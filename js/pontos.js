const pontos = [
    {
        id: "ibirapuera",
        nome: "Parque Ibirapuera",
        bairro: "Vila Mariana",
        endereco: "Av. Pedro Álvares Cabral, s/n — Portão 10, São Paulo — SP",
        horario: "Todos os dias, 5h às 23h",
        bikes: 12,
        imagem: "/images/pontos/ibirapuera.jpg",
        imagemAlt: "Pessoa pedalando em uma ciclovia arborizada",
        creditoFoto: "Davidson Luna",
        coordenadas: "-23.587416,-46.657634"
    },
    {
        id: "largo-da-batata",
        nome: "Largo da Batata",
        bairro: "Pinheiros",
        endereco: "Av. Brigadeiro Faria Lima, 1051 — Pinheiros, São Paulo — SP",
        horario: "Todos os dias, 24 horas",
        bikes: 7,
        imagem: "/images/pontos/largo-da-batata.jpg",
        imagemAlt: "Área urbana movimentada e arborizada",
        creditoFoto: "Kseniia Lobko",
        coordenadas: "-23.567102,-46.693544"
    },
    {
        id: "avenida-paulista",
        nome: "Avenida Paulista",
        bairro: "Bela Vista",
        endereco: "Av. Paulista, 1578 — em frente ao MASP, São Paulo — SP",
        horario: "Todos os dias, 6h às 22h",
        bikes: 9,
        imagem: "/images/pontos/avenida-paulista.jpg",
        imagemAlt: "Rua moderna da cidade com ponte colorida e edifícios",
        creditoFoto: "Vinícius Costa",
        coordenadas: "-23.561414,-46.655881"
    }
];

const elLista = document.getElementById("listaPontos");
const elContagem = document.getElementById("contagemPontos");
const modalMapa = document.getElementById("modalMapa");
const iframeMapa = document.getElementById("mapaIframe");
const elTitulo = document.getElementById("mapaTitulo");
const elEndereco = document.getElementById("mapaEndereco");
const elHorario = document.getElementById("mapaHorario");
const elBikes = document.getElementById("mapaBikes");
const botaoFechar = document.getElementById("fecharMapa");

const iconeBike =
    '<svg aria-hidden="true" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">' +
    '<circle cx="5.5" cy="17.5" r="3.5"></circle>' +
    '<circle cx="18.5" cy="17.5" r="3.5"></circle>' +
    '<path stroke-linecap="round" stroke-linejoin="round" d="m8 17.5 4-8 3 8M9.5 12h6M9.5 7.5H12"></path>' +
    "</svg>";

const iconePin =
    '<svg aria-hidden="true" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">' +
    '<path stroke-linecap="round" stroke-linejoin="round" d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"></path>' +
    '<circle cx="12" cy="10" r="2.5"></circle>' +
    "</svg>";

const iconeSeta =
    '<svg class="ponto-seta" aria-hidden="true" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">' +
    '<path stroke-linecap="round" stroke-linejoin="round" d="m9 18 6-6-6-6"></path>' +
    "</svg>";

function escapar(texto) {
    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function urlMapa(coordenadas) {
    return "https://www.google.com/maps?q=" + coordenadas + "&z=15&output=embed";
}

function criarCartao(ponto, indice) {
    const artigo = document.createElement("article");
    artigo.className = "ponto-card";

    artigo.innerHTML =
        '<div class="ponto-cabecalho">' +
            "<div>" +
                '<div class="ponto-meta">' +
                    "<span>0" + (indice + 1) + "</span>" +
                    '<span class="ponto-meta-linha"></span>' +
                    "<span>" + escapar(ponto.bairro) + "</span>" +
                "</div>" +
                "<h2>" + escapar(ponto.nome) + "</h2>" +
            "</div>" +
            '<div class="ponto-badge">' +
                '<span class="ponto-live"></span>' +
                ponto.bikes + " bikes" +
            "</div>" +
        "</div>" +
        '<div class="ponto-grade">' +
            "<figure class=\"ponto-foto\">" +
                '<img src="' + escapar(ponto.imagem) + '" alt="' + escapar(ponto.imagemAlt) + '">' +
                '<div class="ponto-foto-legenda">' +
                    "<p>" + iconeBike + " " + ponto.bikes + " bicicletas disponíveis</p>" +
                    "<span>Foto: " + escapar(ponto.creditoFoto) + "</span>" +
                "</div>" +
            "</figure>" +
            '<button type="button" class="ponto-mapa-botao" data-id="' + ponto.id + '" ' +
                'aria-label="Abrir mapa de ' + escapar(ponto.nome) + '">' +
                '<div class="ponto-mapa-preview">' +
                    '<iframe title="Miniatura do mapa de ' + escapar(ponto.nome) + '" loading="lazy" ' +
                    'referrerpolicy="no-referrer-when-downgrade" src="' + urlMapa(ponto.coordenadas) + '"></iframe>' +
                "</div>" +
                '<span class="ponto-mapa-sombra"></span>' +
                '<span class="ponto-mapa-cta">' +
                    '<span class="ponto-mapa-cta-texto">' +
                        '<span class="ponto-pin">' + iconePin + "</span>" +
                        "<span>" +
                            "<small>Localização</small>" +
                            "<strong>Ver mapa ampliado</strong>" +
                        "</span>" +
                    "</span>" +
                    iconeSeta +
                "</span>" +
            "</button>" +
        "</div>";

    artigo.querySelector(".ponto-mapa-botao").addEventListener("click", function () {
        abrirMapa(ponto);
    });

    return artigo;
}

function abrirMapa(ponto) {
    elTitulo.textContent = ponto.nome;
    elEndereco.textContent = ponto.endereco;
    elHorario.textContent = ponto.horario;
    elBikes.innerHTML = iconeBike + " " + ponto.bikes + " disponíveis agora";
    iframeMapa.title = "Mapa de " + ponto.nome;
    iframeMapa.src = urlMapa(ponto.coordenadas);

    modalMapa.classList.add("aberto");
    modalMapa.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    botaoFechar.focus();
}

function fecharMapa() {
    modalMapa.classList.remove("aberto");
    modalMapa.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    iframeMapa.src = "about:blank";
}

function renderizar() {
    elLista.replaceChildren();

    pontos.forEach(function (ponto, indice) {
        elLista.appendChild(criarCartao(ponto, indice));
    });

    elContagem.textContent = pontos.length === 1
        ? "1 ponto encontrado"
        : pontos.length + " pontos encontrados";
}

botaoFechar.addEventListener("click", fecharMapa);

modalMapa.addEventListener("mousedown", function (evento) {
    if (evento.target === modalMapa) {
        fecharMapa();
    }
});

document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape" && modalMapa.classList.contains("aberto")) {
        fecharMapa();
    }
});

renderizar();
