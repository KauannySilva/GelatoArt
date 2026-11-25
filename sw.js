const CACHE_GELATOART = 'gelatoart-repositor-v3';
const ASSETS_ESTATICOS = [
    './',
    './index.html',
    './style.css',
    './app.js'
];

// Evento de Instalação: Salva recursos essenciais em cache
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_GELATOART).then((cache) => {
            console.log('[SW] Armazenando shell do GelatoArt Repositor em cache...');
            return cache.addAll(ASSETS_ESTATICOS);
        })
    );
    self.skipWaiting();
});

// Evento de Ativação: Limpa caches obsoletos
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((chaves) => {
            return Promise.all(
                chaves.map((chave) => {
                    if (chave !== CACHE_GELATOART) {
                        console.log('[SW] Removendo cache anterior:', chave);
                        return caches.delete(chave);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Evento Fetch: Cache First com atualização em segundo plano e fallback offline
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then((respostaCache) => {
            if (respostaCache) {
                fetch(event.request)
                    .then((respostaRede) => {
                        if (respostaRede && respostaRede.status === 200) {
                            caches.open(CACHE_GELATOART).then((cache) => {
                                cache.put(event.request, respostaRede.clone());
                            });
                        }
                    })
                    .catch(() => { /* Mantém versão em cache quando offline */ });

                return respostaCache;
            }

            return fetch(event.request)
                .then((respostaRede) => {
                    // Cacheia fontes e biblioteca Lucide quando carregados online
                    if (
                        respostaRede &&
                        respostaRede.status === 200 &&
                        (event.request.url.includes('cdn.jsdelivr.net') ||
                         event.request.url.includes('fonts.googleapis.com') ||
                         event.request.url.includes('fonts.gstatic.com'))
                    ) {
                        const copia = respostaRede.clone();
                        caches.open(CACHE_GELATOART).then((cache) => cache.put(event.request, copia));
                    }
                    return respostaRede;
                })
                .catch(() => {
                    if (event.request.mode === 'navigate') {
                        return caches.match('./index.html');
                    }
                });
        })
    );
});