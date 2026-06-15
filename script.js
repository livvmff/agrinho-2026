// VARIÁVEIS DE ESTADO DO JOGO
let status = { planeta: 50, orcamento: 50, felicidade: 50, energia: 50 };
let currentCardIndex = 0;
let score = 0;
let miniGameTimer;

// BANCO DE DADOS: 8 CARTAS DE DECISÃO (Dilemas)
const cards = [
    {
        title: "⚡ Matriz Energética",
        desc: "A cidade precisa expandir a eletricidade rápida. O que fazer?",
        opt1: { txt: "Construir Usinas Solares (Caro)", planeta: 20, orcamento: -30, felicidade: 10, energia: 15, fato: "A energia solar não emite gases estufa e seu custo de manutenção caiu mais de 80% na última década!" },
        opt2: { txt: "Queimar Carvão (Barato)", planeta: -25, orcamento: -5, felicidade: -10, energia: 25, fato: "A queima de carvão é a maior responsável pelas emissões globais de CO2 e poluentes prejudiciais à saúde pulmonar." }
    },
    {
        title: "🗑️ Crise do Lixo",
        desc: "Os lixões estão cheios. Qual o novo plano de saneamento?",
        opt1: { txt: "Coleta Seletiva Universal", planeta: 20, orcamento: -15, felicidade: 15, energia: 0, fato: "Reciclar uma única tonelada de papel poupa em média 17 árvores e economiza cerca de 26 mil litros de água." },
        opt2: { txt: "Criar novo Lixão isolado", planeta: -20, orcamento: -2, felicidade: -15, energia: 0, fato: "Lixões a céu aberto contaminam o solo e lençóis freáticos com chorume, além de emitirem gás metano altamente inflamável." }
    },
    {
        title: "🚌 Mobilidade Urbana",
        desc: "O trânsito está travado e o ar poluído. Qual o foco do investimento?",
        opt1: { txt: "Ciclovias e Tarifa Zero de Ônibus", planeta: 15, orcamento: -20, felicidade: 25, energia: -5, fato: "Cidades que adotaram transporte público gratuito registraram reduções drásticas no tráfego e acidentes viários." },
        opt2: { txt: "Ampliar avenidas e viadutos", planeta: -15, orcamento: -15, felicidade: 5, energia: 0, fato: "Alargar pistas não resolve o trânsito a longo prazo; fenômeno conhecido como 'Demanda Induzida' atrai ainda mais carros." }
    },
    {
        title: "💧 Escassez de Água",
        desc: "O reservatório principal atingiu níveis preocupantes.",
        opt1: { txt: "Multar desperdício e tratar reuso", planeta: 15, orcamento: 5, felicidade: -10, energia: -5, fato: "A água de reuso pode suprir atividades industriais e de limpeza urbana, poupando água potável preciosa." },
        opt2: { txt: "Fazer rodízio estrito sem multas", planeta: 0, orcamento: -5, felicidade: -25, energia: 0, fato: "Falta de fiscalização incentiva o desperdício oculto e gera pânico na infraestrutura de distribuição." }
    },
    {
        title: "🌳 Desmatamento na Reserva",
        desc: "Madeireiros ilegais avançam na floresta protetora da cidade.",
        opt1: { txt: "Contratar Guarda Florestal Armada", planeta: 25, orcamento: -15, felicidade: 10, energia: 0, fato: "Florestas em pé regulam as chuvas regionais (rios voadores) que abastecem as represas e hidrelétricas da própria cidade." },
        opt2: { txt: "Ignorar e incentivar a agropecuária", planeta: -35, orcamento: 20, felicidade: 5, energia: 0, fato: "A perda da cobertura vegetal acelera a erosão do solo, desertificação e eleva a temperatura média local." }
    },
    {
        title: "🏭 Poluição Industrial",
        desc: "Fábricas locais pedem redução de impostos para se manterem.",
        opt1: { txt: "Dar incentivos apenas para Eco-Fábricas", planeta: 15, orcamento: -10, felicidade: 10, energia: 5, fato: "A 'indústria verde' gera empregos de maior qualidade e reduz custos futuros com saúde pública no município." },
        opt2: { txt: "Dar o benefício sem restrições ambientais", planeta: -20, orcamento: 15, felicidade: -5, energia: 10, fato: "A poluição atmosférica industrial é ligada diretamente ao aumento de internações hospitalares infantis por asma." }
    },
    {
        title: "🛍️ Sacolas Plásticas",
        desc: "Comércio pede posicionamento sobre plásticos de uso único.",
        opt1: { txt: "Banir e incentivar sacolas retornáveis", planeta: 15, orcamento: -2, felicidade: 5, energia: 0, fato: "Sacolas plásticas comuns levam até 500 anos para se decompor, fragmentando-se em microplásticos perigosos." },
        opt2: { txt: "Manter a distribuição livre", planeta: -15, orcamento: 2, felicidade: 5, energia: 0, fato: "Mais de 8 milhões de toneladas de plástico terminam nos oceanos anualmente, matando a fauna marinha." }
    },
    {
        title: "🏫 Educação Ambiental",
        desc: "Secretaria propõe reforma curricular focada em ecologia prática.",
        opt1: { txt: "Aprovar projeto com hortas escolares", planeta: 20, orcamento: -10, felicidade: 15, energia: 0, fato: "Crianças que aprendem a plantar desenvolvem maior responsabilidade civil e hábitos alimentares mais saudáveis." },
        opt2: { txt: "Cortar verba e focar em matérias tradicionais", planeta: -15, orcamento: 5, felicidade: -10, energia: 0, fato: "A falta de consciência ecológica em idades precoces gera gerações que consomem recursos de forma insustentável." }
    }
];

// ITENS DO MINI-JOGO DE RECICLAGEM
const reciclagemItens = [
    { nome: "🍾 Garrafa de Vidro", tipo: "vidro" },
    { nome: "🛍️ Sacola Plástica", tipo: "plastico" },
    { nome: "📦 Caixa de Papelão", tipo: "papel" },
    { nome: "🥫 Lata de Refrigerante", tipo: "metal" }
];
let currentReciclagemItem;

// FUNÇÕES DE NAVEGAÇÃO ENTRE TELAS
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function startGame() {
    status = { planeta: 50, orcamento: 50, felicidade: 50, energia: 50 };
    currentCardIndex = 0;
    score = 0;
    updateUI();
    showScreen('screen-game');
    loadCard();
}

function updateUI() {
    // Atualiza valores textuais
    document.getElementById('val-planeta').innerText = status.planeta;
    document.getElementById('val-orcamento').innerText = status.orcamento;
    document.getElementById('val-felicidade').innerText = status.felicidade;
    document.getElementById('val-energia').innerText = status.energia;

    // Alerta Crítico (Barras piscando em vermelho caso < 25)
    document.getElementById('status-planeta').classList.toggle('critico', status.planeta < 25);
    document.getElementById('status-orcamento').classList.toggle('critico', status.orcamento < 25);
    document.getElementById('status-felicidade').classList.toggle('critico', status.felicidade < 25);
    document.getElementById('status-energia').classList.toggle('critico', status.energia < 25);

    // Validação de Derrota Automática (Game Over se algum status zerar)
    if(status.planeta <= 0 || status.orcamento <= 0 || status.felicidade <= 0 || status.energia <= 0) {
        endGame(false, "Sua gestão colapsou! Um dos pilares da cidade chegou a zero.");
        return;
    }

    // Mudança de Visual da Cidade baseada na Saúde do Planeta
    let cenario = document.getElementById('cidade-cenario');
    let fumaca = document.getElementById('nuvens-fumaca');
    let verdes = document.getElementById('elementos-verdes');
    let sol = document.getElementById('sol');

    if(status.planeta >= 65) {
        cenario.className = "cidade-limpa";
        fumaca.classList.add('hidden');
        verdes.classList.remove('hidden');
        sol.classList.remove('hidden');
    } else {
        cenario.className = "cidade-poluida";
        fumaca.classList.remove('hidden');
        verdes.classList.add('hidden');
        sol.classList.add('hidden');
    }
}

// LÓGICA DO FLUXO PRINCIPAL DE CARTAS
function loadCard() {
    if(currentCardIndex >= cards.length) {
        // Intercala com mini-jogo na metade e no fim
        startMiniReciclagem();
        return;
    }
    let card = cards[currentCardIndex];
    document.getElementById('card-title').innerText = card.title;
    document.getElementById('card-desc').innerText = card.desc;
    document.getElementById('btn-opt1').innerText = card.opt1.txt;
    document.getElementById('btn-opt2').innerText = card.opt2.txt;
}

function makeChoice(option) {
    let card = cards[currentCardIndex];
    let choice = option === 1 ? card.opt1 : card.opt2;

    // Aplica modificadores de status
    status.planeta = Math.min(100, Math.max(0, status.planeta + choice.planeta));
    status.orcamento = Math.min(100, Math.max(0, status.orcamento + choice.orcamento));
    status.felicidade = Math.min(100, Math.max(0, status.felicidade + choice.felicidade));
    status.energia = Math.min(100, Math.max(0, status.energia + choice.energia));

    score += Math.max(5, choice.planeta * 2); // Pontua se fizer escolhas ecologicamente corretas

    updateUI();

    // Exibe Pop-up com Fato Educativo Real
    document.getElementById('fact-text').innerText = choice.fato;
    document.getElementById('pop-fact').classList.remove('hidden');
}

function closeFact() {
    document.getElementById('pop-fact').classList.add('hidden');
    currentCardIndex++;
    
    // Ativa Mini-jogos em momentos específicos da jornada
    if(currentCardIndex === 4) {
        startMiniReciclagem();
    } else if (currentCardIndex === 8) {
        startMiniDesperdicio();
    } else {
        loadCard();
    }
}

// ♻️ MINI-JOGO 1: HORA DA RECICLAGEM
function startMiniReciclagem() {
    showScreen('screen-mini-reciclagem');
    let tempo = 15;
    document.getElementById('reciclagem-tempo').innerText = tempo;
    proximoItemReciclagem();

    miniGameTimer = setInterval(() => {
        tempo--;
        document.getElementById('reciclagem-tempo').innerText = tempo;
        if(tempo <= 0) {
            clearInterval(miniGameTimer);
            // Retorna ao fluxo normal
            showScreen('screen-game');
            loadCard();
        }
    }, 1000);
}

function proximoItemReciclagem() {
    currentReciclagemItem = reciclagemItens[Math.floor(Math.random() * reciclagemItens.length)];
    document.getElementById('item-reciclavel').innerText = currentReciclagemItem.nome;
}

function checkReciclagem(tipoSelecionado) {
    if(tipoSelecionado === currentReciclagemItem.tipo) {
        score += 30;
        status.planeta = Math.min(100, status.planeta + 5);
    } else {
        status.planeta = Math.max(0, status.planeta - 5);
    }
    updateUI();
    proximoItemReciclagem();
}

// 🔍 MINI-JOGO 2: DETETIVE DO DESPERDÍCIO
function startMiniDesperdicio() {
    showScreen('screen-mini-desperdicio');
    // Restaura os elementos da casa na tela
    document.getElementById('item-torneira').classList.remove('hidden');
    document.getElementById('item-lampada').classList.remove('hidden');
    document.getElementById('item-tv').classList.remove('hidden');

    let tempo = 15;
    document.getElementById('desperdicio-tempo').innerText = tempo;

    miniGameTimer = setInterval(() => {
        tempo--;
        document.getElementById('desperdicio-tempo').innerText = tempo;
        if(tempo <= 0) {
            clearInterval(miniGameTimer);
            // Ao acabar o segundo mini-jogo (fim de tudo), decide a vitória
            if(status.planeta >= 60) {
                endGame(true, "Parabéns! Você salvou a cidade e garantiu um futuro sustentável!");
            } else {
                endGame(false, "O tempo acabou e sua cidade terminou cinza e poluída.");
            }
        }
    }, 1000);
}

function corrigirDesperdicio(idElemento) {
    document.getElementById(`item-${idElemento}`).classList.add('hidden');
    score += 40;
    status.energia = Math.min(100, status.energia + 10);
    status.planeta = Math.min(100, status.planeta + 5);
    updateUI();
}

// FINALIZADORES DE JOGO
function endGame(isVitoria, mensagem) {
    clearInterval(miniGameTimer);
    showScreen('screen-gameover');
    
    document.getElementById('end-title').innerText = isVitoria ? "🎉 Vitória Ecológica!" : "🪦 Fim de Jogo";
    document.getElementById('end-desc').innerHTML = `
        ${mensagem}<br><br>
        <b>Estatísticas Finais:</b><br>
        🌳 Planeta: ${status.planeta}%<br>
        💰 Economia: $${status.orcamento}k<br>
        🏆 Pontuação Final: ${score} pts
    `;
    document.getElementById('final-score').innerText = score;
}

function verRanking() {
    showScreen('screen-ranking');
}

function resetToMenu() {
    showScreen('screen-menu');
}