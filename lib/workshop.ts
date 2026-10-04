import type { Order,Plan,Stock } from './cutting';
export type CoordinationMessage={id:string;author:string;body:string;createdAt:string;mine:boolean};
export type Reservation={id:string;stock:Stock;order:Order;plan:Plan;status:'reserved'|'collected'|'reused'|'cancelled';createdAt:string;updatedAt:string;usedIds:string[];weightKg:number|null;avoidedNew:'yes'|'no'|'unknown';notes:string;buyerName?:string;sellerName?:string;canCollect?:boolean;canRecordReuse?:boolean;canCancel?:boolean;canMessage?:boolean;messages?:CoordinationMessage[]};
export type WorkshopProfile={name:string;suburb:string;contact:string};
export type Exchange={id:string;name:string;shared:boolean;isOwner:boolean;memberCount:number;inviteCode?:string};
export type MemberSummary={name:string;suburb:string;mine:boolean};
export type ExchangeNotification={id:string;recordId:string;title:string;body:string;createdAt:string;read:boolean};
export type PilotFeedback={id:string;workshop:string;source:'sample'|'interview'|'trial';date:string;currentProcess:string;finding:string;pickupBarrier:string;canCut:'not_tested'|'yes'|'needs_changes';wouldUse:'yes'|'maybe'|'no';sourceNote:string;usualMinutes:number|null;matchingMinutes:number|null;author:string;createdAt:string};
export type Workshop={stocks:Stock[];reservations:Reservation[];profile?:WorkshopProfile;exchange?:Exchange;exchanges?:Exchange[];members?:MemberSummary[];notifications?:ExchangeNotification[];feedback?:PilotFeedback[]};
