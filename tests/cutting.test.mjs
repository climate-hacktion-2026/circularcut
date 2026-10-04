import test from 'node:test';
import assert from 'node:assert/strict';
import {sampleOrder,sampleStocks,matchStock,validateOrder,getMatches} from '../lib/cutting.ts';
const clone=o=>structuredClone(o);
function independentlyCheck(plan,stock,order){
 assert.equal(plan.placements.length,order.parts.reduce((sum,p)=>sum+p.quantity,0));
 for(const p of plan.placements){assert.ok(p.x>=order.trim&&p.y>=order.trim);assert.ok(p.x+p.w<=stock.width-order.trim+1e-8);assert.ok(p.y+p.h<=stock.height-order.trim+1e-8);}
 for(let i=0;i<plan.placements.length;i++)for(let j=i+1;j<plan.placements.length;j++){const a=plan.placements[i],b=plan.placements[j];assert.ok(a.x+a.w+order.kerf<=b.x+1e-8||b.x+b.w+order.kerf<=a.x+1e-8||a.y+a.h+order.kerf<=b.y+1e-8||b.y+b.h+order.kerf<=a.y+1e-8);}
 const kept=plan.placements.reduce((sum,p)=>sum+p.w*p.h,0),remnant=plan.remaining.reduce((sum,r)=>sum+r.w*r.h,0),blade=plan.cuts.reduce((sum,c)=>sum+c.w*c.h,0),trim=stock.width*stock.height-(stock.width-2*order.trim)*(stock.height-2*order.trim);
 assert.ok(Math.abs(kept+remnant+blade+trim-stock.width*stock.height)<1e-6);
}
test('803 mm of exact pieces and blade allowance do not fit an 800 mm panel',()=>{assert.equal(matchStock(sampleStocks[0],{...sampleOrder,flexible:false}).plan,null);});
test('buyer-approved flexibility finds 398 × 400 pieces and reconciles all material',()=>{const p=matchStock(sampleStocks[0],sampleOrder).plan;assert.ok(p);assert.deepEqual(p.placements.map(x=>[x.actualW,x.actualH]),[[398,400],[398,400]]);assert.equal(p.usedArea,318400);assert.equal(p.totalReduction,4);independentlyCheck(p,sampleStocks[0],sampleOrder);});
test('minimum width of 399 mm blocks that adaptation',()=>{const o=clone(sampleOrder);o.parts[0].minWidth=399;assert.equal(matchStock(sampleStocks[0],o).plan,null);});
test('zero-width blade lets exact pieces touch without overlap',()=>{const o={...sampleOrder,kerf:0,flexible:false};const p=matchStock(sampleStocks[0],o).plan;assert.ok(p);assert.equal(p.usedArea,320000);independentlyCheck(p,sampleStocks[0],o);});
test('edge allowance reduces usable space rather than increasing capacity',()=>{const o={...sampleOrder,trim:10};assert.equal(matchStock(sampleStocks[0],o).plan,null);const p=matchStock(sampleStocks[1],o).plan;assert.ok(p);assert.equal(p.trimArea,29600);independentlyCheck(p,sampleStocks[1],o);});
test('rotation is possible only with explicit permission',()=>{const s={...sampleStocks[0],width:350,height:550};const o={...sampleOrder,flexible:false,parts:[{id:'A',name:'Panel',width:500,height:300,minWidth:500,minHeight:300,quantity:1}]};assert.equal(matchStock(s,o).plan,null);const p=matchStock(s,{...o,rotate:true}).plan;assert.ok(p);assert.equal(p.placements[0].rotated,true);independentlyCheck(p,s,{...o,rotate:true});});
test('material, thickness, condition and reservation status each block inappropriate stock',()=>{for(const change of[{material:'Pine panel'},{thickness:12},{condition:'inspect'},{status:'reserved'}])assert.equal(matchStock({...sampleStocks[0],...change},sampleOrder).plan,null);});
test('mixed part types retain quantities and never overlap',()=>{const s={...sampleStocks[0],width:800,height:800};const o={...sampleOrder,flexible:false,parts:[{id:'A',name:'Large',width:380,height:350,minWidth:380,minHeight:350,quantity:2},{id:'B',name:'Small',width:180,height:170,minWidth:180,minHeight:170,quantity:3}]};const p=matchStock(s,o).plan;assert.ok(p);assert.equal(p.placements.filter(x=>x.partId==='B').length,3);independentlyCheck(p,s,o);});
test('invalid negative, missing and excessive inputs fail intentionally',()=>{for(const o of[{...sampleOrder,kerf:-1},{...sampleOrder,trim:NaN},{...sampleOrder,parts:[]},{...sampleOrder,parts:[{...sampleOrder.parts[0],quantity:25}]},{...sampleOrder,parts:[{...sampleOrder.parts[0],minWidth:410}]},{...sampleOrder,parts:[{...sampleOrder.parts[0],minWidth:370}]}])assert.ok(validateOrder(o).length);});
test('matching stock is ranked before cheaper incompatible stock',()=>{const m=getMatches(sampleStocks,sampleOrder);assert.equal(m[0].stock.id,'OC-001');assert.ok(m.slice(0,3).every(x=>x.plan));});
