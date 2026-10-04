import { database } from '@/db/raw';
import { sampleStocks, matchStock, validateOrder, type Order, type Stock, type Plan } from '@/lib/cutting';
import { cleanDetails, sampleDetails, validateDetails, validateFeedback } from '@/lib/evidence';
import type { Reservation, PilotFeedback, Workshop } from '@/lib/workshop';

export const dynamic = 'force-dynamic';
type ProfileRow = { owner: string; name: string; suburb: string; contact: string; active_exchange: string };
type ExchangeRow = { id: string; name: string; created_by: string; invite_code: string | null; shared: number; sample_seed: number; created_at: string };
type Context = { owner: string; scope: string; profile: ProfileRow; room: ExchangeRow };
type StockRow = { id: string; data: string; status: Stock['status']; seller_id: string };
type ReservationRow = { id: string; stock_id: string; stock: string; order_data: string; plan: string; status: Reservation['status']; created_at: string; updated_at: string; revision: string; used_ids: string; weight_kg: number | null; avoided_new: Reservation['avoidedNew']; notes: string; buyer_id: string; seller_id: string; buyer_name: string; seller_name: string };

function identity(req: Request) {
  const user = req.headers.get('oai-authenticated-user-id');
  if (user) return { owner: 'u:' + user, cookie: '' };
  const found = (req.headers.get('cookie') ?? '').split(';').map(s => s.trim()).find(s => s.startsWith('cc_workspace='))?.slice(13);
  const id = found && /^[a-f0-9-]{36}$/.test(found) ? found : crypto.randomUUID();
  return { owner: 'd:' + id, cookie: found === id ? '' : 'cc_workspace=' + id + '; Path=/; HttpOnly; SameSite=Strict; Max-Age=31536000' + (new URL(req.url).protocol === 'https:' ? '; Secure' : '') };
}
function reply(value: unknown, status = 200, cookie = '') {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };
  if (cookie) headers['Set-Cookie'] = cookie;
  return new Response(JSON.stringify(value), { status, headers });
}
const short = (x: unknown, max: number, required = false) => typeof x === 'string' && x.length <= max && (!required || !!x.trim());

async function context(owner: string): Promise<Context> {
  const db = database(), now = new Date().toISOString();
  // Original owner keys remain the personal exchange keys. Existing data is kept in place.
  await db.batch([
    db.prepare('INSERT OR IGNORE INTO workshop_profiles(owner,name,suburb,contact,active_exchange) VALUES(?,?,?,?,?)').bind(owner, 'My workshop', '', '', owner),
    db.prepare('INSERT OR IGNORE INTO exchanges(id,name,created_by,shared,sample_seed,created_at) VALUES(?,?,?,?,?,?)').bind(owner, 'My workshop', owner, 0, 1, now),
    db.prepare('INSERT OR IGNORE INTO exchange_members(exchange_id,member_id,joined_at) VALUES(?,?,?)').bind(owner, owner, now),
  ]);
  const profile = (await db.prepare('SELECT * FROM workshop_profiles WHERE owner=?').bind(owner).first<ProfileRow>())!;
  const room = await db.prepare('SELECT e.* FROM exchanges e JOIN exchange_members m ON m.exchange_id=e.id WHERE e.id=? AND m.member_id=?').bind(profile.active_exchange, owner).first<ExchangeRow>();
  if (!room) throw new Error('Active exchange membership is missing');
  return { owner, scope: room.id, profile, room };
}
function stockFrom(row: StockRow, ctx: Context): Stock {
  const stored = JSON.parse(row.data) as Stock;
  return { ...sampleDetails(stored), ...stored, status: row.status, canEdit: (row.seller_id || ctx.room.created_by) === ctx.owner };
}
async function seed(ctx: Context) {
  if (!ctx.room.sample_seed) return;
  const db = database();
  await db.batch(sampleStocks.map(s => db.prepare('INSERT OR IGNORE INTO offcuts(owner,id,data,status,seller_id) VALUES(?,?,?,?,?)').bind(ctx.scope, s.id, JSON.stringify({ ...s, ...sampleDetails(s) }), 'available', ctx.room.created_by)));
}
function participants(row: ReservationRow, ctx: Context) {
  // Legacy records belong to the owner of their original private exchange.
  return { buyer: row.buyer_id || ctx.room.created_by, seller: row.seller_id || ctx.room.created_by };
}
async function read(ctx: Context): Promise<Workshop> {
  const db = database();
  const [stockRows, recordRows, memberRows, roomRows, noticeRows, feedbackRows, messageRows] = await Promise.all([
    db.prepare('SELECT id,data,status,seller_id FROM offcuts WHERE owner=? ORDER BY id').bind(ctx.scope).all<StockRow>(),
    db.prepare('SELECT * FROM reservations WHERE owner=? ORDER BY created_at DESC').bind(ctx.scope).all<ReservationRow>(),
    db.prepare('SELECT p.name,p.suburb,m.member_id FROM exchange_members m JOIN workshop_profiles p ON p.owner=m.member_id WHERE m.exchange_id=? ORDER BY m.joined_at').bind(ctx.scope).all<{ name: string; suburb: string; member_id: string }>(),
    db.prepare('SELECT e.*, (SELECT COUNT(*) FROM exchange_members n WHERE n.exchange_id=e.id) AS member_count FROM exchanges e JOIN exchange_members m ON e.id=m.exchange_id WHERE m.member_id=? ORDER BY e.shared,e.created_at').bind(ctx.owner).all<ExchangeRow & { member_count: number }>(),
    db.prepare('SELECT id,record_id,title,body,created_at,read_at FROM exchange_notifications WHERE exchange_id=? AND recipient=? ORDER BY created_at DESC LIMIT 50').bind(ctx.scope, ctx.owner).all<{ id: string; record_id: string; title: string; body: string; created_at: string; read_at: string | null }>(),
    db.prepare('SELECT id,data,created_at FROM pilot_feedback WHERE exchange_id=? ORDER BY created_at DESC').bind(ctx.scope).all<{ id: string; data: string; created_at: string }>(),
    db.prepare('SELECT m.* FROM coordination_messages m JOIN reservations r ON r.owner=m.exchange_id AND r.id=m.reservation_id WHERE m.exchange_id=? AND (r.buyer_id=? OR r.seller_id=? OR (r.buyer_id=? AND r.seller_id=? AND r.owner=?)) ORDER BY m.created_at').bind(ctx.scope, ctx.owner, ctx.owner, '', '', ctx.owner).all<{ id: string; reservation_id: string; author_id: string; author_name: string; body: string; created_at: string }>(),
  ]);
  const describe = (r: ExchangeRow & { member_count?: number }) => ({ id: r.id, name: r.shared ? r.name : 'My workshop', shared: !!r.shared, isOwner: r.created_by === ctx.owner, memberCount: r.member_count ?? memberRows.results.length, ...(r.shared ? { inviteCode: r.invite_code ?? '' } : {}) });
  return {
    stocks: stockRows.results.map(row => stockFrom(row, ctx)),
    reservations: recordRows.results.map(row => {
      const p = participants(row, ctx), mine = p.buyer === ctx.owner;
      return { id: row.id, stock: JSON.parse(row.stock), order: JSON.parse(row.order_data), plan: JSON.parse(row.plan), status: row.status, createdAt: row.created_at, updatedAt: row.updated_at, usedIds: JSON.parse(row.used_ids), weightKg: row.weight_kg, avoidedNew: row.avoided_new, notes: row.notes, buyerName: row.buyer_name || ctx.profile.name, sellerName: row.seller_name || (JSON.parse(row.stock) as Stock).workshop, canCollect: mine && row.status === 'reserved', canRecordReuse: mine && row.status === 'collected', canCancel: (mine || p.seller === ctx.owner) && row.status === 'reserved', canMessage: mine || p.seller === ctx.owner, messages: messageRows.results.filter(m => m.reservation_id === row.id).map(m => ({ id: m.id, author: m.author_name, body: m.body, createdAt: m.created_at, mine: m.author_id === ctx.owner })) };
    }),
    profile: { name: ctx.profile.name, suburb: ctx.profile.suburb, contact: ctx.profile.contact },
    exchange: describe(ctx.room), exchanges: roomRows.results.map(describe),
    members: memberRows.results.map(m => ({ name: m.name, suburb: m.suburb, mine: m.member_id === ctx.owner })),
    notifications: noticeRows.results.map(n => ({ id: n.id, recordId: n.record_id, title: n.title, body: n.body, createdAt: n.created_at, read: !!n.read_at })),
    feedback: feedbackRows.results.map(f => ({ ...JSON.parse(f.data), id: f.id, createdAt: f.created_at })),
  };
}
function notification(ctx: Context, recipient: string, recordId: string, title: string, body: string, now: string, revision?: string) {
  const db = database();
  if (revision) return db.prepare('INSERT INTO exchange_notifications(id,exchange_id,recipient,record_id,title,body,created_at) SELECT ?,?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM reservations WHERE owner=? AND id=? AND revision=?)').bind(crypto.randomUUID(), ctx.scope, recipient, recordId, title, body, now, ctx.scope, recordId, revision);
  return db.prepare('INSERT INTO exchange_notifications(id,exchange_id,recipient,record_id,title,body,created_at) VALUES(?,?,?,?,?,?,?)').bind(crypto.randomUUID(), ctx.scope, recipient, recordId, title, body, now);
}
export async function GET(req: Request) {
  const { owner, cookie } = identity(req);
  try { const ctx = await context(owner); await seed(ctx); return reply(await read(ctx), 200, cookie); }
  catch (e) { console.error('Workshop load failed', e); return reply({ error: 'Could not load saved exchange data. Please retry.' }, 503, cookie); }
}
export async function POST(req: Request) {
  const { owner, cookie } = identity(req);
  try {
    const origin = req.headers.get('origin');
    if (origin && origin !== new URL(req.url).origin) return reply({ error: 'This request must come from your exchange.' }, 403, cookie);
    const body = await req.text();
    if (body.length > 100000) return reply({ error: 'Request is too large.' }, 413, cookie);
    let b: any;
    try { b = JSON.parse(body); } catch { return reply({ error: 'Invalid request.' }, 400, cookie); }
    if (!b || typeof b !== 'object' || Array.isArray(b)) return reply({ error: 'Invalid request.' }, 400, cookie);
    let ctx = await context(owner);
    if (b.exchangeId !== undefined && b.exchangeId !== ctx.scope) return reply({ error: 'The active exchange changed in another tab. Refresh before saving.' }, 409, cookie);
    const db = database(), now = new Date().toISOString();
    const success = async (status = 200, extra = {}) => reply({ ...await read(ctx), ...extra }, status, cookie);

    if (b.action === 'profile') {
      const p = b.profile ?? {};
      if (!short(p.name, 80, true) || !short(p.suburb, 80) || !short(p.contact, 180)) return reply({ error: 'Enter a workshop name and valid contact details.' }, 400, cookie);
      await db.prepare('UPDATE workshop_profiles SET name=?,suburb=?,contact=? WHERE owner=?').bind(p.name.trim(), p.suburb.trim(), p.contact.trim(), owner).run();
      ctx = await context(owner); return success();
    }
    if (b.action === 'createExchange') {
      if (!short(b.name, 100, true) || typeof b.includeSamples !== 'boolean') return reply({ error: 'Name the shared exchange and choose whether to include sample stock.' }, 400, cookie);
      const id = crypto.randomUUID(), code = 'CC-' + crypto.randomUUID().replaceAll('-', '').slice(0, 24).toUpperCase().match(/.{6}/g)!.join('-');
      await db.batch([
        db.prepare('INSERT INTO exchanges(id,name,created_by,invite_code,shared,sample_seed,created_at) VALUES(?,?,?,?,?,?,?)').bind(id, b.name.trim(), owner, code, 1, b.includeSamples ? 1 : 0, now),
        db.prepare('INSERT INTO exchange_members(exchange_id,member_id,joined_at) VALUES(?,?,?)').bind(id, owner, now),
        db.prepare('UPDATE workshop_profiles SET active_exchange=? WHERE owner=?').bind(id, owner),
      ]);
      ctx = await context(owner); await seed(ctx); return success(201);
    }
    if (b.action === 'joinExchange') {
      const code = typeof b.code === 'string' ? b.code.trim().toUpperCase() : '';
      if (!/^CC-(?:[A-F0-9]{6}-){3}[A-F0-9]{6}$/.test(code)) return reply({ error: 'Enter the complete exchange code.' }, 400, cookie);
      const room = await db.prepare('SELECT id FROM exchanges WHERE invite_code=? AND shared=1').bind(code).first<{ id: string }>();
      if (!room) return reply({ error: 'That exchange code was not found.' }, 404, cookie);
      await db.batch([
        db.prepare('INSERT OR IGNORE INTO exchange_members(exchange_id,member_id,joined_at) VALUES(?,?,?)').bind(room.id, owner, now),
        db.prepare('UPDATE workshop_profiles SET active_exchange=? WHERE owner=?').bind(room.id, owner),
      ]);
      ctx = await context(owner); await seed(ctx); return success();
    }
    if (b.action === 'switchExchange') {
      const membership = await db.prepare('SELECT exchange_id FROM exchange_members WHERE exchange_id=? AND member_id=?').bind(String(b.id), owner).first();
      if (!membership) return reply({ error: 'Join that exchange before opening it.' }, 403, cookie);
      await db.prepare('UPDATE workshop_profiles SET active_exchange=? WHERE owner=?').bind(String(b.id), owner).run();
      ctx = await context(owner); await seed(ctx); return success();
    }
    if (b.action === 'readNotifications') {
      await db.prepare('UPDATE exchange_notifications SET read_at=? WHERE exchange_id=? AND recipient=? AND read_at IS NULL').bind(now, ctx.scope, owner).run();
      return success();
    }
    if (b.action === 'reserve') {
      const o = b.order as Order, errors = validateOrder(o);
      if (errors.length) return reply({ error: errors[0] }, 400, cookie);
      if (b.approved !== true) return reply({ error: 'Approve the final dimensions before reserving.' }, 400, cookie);
      const row = await db.prepare('SELECT id,data,status,seller_id FROM offcuts WHERE owner=? AND id=?').bind(ctx.scope, String(b.stockId)).first<StockRow>();
      if (!row) return reply({ error: 'Offcut not found.' }, 404, cookie);
      const stock = stockFrom(row, ctx), match = matchStock(stock, o), seller = row.seller_id || ctx.room.created_by;
      if (!match.plan) return reply({ error: match.reason }, 409, cookie);
      if (b.signature !== match.plan.signature) return reply({ error: 'The plan changed. Review the updated dimensions.' }, 409, cookie);
      const id = 'CC-' + crypto.randomUUID().slice(0, 8).toUpperCase(), revision = crypto.randomUUID();
      const { canEdit: _, ...snapshot } = stock;
      const result = await db.batch([
        db.prepare('INSERT INTO reservations(owner,id,stock_id,stock,order_data,plan,status,created_at,updated_at,revision,used_ids,avoided_new,notes,buyer_id,seller_id,buyer_name,seller_name) SELECT ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM offcuts WHERE owner=? AND id=? AND status=? AND data=?)').bind(ctx.scope, id, stock.id, JSON.stringify(snapshot), JSON.stringify(o), JSON.stringify(match.plan), 'reserved', now, now, revision, '[]', 'unknown', '', owner, seller, ctx.profile.name, stock.workshop, ctx.scope, stock.id, 'available', row.data),
        db.prepare('UPDATE offcuts SET status=? WHERE owner=? AND id=? AND EXISTS(SELECT 1 FROM reservations WHERE owner=? AND id=? AND revision=?)').bind('reserved', ctx.scope, stock.id, ctx.scope, id, revision),
        notification(ctx, seller, id, 'New offcut reservation', ctx.profile.name + ' reserved ' + stock.id + ' for ' + o.name + '. Arrange pickup in the reservation conversation.', now, revision),
      ]);
      if (!result[0].meta.changes) return reply({ error: 'This listing changed or was just reserved. Refresh before choosing it.' }, 409, cookie);
      return success(201, { createdId: id });
    }
    if (b.action === 'advance' || b.action === 'cancel' || b.action === 'message') {
      const row = await db.prepare('SELECT * FROM reservations WHERE owner=? AND id=?').bind(ctx.scope, String(b.id)).first<ReservationRow>();
      if (!row) return reply({ error: 'Reservation not found.' }, 404, cookie);
      const p = participants(row, ctx), mine = owner === p.buyer;
      if (!mine && owner !== p.seller) return reply({ error: 'Only this reservation’s buyer or seller can change it.' }, 403, cookie);
      if (b.action === 'message') {
        if (!short(b.body, 1000, true)) return reply({ error: 'Enter a pickup message of up to 1,000 characters.' }, 400, cookie);
        await db.batch([
          db.prepare('INSERT INTO coordination_messages(id,exchange_id,reservation_id,author_id,author_name,body,created_at) VALUES(?,?,?,?,?,?,?)').bind(crypto.randomUUID(), ctx.scope, row.id, owner, ctx.profile.name, b.body.trim(), now),
          notification(ctx, mine ? p.seller : p.buyer, row.id, 'Pickup conversation update', ctx.profile.name + ': ' + b.body.trim().slice(0, 180), now),
        ]); return success();
      }
      const target = b.action === 'cancel' ? 'cancelled' : b.status;
      const expected = target === 'collected' ? 'reserved' : target === 'reused' ? 'collected' : target === 'cancelled' ? 'reserved' : null;
      if (target !== 'cancelled' && !mine) return reply({ error: 'The buyer records collection and actual reuse.' }, 403, cookie);
      if (!expected || row.status !== expected) return reply({ error: 'That status change is unavailable. Refresh the ledger.' }, 409, cookie);
      let usedIds: string[] = [], weight: number | null = null, avoided = 'unknown', notes = '';
      if (target === 'reused') {
        const plan = JSON.parse(row.plan) as Plan;
        if (!Array.isArray(b.usedIds) || !b.usedIds.length || b.usedIds.some((id: unknown) => typeof id !== 'string' || !plan.placements.some(p => p.id === id)) || new Set(b.usedIds).size !== b.usedIds.length) return reply({ error: 'Select the pieces actually reused.' }, 400, cookie);
        usedIds = b.usedIds;
        if (b.weightKg !== null && b.weightKg !== undefined && b.weightKg !== '') {
          weight = Number(b.weightKg); if (!Number.isFinite(weight) || weight <= 0 || weight > 1000) return reply({ error: 'Enter a valid measured weight, or leave it blank.' }, 400, cookie);
        }
        if (!['yes', 'no', 'unknown'].includes(b.avoidedNew)) return reply({ error: 'Choose whether new material would otherwise have been bought.' }, 400, cookie);
        avoided = b.avoidedNew; notes = String(b.notes ?? '').trim().slice(0, 1000);
      }
      const revision = crypto.randomUUID();
      const result = await db.batch([
        db.prepare('UPDATE reservations SET status=?,updated_at=?,revision=?,used_ids=?,weight_kg=?,avoided_new=?,notes=? WHERE owner=? AND id=? AND status=?').bind(target, now, revision, JSON.stringify(usedIds), weight, avoided, notes, ctx.scope, row.id, expected),
        db.prepare('UPDATE offcuts SET status=? WHERE owner=? AND id=? AND EXISTS(SELECT 1 FROM reservations WHERE owner=? AND id=? AND revision=?)').bind(target === 'cancelled' ? 'available' : target, ctx.scope, row.stock_id, ctx.scope, row.id, revision),
        notification(ctx, mine ? p.seller : p.buyer, row.id, target === 'reused' ? 'Actual reuse recorded' : target === 'collected' ? 'Collection recorded' : 'Reservation cancelled', ctx.profile.name + ' updated ' + row.stock_id + ' to ' + target + '.', now, revision),
      ]);
      if (!result[0].meta.changes) return reply({ error: 'The record changed. Please refresh.' }, 409, cookie);
      return success();
    }
    if (b.action === 'addStock') {
      const x = b.stock ?? {};
      if (!['Birch plywood', 'Hoop pine plywood', 'Pine panel'].includes(x.material) || !Number.isFinite(x.thickness) || x.thickness < 3 || x.thickness > 60 || ![x.width, x.height].every(n => Number.isInteger(n) && n >= 40 && n <= 5000) || !Number.isFinite(x.price) || x.price < 0 || x.price > 10000 || !Number.isFinite(x.distance) || x.distance < 0 || x.distance > 1000 || !['clean', 'inspect'].includes(x.condition) || !['width', 'none'].includes(x.grain) || !short(x.workshop, 80, true) || !short(x.suburb, 80, true) || typeof x.demo !== 'boolean') return reply({ error: 'Check the material, dimensions, price and workshop details.' }, 400, cookie);
      const errors = validateDetails(x); if (errors.length) return reply({ error: errors[0] }, 400, cookie);
      const stock: Stock = { id: 'OC-' + crypto.randomUUID().slice(0, 8).toUpperCase(), material: x.material, thickness: x.thickness, width: x.width, height: x.height, workshop: x.workshop.trim(), suburb: x.suburb.trim(), distance: x.distance, price: x.price, grain: x.grain, condition: x.condition, status: 'available', demo: x.demo, ...cleanDetails(x) };
      await db.prepare('INSERT INTO offcuts(owner,id,data,status,seller_id) VALUES(?,?,?,?,?)').bind(ctx.scope, stock.id, JSON.stringify(stock), stock.status, owner).run();
      return success(201);
    }
    if (b.action === 'stockDetails') {
      const row = await db.prepare('SELECT id,data,status,seller_id FROM offcuts WHERE owner=? AND id=?').bind(ctx.scope, String(b.id)).first<StockRow>();
      if (!row) return reply({ error: 'Offcut not found.' }, 404, cookie);
      if ((row.seller_id || ctx.room.created_by) !== owner) return reply({ error: 'Only the listing’s seller can edit its details.' }, 403, cookie);
      if (row.status !== 'available') return reply({ error: 'Seller details are fixed while this offcut has an active reservation.' }, 409, cookie);
      const errors = validateDetails(b.details ?? {}); if (errors.length) return reply({ error: errors[0] }, 400, cookie);
      const { canEdit: _, ...stock } = stockFrom(row, ctx);
      const result = await db.prepare('UPDATE offcuts SET data=? WHERE owner=? AND id=? AND status=? AND data=?').bind(JSON.stringify({ ...stock, ...cleanDetails(b.details ?? {}) }), ctx.scope, row.id, 'available', row.data).run();
      if (!result.meta.changes) return reply({ error: 'This listing changed or was just reserved. Refresh its details.' }, 409, cookie);
      return success();
    }
    if (b.action === 'addFeedback') {
      const value = b.feedback ?? {}, errors = validateFeedback(value);
      if (errors.length) return reply({ error: errors[0] }, 400, cookie);
      const id = crypto.randomUUID();
      const f: Omit<PilotFeedback, 'id' | 'createdAt'> = { workshop: value.workshop.trim(), source: value.source, date: value.date, currentProcess: (value.currentProcess ?? '').trim(), finding: value.finding.trim(), pickupBarrier: (value.pickupBarrier ?? '').trim(), canCut: value.canCut, wouldUse: value.wouldUse, sourceNote: (value.sourceNote ?? '').trim(), usualMinutes: value.usualMinutes ?? null, matchingMinutes: value.matchingMinutes ?? null, author: ctx.profile.name };
      await db.prepare('INSERT INTO pilot_feedback(id,exchange_id,author_id,data,created_at) VALUES(?,?,?,?,?)').bind(id, ctx.scope, owner, JSON.stringify(f), now).run();
      return success(201);
    }
    if (b.action === 'resetDemo') {
      if (b.confirm !== true) return reply({ error: 'Confirm the demonstration reset.' }, 400, cookie);
      if (ctx.room.created_by !== owner) return reply({ error: 'Only the exchange creator can reset its shared sample data.' }, 403, cookie);
      await db.batch([
        db.prepare('DELETE FROM coordination_messages WHERE exchange_id=? AND reservation_id IN (SELECT id FROM reservations WHERE owner=? AND json_extract(stock,?)=1)').bind(ctx.scope, ctx.scope, '$.demo'),
        db.prepare('DELETE FROM exchange_notifications WHERE exchange_id=? AND record_id IN (SELECT id FROM reservations WHERE owner=? AND json_extract(stock,?)=1)').bind(ctx.scope, ctx.scope, '$.demo'),
        db.prepare('DELETE FROM reservations WHERE owner=? AND json_extract(stock,?)=1').bind(ctx.scope, '$.demo'),
        db.prepare('DELETE FROM offcuts WHERE owner=? AND json_extract(data,?)=1').bind(ctx.scope, '$.demo'),
        db.prepare('DELETE FROM pilot_feedback WHERE exchange_id=? AND json_extract(data,?)=?').bind(ctx.scope, '$.source', 'sample'),
      ]);
      await seed(ctx); return success();
    }
    return reply({ error: 'Unknown action.' }, 400, cookie);
  } catch (e) {
    console.error('Exchange save failed', e);
    return reply({ error: 'Could not save the change. Your inputs have been preserved; please retry.' }, 503, cookie);
  }
}
