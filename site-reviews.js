const PLACE_ID = "ChIJRYAgduZtRw0RxYI_k3cfktM";
const MAPS_API_KEY = "AIzaSyB_lMbHRAzJQcg8wnQ8miWHI3HZmHIQ1iI";

const reviewsButton = document.getElementById("reviews-load");
const reviewsPanel = document.getElementById("reviews-panel");
const reviewsStatus = document.getElementById("reviews-status");
const reviewsFallback = document.getElementById("reviews-fallback");

function ensureMapsLoader() {
  if (window.google?.maps?.importLibrary) return;

  ((g) => {
    let loader;
    const namespace = "google";
    const importName = "importLibrary";
    const callbackName = "__ib__";
    const root = document;
    let googleNamespace = window[namespace] || (window[namespace] = {});
    const maps = googleNamespace.maps || (googleNamespace.maps = {});
    const requested = new Set();
    const params = new URLSearchParams();

    const loadScript = () =>
      loader ||
      (loader = new Promise((resolve, reject) => {
        const script = root.createElement("script");
        params.set("libraries", [...requested].join(","));
        for (const key of Object.keys(g)) {
          params.set(
            key.replace(/[A-Z]/g, (letter) => "_" + letter[0].toLowerCase()),
            g[key]
          );
        }
        params.set("callback", namespace + ".maps." + callbackName);
        script.src = "https://maps." + namespace + "apis.com/maps/api/js?" + params;
        script.async = true;
        maps[callbackName] = resolve;
        script.onerror = () => reject(new Error("maps-load-failed"));
        root.head.append(script);
      }));

    maps[importName] = (library, ...args) =>
      requested.add(library) &&
      loadScript().then(() => maps[importName](library, ...args));
  })({
    key: MAPS_API_KEY,
    v: "weekly",
  });
}

function revealFallback() {
  if (reviewsFallback) reviewsFallback.hidden = false;
}

function showStatus(message) {
  if (!reviewsStatus) return;
  reviewsStatus.hidden = false;
  reviewsStatus.textContent = message;
}

function buildReviewsElement() {
  const details = document.createElement("gmp-place-details");
  const request = document.createElement("gmp-place-details-place-request");
  const config = document.createElement("gmp-place-content-config");

  request.setAttribute("place", PLACE_ID);
  config.append(
    document.createElement("gmp-place-rating"),
    document.createElement("gmp-place-review-summary"),
    document.createElement("gmp-place-reviews")
  );
  details.append(request, config);
  return details;
}

async function showReviews() {
  if (!reviewsButton || !reviewsPanel) return;

  reviewsButton.disabled = true;
  reviewsButton.textContent = "Cargando reseñas…";
  if (reviewsStatus) reviewsStatus.hidden = true;

  const details = buildReviewsElement();
  const loaded = new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error("timeout")), 15000);
    details.addEventListener("gmp-load", () => {
      window.clearTimeout(timer);
      resolve();
    });
    details.addEventListener("gmp-error", () => {
      window.clearTimeout(timer);
      reject(new Error("reviews-error"));
    });
  });

  try {
    ensureMapsLoader();
    await google.maps.importLibrary("places");
    reviewsPanel.replaceChildren(details);
    reviewsPanel.hidden = false;
    await loaded;
    reviewsButton.hidden = true;
    revealFallback();
    details.focus?.();
  } catch {
    reviewsPanel.hidden = true;
    reviewsPanel.replaceChildren();
    reviewsButton.disabled = false;
    reviewsButton.textContent = "Ver reseñas";
    showStatus("No se han podido cargar las reseñas.");
    revealFallback();
  }
}

if (reviewsButton) {
  reviewsButton.addEventListener("click", () => {
    showReviews();
  });
}
