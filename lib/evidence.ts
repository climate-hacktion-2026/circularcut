import type { AlternativeRoute,Stock,StockDetails } from './cutting';
import type { PilotFeedback,Reservation } from './workshop';

export const alternativeRoutes:{value:AlternativeRoute;label:string}[]=[
 {value:'unknown',label:'Unknown / not established'},
 {value:'keep',label:'Keep for another job'},
 {value:'sell',label:'Sell or give to someone else'},
 {value:'recycle',label:'Send for recycling'},
 {value:'landfill',label:'Dispose of to landfill'},
 {value:'burn',label:'Burn as waste'},
];
export const routeLabel=(route?:string)=>alternativeRoutes.find(x=>x.value===route)?.label??'Unknown / not established';
export const interviewQuestions=[
 'How do you currently store, reuse or dispose of suitable offcuts?',
 'Walk us through a recent material order. How long did sourcing take?',
 'Which defects, grain, dimensions or condition checks would rule out this offcut?',
 'Would you accept these final piece sizes and this cut sequence? What needs changing?',
 'What pickup time, distance, handling or price would make this match worthwhile?',
 'What would happen to this material without the exchange, and what evidence supports that?',
 'After a real trial: which pieces were made, what was weighed, and was a new purchase replaced?',
];
export function sampleDetails(stock:Stock):StockDetails {
 if(!stock.demo||!/^OC-00[1-7]$/.test(stock.id))return {};
 return {defects:stock.condition==='inspect'?'Sample: surface marks need inspection before a usable rectangle is confirmed.':'Sample: measured clean rectangle; inspect edges and both faces before cutting.',pickupWindow:'Sample: weekdays 10 am–3 pm, agree a time first',pickupLocation:stock.suburb+' workshop entrance (sample)',sellerContact:'Use the reservation conversation to arrange pickup (sample)',alternativeRoute:stock.id==='OC-001'?'landfill':stock.id==='OC-002'?'keep':'unknown',baselineNotes:stock.id==='OC-001'?'Fictional demonstration: the seller reports this offcut would go in the disposal skip during a clear-out.':stock.id==='OC-002'?'Fictional demonstration: the workshop would otherwise keep this panel for a later job.':'No disposal baseline established.',baselineRecordedAt:'2026-10-03'};
}
export function validateDetails(value:StockDetails):string[] {
 const limits={defects:600,pickupWindow:180,pickupLocation:180,sellerContact:180,baselineNotes:800};
 for(const [key,max] of Object.entries(limits)){const x=value[key as keyof StockDetails];if(x!==undefined&&(typeof x!=='string'||x.length>max))return ['Check the seller and pickup details.'];}
 if(!alternativeRoutes.some(x=>x.value===(value.alternativeRoute??'unknown')))return ['Choose a valid alternative destination.'];
 if(value.alternativeRoute&&value.alternativeRoute!=='unknown'&&!value.baselineNotes?.trim())return ['Explain how the seller established the alternative destination.'];
 return [];
}
export function cleanDetails(value:StockDetails={}):StockDetails {
 return {defects:value.defects?.trim()??'',pickupWindow:value.pickupWindow?.trim()??'',pickupLocation:value.pickupLocation?.trim()??'',sellerContact:value.sellerContact?.trim()??'',alternativeRoute:value.alternativeRoute??'unknown',baselineNotes:value.baselineNotes?.trim()??'',baselineRecordedAt:new Date().toISOString()};
}
export function reusedArea(record:Reservation):number {
 return record.status==='reused'?record.plan.placements.filter(p=>record.usedIds.includes(p.id)).reduce((a,p)=>a+p.w*p.h,0):0;
}
export function baselineSummary(records:Reservation[],demo:boolean){
 const done=records.filter(r=>r.status==='reused'&&r.stock.demo===demo);
 const withBaseline=done.filter(r=>r.stock.alternativeRoute&&r.stock.alternativeRoute!=='unknown'&&r.stock.baselineNotes?.trim());
 const reportedLandfill=withBaseline.filter(r=>r.stock.alternativeRoute==='landfill');
 return {completed:done.length,documented:withBaseline.length,unknown:done.length-withBaseline.length,landfillArea:reportedLandfill.reduce((a,r)=>a+reusedArea(r),0),landfillRecords:reportedLandfill.length};
}
export function validateFeedback(value:Partial<PilotFeedback>&{confirmedActual?:boolean}):string[] {
 if(!['sample','interview','trial'].includes(value.source??''))return ['Choose the feedback source.'];
 if(typeof value.workshop!=='string'||!value.workshop.trim()||value.workshop.length>80)return ['Enter a workshop name or alias.'];
 if(typeof value.finding!=='string'||!value.finding.trim()||value.finding.length>1000)return ['Record what the maker said, up to 1,000 characters.'];
 const date=value.date, today=new Date().toLocaleDateString('sv-SE',{timeZone:'Australia/Sydney'});
 if(typeof date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date+'T00:00:00Z'))||new Date(date+'T00:00:00Z').toISOString().slice(0,10)!==date||date>today)return ['Enter a valid date that is not in the future.'];
 if(!['not_tested','yes','needs_changes'].includes(value.canCut??'')||!['yes','maybe','no'].includes(value.wouldUse??''))return ['Choose the cut-review and adoption outcomes.'];
 for(const key of ['currentProcess','pickupBarrier','sourceNote'] as const)if(value[key]!==undefined&&(typeof value[key]!=='string'||value[key]!.length>600))return ['Keep feedback notes within 600 characters.'];
 if(value.source!=='sample'&&(value.confirmedActual!==true||!value.sourceNote?.trim()))return ['Confirm that an actual interview or trial took place and describe its source.'];
 for(const key of ['usualMinutes','matchingMinutes'] as const){const minutes=value[key];if(minutes!==null&&minutes!==undefined&&(typeof minutes!=='number'||!Number.isFinite(minutes)||minutes<0||minutes>240))return ['Sourcing time must be 0–240 minutes, or left blank.'];}
 return [];
}
