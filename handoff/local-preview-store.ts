/** Browser-only design adapter. Production continues to use app/api/workshop/route.ts. */
import { sampleStocks, matchStock, validateOrder, type Stock } from '../lib/cutting';
import { sampleDetails, cleanDetails, validateDetails, validateFeedback } from '../lib/evidence';
import type { Workshop, WorkshopProfile, Reservation, ExchangeNotification, PilotFeedback } from '../lib/workshop';

type Room={id:string;name:string;shared:boolean;includeSamples:boolean;inviteCode?:string;stocks:Stock[];reservations:Reservation[];notifications:ExchangeNotification[];feedback:PilotFeedback[]};
type State={version:1;profile:WorkshopProfile;active:string;rooms:Room[]};
type StorageLike=Pick<Storage,'getItem'|'setItem'>;
const KEY='circularcut.kai-offline-design-preview.v1';
const clone=<T,>(value:T):T=>JSON.parse(JSON.stringify(value));
const guid=()=>globalThis.crypto?.randomUUID?.()??'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const n=Math.floor(Math.random()*16);return (c==='x'?n:(n&3)|8).toString(16);});
const now=()=>new Date().toISOString();
const short=(x:unknown,max:number,required=false)=>typeof x==='string'&&x.length<=max&&(!required||!!x.trim());
function fail(message:string,status=400):never{throw Object.assign(new Error(message),{status});}
const seed=()=>clone(sampleStocks).map(s=>({...s,...sampleDetails(s),canEdit:true}));
function room(id:string,name:string,shared=false,includeSamples=true):Room{return {id,name,shared,includeSamples,...(shared?{inviteCode:'CC-'+guid().replaceAll('-','').slice(0,24).toUpperCase().match(/.{6}/g)!.join('-')}:{ }),stocks:includeSamples?seed():[],reservations:[],notifications:[],feedback:[]};}
const initial=():State=>({version:1,profile:{name:'My workshop',suburb:'',contact:''},active:'local-personal',rooms:[room('local-personal','My workshop')]});

export function createLocalPreview(storage?:StorageLike){
 let state=initial();
 try{const saved=storage?.getItem(KEY);if(saved){const data=JSON.parse(saved);if(data.version===1&&Array.isArray(data.rooms)&&data.rooms.some((r:Room)=>r.id===data.active))state=data;}}catch{}
 const active=()=>state.rooms.find(r=>r.id===state.active)!;
 const describe=(r:Room)=>({id:r.id,name:r.name,shared:r.shared,isOwner:true,memberCount:1,...(r.inviteCode?{inviteCode:r.inviteCode}:{})});
 const persist=()=>{try{storage?.setItem(KEY,JSON.stringify(state));}catch{}};
 function snapshot():Workshop{
  const r=active();
  return clone({stocks:r.stocks.map(s=>({...s,canEdit:true})),reservations:r.reservations.map(x=>({...x,canCollect:x.status==='reserved',canRecordReuse:x.status==='collected',canCancel:x.status==='reserved',canMessage:true})),profile:state.profile,exchange:describe(r),exchanges:state.rooms.map(describe),members:[{name:state.profile.name,suburb:state.profile.suburb,mine:true}],notifications:r.notifications,feedback:r.feedback});
 }
 function notify(r:Room,id:string,title:string,body:string){r.notifications.unshift({id:guid(),recordId:id,title,body,createdAt:now(),read:false});}
 function change(b:any){
  const r=active();
  if(b.exchangeId!==undefined&&b.exchangeId!==r.id)fail('The active preview workspace changed. Refresh before saving.',409);
  if(b.action==='profile'){
   const p=b.profile??{};if(!short(p.name,80,true)||!short(p.suburb,80)||!short(p.contact,180))fail('Enter a workshop name and valid contact details.');
   state.profile={name:p.name.trim(),suburb:p.suburb.trim(),contact:p.contact.trim()};
  }else if(b.action==='createExchange'){
   if(!short(b.name,100,true)||typeof b.includeSamples!=='boolean')fail('Name the exchange and choose whether to include sample stock.');
   const next=room(guid(),b.name.trim(),true,b.includeSamples);state.rooms.push(next);state.active=next.id;
  }else if(b.action==='joinExchange'){
   const found=state.rooms.find(x=>x.inviteCode===String(b.code??'').trim().toUpperCase());
   if(!found)fail('Offline design preview: only codes created in this browser can be opened. Use the full source for real shared exchanges.',404);
   state.active=found.id;
  }else if(b.action==='switchExchange'){
   if(!state.rooms.some(x=>x.id===b.id))fail('This local preview workspace was not found.',404);state.active=b.id;
  }else if(b.action==='readNotifications'){
   r.notifications.forEach(n=>{n.read=true;});
  }else if(b.action==='reserve'){
   const errors=validateOrder(b.order);if(errors.length)fail(errors[0]);if(b.approved!==true)fail('Approve the final dimensions before reserving.');
   const stock=r.stocks.find(s=>s.id===b.stockId);if(!stock)fail('Offcut not found.',404);
   const match=matchStock(stock,b.order);if(!match.plan)fail(match.reason,409);if(b.signature!==match.plan.signature)fail('The plan changed. Review the updated dimensions.',409);
   const id='CC-'+guid().slice(0,8).toUpperCase(),created=now();
   r.reservations.unshift({id,stock:clone(stock),order:clone(b.order),plan:clone(match.plan),status:'reserved',createdAt:created,updatedAt:created,usedIds:[],weightKg:null,avoidedNew:'unknown',notes:'',buyerName:state.profile.name,sellerName:stock.workshop,messages:[]});stock.status='reserved';
   notify(r,id,'Local preview reservation',state.profile.name+' reserved '+stock.id+'. This update is stored in this browser.');
   return {createdId:id};
  }else if(['advance','cancel','message'].includes(b.action)){
   const record=r.reservations.find(x=>x.id===b.id);if(!record)fail('Reservation not found.',404);
   if(b.action==='message'){
    if(!short(b.body,1000,true))fail('Enter a pickup message of up to 1,000 characters.');
    record.messages??=[];record.messages.push({id:guid(),author:state.profile.name,body:b.body.trim(),createdAt:now(),mine:true});
    notify(r,record.id,'Local pickup message',b.body.trim().slice(0,180));
   }else{
    const target=b.action==='cancel'?'cancelled':b.status;
    const expected=target==='collected'?'reserved':target==='reused'?'collected':target==='cancelled'?'reserved':null;
    if(!expected||record.status!==expected)fail('That status change is unavailable. Refresh the ledger.',409);
    if(target==='reused'){
     if(!Array.isArray(b.usedIds)||!b.usedIds.length||b.usedIds.some((id:unknown)=>typeof id!=='string'||!record.plan.placements.some(p=>p.id===id))||new Set(b.usedIds).size!==b.usedIds.length)fail('Select the pieces actually reused.');
     let weight:number|null=null;if(b.weightKg!==null&&b.weightKg!==undefined&&b.weightKg!==''){weight=Number(b.weightKg);if(!Number.isFinite(weight)||weight<=0||weight>1000)fail('Enter a valid measured weight, or leave it blank.');}
     if(!['yes','no','unknown'].includes(b.avoidedNew))fail('Choose whether new material would otherwise have been bought.');
     record.usedIds=[...b.usedIds];record.weightKg=weight;record.avoidedNew=b.avoidedNew;record.notes=String(b.notes??'').trim().slice(0,1000);
    }
    record.status=target;record.updatedAt=now();const stock=r.stocks.find(s=>s.id===record.stock.id);if(stock)stock.status=target==='cancelled'?'available':target;
    notify(r,record.id,'Local preview status update',record.stock.id+' changed to '+target+'.');
   }
  }else if(b.action==='stockDetails'){
   const stock=r.stocks.find(s=>s.id===b.id);if(!stock)fail('Offcut not found.',404);if(stock.status!=='available')fail('Seller details are fixed while this offcut has an active reservation.',409);
   const errors=validateDetails(b.details??{});if(errors.length)fail(errors[0]);Object.assign(stock,cleanDetails(b.details??{}));
  }else if(b.action==='addStock'){
   const x=b.stock??{};
   if(!['Birch plywood','Hoop pine plywood','Pine panel'].includes(x.material)||!Number.isFinite(x.thickness)||x.thickness<3||x.thickness>60||![x.width,x.height].every(n=>Number.isInteger(n)&&n>=40&&n<=5000)||!Number.isFinite(x.price)||x.price<0||x.price>10000||!Number.isFinite(x.distance)||x.distance<0||x.distance>1000||!['clean','inspect'].includes(x.condition)||!['width','none'].includes(x.grain)||!short(x.workshop,80,true)||!short(x.suburb,80,true)||typeof x.demo!=='boolean')fail('Check the material, dimensions, price and workshop details.');
   const errors=validateDetails(x);if(errors.length)fail(errors[0]);
   r.stocks.push({id:'OC-'+guid().slice(0,8).toUpperCase(),material:x.material,thickness:x.thickness,width:x.width,height:x.height,workshop:x.workshop.trim(),suburb:x.suburb.trim(),distance:x.distance,price:x.price,grain:x.grain,condition:x.condition,status:'available',demo:x.demo,canEdit:true,...cleanDetails(x)});
  }else if(b.action==='addFeedback'){
   const value=b.feedback??{},errors=validateFeedback(value);if(errors.length)fail(errors[0]);
   r.feedback.unshift({id:guid(),createdAt:now(),workshop:value.workshop.trim(),source:value.source,date:value.date,currentProcess:(value.currentProcess??'').trim(),finding:value.finding.trim(),pickupBarrier:(value.pickupBarrier??'').trim(),canCut:value.canCut,wouldUse:value.wouldUse,sourceNote:(value.sourceNote??'').trim(),usualMinutes:value.usualMinutes??null,matchingMinutes:value.matchingMinutes??null,author:state.profile.name});
  }else if(b.action==='resetDemo'){
   if(b.confirm!==true)fail('Confirm the demonstration reset.');
   const removed=new Set(r.reservations.filter(x=>x.stock.demo).map(x=>x.id));
   r.reservations=r.reservations.filter(x=>!x.stock.demo);r.stocks=r.stocks.filter(x=>!x.demo);if(r.includeSamples)r.stocks.push(...seed());
   r.feedback=r.feedback.filter(x=>x.source!=='sample');r.notifications=r.notifications.filter(x=>!removed.has(x.recordId));
  }else fail('Unknown local-preview action.');
  return {};
 }
 return {snapshot,async fetch(request:Request){
  const json=(value:unknown,status=200)=>new Response(JSON.stringify(value),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
  if(request.method==='GET')return json(snapshot());
  if(request.method!=='POST')return json({error:'Method not supported in the design preview.'},405);
  const before=clone(state);
  try{
   const raw=await request.text();if(raw.length>100000)fail('Request is too large.',413);
   let b:any;try{b=JSON.parse(raw);}catch{fail('Invalid request.');}
   if(!b||typeof b!=='object'||Array.isArray(b))fail('Invalid request.');
   const extra=change(b);persist();return json({...snapshot(),...extra},b.action==='reserve'||b.action==='addStock'||b.action==='addFeedback'||b.action==='createExchange'?201:200);
  }catch(error){state=before;const e=error as Error&{status?:number};return json({error:e.message||'Could not save the local preview change.'},e.status??400);}
 }};
}
