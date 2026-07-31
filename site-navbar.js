const NAV_ITEMS = [
  { id: "index", href: "index.html", label: "Inicio" },
  { id: "about", href: "about.html", label: "Nosotros" },
  { id: "modalities", href: "modalities.html", label: "Entrenamientos" },
  { id: "horarios", href: "horarios.html", label: "Horarios" },
  { id: "eventos", href: "eventos.html", label: "Eventos" },
  { id: "aiki-kids", href: "aiki-kids.html", label: "Aiki Kids" },
  { id: "galeria", href: "galeria.html", label: "Galería" },
  { id: "faq", href: "faq.html", label: "Preguntas frecuentes" },
  { id: "contact", href: "contact.html", label: "Contacto" },
];

class SiteNavbar extends HTMLElement {
  connectedCallback() {
    const active = this.getAttribute("active") || "";
    const itemsHtml = NAV_ITEMS.map((item) => {
      const activeClass = item.id === active ? " active" : "";
      const ariaCurrent = item.id === active ? ' aria-current="page"' : "";
      return `<li class="nav-item">
          <a href="${item.href}" class="nav-link${activeClass}"${ariaCurrent}>${item.label}</a>
        </li>`;
    }).join("");

    this.innerHTML = `
  <nav class="navbar" aria-label="Principal">
    <div class="nav-container">
      <a href="index.html" class="nav-logo">
        <img src="assets/images/logo-transparent.png" alt="Kodokai Valladolid" class="logo-image">
      </a>
      <ul class="nav-menu" id="primary-nav">
        ${itemsHtml}
      </ul>
      <button type="button" class="hamburger" aria-label="Abrir menú" aria-controls="primary-nav" aria-expanded="false">
        <span class="bar" aria-hidden="true"></span>
        <span class="bar" aria-hidden="true"></span>
        <span class="bar" aria-hidden="true"></span>
      </button>
    </div>
  </nav>`;
  }
}

customElements.define("site-navbar", SiteNavbar);
