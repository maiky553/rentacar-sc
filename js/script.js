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
const WHATSAPP_NUMBER = ""; // <-- pon aquí el número cuando lo tengas

/* ----------------------------------------------------------
   2) VEHÍCULOS
   Edita, agrega o quita vehículos en esta lista.
   - image: ruta a la foto. Colócala en images/vehiculos/
            con ese mismo nombre y aparecerá automáticamente.
            Si no existe todavía, se muestra un marcador
            "Foto próximamente" en su lugar (no rompe el diseño).
   - price: escribe el texto que quieras mostrar
            (ej: "Desde 30 USD/día" o "Consultar por WhatsApp").
---------------------------------------------------------- */
const VEHICLES = [
  {
    name: "Suzuki Alto",
    type: "Carro",
    specs: ["Automático", "4 pasajeros", "Aire acondicionado"],
    price: "Consultar por WhatsApp",
    image: "images/vehiculos/suzuki-alto.jpg"
  },
  {
    name: "Kia Picanto",
    type: "Carro",
    specs: ["Automático", "4 pasajeros", "Aire acondicionado"],
    price: "Consultar por WhatsApp",
    image: "images/vehiculos/kia-picanto.jpg"
  },
  {
    name: "Geely Emgrand",
    type: "Carro",
    specs: ["Automático", "5 pasajeros", "Maletero amplio"],
    price: "Consultar por WhatsApp",
    image: "images/vehiculos/geely-emgrand.jpg"
  },
  {
    name: "Peugeot 301",
    type: "Carro",
    specs: ["Automático", "5 pasajeros", "Aire acondicionado"],
    price: "Consultar por WhatsApp",
    image: "images/vehiculos/peugeot-301.jpg"
  },
  {
    name: "Moto eléctrica",
    type: "Moto",
    specs: ["Ideal ciudad", "Bajo consumo", "1 pasajero"],
    price: "Consultar por WhatsApp",
    image: "images/vehiculos/moto-electrica.jpg"
  },
  {
    name: "Moto Suzuki",
    type: "Moto",
    specs: ["2 pasajeros", "Buen rendimiento"],
    price: "Consultar por WhatsApp",
    image: "images/vehiculos/moto-suzuki.jpg"
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

function buildVehicleCard(vehicle){
  const icon = vehicle.type.toLowerCase() === "moto" ? motoIconSVG : carIconSVG;
  const message = `Hola, me interesa rentar el ${vehicle.name} en Santiago de Cuba. ¿Está disponible?`;

  const specsHTML = vehicle.specs.map(s => `<li>${s}</li>`).join("");

  return `
    <article class="vehicle-card">
      <div class="vehicle-photo">
        <span class="vehicle-type-tag">${vehicle.type}</span>
        <img src="${vehicle.image}" alt="${vehicle.name}"
             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="photo-placeholder" style="display:none;">
          ${icon}
          <span>Foto próximamente</span>
        </div>
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
  grid.innerHTML = VEHICLES.map(buildVehicleCard).join("");
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
  initWhatsAppButtons();
  initNavToggle();

  const yearEl = document.getElementById("year");
  if(yearEl) yearEl.textContent = new Date().getFullYear();
});
