const STORE_KEYS = {
  inventory: "dealer_inventory",
  messages: "dealer_messages",
  settings: "dealer_settings",
  sales: "dealer_sales",
  admin: "dealer_admin_user"
};

const CURRENCIES = {
  USD: { symbol: "$", rate: 0.13 },
  EUR: { symbol: "EUR ", rate: 0.11 },
  GBP: { symbol: "GBP ", rate: 0.10 },
  HKD: { symbol: "HKD ", rate: 1 },
  NGN: { symbol: "NGN ", rate: 178.94 },
  NAD: { symbol: "NAD ", rate: 2.16},
  PHP: { symbol: "PHP ", rate: 7.66}
};

const defaults = {
  inventory: [
    {
      id: crypto.randomUUID(),
      brand: "Toyota",
      model: "Camry",
      year: 2021,
      price: 24500,
      imageUrl: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80"
      ],
      engine: "2.5L 4-Cylinder",
      transmission: "Automatic",
      fuelType: "Petrol",
      mileage: 42000,
      color: "Silver",
      vin: "JTDB11HK1M3000001",
      horsepower: 203,
      seats: 5,
      doors: 4,
      drivetrain: "FWD",
      features: "Reverse Camera, Bluetooth, Cruise Control",
      status: "available"
    },
    {
      id: crypto.randomUUID(),
      brand: "Honda",
      model: "Civic",
      year: 2020,
      price: 19800,
      imageUrl: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80"
      ],
      engine: "2.0L 4-Cylinder",
      transmission: "CVT",
      fuelType: "Petrol",
      mileage: 51000,
      color: "Black",
      vin: "2HGFC2F69LH000002",
      horsepower: 158,
      seats: 5,
      doors: 4,
      drivetrain: "FWD",
      features: "Apple CarPlay, Lane Assist, Keyless Entry",
      status: "available"
    },
    {
      id: crypto.randomUUID(),
      brand: "BMW",
      model: "X5",
      year: 2022,
      price: 55900,
      imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80",
      images: [
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1486496572940-2bb2341fdbdf?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80"
      ],
      engine: "3.0L Turbo",
      transmission: "Automatic",
      fuelType: "Petrol",
      mileage: 26000,
      color: "White",
      vin: "5UXCR6C04N9A00003",
      horsepower: 335,
      seats: 5,
      doors: 5,
      drivetrain: "AWD",
      features: "Panoramic Roof, Parking Sensors, Navigation",
      status: "available"
    }
  ],
  settings: {
    dealerName: "AK MOTORS",
    phone: "+852 91054784",
    email: "akmotorsbs@gmail.com",
    address: "2794 Wing Ning Lei, Wang Toi Shan, Pat Heung, Kam Tin, Yuen Long, New Territory, Hong Kong",
    currency: "HKD"
  },
  messages: [],
  sales: [],
  admin: {
    username: "admin",
    password: "admin123"
  }
};

function readStore(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
}

function writeStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function ensureSeedData() {
  if (!localStorage.getItem(STORE_KEYS.inventory)) {
    writeStore(STORE_KEYS.inventory, defaults.inventory);
  }
  if (!localStorage.getItem(STORE_KEYS.settings)) {
    writeStore(STORE_KEYS.settings, defaults.settings);
  }
  if (!localStorage.getItem(STORE_KEYS.messages)) {
    writeStore(STORE_KEYS.messages, defaults.messages);
  }
  if (!localStorage.getItem(STORE_KEYS.sales)) {
    writeStore(STORE_KEYS.sales, defaults.sales);
  }
  if (!localStorage.getItem(STORE_KEYS.admin)) {
    writeStore(STORE_KEYS.admin, defaults.admin);
  }
}

function getSettings() {
  return readStore(STORE_KEYS.settings, defaults.settings);
}

function getInventory() {
  return readStore(STORE_KEYS.inventory).map((car) => ({
    ...car,
    images: Array.isArray(car.images) && car.images.length
      ? car.images.filter(Boolean)
      : [car.imageUrl].filter(Boolean),
    imageUrl: car.imageUrl || (Array.isArray(car.images) && car.images[0]) || "",
    engine: car.engine || "N/A",
    transmission: car.transmission || "N/A",
    fuelType: car.fuelType || "N/A",
    mileage: Number(car.mileage || 0),
    color: car.color || "N/A",
    vin: car.vin || "N/A",
    horsepower: Number(car.horsepower || 0),
    seats: Number(car.seats || 0),
    doors: Number(car.doors || 0),
    drivetrain: car.drivetrain || "N/A",
    features: car.features || ""
  }));
}

function saveInventory(cars) {
  writeStore(STORE_KEYS.inventory, cars);
}

function getMessages() {
  return readStore(STORE_KEYS.messages, defaults.messages);
}

function saveMessages(messages) {
  writeStore(STORE_KEYS.messages, messages);
}

function getSales() {
  return readStore(STORE_KEYS.sales, defaults.sales);
}

function saveSales(sales) {
  writeStore(STORE_KEYS.sales, sales);
}

function convertPrice(priceUsd) {
  const settings = getSettings();
  const currency = CURRENCIES[settings.currency] || CURRENCIES.USD;
  const converted = priceUsd * currency.rate;
  return `${currency.symbol}${converted.toLocaleString(undefined, {
    maximumFractionDigits: 2
  })}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

function applyCompanyInfoToPage() {
  const settings = getSettings();
  const dealerName = document.getElementById("dealerName");
  if (dealerName) {
    dealerName.textContent = settings.dealerName;
  }

  document.querySelectorAll("[data-dealer-name]").forEach((element) => {
    element.textContent = settings.dealerName;
  });
}

function renderPublicContact() {
  const settings = getSettings();
  const contact = document.getElementById("dealerContactInfo");
  const footer = document.getElementById("footerDealerText");
  applyCompanyInfoToPage();
  if (!contact || !footer) return;
  contact.innerHTML = `
    <p><strong>${escapeHtml(settings.dealerName)}</strong></p>
    <p>Phone: ${escapeHtml(settings.phone)}</p>
    <p>Email: ${escapeHtml(settings.email)}</p>
    <p>Address: ${escapeHtml(settings.address)}</p>
  `;
  footer.textContent = `${settings.dealerName} | ${settings.phone} | ${settings.email}`;
}

function renderInventory(query = "") {
  const grid = document.getElementById("inventoryGrid");
  const empty = document.getElementById("inventoryEmpty");
  if (!grid || !empty) return;

  const q = query.trim().toLowerCase();
  const cars = getInventory().filter((car) => {
    if (car.status !== "available") return false;
    const hay = `${car.brand} ${car.model} ${car.year}`.toLowerCase();
    return hay.includes(q);
  });

  grid.innerHTML = cars
    .map(
      (car) => `
      <article class="car-card">
        <a href="car-detail.html?id=${encodeURIComponent(car.id)}">
          <img src="${escapeHtml((car.images && car.images[0]) || car.imageUrl)}" alt="${escapeHtml(car.brand)} ${escapeHtml(car.model)}" />
        </a>
        <div class="car-body">
          <h4>
            <a href="car-detail.html?id=${encodeURIComponent(car.id)}">
              ${escapeHtml(car.brand)} ${escapeHtml(car.model)}
            </a>
          </h4>
          <p>Year: ${escapeHtml(car.year)}</p>
          <p>Price: <strong>${convertPrice(car.price)}</strong></p>
          <span class="tag available">Available</span>
          <p><a class="btn small" href="car-detail.html?id=${encodeURIComponent(car.id)}">View Details</a></p>
        </div>
      </article>
    `
    )
    .join("");

  empty.classList.toggle("hidden", cars.length > 0);
}

function setupMessageForm() {
  const form = document.getElementById("messageForm");
  const status = document.getElementById("messageStatus");
  if (!form || !status) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const entry = {
      id: crypto.randomUUID(),
      name: document.getElementById("senderName").value.trim(),
      email: document.getElementById("senderEmail").value.trim(),
      phone: document.getElementById("senderPhone").value.trim(),
      message: document.getElementById("senderMessage").value.trim(),
      carId: form.getAttribute("data-car-id") || "",
      carLabel: form.getAttribute("data-car-label") || "",
      date: new Date().toISOString()
    };

    const messages = getMessages();
    messages.unshift(entry);
    saveMessages(messages);
    form.reset();
    status.textContent = "Message sent successfully.";
  });
}

function getCarFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const carId = params.get("id");
  if (!carId) return null;
  return getInventory().find((car) => car.id === carId) || null;
}

function renderCarDetailPage() {
  const card = document.getElementById("carDetailCard");
  const form = document.getElementById("messageForm");
  if (!card || !form) return;

  const car = getCarFromQuery();
  if (!car) {
    card.innerHTML = "<p class='muted'>Car not found.</p>";
    return;
  }

  const label = `${car.brand} ${car.model} (${car.year})`;
  const gallery = (car.images && car.images.length ? car.images : [car.imageUrl]).filter(Boolean);
  const mainImage = gallery[0] || car.imageUrl;
  form.setAttribute("data-car-id", car.id);
  form.setAttribute("data-car-label", label);
  const textArea = document.getElementById("senderMessage");
  if (textArea && !textArea.value) {
    textArea.value = `I am interested in ${label}.`;
  }

  card.innerHTML = `
    <article class="detail-card">
      <div class="detail-gallery">
        <img id="detailMainImage" class="detail-main-image" src="${escapeHtml(mainImage)}" alt="${escapeHtml(label)}" />
        <div class="detail-thumbs">
          ${gallery
            .map(
              (img, index) => `
                <button class="thumb-btn ${index === 0 ? "active" : ""}" type="button" data-image="${escapeHtml(img)}">
                  <img src="${escapeHtml(img)}" alt="${escapeHtml(label)} view ${index + 1}" />
                </button>
              `
            )
            .join("")}
        </div>
      </div>
      <div class="car-body detail-content">
        <h3>${escapeHtml(car.brand)} ${escapeHtml(car.model)}</h3>
        <div class="spec-grid">
          <p><strong>Year:</strong> ${escapeHtml(car.year)}</p>
          <p><strong>Price:</strong> ${convertPrice(car.price)}</p>
          <p><strong>Status:</strong> ${escapeHtml(car.status)}</p>
          <p><strong>Engine:</strong> ${escapeHtml(car.engine)}</p>
          <p><strong>Transmission:</strong> ${escapeHtml(car.transmission)}</p>
          <p><strong>Fuel Type:</strong> ${escapeHtml(car.fuelType)}</p>
          <p><strong>Mileage:</strong> ${escapeHtml(car.mileage)} km</p>
          <p><strong>Color:</strong> ${escapeHtml(car.color)}</p>
          <p><strong>VIN:</strong> ${escapeHtml(car.vin)}</p>
          <p><strong>Horsepower:</strong> ${escapeHtml(car.horsepower)} hp</p>
          <p><strong>Seats:</strong> ${escapeHtml(car.seats)}</p>
          <p><strong>Doors:</strong> ${escapeHtml(car.doors)}</p>
          <p><strong>Drivetrain:</strong> ${escapeHtml(car.drivetrain)}</p>
        </div>
        <h4>Full Specifications</h4>
        <p><strong>Features:</strong> ${escapeHtml(car.features || "N/A")}</p>
      </div>
    </article>
  `;

  const main = document.getElementById("detailMainImage");
  const thumbs = card.querySelectorAll(".thumb-btn");
  thumbs.forEach((btn) => {
    btn.addEventListener("click", () => {
      const image = btn.getAttribute("data-image");
      if (main && image) {
        main.src = image;
      }
      thumbs.forEach((item) => item.classList.remove("active"));
      btn.classList.add("active");
    });
  });
}

function setupSearch() {
  const input = document.getElementById("searchInput");
  if (!input) return;
  input.addEventListener("input", () => renderInventory(input.value));
}

function refreshPageFromSettings() {
  applyCompanyInfoToPage();
  renderPublicContact();
  const searchInput = document.getElementById("searchInput");
  renderInventory(searchInput ? searchInput.value : "");
  renderCarDetailPage();
}

function setupSettingsSync() {
  window.addEventListener("storage", (event) => {
    if (event.key === STORE_KEYS.settings) {
      refreshPageFromSettings();
    }
  });

  // Handles cases where this tab regains focus after updates elsewhere.
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      refreshPageFromSettings();
    }
  });
}

function bootPublicPage() {
  ensureSeedData();
  applyCompanyInfoToPage();
  renderPublicContact();
  renderInventory();
  renderCarDetailPage();
  setupSearch();
  setupMessageForm();
  setupSettingsSync();
}

bootPublicPage();
