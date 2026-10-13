
   const pontos = [
    {
        id: "ibirapuera",
        nome: "Parque Ibirapuera",
        endereco: "Av. Pedro Álvares Cabral, Portão 3",
        bairro: "Vila Mariana",
        lat: -23.5874,
        lng: -46.6576,
        horario: "6h às 22h",
        bikes: { urbana: 8, eletrica: 3, cesta: 2, cadeirinha: 1, infantil: 2 }
    },
    {
        id: "paulista-masp",
        nome: "Avenida Paulista (MASP)",
        endereco: "Av. Paulista, 1578",
        bairro: "Bela Vista",
        lat: -23.5614,
        lng: -46.6559,
        horario: "6h às 23h",
        bikes: { urbana: 10, eletrica: 5, cesta: 3, cadeirinha: 0, infantil: 0 }
    },
    {
        id: "villa-lobos",
        nome: "Parque Villa-Lobos",
        endereco: "Av. Prof. Fonseca Rodrigues, 2001",
        bairro: "Alto de Pinheiros",
        lat: -23.5459,
        lng: -46.7219,
        horario: "5h30 às 19h",
        bikes: { urbana: 6, eletrica: 2, cesta: 2, cadeirinha: 2, infantil: 4 }
    },
    {
        id: "largo-da-batata",
        nome: "Largo da Batata",
        endereco: "Largo da Batata, s/n",
        bairro: "Pinheiros",
        lat: -23.5667,
        lng: -46.6967,
        horario: "6h às 22h",
        bikes: { urbana: 7, eletrica: 4, cesta: 1, cadeirinha: 0, infantil: 0 }
    },
    {
        id: "agua-branca",
        nome: "Parque da Água Branca",
        endereco: "Av. Francisco Matarazzo, 455",
        bairro: "Água Branca",
        lat: -23.5258,
        lng: -46.6679,
        horario: "6h às 20h",
        bikes: { urbana: 5, eletrica: 1, cesta: 2, cadeirinha: 1, infantil: 3 }
    },
    {
        id: "estacao-da-luz",
        nome: "Estação da Luz",
        endereco: "Praça da Luz, s/n",
        bairro: "Luz",
        lat: -23.5336,
        lng: -46.6355,
        horario: "6h às 22h",
        bikes: { urbana: 6, eletrica: 2, cesta: 0, cadeirinha: 0, infantil: 0 }
    },
    {
        id: "praca-roosevelt",
        nome: "Praça Roosevelt",
        endereco: "Praça Franklin Roosevelt, s/n",
        bairro: "Consolação",
        lat: -23.5496,
        lng: -46.6486,
        horario: "6h às 23h",
        bikes: { urbana: 4, eletrica: 2, cesta: 1, cadeirinha: 0, infantil: 0 }
    }
];

const TIPOS = {
    urbana: "Urbana",
    eletrica: "Elétrica",
    cesta: "Com cestinha",
    cadeirinha: "Com cadeirinha",
    infantil: "Infantil"
};

const CENTRO_INICIAL = [-23.5614, -46.6559];

const elLista = document.getElementById("listaPontos");
const elContagem = document.getElementById("contagemPontos");
const elVazio = document.getElementById("mensagemVazia");
const selectTipo = document.getElementById("filtroTipo");
const selectBairro = document.getElementById("filtroBairro");

/* Se o Leaflet não carregar (sem internet, por exemplo), a lista continua funcionando */
const temMapa = typeof L !== "undefined";
const reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const pontoPorId = new Map(pontos.map(function (ponto) {
    return [ponto.id, ponto];
}));

let mapa = null;
let camadaMarcadores = null;
const marcadores = new Map(); // id do ponto -> marcador no mapa
let idSelecionado = null;


function escapar(texto) {
    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function totalDisponivel(ponto, tipo) {
    if (tipo) {
        return ponto.bikes[tipo];
    }
    return Object.values(ponto.bikes).reduce(function (soma, qtd) {
        return soma + qtd;
    }, 0);
}

function pontosFiltrados() {
    const tipo = selectTipo.value;
    const bairro = selectBairro.value;

    return pontos.filter(function (ponto) {
        const temTipo = !tipo || ponto.bikes[tipo] > 0;
        const noBairro = !bairro || ponto.bairro === bairro;
        return temTipo && noBairro;
    });
}


function iniciarMapa() {
    const elMapa = document.getElementById("mapa");

    if (!temMapa) {
        elMapa.classList.add("mapa-indisponivel");
        elMapa.textContent = "Não foi possível carregar o mapa. A lista de pontos continua disponível.";
        return;
    }

    mapa = L.map(elMapa).setView(CENTRO_INICIAL, 12);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(mapa);

    camadaMarcadores = L.featureGroup().addTo(mapa);
}

function criarIcone(ponto, selecionado) {
    const tamanho = selecionado ? 44 : 36;

    return L.divIcon({
        className: "marcador" + (selecionado ? " marcador-selecionado" : ""),
        html: "<span>" + totalDisponivel(ponto, selectTipo.value) + "</span>",
        iconSize: [tamanho, tamanho],
        iconAnchor: [tamanho / 2, tamanho / 2],
        popupAnchor: [0, -tamanho / 2]
    });
}

function criarCartao(ponto) {
    const item = document.createElement("li");

    const tipoFiltrado = selectTipo.value;
    const bikesDisponiveis = Object.entries(TIPOS)
        .filter(function (par) {
            return ponto.bikes[par[0]] > 0;
        })
        .map(function (par) {
            const classe = par[0] === tipoFiltrado ? ' class="tipo-filtrado"' : "";
            return "<li" + classe + "><strong>" + ponto.bikes[par[0]] + "</strong> " + par[1] + "</li>";
        })
        .join("");

    const botaoMapa = temMapa
        ? '<button type="button" class="botao-ponto">Ver no mapa</button>'
        : "";

    const classeCartao = "ponto-card" + (ponto.id === idSelecionado ? " selecionado" : "");

    item.innerHTML =
        '<article class="' + classeCartao + '" data-id="' + ponto.id + '">' +
        "<h3>" + escapar(ponto.nome) + "</h3>" +
        '<p class="ponto-endereco">' + escapar(ponto.endereco) + ", " + escapar(ponto.bairro) + "</p>" +
        '<p class="ponto-horario">Aberto das ' + escapar(ponto.horario) + "</p>" +
        '<ul class="ponto-bikes">' + (bikesDisponiveis || "<li>Sem bicicletas no momento</li>") + "</ul>" +
        '<div class="ponto-acoes">' + botaoMapa +
        '<a class="link-destaque" target="_blank" rel="noopener" ' +
        'href="https://www.google.com/maps/dir/?api=1&destination=' + ponto.lat + "," + ponto.lng + '">' +
        "Como chegar</a></div>" +
        "</article>";

    /* Clicar no cartão (ou no botão "Ver no mapa") seleciona o ponto. O link "Como chegar" segue normal. */
    item.querySelector(".ponto-card").addEventListener("click", function (evento) {
        if (evento.target.closest("a")) {
            return;
        }
        selecionarPonto(ponto.id, { mover: true });
    });

    return item;
}


function selecionarPonto(id, opcoes) {
    const config = opcoes || {};
    idSelecionado = id;

    document.querySelectorAll(".ponto-card").forEach(function (cartao) {
        cartao.classList.toggle("selecionado", cartao.dataset.id === id);
    });

    if (temMapa) {
        marcadores.forEach(function (marcador, chave) {
            marcador.setIcon(criarIcone(pontoPorId.get(chave), chave === id));
        });

        const marcador = marcadores.get(id);

        if (config.mover) {
            mapa.flyTo(marcador.getLatLng(), Math.max(mapa.getZoom(), 15), { animate: !reduzMovimento });
        }
        marcador.openPopup();
    }

    if (config.rolar) {
        const cartao = document.querySelector('.ponto-card[data-id="' + id + '"]');
        if (cartao) {
            cartao.scrollIntoView({ block: "nearest", behavior: reduzMovimento ? "auto" : "smooth" });
        }
    }
}

function renderizar() {
    const lista = pontosFiltrados();

    elLista.replaceChildren();

    if (temMapa) {
        camadaMarcadores.clearLayers();
        marcadores.clear();
    }

    /* se o ponto selecionado saiu da lista por causa do filtro, limpa a seleção */
    const aindaVisivel = lista.some(function (ponto) {
        return ponto.id === idSelecionado;
    });
    if (!aindaVisivel) {
        idSelecionado = null;
    }

    lista.forEach(function (ponto) {
        elLista.appendChild(criarCartao(ponto));

        if (!temMapa) {
            return;
        }

        const marcador = L.marker([ponto.lat, ponto.lng], {
            icon: criarIcone(ponto, ponto.id === idSelecionado),
            title: ponto.nome + ": " + totalDisponivel(ponto, selectTipo.value) + " bicicletas",
            keyboard: true
        });

        marcador.bindPopup("<strong>" + escapar(ponto.nome) + "</strong><br>" + escapar(ponto.endereco));
        marcador.on("click", function () {
            selecionarPonto(ponto.id, { rolar: true });
        });

        marcador.addTo(camadaMarcadores);
        marcadores.set(ponto.id, marcador);
    });

    elContagem.textContent = lista.length === 1
        ? "1 ponto encontrado"
        : lista.length + " pontos encontrados";

    elVazio.hidden = lista.length > 0;

    if (temMapa && lista.length > 0) {
        mapa.fitBounds(camadaMarcadores.getBounds().pad(0.2), {
            maxZoom: 15,
            animate: !reduzMovimento
        });
    }
}


function iniciarFiltros() {
    Object.entries(TIPOS).forEach(function (par) {
        selectTipo.add(new Option(par[1], par[0]));
    });

    Array.from(new Set(pontos.map(function (ponto) {
        return ponto.bairro;
    })))
        .sort(function (a, b) {
            return a.localeCompare(b, "pt-BR");
        })
        .forEach(function (bairro) {
            selectBairro.add(new Option(bairro, bairro));
        });

    selectTipo.addEventListener("change", renderizar);
    selectBairro.addEventListener("change", renderizar);
}

iniciarFiltros();
iniciarMapa();
renderizar();