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
                    '/images/body-bg.gif',
                    '/images/logo_silinet_rus.svg',
                    '/images/no-internet.jpg',
                    '/images/promo.png',
                    '/assets/android-chrome-192x192.png',
                    '/assets/android-chrome-256x256.png',
                    '/assets/android-chrome-512x512.png',
                    '/assets/apple-touch-icon.png',
                    '/assets/favicon-16x16.png',
                    '/assets/favicon-32x32.png',
                    '/assets/safari-pinned-tab.svg',
                    '/scripts/uikit/fonts/roboto/regular-400.woff2',
                    '/scripts/uikit/css/style.css',
                    '/scripts/uikit/css/uikit.css',
                    '/scripts/uikit/css/uikit.min.css',
                    '/scripts/uikit/css/uikit-rtl.css',
                    '/scripts/uikit/css/uikit-rtl.min.css',
                    '/scripts/air-datepicker/css/datepicker.css',
                    '/scripts/uikit/js/script.js',
                    '/scripts/uikit/js/uikit.js',
                    '/scripts/uikit/js/uikit.min.js',
                    '/scripts/uikit/js/uikit-icons.js',
                    '/scripts/uikit/js/uikit-icons.min.js',
                    '/scripts/jquery/jquery.js',
                    '/scripts/jquery/jquery.mask.js',
                    '/scripts/air-datepicker/js/datepicker.js',
                    '/scripts/jquery/jquery.color.plus-names-2.1.2.js'
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
const FALLBACK = `
<style>
* {
margin: 0;
padding: 0;
box-sizing: border-box;

}
html, body {
overflow: hidden!important;
}

h1 {
color: brown;
font-size: 3rem;
text-align: center;

}
.no-internet {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #009933f5;
    padding: 0;
    margin: 0;
    overflow-x: hidden!important;
}
.no-internet-img {
    max-width: 50%;
    width: 40%;
    margin-bottom: 2rem;
}
</style>
<div class="no-internet">
<img class="no-internet-img" src="images/no-internet.jpg" alt="Нет интернета!">
      <h1>Нет интернета, режим оффлайн.<br/><a href="/">На Главную</a></h1>
</div>`

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
