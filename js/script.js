const modalLogin = document.getElementById("modalLogin");
const campoEmail = document.getElementById("email");
const campoSenha = document.getElementById("senha");
const mensagemLogin = document.getElementById("mensagemLogin");
const formLogin = document.getElementById("formLogin");

let elementoAnterior = null;

function abrirModal() {
    elementoAnterior = document.activeElement;

    modalLogin.style.display = "flex";
    modalLogin.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    mensagemLogin.textContent = "";

    campoEmail.focus();
}

function fecharModal() {
    modalLogin.style.display = "none";
    modalLogin.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

    if (elementoAnterior) {
        elementoAnterior.focus();
    }
}

function fecharAoClicarFora(event) {
    if (event.target === modalLogin) {
        fecharModal();
    }
}

function alternarSenha() {
    const botaoSenha = document.querySelector(".mostrar-senha");

    if (campoSenha.type === "password") {
        campoSenha.type = "text";
        botaoSenha.textContent = "Ocultar";
        botaoSenha.setAttribute("aria-label", "Ocultar senha");
    } else {
        campoSenha.type = "password";
        botaoSenha.textContent = "Mostrar";
        botaoSenha.setAttribute("aria-label", "Mostrar senha");
    }
}

formLogin.addEventListener("submit", function(event) {
    event.preventDefault();

    const email = campoEmail.value.trim();
    const senha = campoSenha.value;

    if (!email || !senha) {
        mensagemLogin.textContent =
            "Preencha todos os campos.";

        return;
    }

    mensagemLogin.textContent =
        "Conecte o login ao backend para autenticar.";
});