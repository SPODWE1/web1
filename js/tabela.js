
document.addEventListener("DOMContentLoaded", () => {

    // Carregar tabela
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/json/tabelaPlanos.json", true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            const dados = JSON.parse(xhr.responseText);
            const tbody = document.getElementById("tabela-planos");

            if (!tbody) return;

            tbody.innerHTML = "";

            dados.forEach(item => {
                const tr = document.createElement("tr");

                tr.innerHTML = `
                    <td>${item.categoria}</td>
                    <td>${item.descricao}</td>
                    <td>${item.preco}</td>
                    <td>${item.adicionalExcedente}</td>
                `;

                tbody.appendChild(tr);
            });
        } else {
            console.error("Erro ao carregar o JSON:", xhr.statusText);
        }
    };

    xhr.onerror = function () {
        console.error("Erro ao tentar carregar o arquivo.");
    };

    xhr.send();


    const botoes = document.querySelectorAll(".btn-plano");
    const destino = document.getElementById("tabela-container");

    botoes.forEach(botao => {
        botao.addEventListener("click", function(event) {
            event.preventDefault();

            const inicio = window.scrollY;
            const fim = destino.getBoundingClientRect().top + window.scrollY;

            const duracao = 2000;
            const inicioTempo = performance.now();

            function animar(tempoAtual) {
                const progresso = Math.min(
                    (tempoAtual - inicioTempo) / duracao, 1
                );

                const suavizacao = 1 - Math.pow(1 - progresso, 3);

                window.scrollTo(
                    0,
                    inicio + (fim - inicio) * suavizacao
                );

                if (progresso < 1) {
                    requestAnimationFrame(animar);
                }
            }

            requestAnimationFrame(animar);
        });
    });
});
