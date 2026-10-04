import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
import * as cutting from '../lib/cutting.ts';
import * as evidence from '../lib/evidence.ts';

// Execute the real route and SQL in an isolated SQLite database, without a web server.
// This validates API permissions, migrations, transactions and impact logic; browser
// QA separately exercises the actual Worker/D1 binding and rendered interface.
export function createRouteHarness(){
 const sqlite=new DatabaseSync(':memory:');
 sqlite.exec(readFileSync(new URL('../drizzle/0000_amazing_juggernaut.sql',import.meta.url),'utf8'));
 // A pre-upgrade record with no new actor columns exercises backwards compatibility.
 const legacyKey='d:11111111-1111-4111-8111-111111111111';
 const plan=cutting.matchStock(cutting.sampleStocks[0],cutting.sampleOrder).plan;
 sqlite.prepare('INSERT INTO offcuts(owner,id,data,status) VALUES(?,?,?,?)').run(legacyKey,'OC-001',JSON.stringify(cutting.sampleStocks[0]),'collected');
 sqlite.prepare('INSERT INTO reservations(owner,id,stock_id,stock,order_data,plan,status,created_at,updated_at,revision,used_ids,avoided_new,notes) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)').run(legacyKey,'CC-LEGACY','OC-001',JSON.stringify(cutting.sampleStocks[0]),JSON.stringify(cutting.sampleOrder),JSON.stringify(plan),'collected','2026-10-02','2026-10-02','legacy-revision','[]','unknown','Synthetic pre-upgrade record');
 sqlite.exec(readFileSync(new URL('../drizzle/0001_known_gertrude_yorkes.sql',import.meta.url),'utf8'));
 const db={prepare(query){return {bind(...args){return {async first(){return sqlite.prepare(query).get(...args)??null;},async all(){return {results:sqlite.prepare(query).all(...args)};},run(){const r=sqlite.prepare(query).run(...args);return {meta:{changes:Number(r.changes)}};}};}};},async batch(statements){sqlite.exec('BEGIN');try{const results=[];for(const s of statements)results.push(s.run());sqlite.exec('COMMIT');return results;}catch(e){sqlite.exec('ROLLBACK');throw e;}}};
 let source=readFileSync(new URL('../app/api/workshop/route.ts',import.meta.url),'utf8');
 source=source.replace("import { database } from '@/db/raw';",'')
 .replace(/import \{[^;]+\} from '@\/lib\/cutting';/,"const { sampleStocks, matchStock, validateOrder } = cutting;")
 .replace(/import \{[^;]+\} from '@\/lib\/evidence';/,"const { cleanDetails, sampleDetails, validateDetails, validateFeedback } = evidence;");
 const compiled=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText;
 const exports={};new Function('database','cutting','evidence','exports',compiled)(()=>db,cutting,evidence,exports);
 return {async fetch(url,options={}){const req=new Request(url,options);return req.method==='POST'?exports.POST(req):exports.GET(req);},close(){sqlite.close();},legacyCookie:'cc_workspace='+legacyKey.slice(2)};
}
