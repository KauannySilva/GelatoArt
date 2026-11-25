/**
 * GelatoArt Repositor — Sistema de Gestão de Estoque e Pedidos
 * Redesign Premium: Identidade Chocolate/Creme/Pistache, Lucide Icons,
 * Renders padronizados de potes comerciais (10L) e persistência offline-first.
 */

const STORAGE_KEY = 'gelatoart_erp_state_v2';
const OFFLINE_QUEUE_KEY = 'gelatoart_offline_queue_v2';
const PRECO_CAIXA_10L = 180.0;

// ============================================================================
// 1. ESTÚDIO DE IMAGENS PADRONIZADAS DOS POTES (FOTOGRAFIA DE CATÁLOGO)
// ============================================================================
const ProductImageStudio = (() => {
    const cacheDataUrl = {};

    const perfisVisuais = {
        'chocolate-belga': {
            base: '#4B2A1E',
            swirl: '#2E170F',
            detalhe: 'chocolate',
            subtitulo: 'CACAU BELGA 70%'
        },
        'morango-silvestre': {
            base: '#E79AA8',
            swirl: '#C95A70',
            detalhe: 'morango',
            subtitulo: 'POLPA INTEGRAL'
        },
        'pistache-premium': {
            base: '#A8C294',
            swirl: '#7D9E68',
            detalhe: 'pistache',
            subtitulo: 'PISTACHE SICILIANO'
        },
        'baunilha-bourbon': {
            base: '#F5E7C6',
            swirl: '#E6D1A1',
            detalhe: 'baunilha',
            subtitulo: 'FAVAS DE MADAGASCAR'
        },
        'ninho-nutella': {
            base: '#F3ECE1',
            swirl: '#543022',
            detalhe: 'mesclado',
            subtitulo: 'CREME DE AVELÃ'
        },
        'flocos': {
            base: '#F7F3EB',
            swirl: '#E9E0D1',
            detalhe: 'flocos',
            subtitulo: 'NATA & RASPAS'
        },
        'maracuja': {
            base: '#F4CE6A',
            swirl: '#DCA732',
            detalhe: 'maracuja',
            subtitulo: 'FRUTA TROPICAL'
        },
        'cookies-cream': {
            base: '#EFECE6',
            swirl: '#D8D1C7',
            detalhe: 'cookies',
            subtitulo: 'BISCOITO DE CACAU'
        }
    };

    function gerarImagemPote(sabor) {
        if (cacheDataUrl[sabor.id]) return cacheDataUrl[sabor.id];

        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 480;
        const ctx = canvas.getContext('2d');
        const cfg = perfisVisuais[sabor.id] || perfisVisuais['baunilha-bourbon'];

        // 1. Fundo de estúdio padronizado (Bege claro com vinheta suave)
        const bgGrad = ctx.createRadialGradient(320, 210, 40, 320, 240, 420);
        bgGrad.addColorStop(0, '#F7F1E8');
        bgGrad.addColorStop(1, '#E6D9C7');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, 640, 480);

        // Superfície / bancada sutil
        ctx.fillStyle = '#DFD0BC';
        ctx.fillRect(0, 365, 640, 115);

        // 2. Sombra de estúdio na base do pote
        const shadowGrad = ctx.createRadialGradient(320, 406, 20, 320, 406, 155);
        shadowGrad.addColorStop(0, 'rgba(53, 35, 27, 0.34)');
        shadowGrad.addColorStop(1, 'rgba(53, 35, 27, 0)');
        ctx.fillStyle = shadowGrad;
        ctx.beginPath();
        ctx.ellipse(320, 406, 155, 26, 0, 0, Math.PI * 2);
        ctx.fill();

        // 3. Corpo cilíndrico do pote comercial (10L / Embalagem GelatoArt)
        const potTopY = 175;
        const potBotY = 398;
        const topRX = 132;
        const botRX = 114;

        const bodyGrad = ctx.createLinearGradient(188, 0, 452, 0);
        bodyGrad.addColorStop(0, '#E9DFD1');
        bodyGrad.addColorStop(0.28, '#FFFFFF');
        bodyGrad.addColorStop(0.75, '#F4ECE0');
        bodyGrad.addColorStop(1, '#D8C9B6');

        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.moveTo(320 - topRX, potTopY);
        ctx.lineTo(320 - botRX, potBotY);
        ctx.ellipse(320, potBotY, botRX, 24, 0, Math.PI, 0, true);
        ctx.lineTo(320 + topRX, potTopY);
        ctx.closePath();
        ctx.fill();

        // Faixa editorial marrom chocolate no rótulo
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(320 - topRX, potTopY);
        ctx.lineTo(320 - botRX, potBotY);
        ctx.ellipse(320, potBotY, botRX, 24, 0, Math.PI, 0, true);
        ctx.lineTo(320 + topRX, potTopY);
        ctx.closePath();
        ctx.clip();

        // Faixa superior dourada/pistache fina
        ctx.fillStyle = '#4D7C5B';
        ctx.fillRect(170, 226, 300, 6);

        // Rótulo principal
        ctx.fillStyle = '#35231B';
        ctx.fillRect(170, 232, 300, 114);

        // Tipografia do rótulo no pote
        ctx.fillStyle = '#F7F1E8';
        ctx.font = '700 26px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('GelatoArt', 320, 268);

        ctx.fillStyle = '#C7B6A6';
        ctx.font = '600 10px sans-serif';
        ctx.fillText('ARTISANAL GELATO • 10 LITROS', 320, 286);

        // Linha divisória
        ctx.strokeStyle = 'rgba(247,241,232,0.25)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(235, 297);
        ctx.lineTo(405, 297);
        ctx.stroke();

        // Nome do sabor no rótulo
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '700 14px sans-serif';
        ctx.fillText(sabor.nome.toUpperCase(), 320, 319);

        ctx.fillStyle = '#A8C294';
        ctx.font = '600 10px sans-serif';
        ctx.fillText(cfg.subtitulo, 320, 335);
        ctx.restore();

        // 4. Sorvete cremoso aparente no topo do pote aberto
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(320, potTopY, topRX - 4, 38, 0, 0, Math.PI * 2);
        ctx.clip();

        // Base do sorvete
        const iceGrad = ctx.createRadialGradient(295, 160, 15, 320, 175, 140);
        iceGrad.addColorStop(0, '#FFFFFF');
        iceGrad.addColorStop(0.22, cfg.base);
        iceGrad.addColorStop(1, cfg.swirl);
        ctx.fillStyle = iceGrad;
        ctx.fillRect(180, 120, 280, 110);

        // Ondulações / espirais artesanais de sorvete
        ctx.strokeStyle = cfg.swirl;
        ctx.lineWidth = 9;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(215, 178);
        ctx.bezierCurveTo(260, 145, 340, 202, 420, 165);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(235, 160);
        ctx.bezierCurveTo(295, 138, 345, 178, 395, 152);
        ctx.stroke();

        // Inclusões específicas por sabor
        if (cfg.detalhe === 'baunilha') {
            ctx.fillStyle = '#3B281E';
            for (let i = 0; i < 48; i++) {
                const px = 210 + ((i * 37) % 220);
                const py = 148 + ((i * 23) % 52);
                ctx.fillRect(px, py, 2, 2);
            }
        } else if (cfg.detalhe === 'flocos' || cfg.detalhe === 'cookies') {
            ctx.fillStyle = '#2E1A12';
            const size = cfg.detalhe === 'cookies' ? 8 : 5;
            for (let i = 0; i < 26; i++) {
                const px = 215 + ((i * 43) % 210);
                const py = 148 + ((i * 29) % 50);
                ctx.fillRect(px, py, size, size - 1);
            }
        } else if (cfg.detalhe === 'morango') {
            ctx.fillStyle = '#B8334A';
            for (let i = 0; i < 14; i++) {
                const px = 225 + ((i * 47) % 190);
                const py = 152 + ((i * 31) % 44);
                ctx.beginPath();
                ctx.arc(px, py, 4.5, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (cfg.detalhe === 'pistache') {
            ctx.fillStyle = '#62834D';
            for (let i = 0; i < 18; i++) {
                const px = 220 + ((i * 41) % 200);
                const py = 150 + ((i * 27) % 46);
                ctx.fillRect(px, py, 6, 4);
            }
        } else if (cfg.detalhe === 'maracuja') {
            ctx.fillStyle = '#3A2818';
            for (let i = 0; i < 22; i++) {
                const px = 220 + ((i * 39) % 200);
                const py = 150 + ((i * 25) % 46);
                ctx.beginPath();
                ctx.ellipse(px, py, 2.5, 1.5, 0.4, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        ctx.restore();

        // Borda superior do pote (aro branco de acabamento)
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(320, potTopY, topRX - 2, 38, 0, 0, Math.PI * 2);
        ctx.stroke();

        // 5. Tampa encostada lateralmente para composição de catálogo
        ctx.fillStyle = '#35231B';
        ctx.beginPath();
        ctx.ellipse(455, 378, 56, 16, -0.18, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#C7B6A6';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        const dataUrl = canvas.toDataURL('image/png');
        cacheDataUrl[sabor.id] = dataUrl;
        return dataUrl;
    }

    return { gerarImagemPote };
})();

// ============================================================================
// 2. DADOS INICIAIS DE DEMONSTRAÇÃO (8 SABORES DA FÁBRICA)
// ============================================================================
function criarEstadoInicial() {
    const hoje = new Date();
    const formatarDataISO = (diasAtras = 0) => {
        const d = new Date(hoje);
        d.setDate(d.getDate() - diasAtras);
        return d.toISOString().split('T')[0];
    };
    const agoraHora = () => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const hojeBR = () => new Date().toLocaleDateString('pt-BR');

    return {
        perfilUsuario: 'Vendedor',
        sabores: [
            {
                id: 'chocolate-belga',
                nome: 'Chocolate Belga',
                categoria: 'Clássicos',
                descricao: 'Sorvete de chocolate cremoso elaborado com cacau belga 70% de origem selecionada.',
                estoque: 18,
                vendidosSemana: 34,
                imagemUrl: './assets/products/chocolate-belga.jpg'
            },
            {
                id: 'morango-silvestre',
                nome: 'Morango Silvestre',
                categoria: 'Frutas',
                descricao: 'Sorvete rosa artesanal preparado com polpa integral e pedaços de morangos frescos.',
                estoque: 6,
                vendidosSemana: 28,
                imagemUrl: './assets/products/morango-silvestre.jpg'
            },
            {
                id: 'pistache-premium',
                nome: 'Pistache Premium',
                categoria: 'Premium',
                descricao: 'Sorvete verde-claro de pistache siciliano torrado com textura densa e aveludada.',
                estoque: 0,
                vendidosSemana: 31,
                imagemUrl: './assets/products/pistache-premium.jpg'
            },
            {
                id: 'baunilha-bourbon',
                nome: 'Baunilha Bourbon',
                categoria: 'Clássicos',
                descricao: 'Sorvete de baunilha com pequenos pontos naturais de favas Bourbon de Madagascar.',
                estoque: 14,
                vendidosSemana: 19,
                imagemUrl: './assets/products/baunilha-bourbon.jpg'
            },
            {
                id: 'ninho-nutella',
                nome: 'Ninho com Nutella',
                categoria: 'Especiais',
                descricao: 'Sorvete branco de leite Ninho cremoso mesclado com camadas de creme de chocolate e avelã.',
                estoque: 5,
                vendidosSemana: 39,
                imagemUrl: './assets/products/ninho-nutella.jpg'
            },
            {
                id: 'flocos',
                nome: 'Flocos',
                categoria: 'Clássicos',
                descricao: 'Sorvete branco de nata fresca com pequenas raspas crocantes de chocolate meio amargo.',
                estoque: 12,
                vendidosSemana: 22,
                imagemUrl: './assets/products/flocos.jpg'
            },
            {
                id: 'maracuja',
                nome: 'Maracujá',
                categoria: 'Frutas',
                descricao: 'Sorvete amarelo-claro refrescante produzido com polpa concentrada de maracujá.',
                estoque: 9,
                vendidosSemana: 17,
                imagemUrl: './assets/products/maracuja.jpg'
            },
            {
                id: 'cookies-cream',
                nome: 'Cookies and Cream',
                categoria: 'Especiais',
                descricao: 'Sorvete branco cremoso com pedaços generosos de biscoito de cacau crocante.',
                estoque: 11,
                vendidosSemana: 26,
                imagemUrl: './assets/products/cookies-cream.jpg'
            }
        ],
        pedidos: [
            {
                id: 'PED-1041',
                cliente: 'Empório Gelado Paulista',
                endereco: 'Av. Paulista, 1578 - Bela Vista',
                saborId: 'chocolate-belga',
                saborNome: 'Chocolate Belga',
                quantidade: 4,
                data: formatarDataISO(0),
                valorTotal: 4 * PRECO_CAIXA_10L,
                status: 'Em preparação',
                horarioPrevisto: '15:30',
                entregaStatus: 'Aguardando retirada',
                entregueEm: null
            },
            {
                id: 'PED-1042',
                cliente: 'Café & Sabor Jardins',
                endereco: 'Rua Oscar Freire, 890 - Jardins',
                saborId: 'ninho-nutella',
                saborNome: 'Ninho com Nutella',
                quantidade: 3,
                data: formatarDataISO(0),
                valorTotal: 3 * PRECO_CAIXA_10L,
                status: 'Saiu para entrega',
                horarioPrevisto: '16:15',
                entregaStatus: 'Em rota',
                entregueEm: null
            },
            {
                id: 'PED-1043',
                cliente: 'Restaurante Vila Verde',
                endereco: 'Rua Harmonia, 312 - Vila Madalena',
                saborId: 'morango-silvestre',
                saborNome: 'Morango Silvestre',
                quantidade: 2,
                data: formatarDataISO(0),
                valorTotal: 2 * PRECO_CAIXA_10L,
                status: 'Novo pedido',
                horarioPrevisto: '17:00',
                entregaStatus: 'Aguardando retirada',
                entregueEm: null
            },
            {
                id: 'PED-1039',
                cliente: 'Bistrô Parque Sul',
                endereco: 'Av. Moema, 540 - Moema',
                saborId: 'flocos',
                saborNome: 'Flocos',
                quantidade: 5,
                data: formatarDataISO(1),
                valorTotal: 5 * PRECO_CAIXA_10L,
                status: 'Entregue',
                horarioPrevisto: '14:00',
                entregaStatus: 'Entregue',
                entregueEm: `${formatarDataISO(1)} às 13:52`
            }
        ],
        reposicoes: [
            {
                id: 'REP-208',
                loja: 'Loja Matriz — Centro',
                itens: [
                    { saborId: 'pistache-premium', saborNome: 'Pistache Premium', quantidade: 10 },
                    { saborId: 'morango-silvestre', saborNome: 'Morango Silvestre', quantidade: 6 }
                ],
                totalCaixas: 16,
                data: hojeBR(),
                status: 'Em preparação'
            },
            {
                id: 'REP-207',
                loja: 'Quiosque Shopping Plaza',
                itens: [
                    { saborId: 'ninho-nutella', saborNome: 'Ninho com Nutella', quantidade: 8 }
                ],
                totalCaixas: 8,
                data: hojeBR(),
                status: 'Aguardando separação'
            }
        ],
        historico: [
            {
                id: 'HIS-1',
                data: hojeBR(),
                dataISO: formatarDataISO(0),
                hora: agoraHora(),
                tipo: 'Pedido',
                produto: 'PED-1043 — Morango Silvestre',
                quantidade: '2 cx (10L)',
                detalhe: 'Novo pedido registrado para Restaurante Vila Verde'
            },
            {
                id: 'HIS-2',
                data: hojeBR(),
                dataISO: formatarDataISO(0),
                hora: '11:20',
                tipo: 'Reposição',
                produto: 'REP-208 — Pistache Premium + Morango',
                quantidade: '16 cx (10L)',
                detalhe: 'Solicitação de reposição em preparação na fábrica'
            },
            {
                id: 'HIS-3',
                data: hojeBR(),
                dataISO: formatarDataISO(0),
                hora: '09:45',
                tipo: 'Saída',
                produto: 'Pistache Premium',
                quantidade: '-4 cx (10L)',
                detalhe: 'Venda direta no balcão da unidade'
            },
            {
                id: 'HIS-4',
                data: hojeBR(),
                dataISO: formatarDataISO(0),
                hora: '08:30',
                tipo: 'Entrada',
                produto: 'Chocolate Belga',
                quantidade: '+12 cx (10L)',
                detalhe: 'Recebimento matinal da fábrica GelatoArt'
            }
        ],
        alertas: []
    };
}

// ============================================================================
// 3. PERSISTÊNCIA LOCAL E FILA OFFLINE
// ============================================================================
const StorageRepository = {
    carregarEstado() {
        try {
            const salvo = localStorage.getItem(STORAGE_KEY);
            if (!salvo) {
                const inicial = criarEstadoInicial();
                this.salvarEstado(inicial);
                return inicial;
            }
            return JSON.parse(salvo);
        } catch (e) {
            console.error('[Storage] Erro ao ler localStorage:', e);
            return criarEstadoInicial();
        }
    },

    salvarEstado(estado) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
        } catch (e) {
            console.error('[Storage] Erro ao salvar estado:', e);
        }
    },

    resetar() {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(OFFLINE_QUEUE_KEY);
        return this.carregarEstado();
    }
};

const SyncService = {
    obterFila() {
        try {
            return JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || '[]');
        } catch {
            return [];
        }
    },

    registrarOperacao(tipoAcao, payload) {
        if (navigator.onLine) return;

        const fila = this.obterFila();
        fila.push({
            id: `SYNC-${Date.now()}`,
            timestamp: new Date().toISOString(),
            endpointFuturo: `/api/v1/${tipoAcao}`,
            metodo: 'POST',
            payload,
            status: 'AGUARDANDO_API'
        });
        localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(fila));
        atualizarIndicadorFilaOffline();
    },

    aoReconectar() {
        const fila = this.obterFila();
        if (fila.length > 0) {
            mostrarToast(`Conexão restabelecida. ${fila.length} operação(ões) na fila local prontas para envio.`);
        }
        atualizarIndicadorFilaOffline();
    }
};

// ============================================================================
// 4. ESTADO GLOBAL E REGRAS DE NEGÓCIO
// ============================================================================
let appState = StorageRepository.carregarEstado();

function atualizarIcones() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
    }
}

function classificarEstoque(qtd) {
    if (qtd <= 0) return { codigo: 'critico', classe: 'status-vermelho', texto: 'Indisponível' };
    if (qtd <= 8) return { codigo: 'baixo', classe: 'status-amarelo', texto: 'Estoque baixo' };
    return { codigo: 'disponivel', classe: 'status-verde', texto: 'Disponível' };
}

function registrarHistorico(tipo, produto, quantidade, detalhe) {
    const agora = new Date();
    appState.historico.unshift({
        id: `HIS-${Date.now()}`,
        data: agora.toLocaleDateString('pt-BR'),
        dataISO: agora.toISOString().split('T')[0],
        hora: agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        tipo,
        produto,
        quantidade,
        detalhe
    });
}

function adicionarAlerta(nivel, titulo, mensagem) {
    const agora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    appState.alertas.unshift({
        id: `ALT-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        nivel,
        titulo,
        mensagem,
        hora: agora
    });
    if (appState.alertas.length > 30) appState.alertas.pop();
}

function sincronizarAlertasAutomaticos() {
    const alertasBase = [];

    appState.sabores.forEach(s => {
        if (s.estoque === 0) {
            alertasBase.push({
                id: `AUTO-ZERO-${s.id}`,
                nivel: 'critico',
                titulo: `Produto Indisponível: ${s.nome}`,
                mensagem: `Saldo zerado (0 caixas de 10L). Solicite reposição imediata à fábrica.`,
                hora: 'Agora'
            });
        } else if (s.estoque <= 8) {
            alertasBase.push({
                id: `AUTO-BAIXO-${s.id}`,
                nivel: 'aviso',
                titulo: `Estoque Baixo: ${s.nome}`,
                mensagem: `Restam ${s.estoque} caixa(s) de 10L na unidade.`,
                hora: 'Agora'
            });
        }
    });

    const pendentes = appState.pedidos.filter(p => p.status !== 'Entregue' && p.status !== 'Cancelado');
    if (pendentes.length > 0) {
        alertasBase.push({
            id: 'AUTO-ENTREGAS',
            nivel: 'aviso',
            titulo: `${pendentes.length} Entrega(s) Pendente(s)`,
            mensagem: `Pedidos comerciais aguardando conclusão na rota de entregas.`,
            hora: 'Hoje'
        });
    }

    const manuais = appState.alertas.filter(a => !a.id.startsWith('AUTO-'));
    appState.alertas = [...alertasBase, ...manuais];
}

function persistirERenderizar() {
    sincronizarAlertasAutomaticos();
    StorageRepository.salvarEstado(appState);
    renderizarTudo();
}

// ============================================================================
// 5. MONITORAMENTO DE REDE, SERVICE WORKER E NOTIFICAÇÕES
// ============================================================================
const elementoStatus = document.getElementById('status-conexao');

function atualizarIndicadorRede() {
    if (!elementoStatus) return;
    if (navigator.onLine) {
        elementoStatus.innerHTML = '<span class="status-dot"></span> Online • Fábrica Conectada';
        elementoStatus.style.color = '#4D7C5B';
        elementoStatus.style.backgroundColor = '#E7F0EA';
        SyncService.aoReconectar();
    } else {
        elementoStatus.innerHTML = '<span class="status-dot"></span> Offline • Cache Local';
        elementoStatus.style.color = '#9E3F35';
        elementoStatus.style.backgroundColor = '#F7E5E3';
    }
}

function atualizarIndicadorFilaOffline() {
    const fila = SyncService.obterFila();
    const badge = document.getElementById('fila-offline-badge');
    const banner = document.getElementById('banner-sync');
    const qtdSpan = document.getElementById('qtd-fila-offline');
    const bannerQtd = document.getElementById('banner-sync-qtd');

    if (fila.length > 0) {
        badge.classList.remove('hidden');
        banner.classList.remove('hidden');
        qtdSpan.textContent = fila.length;
        bannerQtd.textContent = fila.length;
    } else {
        badge.classList.add('hidden');
        banner.classList.add('hidden');
    }
}

window.addEventListener('online', atualizarIndicadorRede);
window.addEventListener('offline', atualizarIndicadorRede);

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registro => console.log('[PWA] SW GelatoArt Repositor registrado:', registro.scope))
            .catch(erro => console.error('[PWA] Erro ao registrar SW:', erro));
    });
}

function atualizarStatusPermissaoNotificacao() {
    const el = document.getElementById('texto-permissao-notif');
    if (!el) return;
    if (!('Notification' in window)) {
        el.textContent = 'Não suportado neste navegador';
        return;
    }
    const mapa = {
        granted: 'Ativadas (Permissão concedida)',
        denied: 'Bloqueadas nas configurações do navegador',
        default: 'Aguardando ativação'
    };
    el.textContent = mapa[Notification.permission] || Notification.permission;
}

const btnNotificacao = document.getElementById('btn-notificacao');
if (btnNotificacao) {
    btnNotificacao.addEventListener('click', () => {
        if (!('Notification' in window)) {
            mostrarToast('Este navegador não suporta notificações.');
            return;
        }
        Notification.requestPermission().then(permissao => {
            atualizarStatusPermissaoNotificacao();
            if (permissao === 'granted') {
                new Notification('GelatoArt Repositor', {
                    body: 'Alertas de reposição ativados com sucesso. Você receberá avisos de estoque e novos lotes.'
                });
                adicionarAlerta('sucesso', 'Alertas Ativados', 'Notificações de reposição habilitadas com sucesso.');
                persistirERenderizar();
                mostrarToast('Alertas de reposição ativados com sucesso.');
            } else {
                mostrarToast('Permissão para notificações recusada.');
            }
        });
    });
}

function dispararNotificacaoNativa(titulo, corpo) {
    if ('Notification' in window && Notification.permission === 'granted') {
        try {
            new Notification(titulo, { body: corpo });
        } catch {
            // Ignora quando bloqueado pelo contexto
        }
    }
}

// ============================================================================
// 6. NAVEGAÇÃO E FEEDBACK VISUAL
// ============================================================================
function navegarPara(viewId) {
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));

    const secaoAlvo = document.getElementById(`view-${viewId}`);
    const btnAlvo = document.querySelector(`.nav-item[data-view="${viewId}"]`);

    if (secaoAlvo) secaoAlvo.classList.add('active');
    if (btnAlvo) btnAlvo.classList.add('active');

    fecharMenuMobile();
}

function abrirMenuMobile() {
    document.getElementById('sidebar').classList.add('open');
    document.getElementById('sidebar-overlay').classList.add('active');
}

function fecharMenuMobile() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebar-overlay').classList.remove('active');
}

function mostrarToast(mensagem) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = mensagem;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3600);
}

// Helper para renderizar a imagem do pote (tenta pasta /assets/products/ e usa Studio Render como fallback garantido)
function renderizarTagImagemPote(sabor) {
    const fallbackSrc = ProductImageStudio.gerarImagemPote(sabor);
    const localPath = sabor.imagemUrl || fallbackSrc;
    return `<img src="${localPath}" alt="Pote comercial GelatoArt ${sabor.nome}" loading="lazy" onerror="this.onerror=null; this.src='${fallbackSrc}';">`;
}

// ============================================================================
// 7. RENDERIZAÇÃO DAS TELAS
// ============================================================================
function renderizarDashboard() {
    const hora = new Date().getHours();
    const saudacao = hora < 12 ? 'Bom dia' : (hora < 18 ? 'Boa tarde' : 'Boa noite');
    document.getElementById('saudacao-usuario').textContent = `${saudacao}, Carlos Andrade`;

    const totalCaixas = appState.sabores.reduce((acc, s) => acc + s.estoque, 0);
    const saboresDisponiveis = appState.sabores.filter(s => s.estoque > 0).length;
    const estoqueBaixo = appState.sabores.filter(s => s.estoque <= 8).length;

    const aguardando = appState.pedidos.filter(p => p.status === 'Novo pedido' || p.status === 'Aguardando confirmação').length;
    const emPreparacao = appState.pedidos.filter(p => p.status === 'Em preparação').length;
    const entregasPendentes = appState.pedidos.filter(p => p.status !== 'Entregue' && p.status !== 'Cancelado').length;
    const entregasConcluidas = appState.pedidos.filter(p => p.status === 'Entregue').length;

    const kpis = [
        { label: 'Total em Estoque', valor: `${totalCaixas} cx`, sub: 'Caixas de 10 litros', icone: 'package', tipo: '' },
        { label: 'Sabores Disponíveis', valor: `${saboresDisponiveis}/${appState.sabores.length}`, sub: 'Com saldo ativo', icone: 'ice-cream', tipo: 'sucesso' },
        { label: 'Estoque Baixo / Crítico', valor: estoqueBaixo, sub: 'Abaixo de 9 caixas', icone: 'alert-triangle', tipo: estoqueBaixo > 0 ? 'alerta' : 'sucesso' },
        { label: 'Pedidos Aguardando', valor: aguardando, sub: 'Novos ou a confirmar', icone: 'clock', tipo: '' },
        { label: 'Em Preparação', valor: emPreparacao, sub: 'Separação câmara fria', icone: 'layers', tipo: '' },
        { label: 'Entregas Pendentes', valor: entregasPendentes, sub: 'Em rota ou retirada', icone: 'truck', tipo: '' },
        { label: 'Entregas Concluídas', valor: entregasConcluidas, sub: 'Finalizadas hoje', icone: 'check-circle-2', tipo: 'sucesso' }
    ];

    document.getElementById('dashboard-kpis').innerHTML = kpis.map(k => `
        <div class="kpi-card ${k.tipo}">
            <div class="kpi-top">
                <span class="kpi-label">${k.label}</span>
                <div class="kpi-icon-wrap"><i data-lucide="${k.icone}"></i></div>
            </div>
            <div class="kpi-value">${k.valor}</div>
            <div class="kpi-sub">${k.sub}</div>
        </div>
    `).join('');

    // Gráfico 1: Movimentação
    const movDias = [
        { dia: 'Seg', val: 24 },
        { dia: 'Ter', val: 31 },
        { dia: 'Qua', val: 19 },
        { dia: 'Qui', val: 38 },
        { dia: 'Sex', val: 45 },
        { dia: 'Sáb', val: 52 },
        { dia: 'Hoje', val: totalCaixas }
    ];
    const maxMov = Math.max(...movDias.map(d => d.val), 1);
    document.getElementById('chart-movimentacao').innerHTML = movDias.map(d => `
        <div class="bar-col">
            <span class="bar-val">${d.val}</span>
            <div class="bar-fill" style="height: ${Math.max((d.val / maxMov) * 110, 12)}px;"></div>
            <span class="bar-lbl">${d.dia}</span>
        </div>
    `).join('');

    // Gráfico 2: Sabores mais vendidos
    const topSabores = [...appState.sabores]
        .sort((a, b) => b.vendidosSemana - a.vendidosSemana)
        .slice(0, 5);
    const maxVenda = Math.max(...topSabores.map(s => s.vendidosSemana), 1);
    document.getElementById('chart-sabores').innerHTML = topSabores.map(s => `
        <div class="h-bar-row">
            <div class="h-bar-info">
                <span>${s.nome}</span>
                <span>${s.vendidosSemana} cx</span>
            </div>
            <div class="h-bar-track">
                <div class="h-bar-fill" style="width: ${(s.vendidosSemana / maxVenda) * 100}%;"></div>
            </div>
        </div>
    `).join('');

    // Gráfico 3: Pedidos por período
    const pedDias = [
        { dia: 'Seg', val: 6 },
        { dia: 'Ter', val: 8 },
        { dia: 'Qua', val: 5 },
        { dia: 'Qui', val: 9 },
        { dia: 'Sex', val: 12 },
        { dia: 'Sáb', val: 14 },
        { dia: 'Hoje', val: appState.pedidos.length }
    ];
    const maxPed = Math.max(...pedDias.map(d => d.val), 1);
    document.getElementById('chart-pedidos').innerHTML = pedDias.map(d => `
        <div class="bar-col">
            <span class="bar-val">${d.val}</span>
            <div class="bar-fill" style="height: ${Math.max((d.val / maxPed) * 110, 12)}px;"></div>
            <span class="bar-lbl">${d.dia}</span>
        </div>
    `).join('');

    // Atividades recentes
    const recentes = appState.historico.slice(0, 4);
    document.getElementById('dashboard-atividades').innerHTML = recentes.map(item => `
        <div class="activity-item">
            <div>
                <strong>${item.produto}</strong>
                <div style="font-size: 0.83rem; color: var(--marrom-suave);">${item.detalhe}</div>
            </div>
            <div style="text-align: right;">
                <strong>${item.quantidade}</strong>
                <div style="font-size: 0.78rem; color: var(--marrom-suave);">${item.data} • ${item.hora}</div>
            </div>
        </div>
    `).join('');

    // Alertas resumidos no Dashboard
    const alertasCriticos = appState.alertas.slice(0, 4);
    document.getElementById('dashboard-alertas-resumo').innerHTML = alertasCriticos.map(a => `
        <div class="activity-item">
            <div>
                <strong>${a.titulo}</strong>
                <div style="font-size: 0.83rem; color: var(--marrom-suave);">${a.mensagem}</div>
            </div>
            <span class="status-pill ${a.nivel === 'critico' ? 'status-vermelho' : (a.nivel === 'sucesso' ? 'status-verde' : 'status-amarelo')}">
                ${a.nivel === 'critico' ? 'Crítico' : (a.nivel === 'sucesso' ? 'Concluído' : 'Atenção')}
            </span>
        </div>
    `).join('');
}

function renderizarEstoque() {
    const busca = document.getElementById('filtro-estoque-busca').value.toLowerCase().trim();
    const cat = document.getElementById('filtro-estoque-categoria').value;
    const statusFiltro = document.getElementById('filtro-estoque-status').value;

    const filtrados = appState.sabores.filter(s => {
        const st = classificarEstoque(s.estoque);
        const matchBusca = s.nome.toLowerCase().includes(busca);
        const matchCat = cat === 'todas' || s.categoria === cat;
        const matchStatus = statusFiltro === 'todos' || st.codigo === statusFiltro;
        return matchBusca && matchCat && matchStatus;
    });

    const container = document.getElementById('lista-estoque');
    if (filtrados.length === 0) {
        container.innerHTML = `<div class="card-sorvete">Nenhum sabor encontrado para os filtros aplicados.</div>`;
        return;
    }

    container.innerHTML = filtrados.map(s => {
        const st = classificarEstoque(s.estoque);
        return `
            <article class="produto-card">
                <div class="produto-media">
                    <span class="produto-cat-tag">${s.categoria}</span>
                    ${renderizarTagImagemPote(s)}
                </div>
                <div class="produto-body">
                    <h3>${s.nome}</h3>
                    <div class="produto-meta-row">
                        <span class="status-pill ${st.classe}">${st.texto}</span>
                        <span>Caixas 10L</span>
                    </div>
                    <div class="estoque-controles">
                        <button type="button" class="btn-qtd min-44" data-ajuste-estoque="${s.id}" data-delta="-1" aria-label="Retirar caixa de ${s.nome}">
                            <i data-lucide="minus"></i>
                        </button>
                        <span class="estoque-qtd-display">${s.estoque} cx</span>
                        <button type="button" class="btn-qtd min-44" data-ajuste-estoque="${s.id}" data-delta="1" aria-label="Adicionar caixa de ${s.nome}">
                            <i data-lucide="plus"></i>
                        </button>
                    </div>
                </div>
            </article>
        `;
    }).join('');
}

function ajustarEstoque(saborId, delta) {
    const sabor = appState.sabores.find(s => s.id === saborId);
    if (!sabor) return;

    if (delta < 0 && sabor.estoque <= 0) {
        mostrarToast(`O sabor ${sabor.nome} já está com 0 caixas em estoque.`);
        return;
    }

    sabor.estoque += delta;
    if (delta < 0) sabor.vendidosSemana += Math.abs(delta);

    const tipoMov = delta > 0 ? 'Entrada' : 'Saída';
    const sinal = delta > 0 ? `+${delta}` : `${delta}`;
    registrarHistorico(
        tipoMov,
        sabor.nome,
        `${sinal} cx (10L)`,
        `Ajuste manual no estoque da loja (Saldo atual: ${sabor.estoque} cx)`
    );

    if (sabor.estoque === 0) {
        dispararNotificacaoNativa('Estoque Crítico — GelatoArt', `${sabor.nome} ficou indisponível (0 caixas).`);
    }

    SyncService.registrarOperacao('estoque/ajuste', { saborId, delta, novoSaldo: sabor.estoque });
    persistirERenderizar();
    mostrarToast(`${sabor.nome}: saldo atualizado para ${sabor.estoque} caixa(s).`);
}

function renderizarCatalogo() {
    const container = document.getElementById('lista-catalogo');
    container.innerHTML = appState.sabores.map(s => {
        const st = classificarEstoque(s.estoque);
        return `
            <article class="produto-card">
                <div class="produto-media">
                    <span class="produto-cat-tag">${s.categoria}</span>
                    ${renderizarTagImagemPote(s)}
                </div>
                <div class="produto-body">
                    <h3>${s.nome}</h3>
                    <p class="produto-desc">${s.descricao}</p>
                    <div class="produto-meta-row">
                        <span class="status-pill ${st.classe}">${st.texto}</span>
                        <strong>${s.estoque} cx disponíveis</strong>
                    </div>
                    <div style="display:flex; gap:8px; margin-top:4px;">
                        <button type="button" class="btn-secundario min-44" style="flex:1;" data-detalhe-produto="${s.id}">
                            <i data-lucide="eye"></i>
                            <span>Detalhes</span>
                        </button>
                        <button type="button" class="btn-sorvete min-44" style="flex:1;" data-repor-sabor="${s.id}">
                            <i data-lucide="package-plus"></i>
                            <span>Repor</span>
                        </button>
                    </div>
                </div>
            </article>
        `;
    }).join('');
}

function abrirDetalhesProduto(saborId) {
    const s = appState.sabores.find(item => item.id === saborId);
    if (!s) return;
    const st = classificarEstoque(s.estoque);

    document.getElementById('detalhe-produto-titulo').textContent = s.nome;
    document.getElementById('detalhe-produto-conteudo').innerHTML = `
        <div class="produto-media" style="border-radius:10px; margin-bottom:16px; border:1px solid var(--borda-suave);">
            <span class="produto-cat-tag">${s.categoria}</span>
            ${renderizarTagImagemPote(s)}
        </div>
        <p style="margin:0 0 12px; color:var(--marrom-suave);">${s.descricao}</p>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; background:var(--creme-fundo); padding:12px; border-radius:10px; margin-bottom:16px;">
            <div>
                <small style="color:var(--marrom-suave); display:block;">Embalagem Padrão</small>
                <strong>Caixa Comercial 10L</strong>
            </div>
            <div>
                <small style="color:var(--marrom-suave); display:block;">Valor Unitário</small>
                <strong>R$ ${PRECO_CAIXA_10L.toFixed(2).replace('.', ',')}</strong>
            </div>
            <div>
                <small style="color:var(--marrom-suave); display:block;">Saldo em Loja</small>
                <strong>${s.estoque} caixa(s)</strong>
            </div>
            <div>
                <small style="color:var(--marrom-suave); display:block;">Situação</small>
                <span class="status-pill ${st.classe}">${st.texto}</span>
            </div>
        </div>
        <div class="modal-actions">
            <button type="button" class="btn-secundario min-44" data-close-modal="modal-detalhe-produto">Fechar</button>
            <button type="button" class="btn-sorvete min-44" data-repor-sabor-modal="${s.id}">
                <i data-lucide="package-plus"></i>
                <span>Solicitar Reposição</span>
            </button>
        </div>
    `;
    document.getElementById('modal-detalhe-produto').classList.remove('hidden');
    atualizarIcones();
}

function renderizarPedidos() {
    const busca = document.getElementById('filtro-pedido-cliente').value.toLowerCase().trim();
    const dataFiltro = document.getElementById('filtro-pedido-data').value;
    const statusFiltro = document.getElementById('filtro-pedido-status').value;

    const statusOpcoes = [
        'Novo pedido',
        'Aguardando confirmação',
        'Em preparação',
        'Saiu para entrega',
        'Entregue',
        'Cancelado'
    ];

    const filtrados = appState.pedidos.filter(p => {
        const matchTexto = p.cliente.toLowerCase().includes(busca) || p.id.toLowerCase().includes(busca);
        const matchData = !dataFiltro || p.data === dataFiltro;
        const matchStatus = statusFiltro === 'todos' || p.status === statusFiltro;
        return matchTexto && matchData && matchStatus;
    });

    const container = document.getElementById('lista-pedidos');
    if (filtrados.length === 0) {
        container.innerHTML = `<div class="card-sorvete">Nenhum pedido encontrado com os filtros selecionados.</div>`;
        return;
    }

    container.innerHTML = filtrados.map(p => {
        let classeBadge = 'status-azul';
        if (p.status === 'Entregue') classeBadge = 'status-verde';
        else if (p.status === 'Cancelado') classeBadge = 'status-vermelho';
        else if (p.status === 'Novo pedido' || p.status === 'Aguardando confirmação') classeBadge = 'status-amarelo';

        return `
            <article class="pedido-card">
                <div>
                    <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
                        <strong>${p.id}</strong>
                        <span>•</span>
                        <strong>${p.cliente}</strong>
                        <span class="status-pill ${classeBadge}">${p.status}</span>
                    </div>
                    <div style="margin-top:6px; font-size:0.9rem;">
                        Produto: <strong>${p.saborNome}</strong> (${p.quantidade} cx de 10L) •
                        Total: <strong>R$ ${p.valorTotal.toFixed(2).replace('.', ',')}</strong>
                    </div>
                    <div style="font-size:0.83rem; color: var(--marrom-suave); margin-top:4px;">
                        Data: ${p.data.split('-').reverse().join('/')} • Endereço: ${p.endereco}
                    </div>
                </div>

                <div class="pedido-actions">
                    <select class="input-sorvete min-44" style="width:auto;" data-status-pedido="${p.id}" aria-label="Alterar status do pedido ${p.id}">
                        ${statusOpcoes.map(st => `<option value="${st}" ${p.status === st ? 'selected' : ''}>${st}</option>`).join('')}
                    </select>
                    <button type="button" class="btn-secundario min-44" data-detalhe-pedido="${p.id}">
                        <i data-lucide="file-text"></i>
                        <span>Detalhes</span>
                    </button>
                </div>
            </article>
        `;
    }).join('');
}

function alterarStatusPedido(pedidoId, novoStatus) {
    const pedido = appState.pedidos.find(p => p.id === pedidoId);
    if (!pedido || pedido.status === novoStatus) return;

    const anterior = pedido.status;
    pedido.status = novoStatus;

    if (novoStatus === 'Saiu para entrega') pedido.entregaStatus = 'Em rota';
    if (novoStatus === 'Entregue') {
        pedido.entregaStatus = 'Entregue';
        pedido.entregueEm = `${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    }

    registrarHistorico(
        'Status',
        `${pedido.id} (${pedido.cliente})`,
        `${pedido.quantidade} cx`,
        `Status alterado de "${anterior}" para "${novoStatus}"`
    );

    SyncService.registrarOperacao('pedidos/status', { pedidoId, novoStatus });
    persistirERenderizar();
    mostrarToast(`Pedido ${pedido.id} atualizado para "${novoStatus}".`);
}

function abrirDetalhesPedido(pedidoId) {
    const p = appState.pedidos.find(item => item.id === pedidoId);
    if (!p) return;

    document.getElementById('detalhe-pedido-titulo').textContent = `Pedido ${p.id}`;
    document.getElementById('detalhe-pedido-conteudo').innerHTML = `
        <p><strong>Cliente:</strong> ${p.cliente}</p>
        <p><strong>Endereço:</strong> ${p.endereco}</p>
        <p><strong>Produto:</strong> ${p.saborNome}</p>
        <p><strong>Quantidade:</strong> ${p.quantidade} caixas (10 litros)</p>
        <p><strong>Valor Total:</strong> R$ ${p.valorTotal.toFixed(2).replace('.', ',')}</p>
        <p><strong>Data do Pedido:</strong> ${p.data.split('-').reverse().join('/')}</p>
        <p><strong>Status Comercial:</strong> ${p.status}</p>
        <p><strong>Status de Entrega:</strong> ${p.entregaStatus} ${p.entregueEm ? `(${p.entregueEm})` : ''}</p>
    `;
    document.getElementById('modal-detalhe-pedido').classList.remove('hidden');
}

function renderizarReposicao() {
    const containerInputs = document.getElementById('reposicao-sabores-inputs');
    const valoresAtuais = {};
    containerInputs.querySelectorAll('input[data-rep-sabor]').forEach(inp => {
        valoresAtuais[inp.dataset.repSabor] = parseInt(inp.value, 10) || 0;
    });

    containerInputs.innerHTML = appState.sabores.map(s => `
        <div class="item-sabor">
            <label for="rep-${s.id}">${s.nome}</label>
            <div style="font-size: 0.78rem; color: var(--marrom-suave); margin: 2px 0 8px;">
                Saldo atual: ${s.estoque} cx
            </div>
            <input type="number" id="rep-${s.id}" data-rep-sabor="${s.id}" class="input-sorvete min-44" min="0" max="100" value="${valoresAtuais[s.id] || 0}">
        </div>
    `).join('');

    atualizarResumoReposicao();

    const statusRepOpcoes = [
        'Solicitação enviada',
        'Aguardando separação',
        'Em preparação',
        'Saiu para entrega',
        'Reposição concluída'
    ];

    const listaRep = document.getElementById('lista-reposicoes');
    listaRep.innerHTML = appState.reposicoes.map(r => {
        const concluida = r.status === 'Reposição concluída';
        const badgeClass = concluida ? 'status-verde' : 'status-amarelo';
        const resumoItens = r.itens.map(i => `${i.saborNome} (${i.quantidade} cx)`).join(', ');

        return `
            <div class="reposicao-item">
                <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap;">
                    <strong>${r.id} — ${r.loja}</strong>
                    <span class="status-pill ${badgeClass}">${r.status}</span>
                </div>
                <div style="font-size:0.86rem; color:var(--chocolate-escuro);">${resumoItens}</div>
                <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap;">
                    <small style="color:var(--marrom-suave);">Data: ${r.data} • Total: <strong>${r.totalCaixas} cx</strong></small>
                    <select class="input-sorvete min-44" style="width:auto;" data-status-reposicao="${r.id}" ${concluida ? 'disabled' : ''}>
                        ${statusRepOpcoes.map(st => `<option value="${st}" ${r.status === st ? 'selected' : ''}>${st}</option>`).join('')}
                    </select>
                </div>
            </div>
        `;
    }).join('');
}

function atualizarResumoReposicao() {
    const inputs = document.querySelectorAll('input[data-rep-sabor]');
    const selecionados = [];
    let total = 0;

    inputs.forEach(inp => {
        const qtd = parseInt(inp.value, 10) || 0;
        if (qtd > 0) {
            const sabor = appState.sabores.find(s => s.id === inp.dataset.repSabor);
            if (sabor) {
                selecionados.push(`${sabor.nome}: <strong>${qtd} cx</strong>`);
                total += qtd;
            }
        }
    });

    const box = document.getElementById('resumo-reposicao');
    if (selecionados.length === 0) {
        box.innerHTML = `<h4>Resumo da Solicitação</h4><p style="margin:0; font-size:0.86rem; color:var(--marrom-suave);">Selecione a quantidade de caixas nos sabores acima.</p>`;
    } else {
        box.innerHTML = `
            <h4>Resumo da Solicitação</h4>
            <p style="margin:0 0 6px; font-size:0.86rem;">${selecionados.join(' • ')}</p>
            <div style="font-size:0.88rem;">Volume total: <strong>${total} caixa(s) de 10 litros</strong></div>
        `;
    }
}

function alterarStatusReposicao(repId, novoStatus) {
    const rep = appState.reposicoes.find(r => r.id === repId);
    if (!rep || rep.status === novoStatus) return;

    rep.status = novoStatus;

    if (novoStatus === 'Reposição concluída') {
        rep.itens.forEach(item => {
            const sabor = appState.sabores.find(s => s.id === item.saborId);
            if (sabor) sabor.estoque += item.quantidade;
        });

        registrarHistorico(
            'Entrada',
            `${rep.id} (${rep.loja})`,
            `+${rep.totalCaixas} cx (10L)`,
            'Reposição concluída — estoque da loja abastecido automaticamente'
        );
        adicionarAlerta('sucesso', `Reposição ${rep.id} Concluída`, `Estoque atualizado com +${rep.totalCaixas} caixas para ${rep.loja}.`);
        dispararNotificacaoNativa('Reposição Concluída — GelatoArt', `Lote ${rep.id} entregue e somado ao estoque.`);
        mostrarToast(`Reposição ${rep.id} concluída. Estoque atualizado.`);
    } else {
        registrarHistorico('Status', rep.id, `${rep.totalCaixas} cx`, `Status da reposição alterado para "${novoStatus}"`);
        if (novoStatus === 'Saiu para entrega') {
            adicionarAlerta('sucesso', `Reposição ${rep.id} Aprovada`, `Lote saiu da fábrica para ${rep.loja}.`);
        }
        mostrarToast(`Reposição ${rep.id}: ${novoStatus}.`);
    }

    SyncService.registrarOperacao('reposicoes/status', { repId, novoStatus });
    persistirERenderizar();
}

function renderizarEntregas() {
    const container = document.getElementById('lista-entregas');
    const entregas = appState.pedidos.filter(p => p.status !== 'Cancelado');

    if (entregas.length === 0) {
        container.innerHTML = `<div class="card-sorvete">Nenhuma entrega cadastrada.</div>`;
        return;
    }

    container.innerHTML = entregas.map(p => {
        const concluida = p.entregaStatus === 'Entregue';
        const classe = concluida ? 'status-verde' : (p.entregaStatus === 'Em rota' ? 'status-azul' : 'status-amarelo');

        return `
            <article class="card-sorvete" style="display:flex; flex-direction:column; gap:10px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <strong>Pedido ${p.id}</strong>
                    <span class="status-pill ${classe}">${p.entregaStatus}</span>
                </div>
                <div><strong>Destino:</strong> ${p.cliente}</div>
                <div style="font-size:0.86rem; color:var(--marrom-suave); display:flex; align-items:center; gap:6px;">
                    <i data-lucide="map-pin" class="icon-sm"></i>
                    <span>${p.endereco}</span>
                </div>
                <div style="font-size:0.88rem; display:flex; align-items:center; gap:6px;">
                    <i data-lucide="package" class="icon-sm"></i>
                    <span><strong>${p.saborNome}</strong> — ${p.quantidade} cx (10L)</span>
                </div>
                <div style="font-size:0.84rem; color:var(--marrom-suave);">
                    Horário previsto: <strong style="color:var(--chocolate-escuro);">${p.horarioPrevisto || '16:00'}</strong>
                    ${p.entregueEm ? `<br>Concluída em: <strong style="color:var(--pistache);">${p.entregueEm}</strong>` : ''}
                </div>

                <div style="display:flex; gap:8px; margin-top:auto; padding-top:12px; border-top:1px solid var(--borda-suave); flex-wrap:wrap;">
                    <select class="input-sorvete min-44" style="flex:1;" data-status-entrega="${p.id}" ${concluida ? 'disabled' : ''}>
                        <option value="Aguardando retirada" ${p.entregaStatus === 'Aguardando retirada' ? 'selected' : ''}>Aguardando retirada</option>
                        <option value="Em rota" ${p.entregaStatus === 'Em rota' ? 'selected' : ''}>Em rota</option>
                        <option value="Entregue" ${p.entregaStatus === 'Entregue' ? 'selected' : ''}>Entregue</option>
                    </select>
                    ${!concluida ? `
                        <button type="button" class="btn-sorvete min-44" data-confirmar-entrega="${p.id}">
                            <i data-lucide="check"></i>
                            <span>Confirmar</span>
                        </button>
                    ` : ''}
                </div>
            </article>
        `;
    }).join('');
}

function atualizarEntrega(pedidoId, novoStatusEntrega) {
    const pedido = appState.pedidos.find(p => p.id === pedidoId);
    if (!pedido || pedido.entregaStatus === novoStatusEntrega) return;

    pedido.entregaStatus = novoStatusEntrega;

    if (novoStatusEntrega === 'Em rota') {
        pedido.status = 'Saiu para entrega';
        registrarHistorico('Status', `${pedido.id} — ${pedido.cliente}`, `${pedido.quantidade} cx`, 'Entregador iniciou rota de entrega');
        mostrarToast(`Entrega ${pedido.id} marcada como "Em rota".`);
    } else if (novoStatusEntrega === 'Entregue') {
        const agora = new Date();
        const carimbo = `${agora.toLocaleDateString('pt-BR')} às ${agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
        pedido.status = 'Entregue';
        pedido.entregueEm = carimbo;

        registrarHistorico('Entrega', `${pedido.id} — ${pedido.cliente}`, `${pedido.quantidade} cx (10L)`, `Entrega concluída em ${carimbo}`);
        adicionarAlerta('sucesso', `Entrega Concluída (${pedido.id})`, `Pedido entregue para ${pedido.cliente} em ${carimbo}.`);
        mostrarToast(`Entrega ${pedido.id} confirmada com sucesso.`);
    }

    SyncService.registrarOperacao('entregas/atualizar', { pedidoId, novoStatusEntrega, entregueEm: pedido.entregueEm });
    persistirERenderizar();
}

function renderizarHistorico() {
    const periodo = document.getElementById('filtro-historico-periodo').value;
    const tipo = document.getElementById('filtro-historico-tipo').value;
    const hojeISO = new Date().toISOString().split('T')[0];

    const seteDiasAtras = new Date();
    seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);
    const seteDiasISO = seteDiasAtras.toISOString().split('T')[0];

    const filtrados = appState.historico.filter(h => {
        const matchTipo = tipo === 'todos' || h.tipo === tipo;
        let matchPeriodo = true;
        if (periodo === 'hoje') matchPeriodo = h.dataISO === hojeISO;
        else if (periodo === '7dias') matchPeriodo = h.dataISO >= seteDiasISO;
        return matchTipo && matchPeriodo;
    });

    const tbody = document.getElementById('tabela-historico-body');
    if (filtrados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5">Nenhuma movimentação registrada para este filtro.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtrados.map(h => `
        <tr>
            <td><strong>${h.data}</strong> ${h.hora}</td>
            <td><span class="status-pill status-azul">${h.tipo}</span></td>
            <td><strong>${h.produto}</strong></td>
            <td>${h.quantidade}</td>
            <td>${h.detalhe}</td>
        </tr>
    `).join('');
}

function renderizarAlertas() {
    const qtd = appState.alertas.length;
    document.getElementById('badge-menu-alertas').textContent = qtd;
    document.getElementById('badge-top-alertas').textContent = qtd;

    const container = document.getElementById('lista-alertas');
    if (qtd === 0) {
        container.innerHTML = `<div class="card-sorvete">Nenhum alerta pendente no momento.</div>`;
        return;
    }

    container.innerHTML = appState.alertas.map(a => `
        <div class="alerta-card ${a.nivel}">
            <div>
                <strong>${a.titulo}</strong>
                <div style="font-size:0.88rem; color:var(--marrom-suave); margin-top:2px;">${a.mensagem}</div>
            </div>
            <small style="color:var(--marrom-suave); font-weight:600;">${a.hora}</small>
        </div>
    `).join('');
}

function preencherSelectProdutosModal() {
    const select = document.getElementById('pedido-produto');
    select.innerHTML = appState.sabores.map(s => `
        <option value="${s.id}">${s.nome} (Saldo loja: ${s.estoque} cx)</option>
    `).join('');
}

function renderizarTudo() {
    document.getElementById('select-perfil').value = appState.perfilUsuario || 'Vendedor';
    renderizarDashboard();
    renderizarEstoque();
    renderizarCatalogo();
    renderizarPedidos();
    renderizarReposicao();
    renderizarEntregas();
    renderizarHistorico();
    renderizarAlertas();
    atualizarStatusPermissaoNotificacao();
    atualizarIndicadorFilaOffline();
    atualizarIcones();
}

// ============================================================================
// 8. EVENT LISTENERS E INICIALIZAÇÃO
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    const opcoesData = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
    document.getElementById('data-atual').textContent = new Date().toLocaleDateString('pt-BR', opcoesData);

    document.querySelectorAll('.nav-item[data-view]').forEach(btn => {
        btn.addEventListener('click', () => navegarPara(btn.dataset.view));
    });

    document.querySelectorAll('[data-goto]').forEach(btn => {
        btn.addEventListener('click', () => navegarPara(btn.dataset.goto));
    });

    document.getElementById('btn-atalho-alertas').addEventListener('click', () => navegarPara('alertas'));
    document.getElementById('btn-abrir-menu').addEventListener('click', abrirMenuMobile);
    document.getElementById('btn-fechar-menu').addEventListener('click', fecharMenuMobile);
    document.getElementById('sidebar-overlay').addEventListener('click', fecharMenuMobile);

    document.getElementById('select-perfil').addEventListener('change', (e) => {
        appState.perfilUsuario = e.target.value;
        StorageRepository.salvarEstado(appState);
        mostrarToast(`Perfil alterado para ${appState.perfilUsuario}.`);
        if (appState.perfilUsuario === 'Entregador') navegarPara('entregas');
    });

    document.getElementById('btn-reset-demo').addEventListener('click', () => {
        appState = StorageRepository.resetar();
        persistirERenderizar();
        mostrarToast('Dados de demonstração restaurados.');
    });

    document.getElementById('btn-exportar-fila').addEventListener('click', () => {
        const fila = SyncService.obterFila();
        alert(`Operações pendentes na fila local (${fila.length}):\n\n${JSON.stringify(fila, null, 2)}`);
    });

    // Filtros Estoque
    ['filtro-estoque-busca', 'filtro-estoque-categoria', 'filtro-estoque-status'].forEach(id => {
        document.getElementById(id).addEventListener('input', renderizarEstoque);
    });
    document.getElementById('btn-limpar-filtros-estoque').addEventListener('click', () => {
        document.getElementById('filtro-estoque-busca').value = '';
        document.getElementById('filtro-estoque-categoria').value = 'todas';
        document.getElementById('filtro-estoque-status').value = 'todos';
        renderizarEstoque();
        atualizarIcones();
    });

    // Ajustar Estoque (+ / -)
    document.getElementById('lista-estoque').addEventListener('click', (e) => {
        const btn = e.target.closest('[data-ajuste-estoque]');
        if (!btn) return;
        ajustarEstoque(btn.dataset.ajusteEstoque, parseInt(btn.dataset.delta, 10));
    });

    // Catálogo -> Detalhes e Reposição
    document.getElementById('lista-catalogo').addEventListener('click', (e) => {
        const btnDetalhe = e.target.closest('[data-detalhe-produto]');
        if (btnDetalhe) {
            abrirDetalhesProduto(btnDetalhe.dataset.detalheProduto);
            return;
        }
        const btnRepor = e.target.closest('[data-repor-sabor]');
        if (btnRepor) {
            const saborId = btnRepor.dataset.reporSabor;
            navegarPara('reposicao');
            const input = document.getElementById(`rep-${saborId}`);
            if (input) {
                input.value = (parseInt(input.value, 10) || 0) + 5;
                atualizarResumoReposicao();
                input.focus();
            }
        }
    });

    // Ações dentro do modal de detalhes do produto
    document.getElementById('detalhe-produto-conteudo').addEventListener('click', (e) => {
        const closeBtn = e.target.closest('[data-close-modal]');
        if (closeBtn) {
            document.getElementById(closeBtn.dataset.closeModal).classList.add('hidden');
            return;
        }
        const reporModalBtn = e.target.closest('[data-repor-sabor-modal]');
        if (reporModalBtn) {
            const saborId = reporModalBtn.dataset.reporSaborModal;
            document.getElementById('modal-detalhe-produto').classList.add('hidden');
            navegarPara('reposicao');
            const input = document.getElementById(`rep-${saborId}`);
            if (input) {
                input.value = (parseInt(input.value, 10) || 0) + 5;
                atualizarResumoReposicao();
            }
        }
    });

    // Filtros Pedidos
    ['filtro-pedido-cliente', 'filtro-pedido-data', 'filtro-pedido-status'].forEach(id => {
        document.getElementById(id).addEventListener('input', renderizarPedidos);
    });
    document.getElementById('btn-limpar-filtros-pedido').addEventListener('click', () => {
        document.getElementById('filtro-pedido-cliente').value = '';
        document.getElementById('filtro-pedido-data').value = '';
        document.getElementById('filtro-pedido-status').value = 'todos';
        renderizarPedidos();
        atualizarIcones();
    });

    document.getElementById('lista-pedidos').addEventListener('change', (e) => {
        const sel = e.target.closest('[data-status-pedido]');
        if (sel) alterarStatusPedido(sel.dataset.statusPedido, sel.value);
    });
    document.getElementById('lista-pedidos').addEventListener('click', (e) => {
        const btn = e.target.closest('[data-detalhe-pedido]');
        if (btn) abrirDetalhesPedido(btn.dataset.detalhePedido);
    });

    // Modal Novo Pedido
    document.getElementById('btn-abrir-modal-pedido').addEventListener('click', () => {
        preencherSelectProdutosModal();
        document.getElementById('modal-novo-pedido').classList.remove('hidden');
    });

    document.querySelectorAll('[data-close-modal]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById(btn.dataset.closeModal).classList.add('hidden');
        });
    });

    document.getElementById('form-novo-pedido').addEventListener('submit', (e) => {
        e.preventDefault();
        const cliente = document.getElementById('pedido-cliente-nome').value.trim();
        const endereco = document.getElementById('pedido-cliente-endereco').value.trim();
        const saborId = document.getElementById('pedido-produto').value;
        const quantidade = parseInt(document.getElementById('pedido-quantidade').value, 10);

        const sabor = appState.sabores.find(s => s.id === saborId);
        if (!sabor || quantidade <= 0) return;

        if (sabor.estoque >= quantidade) {
            sabor.estoque -= quantidade;
            sabor.vendidosSemana += quantidade;
            registrarHistorico('Saída', sabor.nome, `-${quantidade} cx (10L)`, `Baixa automática para pedido de ${cliente}`);
        }

        const novoPedido = {
            id: `PED-${Math.floor(1044 + Math.random() * 8900)}`,
            cliente,
            endereco,
            saborId: sabor.id,
            saborNome: sabor.nome,
            quantidade,
            data: new Date().toISOString().split('T')[0],
            valorTotal: quantidade * PRECO_CAIXA_10L,
            status: 'Novo pedido',
            horarioPrevisto: '17:30',
            entregaStatus: 'Aguardando retirada',
            entregueEm: null
        };

        appState.pedidos.unshift(novoPedido);
        registrarHistorico('Pedido', `${novoPedido.id} — ${sabor.nome}`, `${quantidade} cx (10L)`, `Novo pedido registrado para ${cliente}`);
        adicionarAlerta('sucesso', `Novo Pedido (${novoPedido.id})`, `${cliente} solicitou ${quantidade} cx de ${sabor.nome}.`);
        dispararNotificacaoNativa('Novo Pedido — GelatoArt', `${novoPedido.id}: ${quantidade} cx de ${sabor.nome} para ${cliente}.`);

        SyncService.registrarOperacao('pedidos/criar', novoPedido);

        e.target.reset();
        document.getElementById('modal-novo-pedido').classList.add('hidden');
        persistirERenderizar();
        mostrarToast(`Pedido ${novoPedido.id} registrado com sucesso.`);
    });

    // Reposição
    document.getElementById('reposicao-sabores-inputs').addEventListener('input', atualizarResumoReposicao);

    document.getElementById('form-reposicao').addEventListener('submit', (e) => {
        e.preventDefault();
        const loja = document.getElementById('ponto-venda').value;
        const itens = [];
        let totalCaixas = 0;

        document.querySelectorAll('input[data-rep-sabor]').forEach(inp => {
            const qtd = parseInt(inp.value, 10) || 0;
            if (qtd > 0) {
                const sabor = appState.sabores.find(s => s.id === inp.dataset.repSabor);
                if (sabor) {
                    itens.push({ saborId: sabor.id, saborNome: sabor.nome, quantidade: qtd });
                    totalCaixas += qtd;
                }
            }
        });

        if (itens.length === 0) {
            mostrarToast('Informe a quantidade de pelo menos 1 sabor.');
            return;
        }

        const novaRep = {
            id: `REP-${Math.floor(209 + Math.random() * 700)}`,
            loja,
            itens,
            totalCaixas,
            data: new Date().toLocaleDateString('pt-BR'),
            status: 'Solicitação enviada'
        };

        appState.reposicoes.unshift(novaRep);
        registrarHistorico(
            'Reposição',
            `${novaRep.id} — ${loja}`,
            `${totalCaixas} cx (10L)`,
            `Solicitação enviada (${itens.map(i => `${i.saborNome}: ${i.quantidade}`).join(', ')})`
        );
        adicionarAlerta('sucesso', `Reposição Enviada (${novaRep.id})`, `Solicitação de ${totalCaixas} caixas enviada para ${loja}.`);
        dispararNotificacaoNativa('Pedido de Reposição — GelatoArt', `${novaRep.id} enviado (${totalCaixas} cx) para ${loja}.`);

        SyncService.registrarOperacao('reposicoes/criar', novaRep);

        document.querySelectorAll('input[data-rep-sabor]').forEach(inp => { inp.value = 0; });
        persistirERenderizar();
        mostrarToast(`Reposição ${novaRep.id} confirmada com sucesso.`);
    });

    document.getElementById('lista-reposicoes').addEventListener('change', (e) => {
        const sel = e.target.closest('[data-status-reposicao]');
        if (sel) alterarStatusReposicao(sel.dataset.statusReposicao, sel.value);
    });

    // Entregas
    document.getElementById('lista-entregas').addEventListener('change', (e) => {
        const sel = e.target.closest('[data-status-entrega]');
        if (sel) atualizarEntrega(sel.dataset.statusEntrega, sel.value);
    });
    document.getElementById('lista-entregas').addEventListener('click', (e) => {
        const btn = e.target.closest('[data-confirmar-entrega]');
        if (btn) atualizarEntrega(btn.dataset.confirmarEntrega, 'Entregue');
    });

    // Histórico
    ['filtro-historico-periodo', 'filtro-historico-tipo'].forEach(id => {
        document.getElementById(id).addEventListener('change', renderizarHistorico);
    });

    // Inicialização
    atualizarIndicadorRede();
    persistirERenderizar();
});