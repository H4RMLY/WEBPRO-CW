/* Log fetch requests and then serve them from the cache */
function interceptFetch(evt) {
    evt.respondWith(handleFetch(evt.request));
    evt.waitUntil(updateCache(evt.request));
  }
  
  /* Retrieve a requested resource from the cache
   * or return a resolved promise if its not there.
   */
  async function handleFetch(request) {
    const c = await caches.open(CACHE);
    const cachedCopy = await c.match(request);
    return cachedCopy;
  }
  
  /* Invoke the default fetch capability to
   * pull a resource over the network and use
   * that to update the cache.
   */
  async function updateCache(request) {
    const c = await caches.open(CACHE);
    const response = await fetch(request);
    console.log('Updating cache ', request.url);
    return c.put(request, response);
  }
  
  const CACHE = 'hiit';
  const CACHEABLE = [
    'WEBPRO-CW/',
    './sw.js',
    './server.js',
    './site',
    './manifest.json',
    './index.html',
    './index.css',
    './index.js',
    './assets/HIT-CW-Icon.png',
    './assets/HIT-CW-Logo.png',
    './external-content/workouts.json',
    './external-content/accounts.json',
  ];
  
  /* Prepare and populate a cache. */
  async function prepareCache() {
    const c = await caches.open(CACHE);
    await c.addAll(CACHEABLE);
    console.log('Cache prepared.');
  }
  
  // install the event listener so it can run in the background.
  self.addEventListener('install', prepareCache);
  self.addEventListener('fetch', interceptFetch);
  