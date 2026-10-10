// =====================================================
// MODO CLARO / ESCURO (continua ao trocar de página)
// =====================================================
const botaoTema = document.getElementById("botaoTema");

function atualizarBotaoTema() {
  const escuro = document.documentElement.classList.contains("escuro");
  botaoTema.textContent = escuro ? "Claro" : "Escuro";
}

atualizarBotaoTema();

botaoTema.addEventListener("click", function () {
  document.documentElement.classList.toggle("escuro");
  const escuro = document.documentElement.classList.contains("escuro");
  localStorage.setItem("tema", escuro ? "escuro" : "claro");
  atualizarBotaoTema();
});

// =====================================================
// MENU DO CELULAR
// =====================================================
const botaoMenu = document.getElementById("botaoMenu");
const menu = document.getElementById("menu");

botaoMenu.addEventListener("click", function () {
  menu.classList.toggle("aberto");
  botaoMenu.classList.toggle("aberto");
});

// =====================================================
// ANIMAÇÃO AO ROLAR + BARRAS DE HABILIDADE
// =====================================================
const secoes = document.querySelectorAll(".secao");
secoes.forEach(function (s) { s.classList.add("escondido"); });

const observador = new IntersectionObserver(function (itens) {
  itens.forEach(function (item) {
    if (item.isIntersecting) {
      item.target.classList.add("visivel");
      item.target.querySelectorAll(".preenche").forEach(function (barra) {
        barra.style.width = barra.dataset.valor + "%";
      });
    }
  });
}, { threshold: 0.1 });

secoes.forEach(function (s) { observador.observe(s); });

// =====================================================
// BOTÃO VOLTAR AO TOPO
// =====================================================
const voltar = document.getElementById("voltar");

window.addEventListener("scroll", function () {
  voltar.classList.toggle("mostrar", window.scrollY > 400);
});

voltar.addEventListener("click", function () {
  window.scrollTo({ top: 0 });
});

// =====================================================
// MODAL (usado em Projetos e Contato)
// =====================================================
const modal = document.getElementById("modal");

function abrirModal(titulo, texto) {
  document.getElementById("modalTitulo").textContent = titulo;
  document.getElementById("modalTexto").textContent = texto;
  modal.classList.add("aberto");
}

function fecharModal() {
  modal.classList.remove("aberto");
}

if (modal) {
  document.getElementById("modalFechar").addEventListener("click", fecharModal);
  // Fecha clicando fora da caixa
  modal.addEventListener("click", function (e) {
    if (e.target === modal) fecharModal();
  });
  // Fecha com a tecla Esc
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") fecharModal();
  });
}

// Abrir detalhes dos projetos
document.querySelectorAll(".projeto").forEach(function (projeto) {
  projeto.addEventListener("click", function () {
    abrirModal(projeto.dataset.titulo, projeto.dataset.texto);
  });
});

// Copiar e-mail
document.querySelectorAll("[data-copiar]").forEach(function (item) {
  item.addEventListener("click", function () {
    navigator.clipboard.writeText(item.dataset.copiar);
    abrirModal("E-mail copiado", "O endereço " + item.dataset.copiar + " foi copiado para a sua área de transferência.");
  });
});

// =====================================================
// FORMULÁRIO DE CONTATO + MÁSCARAS
// =====================================================
const formulario = document.getElementById("formulario");

if (formulario) {
  const nome = document.getElementById("nome");
  const telefone = document.getElementById("telefone");
  const email = document.getElementById("email");
  const mensagem = document.getElementById("mensagem");
  const contador = document.getElementById("contador");

  // Máscara do nome: só letras e espaços, primeira letra de cada palavra maiúscula
  nome.addEventListener("input", function () {
    let valor = nome.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
    valor = valor.replace(/\s{2,}/g, " ");
    valor = valor.replace(/(^|\s)(\S)/g, function (letra) { return letra.toUpperCase(); });
    nome.value = valor;
  });

  // Máscara do telefone: (00) 00000-0000
  telefone.addEventListener("input", function () {
    let numeros = telefone.value.replace(/\D/g, "").slice(0, 11);
    let valor = numeros;
    if (numeros.length > 0) valor = "(" + numeros.slice(0, 2);
    if (numeros.length >= 3) valor += ") " + numeros.slice(2, 7);
    if (numeros.length >= 8) valor += "-" + numeros.slice(7);
    telefone.value = valor;
  });

  // Máscara do e-mail: sem espaços e em minúsculas
  email.addEventListener("input", function () {
    email.value = email.value.replace(/\s/g, "").toLowerCase();
  });

  // Contador de caracteres da mensagem
  mensagem.addEventListener("input", function () {
    contador.textContent = mensagem.value.length + " / 500";
  });

  function mostrarErro(campo, idErro, texto) {
    document.getElementById(idErro).textContent = texto;
    campo.classList.toggle("invalido", texto !== "");
    return texto === "";
  }

  formulario.addEventListener("submit", function (e) {
    e.preventDefault();

    const nomeOk = mostrarErro(nome, "erroNome",
      nome.value.trim().split(" ").length < 2 ? "Digite seu nome e sobrenome." : "");

    const telefoneOk = mostrarErro(telefone, "erroTelefone",
      telefone.value.replace(/\D/g, "").length < 10 ? "Digite um telefone válido com DDD." : "");

    const emailOk = mostrarErro(email, "erroEmail",
      !/^[^@]+@[^@]+\.[a-z]{2,}$/.test(email.value) ? "Digite um e-mail válido." : "");

    const mensagemOk = mostrarErro(mensagem, "erroMensagem",
      mensagem.value.trim().length < 10 ? "A mensagem precisa ter pelo menos 10 caracteres." : "");

    if (nomeOk && telefoneOk && emailOk && mensagemOk) {
      const primeiroNome = nome.value.trim().split(" ")[0];
      abrirModal("Mensagem enviada", "Obrigado, " + primeiroNome + "! Recebi sua mensagem e vou responder o mais rápido possível.");
      formulario.reset();
      contador.textContent = "0 / 500";
    } else {
      abrirModal("Atenção", "Alguns campos estão incorretos. Confira as mensagens em vermelho.");
    }
  });
}
