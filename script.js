// ===== Configuração =====
// Número de WhatsApp da oficina (só dígitos, com 55 + DDD). Ex.: "5547999998888".
// Enquanto estiver vazio, os botões de WhatsApp ligam para o telefone fixo.
const WHATSAPP = "5547991696393";
const TELEFONE = "+5547991696393";

// ===== Links de WhatsApp =====
function whatsUrl(msg) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
}

document.querySelectorAll(".js-whats").forEach((el) => {
  if (WHATSAPP) {
    el.href = whatsUrl(el.dataset.msg || "Olá! Vim pelo site.");
    el.target = "_blank";
    el.rel = "noopener";
  } else {
    el.href = `tel:${TELEFONE}`;
  }
});

// ===== Menu mobile =====
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

function setMenu(open) {
  nav.classList.toggle("is-open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
}

menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

// ===== Cabeçalho com borda ao rolar =====
const header = document.querySelector(".header");
const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// ===== Verificador de sintomas do câmbio =====
const checker = document.getElementById("checker");
const hint = document.getElementById("checkerHint");

checker.addEventListener("submit", (e) => {
  e.preventDefault();
  const sintomas = [...checker.querySelectorAll("input[type=checkbox]:checked")].map((i) => i.value);
  const carro = document.getElementById("carro").value.trim();

  if (!sintomas.length) {
    hint.textContent = "Marque pelo menos um item para a gente entender o que está acontecendo.";
    hint.classList.add("is-error");
    return;
  }
  hint.classList.remove("is-error");

  const msg =
    "Olá! Vim pelo site. Meu câmbio está com:\n" +
    sintomas.map((s) => `• ${s}`).join("\n") +
    (carro ? `\n\nCarro: ${carro}` : "") +
    "\n\nPodem me ajudar?";

  track("whats_checker");

  if (WHATSAPP) {
    window.open(whatsUrl(msg), "_blank", "noopener");
    hint.textContent = "Abrimos o WhatsApp com a sua mensagem pronta.";
  } else {
    hint.textContent = "Ligue para (47) 99169-6393 e conte: " + sintomas.join(", ").toLowerCase() + ".";
    window.location.href = `tel:${TELEFONE}`;
  }
});

// ===== Medição de cliques (ligações e WhatsApp) =====
// Se o site tiver Google Analytics 4 (gtag), cada clique vira um evento.
function track(name) {
  if (typeof window.gtag === "function") {
    window.gtag("event", "contato", { local: name });
  }
}
document.querySelectorAll("[data-track]").forEach((el) => {
  if (el.closest("form")) return; // o formulário registra no submit
  el.addEventListener("click", () => track(el.dataset.track));
});

// ===== Ano no rodapé =====
document.getElementById("ano").textContent = new Date().getFullYear();
