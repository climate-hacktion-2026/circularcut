import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const root=fileURLToPath(new URL('../',import.meta.url));
const require=createRequire(path.join(root,'package.json'));
const esbuild=require('esbuild');
const postcss=require('postcss');
const tailwind=require('@tailwindcss/postcss');
process.chdir(root);
const target=path.resolve(root,'../index.html');
const result=await esbuild.build({entryPoints:[path.join(root,'handoff/preview.tsx')],absWorkingDir:root,tsconfig:path.join(root,'tsconfig.json'),bundle:true,write:false,format:'iife',platform:'browser',target:'es2022',minify:true,legalComments:'eof',define:{'process.env.NODE_ENV':'"production"'},metafile:true});
const cssSource=await fs.readFile(path.join(root,'app/globals.css'),'utf8');
const css=(await postcss([tailwind({base:root,optimize:true})]).process(cssSource,{from:path.join(root,'app/globals.css'),to:path.join(root,'handoff/preview.css')})).css;
const icon=await fs.readFile(path.join(root,'public/favicon.svg'),'utf8');
const iconUrl='data:image/svg+xml,'+encodeURIComponent(icon);
const script=result.outputFiles[0].text.replace(/<\/script/gi,'<\\/script');
const html=`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CircularCut · EarthSync · Offline design preview</title><meta name="description" content="Local design preview using the actual CircularCut interface and cutting engine. The complete server-backed source is included in the ZIP."><link rel="icon" type="image/svg+xml" href="${iconUrl}"><style>${css}</style><style>.handoff-banner{background:#193d2d;color:#eef4e6;padding:11px 20px;font:13px/1.5 Arial,Helvetica,sans-serif;text-align:center;border-bottom:1px solid #b2c799}.handoff-banner strong{font-weight:700}.handoff-banner span{opacity:.9}.handoff-banner button{margin-left:12px;border:1px solid #91a680;background:#2b523c;color:#fff;border-radius:5px;padding:3px 9px;font:inherit}.handoff-banner button:focus-visible{outline:2px solid #e1edae;outline-offset:2px}@media print{.handoff-banner{display:none}}@media(max-width:650px){.handoff-banner span{display:block}}</style></head>
<body><aside class="handoff-banner" aria-label="Preview information"><strong>Offline design preview</strong> <span>· Saved in this browser · Shared server and account permissions are in the full source folder</span><button id="preview-help" type="button">About this copy</button></aside><div id="root"></div><noscript>This interactive design preview needs JavaScript enabled. The full project source is included in the ZIP.</noscript><script>document.getElementById('preview-help').addEventListener('click',function(){alert('This HTML uses CircularCut’s actual React interface, cutting engine and evidence validation. Records and messages are stored locally for design review. Exchanges here do not connect independent people or the live database. Use the included source folder for the complete server-backed app. No live project changes are made by this file.');});</script><script>${script}</script></body></html>`;
await fs.writeFile(target,html);
const notices=[];
const visited=new Set();
for(const file of Object.keys(result.metafile.inputs)){
 if(!file.includes('node_modules/'))continue;
 let directory=path.dirname(path.resolve(root,file));
 while(directory.includes(`${path.sep}node_modules`)){
  let pkg;try{pkg=JSON.parse(await fs.readFile(path.join(directory,'package.json'),'utf8'));}catch{}
  if(pkg?.name){
   if(!visited.has(pkg.name)){
    visited.add(pkg.name);
    for(const name of ['LICENSE','LICENSE.md','LICENSE.txt','license','license.md','COPYING']){
     try{const body=await fs.readFile(path.join(directory,name),'utf8');notices.push(`${pkg.name} ${pkg.version}\n${'-'.repeat(60)}\n${body}`);break;}catch{}
    }
   }
   break;
  }
  directory=path.dirname(directory);
 }
}
await fs.writeFile(path.resolve(root,'../THIRD-PARTY-NOTICES.txt'),notices.join('\n\n'));
console.log(JSON.stringify({file:target,bytes:Buffer.byteLength(html),embedded_css_bytes:Buffer.byteLength(css),bundled_packages:visited.size}));
