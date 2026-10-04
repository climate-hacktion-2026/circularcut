export type Part={id:string;name:string;width:number;height:number;minWidth:number;minHeight:number;quantity:number};
export type Order={name:string;material:string;thickness:number;kerf:number;trim:number;flexible:boolean;rotate:boolean;parts:Part[]};
export type AlternativeRoute='unknown'|'keep'|'sell'|'recycle'|'landfill'|'burn';
export type StockDetails={defects?:string;pickupWindow?:string;pickupLocation?:string;sellerContact?:string;alternativeRoute?:AlternativeRoute;baselineNotes?:string;baselineRecordedAt?:string};
export type Stock=StockDetails&{id:string;material:string;thickness:number;width:number;height:number;workshop:string;suburb:string;distance:number;price:number;grain:'width'|'none';condition:'clean'|'inspect';status:'available'|'reserved'|'collected'|'reused';demo:boolean;canEdit?:boolean};
export type Rect={x:number;y:number;w:number;h:number};
export type Placement=Rect&{id:string;partId:string;name:string;requestedW:number;requestedH:number;actualW:number;actualH:number;rotated:boolean};
export type Cut=Rect&{axis:'vertical'|'horizontal';at:number;sequence:number};
export type Plan={placements:Placement[];remaining:Rect[];cuts:Cut[];usedArea:number;stockArea:number;kerfArea:number;trimArea:number;utilization:number;adjusted:boolean;totalReduction:number;signature:string};
export type Match={stock:Stock;plan:Plan|null;reason:string};
const EPS=1e-7;
export const sampleOrder:Order={name:'Two display panels',material:'Birch plywood',thickness:18,kerf:3,trim:0,flexible:true,rotate:false,parts:[{id:'A',name:'Display panel',width:400,height:400,minWidth:390,minHeight:400,quantity:2}]};
export const sampleStocks:Stock[]=[
{id:'OC-001',material:'Birch plywood',thickness:18,width:800,height:450,workshop:'Canal Street Joinery',suburb:'Marrickville',distance:2.4,price:12,grain:'width',condition:'clean',status:'available',demo:true},
{id:'OC-002',material:'Birch plywood',thickness:18,width:900,height:600,workshop:'Second Bench Studio',suburb:'Tempe',distance:4.8,price:22,grain:'width',condition:'clean',status:'available',demo:true},
{id:'OC-003',material:'Birch plywood',thickness:18,width:650,height:450,workshop:'Neighbourhood Makers',suburb:'Dulwich Hill',distance:1.1,price:9,grain:'width',condition:'clean',status:'available',demo:true},
{id:'OC-004',material:'Birch plywood',thickness:12,width:1000,height:600,workshop:'Second Bench Studio',suburb:'Tempe',distance:4.8,price:14,grain:'width',condition:'clean',status:'available',demo:true},
{id:'OC-005',material:'Hoop pine plywood',thickness:18,width:1220,height:610,workshop:'Bench & Assembly',suburb:'Alexandria',distance:7.2,price:28,grain:'width',condition:'clean',status:'available',demo:true},
{id:'OC-006',material:'Birch plywood',thickness:18,width:1200,height:800,workshop:'Bench & Assembly',suburb:'Alexandria',distance:7.2,price:35,grain:'width',condition:'clean',status:'available',demo:true},
{id:'OC-007',material:'Birch plywood',thickness:18,width:950,height:550,workshop:'Canal Street Joinery',suburb:'Marrickville',distance:2.4,price:10,grain:'width',condition:'inspect',status:'available',demo:true}];
export function validateOrder(o:Order):string[]{
 const e:string[]=[];if(!o||typeof o!=='object')return ['Enter a valid order.'];
 if(typeof o.name!=='string'||!o.name.trim()||o.name.length>100)e.push('Give the order a name of up to 100 characters.');
 if(!['Birch plywood','Hoop pine plywood','Pine panel'].includes(o.material))e.push('Choose a supported material.');
 if(!Number.isFinite(o.thickness)||o.thickness<3||o.thickness>60)e.push('Thickness must be 3–60 mm.');
 if(!Number.isFinite(o.kerf)||o.kerf<0||o.kerf>10)e.push('Blade width must be 0–10 mm.');
 if(!Number.isFinite(o.trim)||o.trim<0||o.trim>30)e.push('Edge allowance must be 0–30 mm.');
 if(typeof o.flexible!=='boolean'||typeof o.rotate!=='boolean')e.push('Choose valid adjustment and rotation settings.');
 if(!Array.isArray(o.parts)||!o.parts.length||o.parts.length>6)return [...e,'Use 1–6 part types.'];
 let qty=0;const ids=new Set<string>();
 for(const p of o.parts){if(!p||typeof p!=='object'){e.push('Invalid part.');continue;}if(typeof p.id!=='string'||!p.id||p.id.length>20||ids.has(p.id))e.push('Part identifiers must be unique.');ids.add(p.id);
 if(typeof p.name!=='string'||!p.name.trim()||p.name.length>80)e.push('Each part needs a short name.');
 if([p.width,p.height,p.minWidth,p.minHeight].some(n=>!Number.isInteger(n)||n<40||n>3000))e.push('Part dimensions must be whole millimetres from 40 to 3,000.');
 if(p.minWidth>p.width||p.minHeight>p.height)e.push('Minimum dimensions cannot exceed requested sizes.');
 if(p.width-p.minWidth>20||p.height-p.minHeight>20)e.push('This prototype supports up to 20 mm adjustment per dimension.');
 if(!Number.isInteger(p.quantity)||p.quantity<1||p.quantity>24)e.push('Use 1–24 of each part.');qty+=p.quantity;}
 if(qty>24)e.push('Keep the order to 24 pieces or fewer.');return [...new Set(e)];
}
type Piece={id:string;partId:string;name:string;w:number;h:number;requestedW:number;requestedH:number};
function pack(s:Stock,o:Order,pieces:Piece[],sort:number,split:number):Plan|null{
 const t=o.trim,k=o.kerf;const free:Rect[]=[{x:t,y:t,w:s.width-2*t,h:s.height-2*t}],placements:Placement[]=[],cuts:Cut[]=[];
 if(free[0].w<=0||free[0].h<=0)return null;
 const sorted=[...pieces].sort((a,b)=>sort===0?b.w*b.h-a.w*a.h:sort===1?b.h-a.h||b.w-a.w:b.w-a.w||b.h-a.h);
 for(const p of sorted){let best:{i:number;w:number;h:number;rotated:boolean;score:number}|null=null;
  for(let i=0;i<free.length;i++)for(const rot of(o.rotate&&p.w!==p.h?[false,true]:[false])){const f=free[i],w=rot?p.h:p.w,h=rot?p.w:p.h;if(w>f.w+EPS||h>f.h+EPS)continue;const score=f.w*f.h-w*h+Math.min(f.w-w,f.h-h)/10000;if(!best||score<best.score)best={i,w,h,rotated:rot,score};}
  if(!best)return null;const f=free.splice(best.i,1)[0],w=best.w,h=best.h;
  placements.push({x:f.x,y:f.y,w,h,id:p.id,partId:p.partId,name:p.name,requestedW:p.requestedW,requestedH:p.requestedH,actualW:p.w,actualH:p.h,rotated:best.rotated});
  const dx=Math.max(0,f.w-w),dy=Math.max(0,f.h-h),kx=Math.min(k,dx),ky=Math.min(k,dy);
  const add=(r:Rect)=>{if(r.w>EPS&&r.h>EPS)free.push(r);};const cut=(c:Omit<Cut,'sequence'>)=>cuts.push({...c,sequence:cuts.length+1});
  // Each cut spans its free rectangle. Its child cuts are therefore guillotine cuts.
  // At an outer edge the physical blade can extend beyond the remaining stock.
  if(split===0){if(dx>EPS)cut({x:f.x+w,y:f.y,w:kx,h:f.h,axis:'vertical',at:f.x+w});add({x:f.x+w+kx,y:f.y,w:dx-kx,h:f.h});if(dy>EPS)cut({x:f.x,y:f.y+h,w,h:ky,axis:'horizontal',at:f.y+h});add({x:f.x,y:f.y+h+ky,w,h:dy-ky});}
  else{if(dy>EPS)cut({x:f.x,y:f.y+h,w:f.w,h:ky,axis:'horizontal',at:f.y+h});add({x:f.x,y:f.y+h+ky,w:f.w,h:dy-ky});if(dx>EPS)cut({x:f.x+w,y:f.y,w:kx,h,axis:'vertical',at:f.x+w});add({x:f.x+w+kx,y:f.y,w:dx-kx,h});}
 }
 const usedArea=placements.reduce((a,p)=>a+p.w*p.h,0),stockArea=s.width*s.height,totalReduction=placements.reduce((a,p)=>a+p.requestedW-p.actualW+p.requestedH-p.actualH,0);
 return {placements,remaining:free,cuts,usedArea,stockArea,kerfArea:cuts.reduce((a,c)=>a+c.w*c.h,0),trimArea:stockArea-(s.width-2*t)*(s.height-2*t),utilization:100*usedArea/stockArea,adjusted:totalReduction>0,totalReduction,signature:JSON.stringify({stock:s.id,order:o,placements})};
}
export function checkPlan(p:Plan,s:Stock,o:Order):string[]{
 const e:string[]=[];if(p.placements.length!==o.parts.reduce((a,b)=>a+b.quantity,0))e.push('Incorrect piece count.');
 for(const src of o.parts)if(p.placements.filter(x=>x.partId===src.id).length!==src.quantity)e.push('Incorrect part quantity.');const seen=new Set<string>();
 for(const a of p.placements){if(seen.has(a.id))e.push('Duplicate placement.');seen.add(a.id);if(a.x<o.trim-EPS||a.y<o.trim-EPS||a.x+a.w>s.width-o.trim+EPS||a.y+a.h>s.height-o.trim+EPS)e.push('Piece outside trimmed boundaries.');const src=o.parts.find(x=>x.id===a.partId);if(!src||a.actualW>src.width||a.actualH>src.height||a.actualW<(o.flexible?src.minWidth:src.width)||a.actualH<(o.flexible?src.minHeight:src.height))e.push('Size outside approved range.');if(a.rotated&&!o.rotate)e.push('Rotation not allowed.');if(Math.abs(a.w-(a.rotated?a.actualH:a.actualW))>EPS||Math.abs(a.h-(a.rotated?a.actualW:a.actualH))>EPS)e.push('Inconsistent orientation.');}
 for(let i=0;i<p.placements.length;i++)for(let j=i+1;j<p.placements.length;j++){const a=p.placements[i],b=p.placements[j],dx=Math.max(b.x-a.x-a.w,a.x-b.x-b.w),dy=Math.max(b.y-a.y-a.h,a.y-b.y-b.h);if(dx<o.kerf-EPS&&dy<o.kerf-EPS)e.push('Overlap or insufficient blade clearance.');}
 const area=p.usedArea+p.kerfArea+p.trimArea+p.remaining.reduce((a,r)=>a+r.w*r.h,0);if(Math.abs(area-p.stockArea)>.01)e.push('Material areas do not reconcile.');return [...new Set(e)];
}
export function matchStock(s:Stock,o:Order,ignoreStatus=false):Match{
 const fail=(reason:string):Match=>({stock:s,plan:null,reason});const e=validateOrder(o);if(e.length)return fail(e[0]);
 if(!ignoreStatus&&s.status!=='available')return fail('Already '+s.status+'.');if(s.material!==o.material)return fail('Different material: '+s.material+'.');if(s.thickness!==o.thickness)return fail('Thickness is '+s.thickness+' mm; order needs '+o.thickness+' mm.');if(s.condition!=='clean')return fail('Inspect the condition before matching.');
 const mw=o.flexible?Math.max(...o.parts.map(p=>p.width-p.minWidth)):0,mh=o.flexible?Math.max(...o.parts.map(p=>p.height-p.minHeight)):0;const variants:{dw:number;dh:number;loss:number}[]=[];
 for(let dw=0;dw<=mw;dw++)for(let dh=0;dh<=mh;dh++)variants.push({dw,dh,loss:o.parts.reduce((a,p)=>a+(Math.min(dw,p.width-p.minWidth)+Math.min(dh,p.height-p.minHeight))*p.quantity,0)});variants.sort((a,b)=>a.loss-b.loss||a.dh-b.dh);let best:Plan|null=null;
 for(const v of variants){if(best&&v.loss>(best as Plan).totalReduction)break;const pieces=o.parts.flatMap(p=>Array.from({length:p.quantity},(_,i)=>({id:p.id+(i+1),partId:p.id,name:p.name,w:p.width-Math.min(v.dw,p.width-p.minWidth),h:p.height-Math.min(v.dh,p.height-p.minHeight),requestedW:p.width,requestedH:p.height})));
  if(pieces.reduce((a,p)=>a+p.w*p.h,0)>(s.width-2*o.trim)*(s.height-2*o.trim))continue;
  for(let sort=0;sort<3;sort++)for(let split=0;split<2;split++){const p=pack(s,o,pieces,sort,split);if(p&&!checkPlan(p,s,o).length&&(!best||p.totalReduction<best.totalReduction||(p.totalReduction===best.totalReduction&&p.cuts.length<best.cuts.length)))best=p;}if(best&&!best.adjusted)break;
 }
 return best?{stock:s,plan:best,reason:best.adjusted?'Fits within your size range':'Fits your exact sizes'}:fail('No plan found within these sizes and settings.');
}
export function getMatches(s:Stock[],o:Order):Match[]{return s.map(x=>matchStock(x,o)).sort((a,b)=>Number(!!b.plan)-Number(!!a.plan)||a.stock.price-b.stock.price||a.stock.distance-b.stock.distance);}
export function areaLabel(n:number){return (n/1e6).toFixed(3)+' m²';}
