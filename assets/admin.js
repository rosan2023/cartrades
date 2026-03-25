function isLoggedIn() {
  return sessionStorage.getItem("dealer_admin_session") === "1";
}

function setLoggedIn(value) {
  if (value) {
    sessionStorage.setItem("dealer_admin_session", "1");
  } else {
    sessionStorage.removeItem("dealer_admin_session");
  }
}

function byId(id) {
  return document.getElementById(id);
}

function showLogin(loggedIn) {
  const login = byId("loginSection");
  const admin = byId("adminSection");
  if (login) login.classList.toggle("hidden", loggedIn);
  if (admin) admin.classList.toggle("hidden", !loggedIn);
}

function setupAuth() {
  const form = byId("loginForm");
  const status = byId("loginStatus");
  const logoutBtn = byId("logoutBtn");
  if (!form || !status) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const admin = readStore(STORE_KEYS.admin, defaults.admin);
    const user = byId("adminUser").value.trim();
    const pass = byId("adminPass").value.trim();
    if (user === admin.username && pass === admin.password) {
      setLoggedIn(true);
      status.textContent = "";
      showLogin(true);
      window.location.href = "admin-inventory.html";
    } else {
      status.textContent = "Invalid username or password.";
    }
  });

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      setLoggedIn(false);
      showLogin(false);
    });
  }
}

function setupGlobalLogout() {
  const logoutBtn = byId("logoutBtn");
  if (!logoutBtn) return;
  logoutBtn.addEventListener("click", () => {
    setLoggedIn(false);
    window.location.href = "admin.html";
  });
}

function guardAdminPage() {
  const isLoginPage = window.location.pathname.toLowerCase().endsWith("admin.html");
  if (!isLoginPage && !isLoggedIn()) {
    window.location.href = "admin.html";
    return false;
  }
  if (isLoginPage && isLoggedIn()) {
    showLogin(true);
  }
  return true;
}

function renderCarTable() {
  const tbody = document.querySelector("#carTable tbody");
  if (!tbody) return;
  const cars = getInventory();
  tbody.innerHTML = cars
    .map(
      (car) => `
      <tr>
        <td>${escapeHtml(car.brand)} ${escapeHtml(car.model)}</td>
        <td>${escapeHtml(car.year)}</td>
        <td>${convertPrice(car.price)}</td>
        <td><span class="tag ${car.status === "sold" ? "sold" : "available"}">${escapeHtml(car.status)}</span></td>
        <td>
          <button type="button" class="btn small" data-edit="${car.id}">Edit</button>
          <button type="button" class="btn danger small" data-delete="${car.id}">Delete</button>
          ${
            car.status === "available"
              ? `<button type="button" class="btn secondary small" data-sell="${car.id}">Mark Sold</button>`
              : ""
          }
        </td>
      </tr>
    `
    )
    .join("");
}

function clearCarForm() {
  byId("carId").value = "";
  byId("brand").value = "";
  byId("model").value = "";
  byId("year").value = "";
  byId("price").value = "";
  byId("imageUrl").value = "";
  byId("imageUrls").value = "";
  byId("engine").value = "";
  byId("transmission").value = "";
  byId("fuelType").value = "";
  byId("mileage").value = "";
  byId("color").value = "";
  byId("vin").value = "";
  byId("horsepower").value = "";
  byId("seats").value = "";
  byId("doors").value = "";
  byId("drivetrain").value = "";
  byId("features").value = "";
}

function setupCarCrud() {
  const form = byId("carForm");
  const cancelBtn = byId("cancelEditBtn");
  const table = byId("carTable");
  if (!form || !cancelBtn || !table) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const id = byId("carId").value || crypto.randomUUID();
    const cars = getInventory();
    const mainImage = byId("imageUrl").value.trim();
    const imageLines = byId("imageUrls").value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const uniqueImages = Array.from(new Set([mainImage, ...imageLines].filter(Boolean)));
    const payload = {
      id,
      brand: byId("brand").value.trim(),
      model: byId("model").value.trim(),
      year: Number(byId("year").value),
      price: Number(byId("price").value),
      imageUrl: mainImage,
      images: uniqueImages,
      engine: byId("engine").value.trim(),
      transmission: byId("transmission").value.trim(),
      fuelType: byId("fuelType").value.trim(),
      mileage: Number(byId("mileage").value),
      color: byId("color").value.trim(),
      vin: byId("vin").value.trim(),
      horsepower: Number(byId("horsepower").value),
      seats: Number(byId("seats").value),
      doors: Number(byId("doors").value),
      drivetrain: byId("drivetrain").value.trim(),
      features: byId("features").value.trim(),
      status: "available"
    };

    const idx = cars.findIndex((car) => car.id === id);
    if (idx >= 0) {
      payload.status = cars[idx].status;
      cars[idx] = payload;
    } else {
      cars.unshift(payload);
    }

    saveInventory(cars);
    clearCarForm();
    renderAllAdminData();
  });

  cancelBtn.addEventListener("click", clearCarForm);

  table.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest("button");
    if (!(button instanceof HTMLButtonElement)) return;

    const editId = button.getAttribute("data-edit");
    const deleteId = button.getAttribute("data-delete");
    const sellId = button.getAttribute("data-sell");
    const cars = getInventory();

    if (editId) {
      const car = cars.find((item) => item.id === editId);
      if (!car) return;
      byId("carId").value = car.id;
      byId("brand").value = car.brand;
      byId("model").value = car.model;
      byId("year").value = car.year;
      byId("price").value = car.price;
      byId("imageUrl").value = car.imageUrl;
      byId("imageUrls").value = (car.images || [])
        .filter((img) => img && img !== car.imageUrl)
        .join("\n");
      byId("engine").value = car.engine || "";
      byId("transmission").value = car.transmission || "";
      byId("fuelType").value = car.fuelType || "";
      byId("mileage").value = car.mileage || "";
      byId("color").value = car.color || "";
      byId("vin").value = car.vin || "";
      byId("horsepower").value = car.horsepower || "";
      byId("seats").value = car.seats || "";
      byId("doors").value = car.doors || "";
      byId("drivetrain").value = car.drivetrain || "";
      byId("features").value = car.features || "";
    }

    if (deleteId) {
      const next = cars.filter((item) => item.id !== deleteId);
      saveInventory(next);
      renderAllAdminData();
    }

    if (sellId) {
      const idx = cars.findIndex((item) => item.id === sellId);
      if (idx < 0) return;
      cars[idx].status = "sold";
      saveInventory(cars);

      const sales = getSales();
      sales.unshift({
        id: crypto.randomUUID(),
        carId: sellId,
        label: `${cars[idx].brand} ${cars[idx].model} (${cars[idx].year})`,
        price: cars[idx].price,
        soldAt: new Date().toISOString()
      });
      saveSales(sales);
      renderAllAdminData();
    }
  });
}

function setupDealerForm() {
  const form = byId("dealerForm");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const settings = getSettings();
    settings.dealerName = byId("dealerTitle").value.trim();
    settings.phone = byId("dealerPhone").value.trim();
    settings.email = byId("dealerEmail").value.trim();
    settings.address = byId("dealerAddress").value.trim();
    writeStore(STORE_KEYS.settings, settings);
    renderAllAdminData();
  });
}

function setupCurrencyForm() {
  const form = byId("currencyForm");
  const select = byId("currencyCode");
  if (!form || !select) return;

  select.innerHTML = Object.keys(CURRENCIES)
    .map((code) => `<option value="${code}">${code}</option>`)
    .join("");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const settings = getSettings();
    settings.currency = select.value;
    writeStore(STORE_KEYS.settings, settings);
    renderAllAdminData();
  });
}

function setupPasswordForm() {
  const form = byId("passwordForm");
  const status = byId("passwordStatus");
  if (!form || !status) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const admin = readStore(STORE_KEYS.admin, defaults.admin);
    const currentPassword = byId("currentPassword").value.trim();
    const newPassword = byId("newPassword").value.trim();
    const confirmPassword = byId("confirmPassword").value.trim();

    if (currentPassword !== admin.password) {
      status.textContent = "Current password is incorrect.";
      return;
    }
    if (newPassword.length < 8) {
      status.textContent = "New password must be at least 8 characters.";
      return;
    }
    if (newPassword !== confirmPassword) {
      status.textContent = "New password and confirmation do not match.";
      return;
    }
    if (newPassword === currentPassword) {
      status.textContent = "New password must be different from current password.";
      return;
    }

    writeStore(STORE_KEYS.admin, {
      username: admin.username,
      password: newPassword
    });
    form.reset();
    status.textContent = "Admin password updated successfully.";
  });
}

function renderDealerForm() {
  const settings = getSettings();
  const dealerTitle = byId("dealerTitle");
  const dealerPhone = byId("dealerPhone");
  const dealerEmail = byId("dealerEmail");
  const dealerAddress = byId("dealerAddress");
  const currencyCode = byId("currencyCode");
  if (dealerTitle) dealerTitle.value = settings.dealerName;
  if (dealerPhone) dealerPhone.value = settings.phone;
  if (dealerEmail) dealerEmail.value = settings.email;
  if (dealerAddress) dealerAddress.value = settings.address;
  if (currencyCode) currencyCode.value = settings.currency;
}

function renderMessages() {
  const list = byId("messageList");
  if (!list) return;
  const messages = getMessages();
  if (!messages.length) {
    list.innerHTML = "<p class='muted'>No messages yet.</p>";
    return;
  }

  list.innerHTML = messages
    .map(
      (msg) => `
      <div class="list-item">
        <p><strong>${escapeHtml(msg.name)}</strong> (${escapeHtml(msg.email)})</p>
        <p><strong>Contact:</strong> ${escapeHtml(msg.phone || "N/A")}</p>
        <p><strong>Car:</strong> ${escapeHtml(msg.carLabel || "General inquiry")}</p>
        <p>${escapeHtml(msg.message)}</p>
        <p class="muted">${new Date(msg.date).toLocaleString()}</p>
        <button class="btn danger small" data-message-delete="${msg.id}">Delete</button>
      </div>
    `
    )
    .join("");

  list.querySelectorAll("[data-message-delete]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-message-delete");
      const next = getMessages().filter((msg) => msg.id !== id);
      saveMessages(next);
      renderMessages();
    });
  });
}

function renderSalesReport() {
  const tbody = document.querySelector("#salesTable tbody");
  const summary = byId("monthlySummary");
  if (!tbody || !summary) return;

  const sales = getSales();
  const fromInput = byId("reportDateFrom");
  const toInput = byId("reportDateTo");
  const fromDate = fromInput && fromInput.value ? new Date(`${fromInput.value}T00:00:00`) : null;
  const toDate = toInput && toInput.value ? new Date(`${toInput.value}T23:59:59`) : null;
  const hasCustomRange = Boolean(fromDate || toDate);

  const now = new Date();
  const defaultMonth = now.getMonth();
  const defaultYear = now.getFullYear();
  const filteredSales = sales.filter((sale) => {
    const saleDate = new Date(sale.soldAt);
    if (hasCustomRange) {
      if (fromDate && saleDate < fromDate) return false;
      if (toDate && saleDate > toDate) return false;
      return true;
    }
    return saleDate.getMonth() === defaultMonth && saleDate.getFullYear() === defaultYear;
  });

  const revenue = filteredSales.reduce((sum, sale) => sum + Number(sale.price || 0), 0);
  const rangeText = hasCustomRange
    ? `${fromInput?.value || "Start"} to ${toInput?.value || "End"}`
    : `${now.toLocaleString(undefined, { month: "long" })} ${defaultYear}`;
  summary.innerHTML = `
    <p><strong>Period:</strong> ${escapeHtml(rangeText)}</p>
    <p><strong>Total sales:</strong> ${filteredSales.length}</p>
    <p><strong>Revenue:</strong> ${convertPrice(revenue)}</p>
  `;

  tbody.innerHTML = filteredSales
    .map(
      (sale) => `
      <tr>
        <td>${new Date(sale.soldAt).toLocaleDateString()}</td>
        <td>${escapeHtml(sale.label)}</td>
        <td>${convertPrice(sale.price)}</td>
      </tr>
    `
    )
    .join("");
}

function setupSalesReportControls() {
  const applyBtn = byId("applyReportFilterBtn");
  const resetBtn = byId("resetReportFilterBtn");
  const printBtn = byId("printReportBtn");
  const fromInput = byId("reportDateFrom");
  const toInput = byId("reportDateTo");
  if (!applyBtn || !resetBtn || !printBtn || !fromInput || !toInput) return;

  applyBtn.addEventListener("click", () => {
    if (fromInput.value && toInput.value && fromInput.value > toInput.value) {
      alert("Date From cannot be after Date To.");
      return;
    }
    renderSalesReport();
  });

  resetBtn.addEventListener("click", () => {
    fromInput.value = "";
    toInput.value = "";
    renderSalesReport();
  });

  printBtn.addEventListener("click", () => {
    const summaryHtml = byId("monthlySummary")?.innerHTML || "";
    const tableHtml = byId("salesTable")?.outerHTML || "";
    const dealerName = getSettings().dealerName;
    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
      <head>
        <title>Sales Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 24px; color: #111827; }
          h1 { margin-bottom: 6px; }
          table { width: 100%; border-collapse: collapse; margin-top: 14px; }
          th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
          .meta { margin: 10px 0; }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(dealerName)} - Sales Report</h1>
        <div class="meta">${summaryHtml}</div>
        ${tableHtml}
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  });
}

function renderAllAdminData() {
  renderCarTable();
  renderDealerForm();
  renderMessages();
  renderSalesReport();
}

function setupAdminSettingsSync() {
  window.addEventListener("storage", (event) => {
    if (event.key === STORE_KEYS.settings) {
      renderAllAdminData();
      if (typeof applyCompanyInfoToPage === "function") {
        applyCompanyInfoToPage();
      }
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      renderAllAdminData();
      if (typeof applyCompanyInfoToPage === "function") {
        applyCompanyInfoToPage();
      }
    }
  });
}

function bootAdmin() {
  ensureSeedData();
  if (!guardAdminPage()) return;

  if (byId("loginForm")) {
    setupAuth();
    showLogin(isLoggedIn());
    return;
  }

  setupGlobalLogout();
  setupCarCrud();
  setupDealerForm();
  setupCurrencyForm();
  setupPasswordForm();
  setupSalesReportControls();
  setupAdminSettingsSync();
  renderAllAdminData();
}

bootAdmin();
