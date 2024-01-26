function login() {
    window.location.href = "./login.html";
}

function cadastro() {
    window.location.href = "./cadastro.html";
}

function index() {
    window.location.href = "./index.html";
}

document.addEventListener("DOMContentLoaded", function () {
    const $ = (elemento) => document.querySelector(elemento);

    const formCadastro = document.querySelector(".formCadastro");

    if (formCadastro) {
        formCadastro.addEventListener("submit", (ev) => {
            ev.preventDefault();

            const username = $("#username").value;
            const email = $("#email").value;
            const senha = $("#senha").value;

            const tudoPreenchido = username.length !== 0 && email.length !== 0 && senha.length !== 0;

            if (tudoPreenchido === false) {
                alert("Preencha todos os campos antes de enviar.");
                return;
            }

            const usuarioCadastrado = {
                email,
                username,
                senha,
            };

            const string = JSON.stringify(usuarioCadastrado);
            localStorage.setItem("usuario", string);

            alert("Cadastro realizado com sucesso!");
            window.location.href = "./login.html";
        });
    }
});
