class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
  <footer class="footer">
    <div class="container">
      <p>&copy; 2026 Aikido Kodokai Valladolid. Todos los derechos reservados.</p>
    </div>
  </footer>`;
  }
}

customElements.define("site-footer", SiteFooter);
