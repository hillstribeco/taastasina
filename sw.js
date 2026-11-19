const CACHE="card-score-v4";
const ASSETS=["./","./index.html","./manifest.json","./icon.svg","./icon-192.png","./icon-512.png"];

self.addEventListener("install",e=>{
  e.waitUntil(
    caches.open(CACHE)
      .then(c=>c.addAll(ASSETS).catch(()=>{}))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener("activate",e=>{
  e.waitUntil(
    caches.keys()
      .then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  e.respondWith(
    caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{
      if(resp&&resp.status===200&&resp.type==="basic"){
        const clone=resp.clone();
        caches.open(CACHE).then(c=>c.put(e.request,clone)).catch(()=>{});
      }
      return resp;
    }).catch(()=>caches.match("./index.html")))
  );
});
