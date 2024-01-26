function login() {
    window.location.href = "./login.html";
}

function cadastro() {
    window.location.href = "./cadastro.html";
}

function index() {
    window.location.href = "./index.html";
}

document.querySelector("#entrar").addEventListener("click", (ev) => {
    ev.preventDefault();

    const string = localStorage.getItem("usuario");

    if (!string) {
        alert("Usuário não cadastrado");
        return;
    }

    const usuarioCadastrado = JSON.parse(string);

    const { email, senha } = usuarioCadastrado;
    const dadosCorretos = email === document.querySelector("#email").value && senha === document.querySelector("#senha").value;

    if (!dadosCorretos) {
        alert("Dados inválidos!");
        return;
    }

    window.location.href = "./index.html";
});