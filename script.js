const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand();

  try {
    tg.setHeaderColor("secondary_bg_color");
    tg.setBackgroundColor("bg_color");
  } catch (_) {}
}

// Номи корбар
const userName = document.getElementById("userName");
const userAvatar = document.getElementById("userAvatar");

if (tg?.initDataUnsafe?.user) {
  const user = tg.initDataUnsafe.user;
  const name = [user.first_name, user.last_name]
    .filter(Boolean)
    .join(" ");

  userName.textContent =
    name || user.username || "Истифодабаранда";

  if (user.photo_url) {
    const img = document.createElement("img");

    img.src = user.photo_url;
    img.alt = "User";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";
    img.style.borderRadius = "50%";

    userAvatar.replaceChildren(img);
  }
}

// Бозиҳо ва пакетҳо
const games = {
  freefire: {
    name: "Free Fire",
    unit: "Diamonds",
    currency: "💎",

    packages: [
      { amount: 100, price: 10 },
      { amount: 310, price: 25 },
      { amount: 520, price: 40 },
      { amount: 1060, price: 75 },
      { amount: 2180, price: 145 },
      { amount: 5600, price: 350 }
    ]
  },

  pubg: {
    name: "PUBG Mobile",
    unit: "UC",
    currency: "🪙",

    packages: [
      { amount: 60, price: 12 },
      { amount: 325, price: 55 },
      { amount: 660, price: 105 },
      { amount: 1800, price: 270 },
      { amount: 3850, price: 540 },
      { amount: 8100, price: 1080 }
    ]
  }
};

let selectedGame = "freefire";
let selectedPackage = games.freefire.packages[0];

// Элементҳо
const packagesEl = document.getElementById("packages");
const packageTitle = document.getElementById("packageTitle");
const currencyEl = document.getElementById("currency");
const playerIdEl = document.getElementById("playerId");

const orderGameEl = document.getElementById("orderGame");
const orderIdEl = document.getElementById("orderId");
const orderAmountEl = document.getElementById("orderAmount");
const totalPriceEl = document.getElementById("totalPrice");

const buyButton = document.getElementById("buyButton");
const modal = document.getElementById("modal");
const modalText = document.getElementById("modalText");
const closeModal = document.getElementById("closeModal");

// Вибрация
function haptic(type = "light") {
  try {
    tg?.HapticFeedback?.impactOccurred(type);
  } catch (_) {}
}

// Намоиши пакетҳо
function renderPackages() {
  const game = games[selectedGame];

  packageTitle.textContent = game.unit;
  currencyEl.textContent = game.currency;

  packagesEl.innerHTML = "";

  game.packages.forEach((item, index) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "package";

    if (index === 0) {
      button.classList.add("selected");
    }

    const amount = document.createElement("div");
    amount.className = "amount";
    amount.textContent =
      `${item.amount.toLocaleString()} ${game.currency}`;

    const price = document.createElement("div");
    price.className = "price";
    price.textContent =
      `${item.price} сомонӣ`;

    button.appendChild(amount);
    button.appendChild(price);

    button.addEventListener("click", () => {
      selectedPackage = item;

      document
        .querySelectorAll(".package")
        .forEach(p => p.classList.remove("selected"));

      button.classList.add("selected");

      updateSummary();
      haptic();
    });

    packagesEl.appendChild(button);
  });

  selectedPackage = game.packages[0];

  updateSummary();
}

// Навсозии хулоса
function updateSummary() {
  const game = games[selectedGame];

  orderGameEl.textContent = game.name;

  orderIdEl.textContent =
    playerIdEl.value.trim() || "—";

  orderAmountEl.textContent =
    `${selectedPackage.amount.toLocaleString()} ${game.currency}`;

  totalPriceEl.textContent =
    `${selectedPackage.price} сомонӣ`;
}

// Интихоби бозӣ
document.querySelectorAll(".game-card").forEach(card => {
  card.addEventListener("click", () => {

    document
      .querySelectorAll(".game-card")
      .forEach(item => item.classList.remove("active"));

    card.classList.add("active");

    selectedGame = card.dataset.game;

    renderPackages();
    haptic();
  });
});

// Player ID
playerIdEl.addEventListener("input", updateSummary);

// Тугмаи донат
buyButton.addEventListener("click", () => {

  const id = playerIdEl.value.trim();

  if (!id) {
    showAlert("Лутфан Player ID-и худро ворид кунед.");
    playerIdEl.focus();
    return;
  }

  if (id.length < 3) {
    showAlert("Player ID нодуруст менамояд.");
    playerIdEl.focus();
    return;
  }

  const game = games[selectedGame];

  modalText.textContent =
    `${game.name} • ID: ${id} • ` +
    `${selectedPackage.amount.toLocaleString()} ${game.currency} • ` +
    `${selectedPackage.price} сомонӣ`;

  modal.classList.remove("hidden");

  haptic("medium");
});

// Бастани равзана
closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

modal.addEventListener("click", event => {
  if (event.target === modal) {
    modal.classList.add("hidden");
  }
});

// Alert
function showAlert(message) {
  if (tg?.showAlert) {
    tg.showAlert(message);
  } else {
    alert(message);
  }
}

// Оғоз
renderPackages();￼Enter
