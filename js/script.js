/* ==========================================================
   RentaCar SC — configuración y lógica del sitio
   ========================================================== */

/* ----------------------------------------------------------
   1) NÚMERO DE WHATSAPP
   Cuando lo tengas, escríbelo aquí SIN "+", sin espacios y
   con código de país. Ejemplo Cuba: "5355123456"
   Mientras esté vacío ("") los botones avisan que el
   contacto estará disponible pronto.
---------------------------------------------------------- */
const WHATSAPP_NUMBER = "5353080125";

/* ----------------------------------------------------------
   2) VEHÍCULOS
   Edita, agrega o quita vehículos en esta lista.
   - images: lista de fotos del vehículo (puede ser una o varias).
             Colócalas en images/vehiculos/ con esos mismos nombres
             y aparecerán automáticamente, con flechas para pasar
             de una foto a otra si hay más de una.
             Si una foto no existe todavía, se muestra un marcador
             "Foto próximamente" en su lugar (no rompe el diseño).
   - price: escribe el texto que quieras mostrar
            (ej: "Desde 30 USD/día" o "Consultar por WhatsApp").
---------------------------------------------------------- */
const VEHICLES = [
  {
    name: "Kia Picanto",
    type: "Carro",
    specs: ["Automático", "4 pasajeros", "Aire acondicionado"],
    price: "Consultar por WhatsApp",
    images: [
      "images/vehiculos/kia-picanto-lateral.jpg",
      "images/vehiculos/kia-picanto-frontal.jpg",
      "images/vehiculos/kia-picanto-trasera.jpg",
      "images/vehiculos/kia-picanto-interior.jpg"
    ]
  },
  {
    name: "Hyundai Grand i10",
    type: "Carro",
    specs: ["Automático", "4 pasajeros", "Aire acondicionado"],
    price: "Consultar por WhatsApp",
    images: [
      "images/vehiculos/hyundai-grand-i10-lateral.jpg",
      "images/vehiculos/hyundai-grand-i10-frontal.jpg"
    ]
  },
  {
    name: "Minivan BAW",
    type: "Van",
    specs: ["Automático", "7 pasajeros", "Ideal para grupos"],
    price: "Consultar por WhatsApp",
    images: ["images/vehiculos/baw-minivan.jpg"]
  },
  {
    name: "Moto Scooter",
    type: "Moto",
    specs: ["Maxi-scooter", "2 pasajeros", "Amplio espacio de carga"],
    price: "Consultar por WhatsApp",
    images: ["images/vehiculos/moto-scooter.jpg"]
  },
  {
    name: "Geely CK",
    type: "Carro",
    specs: ["5 pasajeros", "Ideal para trayectos largos"],
    price: "Consultar por WhatsApp",
    images: ["images/vehiculos/geely-ck-taxi.jpg"]
  }
];

/* ==========================================================
   A partir de aquí no hace falta tocar nada
   ========================================================== */

const carIconSVG = `<svg viewBox="0 0 24 24"><path d="M3 13l1.5-4.5A2 2 0 0 1 6.4 7h11.2a2 2 0 0 1 1.9 1.5L21 13"/><path d="M3 13h18v4a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H6v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4z"/><circle cx="7.5" cy="17" r="1.5"/><circle cx="16.5" cy="17" r="1.5"/></svg>`;

const motoIconSVG = `<svg viewBox="0 0 24 24"><circle cx="5.5" cy="17.5" r="2.5"/><circle cx="18.5" cy="17.5" r="2.5"/><path d="M5.5 17.5H10l2-5h4.5l2 5"/><path d="M12 12.5l2-3h3"/></svg>`;

function whatsappHref(message){
  if(!WHATSAPP_NUMBER) return null;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function buildVehicleCard(vehicle, vehicleIndex){
  const icon = vehicle.type.toLowerCase() === "moto" ? motoIconSVG : carIconSVG;
  const message = `Hola, me interesa rentar el ${vehicle.name} en Santiago de Cuba. ¿Está disponible?`;

  const specsHTML = vehicle.specs.map(s => `<li>${s}</li>`).join("");

  const slidesHTML = vehicle.images.map(src => `
    <div class="photo-slide">
      <img src="${src}" alt="${vehicle.name}"
           onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
      <div class="photo-placeholder" style="display:none;">
        ${icon}
        <span>Foto próximamente</span>
      </div>
    </div>
  `).join("");

  const hasMultiple = vehicle.images.length > 1;

  const arrowsHTML = hasMultiple ? `
    <button type="button" class="photo-arrow photo-arrow-prev" aria-label="Foto anterior">‹</button>
    <button type="button" class="photo-arrow photo-arrow-next" aria-label="Foto siguiente">›</button>
  ` : "";

  const dotsHTML = hasMultiple ? `
    <div class="photo-dots">
      ${vehicle.images.map((_, i) => `<span class="photo-dot${i === 0 ? " is-active" : ""}"></span>`).join("")}
    </div>
  ` : "";

  return `
    <article class="vehicle-card">
      <div class="vehicle-photo" data-vehicle-index="${vehicleIndex}" data-slide-count="${vehicle.images.length}">
        <span class="vehicle-type-tag">${vehicle.type}</span>
        <div class="photo-track">${slidesHTML}</div>
        ${arrowsHTML}
        ${dotsHTML}
      </div>
      <div class="vehicle-body">
        <h3>${vehicle.name}</h3>
        <ul class="vehicle-specs">${specsHTML}</ul>
        <p class="vehicle-price"><small>Precio</small>${vehicle.price}</p>
        <a href="#" class="btn btn-whatsapp" data-whatsapp-cta data-message="${message}">
          Reservar por WhatsApp
        </a>
      </div>
    </article>
  `;
}

function renderVehicles(){
  const grid = document.getElementById("vehicleGrid");
  if(!grid) return;
  grid.innerHTML = VEHICLES.map((v, i) => buildVehicleCard(v, i)).join("");
}

function goToSlide(photoEl, index){
  const track = photoEl.querySelector(".photo-track");
  const count = Number(photoEl.dataset.slideCount || 1);
  const clamped = ((index % count) + count) % count;
  track.style.transform = `translateX(-${clamped * 100}%)`;
  photoEl.dataset.currentSlide = clamped;

  const dots = photoEl.querySelectorAll(".photo-dot");
  dots.forEach((dot, i) => dot.classList.toggle("is-active", i === clamped));
}

function initPhotoCarousels(){
  document.querySelectorAll(".vehicle-photo").forEach(photoEl => {
    const count = Number(photoEl.dataset.slideCount || 1);
    if(count <= 1) return;

    photoEl.dataset.currentSlide = 0;

    const prevBtn = photoEl.querySelector(".photo-arrow-prev");
    const nextBtn = photoEl.querySelector(".photo-arrow-next");

    prevBtn.addEventListener("click", () => {
      const current = Number(photoEl.dataset.currentSlide || 0);
      goToSlide(photoEl, current - 1);
    });

    nextBtn.addEventListener("click", () => {
      const current = Number(photoEl.dataset.currentSlide || 0);
      goToSlide(photoEl, current + 1);
    });

    photoEl.querySelectorAll(".photo-dot").forEach((dot, i) => {
      dot.addEventListener("click", () => goToSlide(photoEl, i));
    });
  });
}

function showToast(text){
  const toast = document.getElementById("toast");
  if(!toast) return;
  toast.textContent = text;
  toast.classList.add("is-visible");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("is-visible"), 3200);
}

function initWhatsAppButtons(){
  document.querySelectorAll("[data-whatsapp-cta]").forEach(btn => {
    const message = btn.getAttribute("data-message") || "Hola, quisiera información sobre renta de vehículos en Santiago de Cuba.";
    const href = whatsappHref(message);

    if(href){
      btn.setAttribute("href", href);
      btn.setAttribute("target", "_blank");
      btn.setAttribute("rel", "noopener");
    } else {
      btn.setAttribute("data-pending", "true");
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        showToast("El contacto por WhatsApp estará disponible muy pronto.");
      });
    }
  });

  const footerContact = document.getElementById("footerContact");
  if(footerContact && WHATSAPP_NUMBER){
    footerContact.textContent = `WhatsApp: +${WHATSAPP_NUMBER}`;
  }
}

function initNavToggle(){
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  if(!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderVehicles();
  initPhotoCarousels();
  initWhatsAppButtons();
  initNavToggle();

  const yearEl = document.getElementById("year");
  if(yearEl) yearEl.textContent = new Date().getFullYear();
});
