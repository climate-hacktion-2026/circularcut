import React from 'react';
import { createRoot } from 'react-dom/client';
import CircularCut from '../app/circularcut';
import { createLocalPreview } from './local-preview-store';

let storage:Storage|undefined;
try{storage=window.localStorage;}catch{}
const local=createLocalPreview(storage);
const originalFetch=window.fetch.bind(window);
window.fetch=async(input,init)=>{
 const url=new URL(input instanceof Request?input.url:String(input),window.location.href);
 if(url.pathname!=='/api/workshop')return originalFetch(input,init);
 const request=input instanceof Request?input:new Request(url,init);
 return local.fetch(request);
};
document.addEventListener('click',event=>{
 const link=event.target instanceof Element?event.target.closest('a[href="/"]'):null;
 if(link){event.preventDefault();window.location.reload();}
});
createRoot(document.getElementById('root')!).render(<CircularCut/>);
