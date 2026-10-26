import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'dist');
const port=Number(process.env.PORT||4173);
const python=String.raw`C:\Users\JF Arquitetura\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe`;
const syncScript=path.join(path.dirname(fileURLToPath(import.meta.url)),'tools','sync-final-renders.py');
let syncing=false;
function syncFinalRenders(){if(syncing||!fs.existsSync(python)||!fs.existsSync(syncScript))return;syncing=true;const child=spawn(python,[syncScript],{windowsHide:true,stdio:['ignore','pipe','pipe']});child.stdout.on('data',chunk=>{if(!chunk.toString().includes('atualizadas: []'))process.stdout.write(chunk)});child.stderr.on('data',chunk=>process.stderr.write(chunk));child.on('error',()=>{syncing=false});child.on('exit',()=>{syncing=false})}
syncFinalRenders();setInterval(syncFinalRenders,45000).unref();
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.glb':'model/gltf-binary','.woff2':'font/woff2','.svg':'image/svg+xml'};
http.createServer((req,res)=>{
 let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400).end();return}
 const filename=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
 if(!filename.startsWith(root+path.sep)){res.writeHead(403).end();return}
 fs.stat(filename,(err,s)=>{
  if(err||!s.isFile()){res.writeHead(404).end('Arquivo não encontrado');return}
  const headers={'Content-Type':types[path.extname(filename)]||'application/octet-stream','Accept-Ranges':'bytes','Cache-Control':'no-cache'};
  const match=/bytes=(\d+)-(\d*)/.exec(req.headers.range||'');
  if(match){const start=Number(match[1]),end=Math.min(match[2]?Number(match[2]):s.size-1,s.size-1);if(start>end||start>=s.size){res.writeHead(416,{'Content-Range':`bytes */${s.size}`}).end();return}res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${s.size}`,'Content-Length':end-start+1});if(req.method==='HEAD'){res.end();return}fs.createReadStream(filename,{start,end}).pipe(res)}
  else{res.writeHead(200,{...headers,'Content-Length':s.size});if(req.method==='HEAD'){res.end();return}fs.createReadStream(filename).pipe(res)}
 });
}).listen(port,'127.0.0.1',()=>console.log(`Casa Demarchi: http://127.0.0.1:${port}`));
