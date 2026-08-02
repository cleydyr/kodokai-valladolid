const GALLERY_ITEMS = [
  {
    src: "assets/images/dojo_entrada.jpeg",
    alt: "Entrada del dojo Kodokai Valladolid",
    caption: "En el tatami",
    width: 800,
    height: 600,
  },
  {
    src: "assets/images/dojo_altar.jpeg",
    alt: "Altar tradicional en el interior del dojo",
    caption: "Altar tradicional",
    width: 800,
    height: 600,
  },
  {
    src: "assets/gallery/PHOTO-2025-07-24-12-10-00.jpg",
    alt: "Momento del entrenamiento en el dojo Kodokai Valladolid",
    caption: "Paseo de los Castaños",
    width: 1200,
    height: 1600,
  },
  {
    src: "assets/gallery/PHOTO-2025-07-24-12-10-00_1.jpg",
    alt: "Practicantes de Aikido en el tatami",
    caption: "Entrada del dojo",
    width: 1600,
    height: 1200,
  },
  {
    src: "assets/gallery/PHOTO-2025-07-24-12-10-38.jpg",
    alt: "Vista del entrenamiento de Aikido en el dojo",
    caption: "Momento en el dojo",
    width: 1600,
    height: 1200,
  },
  {
    src: "assets/gallery/PHOTO-2025-07-24-12-10-00_2.jpg",
    alt: "Paseo arbolado de los Castaños cerca del dojo",
    caption: "Entorno del dojo",
    width: 1600,
    height: 1200,
  },
  {
    src: "assets/gallery/PHOTO-2025-07-24-12-08-38.jpg",
    alt: "Vista baja del tatami y el tokonoma del dojo",
    caption: "El tatami",
    width: 739,
    height: 1600,
  },
  {
    src: "assets/gallery/entrenamiento-2026-08-02.jpg",
    alt: "Práctica de Aikido en el tatami con varios aikidokas",
    caption: "Entrenamiento",
    width: 960,
    height: 640,
  },
  {
    src: "assets/gallery/grupo-2026-08-02.jpg",
    alt: "Grupo de practicantes de Aikido frente al kamiza",
    caption: "La comunidad",
    width: 960,
    height: 640,
  },
  {
    src: "assets/gallery/tecnica-2026-08-02.jpg",
    alt: "Demostración de técnica de Aikido en el dojo",
    caption: "Técnica en el dojo",
    width: 960,
    height: 640,
  },
];

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

class GalleryItem extends HTMLElement {
  static get observedAttributes() {
    return ["src", "alt", "caption", "width", "height"];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    if (this.isConnected) this.render();
  }

  render() {
    const src = this.getAttribute("src") || "";
    const alt = this.getAttribute("alt") || "";
    const caption = this.getAttribute("caption") || "";
    const width = this.getAttribute("width") || "";
    const height = this.getAttribute("height") || "";
    const widthAttr = width ? ` width="${escapeHtml(width)}"` : "";
    const heightAttr = height ? ` height="${escapeHtml(height)}"` : "";

    this.innerHTML = `
      <figure class="gallery-item">
        <button type="button" class="gallery-trigger" aria-label="Ver imagen a tamaño completo: ${escapeHtml(caption)}">
          <img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}"${widthAttr}${heightAttr} loading="lazy">
        </button>
        <figcaption>${escapeHtml(caption)}</figcaption>
      </figure>
    `;
  }
}

class SiteGallery extends HTMLElement {
  connectedCallback() {
    const itemsHtml = GALLERY_ITEMS.map(
      (item) => `
          <gallery-item
            src="${escapeHtml(item.src)}"
            alt="${escapeHtml(item.alt)}"
            caption="${escapeHtml(item.caption)}"
            width="${item.width}"
            height="${item.height}"
          ></gallery-item>`
    ).join("");

    this.innerHTML = `
      <div class="gallery-grid">
        ${itemsHtml}
      </div>
      <dialog class="lightbox" aria-label="Vista ampliada de la imagen">
        <button type="button" class="lightbox-close" aria-label="Cerrar">×</button>
        <button type="button" class="lightbox-nav lightbox-prev" aria-label="Imagen anterior">‹</button>
        <figure class="lightbox-figure">
          <img class="lightbox-image" src="" alt="">
          <figcaption class="lightbox-caption"></figcaption>
        </figure>
        <button type="button" class="lightbox-nav lightbox-next" aria-label="Imagen siguiente">›</button>
      </dialog>
    `;

    this.initLightbox();
  }

  initLightbox() {
    const dialog = this.querySelector(".lightbox");
    const grid = this.querySelector(".gallery-grid");
    if (!dialog || !grid) return;

    const imageEl = dialog.querySelector(".lightbox-image");
    const captionEl = dialog.querySelector(".lightbox-caption");
    const closeBtn = dialog.querySelector(".lightbox-close");
    const prevBtn = dialog.querySelector(".lightbox-prev");
    const nextBtn = dialog.querySelector(".lightbox-next");
    let currentIndex = 0;

    const getTriggers = () => Array.from(this.querySelectorAll(".gallery-trigger"));

    const getItemData = (trigger) => {
      const img = trigger.querySelector("img");
      const caption = trigger
        .closest(".gallery-item")
        ?.querySelector("figcaption")
        ?.textContent.trim();

      return {
        src: img?.currentSrc || img?.src || "",
        alt: img?.alt || "",
        caption: caption || "",
      };
    };

    const showImage = (index) => {
      const triggers = getTriggers();
      if (triggers.length === 0) return;
      currentIndex = (index + triggers.length) % triggers.length;
      const data = getItemData(triggers[currentIndex]);
      imageEl.src = data.src;
      imageEl.alt = data.alt;
      captionEl.textContent = data.caption;
    };

    const openAt = (index) => {
      showImage(index);
      if (typeof dialog.showModal === "function") {
        dialog.showModal();
      } else {
        dialog.setAttribute("open", "");
      }
      closeBtn.focus();
    };

    const closeLightbox = () => {
      if (dialog.open) dialog.close();
    };

    grid.addEventListener("click", (e) => {
      const trigger = e.target.closest(".gallery-trigger");
      if (!trigger || !grid.contains(trigger)) return;
      const index = getTriggers().indexOf(trigger);
      if (index >= 0) openAt(index);
    });

    closeBtn.addEventListener("click", closeLightbox);
    prevBtn.addEventListener("click", () => showImage(currentIndex - 1));
    nextBtn.addEventListener("click", () => showImage(currentIndex + 1));

    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) closeLightbox();
    });

    dialog.addEventListener("keydown", (e) => {
      if (!dialog.open) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        showImage(currentIndex - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        showImage(currentIndex + 1);
      }
    });
  }
}

customElements.define("gallery-item", GalleryItem);
customElements.define("site-gallery", SiteGallery);
