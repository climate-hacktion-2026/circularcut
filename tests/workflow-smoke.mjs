import assert from 'node:assert/strict';
import { sampleOrder, sampleStocks, matchStock } from '../lib/cutting.ts';
import {createRouteHarness} from './route-harness.mjs';
const harness=process.env.CC_TEST_IN_PROCESS==='1'?createRouteHarness():null;
const fetch=harness?.fetch??globalThis.fetch;

// Local-only integration check. Every run uses its own synthetic workspace.
const endpoint = 'http://127.0.0.1:4173/api/workshop';
const first = await fetch(endpoint);
assert.equal(first.status, 200, 'Preview and local D1 schema must be ready');
const cookie = first.headers.get('set-cookie').split(';')[0];
const headers = { 'Content-Type': 'application/json', Cookie: cookie, Origin: 'http://127.0.0.1:4173' };
const post = body => fetch(endpoint, { method: 'POST', headers, body: JSON.stringify(body) });
const plan = matchStock(sampleStocks[0], sampleOrder).plan;
const payload = { action: 'reserve', order: sampleOrder, stockId: 'OC-001', signature: plan.signature, approved: true };

assert.equal((await post({ ...payload, approved: false })).status, 400);
assert.equal((await post({ ...payload, signature: 'stale' })).status, 409);
const concurrent = await Promise.all([post(payload), post(payload)]);
assert.deepEqual(concurrent.map(r => r.status).sort(), [201, 409], 'Exactly one simultaneous reservation may succeed');
const saved = await concurrent.find(r => r.status === 201).json();
const id = saved.createdId;
assert.equal((await post({ action: 'advance', id, status: 'reused', usedIds: ['A1'], avoidedNew: 'unknown' })).status, 409);
assert.equal((await post({ action: 'advance', id, status: 'collected' })).status, 200);
assert.equal((await post({ action: 'advance', id, status: 'reused', usedIds: ['invented'], avoidedNew: 'unknown' })).status, 400);
assert.equal((await post({ action: 'advance', id, status: 'reused', usedIds: [plan.placements[0].id], weightKg: null, avoidedNew: 'unknown', notes: 'Synthetic API validation' })).status, 200);

const persisted = await (await fetch(endpoint, { headers: { Cookie: cookie } })).json();
assert.equal(persisted.reservations.length, 1);
assert.equal(persisted.reservations[0].status, 'reused');
assert.equal(persisted.reservations[0].usedIds.length, 1);
const isolated = await (await fetch(endpoint)).json();
assert.equal(isolated.reservations.length, 0);
assert.equal(isolated.stocks[0].status, 'available');
harness?.close();
console.log('PASS: approval, stale plans, concurrent reservation, milestone order, invalid pieces, persistence and isolation.');
