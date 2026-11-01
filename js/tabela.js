document.addEventListener("DOMContentLoaded", () => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/json/tabelaPlanos.json", true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            const dados = JSON.parse(xhr.responseText);
            const tbody = document.getElementById("tabela-planos");
            
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
});