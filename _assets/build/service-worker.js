'use strict';
var precacheConfig = [
    ['./index.html', '93c4c0a4c148b4665c56f942d810f863'],
    ['./static/css/main.869744c2.css', '1a6d1b62dffc9c184c630ee434665c23'],
    [
      './static/media/STIX2Text-Bold.4a74d131.otf',
      '4a74d131d7912180ffed97d982bc8a38'
    ],
    [
      './static/media/STIX2Text-Bold.7e101c4d.woff',
      '7e101c4d6dc93114fcf2132253fb69c5'
    ],
    [
      './static/media/STIX2Text-Bold.d0ac74f9.woff2',
      'd0ac74f968e0c6b716b7cffee73c5ed9'
    ],
    [
      './static/media/STIX2Text-BoldItalic.2d52ab76.otf',
      '2d52ab76f38de9715cff8870fbe4f893'
    ],
    [
      './static/media/STIX2Text-BoldItalic.b2de3865.woff2',
      'b2de3865d8c7d4df2b39b2afcb6233e6'
    ],
    [
      './static/media/STIX2Text-BoldItalic.e41e675e.woff',
      'e41e675ee4f41b88508f44d4d51d619c'
    ],
    [
      './static/media/STIX2Text-Italic.12f4ddbd.otf',
      '12f4ddbd82e2162b96c0e322bf6d0219'
    ],
    [
      './static/media/STIX2Text-Italic.37d45f68.woff',
      '37d45f689af9587154d712371fce3ae7'
    ],
    [
      './static/media/STIX2Text-Italic.57a4b715.woff2',
      '57a4b7158d13f48a33c6289224be9ea1'
    ],
    [
      './static/media/STIX2Text-Regular.46928246.woff',
      '4692824673cb844398f7a25fe9f007fb'
    ],
    [
      './static/media/STIX2Text-Regular.b44469bc.otf',
      'b44469bcb3204f5e3f4ce3d23bd4620a'
    ],
    [
      './static/media/STIX2Text-Regular.dec64005.woff2',
      'dec6400521a465937f4bbe6675c60a9c'
    ],
    ['./static/media/clippy.5d886e11.svg', '5d886e110f4329bcecfb919563dee3af']
  ],
  cacheName =
    'sw-precache-v3-sw-precache-webpack-plugin-' +
    (self.registration ? self.registration.scope : ''),
  ignoreUrlParametersMatching = [/^utm_/],
  addDirectoryIndex = function(e, t) {
    var a = new URL(e);
    return '/' === a.pathname.slice(-1) && (a.pathname += t), a.toString();
  },
  cleanResponse = function(t) {
    return t.redirected
      ? ('body' in t ? Promise.resolve(t.body) : t.blob()).then(function(e) {
          return new Response(e, {
            headers: t.headers,
            status: t.status,
            statusText: t.statusText
          });
        })
      : Promise.resolve(t);
  },
  createCacheKey = function(e, t, a, n) {
    var r = new URL(e);
    return (
      (n && r.pathname.match(n)) ||
        (r.search +=
          (r.search ? '&' : '') +
          encodeURIComponent(t) +
          '=' +
          encodeURIComponent(a)),
      r.toString()
    );
  },
  isPathWhitelisted = function(e, t) {
    if (0 === e.length) return !0;
    var a = new URL(t).pathname;
    return e.some(function(e) {
      return a.match(e);
    });
  },
  stripIgnoredUrlParameters = function(e, a) {
    var t = new URL(e);
    return (
      (t.hash = ''),
      (t.search = t.search
        .slice(1)
        .split('&')
        .map(function(e) {
          return e.split('=');
        })
        .filter(function(t) {
          return a.every(function(e) {
            return !e.test(t[0]);
          });
        })
        .map(function(e) {
          return e.join('=');
        })
        .join('&')),
      t.toString()
    );
  },
  hashParamName = '_sw-precache',
  urlsToCacheKeys = new Map(
    precacheConfig.map(function(e) {
      var t = e[0],
        a = e[1],
        n = new URL(t, self.location),
        r = createCacheKey(n, hashParamName, a, /\.\w{8}\./);
      return [n.toString(), r];
    })
  );
function setOfCachedUrls(e) {
  return e
    .keys()
    .then(function(e) {
      return e.map(function(e) {
        return e.url;
      });
    })
    .then(function(e) {
      return new Set(e);
    });
}
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches
      .open(cacheName)
      .then(function(n) {
        return setOfCachedUrls(n).then(function(a) {
          return Promise.all(
            Array.from(urlsToCacheKeys.values()).map(function(t) {
              if (!a.has(t)) {
                var e = new Request(t, { credentials: 'same-origin' });
                return fetch(e).then(function(e) {
                  if (!e.ok)
                    throw new Error(
                      'Request for ' +
                        t +
                        ' returned a response with status ' +
                        e.status
                    );
                  return cleanResponse(e).then(function(e) {
                    return n.put(t, e);
                  });
                });
              }
            })
          );
        });
      })
      .then(function() {
        return self.skipWaiting();
      })
  );
}),
  self.addEventListener('activate', function(e) {
    var a = new Set(urlsToCacheKeys.values());
    e.waitUntil(
      caches
        .open(cacheName)
        .then(function(t) {
          return t.keys().then(function(e) {
            return Promise.all(
              e.map(function(e) {
                if (!a.has(e.url)) return t.delete(e);
              })
            );
          });
        })
        .then(function() {
          return self.clients.claim();
        })
    );
  }),
  self.addEventListener('fetch', function(t) {
    if ('GET' === t.request.method) {
      var e,
        a = stripIgnoredUrlParameters(
          t.request.url,
          ignoreUrlParametersMatching
        ),
        n = 'index.html';
      (e = urlsToCacheKeys.has(a)) ||
        ((a = addDirectoryIndex(a, n)), (e = urlsToCacheKeys.has(a)));
      var r = './index.html';
      !e &&
        'navigate' === t.request.mode &&
        isPathWhitelisted(['^(?!\\/__).*'], t.request.url) &&
        ((a = new URL(r, self.location).toString()),
        (e = urlsToCacheKeys.has(a))),
        e &&
          t.respondWith(
            caches
              .open(cacheName)
              .then(function(e) {
                return e.match(urlsToCacheKeys.get(a)).then(function(e) {
                  if (e) return e;
                  throw Error(
                    'The cached response that was expected is missing.'
                  );
                });
              })
              .catch(function(e) {
                return (
                  console.warn(
                    'Couldn\'t serve response for "%s" from cache: %O',
                    t.request.url,
                    e
                  ),
                  fetch(t.request)
                );
              })
          );
    }
  });
