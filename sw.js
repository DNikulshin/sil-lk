// self.addEventListener('install', (event) => {
//     console.log('Установлен');
// });
//
// self.addEventListener('activate', (event) => {
//     console.log('Активирован');
// });
//
// self.addEventListener('fetch', (event) => {
//     console.log('Происходит запрос на сервер');
// });

const CACHE = 'offline-fallback-v1'

// При установке воркера мы должны закешировать часть данных (статику).
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open(CACHE)
            .then((cache) => cache.addAll(
                [
                    '/',
                    '/index.html',
                    'images',
                    'images/body-bg.gif',
                    'images/logo_silinet_rus.svg',
                    'images/promo.png',
                    'assets',
                    'scripts/uikit/fonts/roboto/regular-400.woff2',
                    'scripts/uikit/css/style.css',
                    'scripts/uikit/css/uikit.css',
                    'scripts/uikit/css/uikit.min.css',
                    'scripts/uikit/css/uikit-rtl.css',
                    'scripts/uikit/css/uikit-rtl.min.css',
                    'scripts/air-datepicker/css/datepicker.css',
                    'scripts/uikit/js/script.js',
                    'scripts/uikit/js/uikit.js',
                    'scripts/uikit/js/uikit.min.js',
                    'scripts/uikit/js/uikit-icons.js',
                    'scripts/uikit/js/uikit-icons.min.js',
                    'scripts/jquery/jquery.js',
                    'scripts/jquery/jquery.mask.js',
                    'scripts/air-datepicker/js/datepicker.js',
                    'scripts/jquery/jquery.color.plus-names-2.1.2.js'
                ]))
            // `skipWaiting()` необходим, потому что мы хотим активировать SW
            // и контролировать его сразу, а не после перезагрузки.
            .then(() => self.skipWaiting())
    )
})

self.addEventListener('activate', (event) => {
    // `self.clients.claim()` позволяет SW начать перехватывать запросы с самого начала,
    // это работает вместе с `skipWaiting()`, позволяя использовать `fallback` с самых первых запросов.
    event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', function (event) {
    // Можете использовать любую стратегию описанную выше.
    // Если она не отработает корректно, то используейте `Embedded fallback`.
    event.respondWith(networkOrCache(event.request)
        .catch(() => useFallback()))
})

function networkOrCache(request) {
    return fetch(request)
        .then((response) => response.ok ? response : fromCache(request))
        .catch(() => fromCache(request))
}

//Fallback.
const FALLBACK =
    `<div style="width: 100%;  display: flex; justify-content: center; align-items: center">
      <h1 style="display: flex;">Нет интернета, режим оффлайн.&nbsp;<a href="/">На Главную</a></h1>
</div>
    `

// Он никогда не упадет, т.к мы всегда отдаем заранее подготовленные данные.
function useFallback() {
    return Promise.resolve(new Response(FALLBACK, {
        headers: {
            'Content-Type': 'text/html; charset=utf-8'
        }
    }))
}

function fromCache(request) {
    return caches.open(CACHE).then((cache) =>
        cache.match(request).then((matching) =>
            matching || Promise.reject('no-match')
        ))
}
