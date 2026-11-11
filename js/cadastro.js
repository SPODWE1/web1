const formularioCadastro = document.getElementById("formCadastro");
const dialogCadastro = document.getElementById("dialogCadastro");
const fecharDialog = document.getElementById("fecharDialog");

if (formularioCadastro) {

    formularioCadastro.addEventListener("submit", function (event) {

        event.preventDefault();

        const senha = document.getElementById("senha").value;
        const confirmarSenha = document.getElementById("confirmarSenha").value;

        if (senha !== confirmarSenha) {
            alert("As senhas não coincidem!");
            return;
        }

        const nome = document.getElementById("nome").value;
        const email = document.getElementById("email").value;
        const telefone = document.getElementById("telefone").value;
        const dataNascimento = document.getElementById("dataNascimento").value;
        const zona = document.getElementById("zona").value;
        const bairro = document.getElementById("bairro").value;

        const sexoSelecionado = document.querySelector(
            'input[name="sexo"]:checked'
        );

        const opcoesSexo = {
            feminino: "Feminino",
            masculino: "Masculino",
            nao_informar: "Prefiro não informar"
        };

        const [ano, mes, dia] = dataNascimento.split("-");
        const dataFormatada = `${dia}/${mes}/${ano}`;

        document.getElementById("resumoNome").textContent = nome;
        document.getElementById("resumoEmail").textContent = email;
        document.getElementById("resumoTelefone").textContent = telefone;
        document.getElementById("resumoData").textContent = dataFormatada;

        document.getElementById("resumoSexo").textContent =
            opcoesSexo[sexoSelecionado.value];

        document.getElementById("resumoZona").textContent = zona;

        document.getElementById("resumoBairro").textContent = bairro;

        dialogCadastro.showModal();

    });

}

fecharDialog.addEventListener("click", function () {

    dialogCadastro.close();

    formularioCadastro.reset();

});