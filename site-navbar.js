const NAV_ITEMS = [
  { id: "index", href: "index.html", label: "Inicio" },
  { id: "about", href: "about.html", label: "Nosotros" },
  { id: "modalities", href: "modalities.html", label: "Entrenamientos" },
  { id: "horarios", href: "horarios.html", label: "Horarios" },
  { id: "aiki-kids", href: "aiki-kids.html", label: "Aiki Kids" },
  { id: "faq", href: "faq.html", label: "Preguntas frecuentes" },
  { id: "contact", href: "contact.html", label: "Contacto" },
];

class SiteNavbar extends HTMLElement {
  connectedCallback() {
    const active = this.getAttribute("active") || "";
    const itemsHtml = NAV_ITEMS.map((item) => {
      const activeClass = item.id === active ? " active" : "";
      return `<li class="nav-item">
          <a href="${item.href}" class="nav-link${activeClass}">${item.label}</a>
        </li>`;
    }).join("");

    this.innerHTML = `
  <nav class="navbar">
    <div class="nav-container">
      <div class="nav-logo">
        <img src="assets/images/logo-transparent.png" alt="Kodokai Valladolid Logo" class="logo-image">
      </div>
      <ul class="nav-menu">
        ${itemsHtml}
      </ul>
      <div class="hamburger">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </div>
    </div>
  </nav>`;
  }
}

customElements.define("site-navbar", SiteNavbar);
