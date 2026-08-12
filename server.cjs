const http=require('http'),fs=require('fs'),path=require('path');
const root=path.resolve(__dirname), port=process.env.PORT||8899;
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon','.xml':'application/xml','.txt':'text/plain'};
http.createServer((req,res)=>{
  let p=decodeURIComponent((req.url||'/').split('?')[0]); if(p==='/')p='/index.html';
  const fp=path.resolve(path.join(root,p));
  // SECURITY: never serve anything outside the project folder
  if(fp!==root && !fp.startsWith(root+path.sep)){res.writeHead(403);res.end('Forbidden');return;}
  fs.readFile(fp,(e,d)=>{
    if(e){ // fall back to 404 page
      fs.readFile(path.join(root,'404.html'),(e2,d2)=>{res.writeHead(404,{'Content-Type':'text/html'});res.end(e2?'404':d2);});
      return;
    }
    res.writeHead(200,{'Content-Type':types[path.extname(fp).toLowerCase()]||'application/octet-stream','Cache-Control':'no-store, no-cache, must-revalidate'});
    res.end(d);
  });
}).listen(port,()=>console.log('serving '+root+' on '+port));
