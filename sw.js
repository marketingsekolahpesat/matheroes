// Service worker Matheroes — installable (Add to Home Screen) + offline.
// Strategi NETWORK-FIRST: saat online selalu ambil versi terbaru (update langsung kebaca, anti-stale);
// saat offline pakai cache. Cache = jaring pengaman, bukan sumber utama → tak ada masalah versi basi.
const CACHE='matheroes-v1';
const ASSETS=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(ASSETS).catch(function(){});}).then(function(){return self.skipWaiting();}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.map(function(k){if(k!==CACHE)return caches.delete(k);}));}).then(function(){return self.clients.claim();}));
});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  e.respondWith(
    fetch(e.request).then(function(r){
      var cp=r.clone(); caches.open(CACHE).then(function(c){c.put(e.request,cp);}); return r;
    }).catch(function(){
      return caches.match(e.request).then(function(m){return m||caches.match('./index.html');});
    })
  );
});
