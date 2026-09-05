const tg =
  window.Telegram && window.Telegram.WebApp
    ? window.Telegram.WebApp
    : null;

if (tg) {
  tg.ready();
  tg.expand();
}


/* =========================
   БОЗИҲО ВА ПАКЕТҲО
========================= */

const games = {

  freefire: {
    name: "Free Fire",
    unit: "Diamonds",
    icon: "💎",

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
    icon: "🪙",

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


/* =========================
   ҲОЛАТ
========================= */

let selectedGame = "freefire";
let selectedPackage = games.freefire.packages[0];


/* =========================
   ELEMENTҲО
========================= */

const userName =
  document.getElementById("userName");

const userAvatar =
  document.getElementById("userAvatar");

const packagesEl =
  document.getElementById("packages");

const packageTitle =
  document.getElementById("packageTitle");

const packageIcon =
  document.getElementById("packageIcon");

const playerIdEl =
  document.getElementById("playerId");

const orderGameEl =
  document.getElementById("orderGame");

const orderIdEl =
  document.getElementById("orderId");

const orderAmountEl =
  document.getElementById("orderAmount");

const totalPriceEl =
  document.getElementById("totalPrice");

const buyButton =
  document.getElementById("buyButton");

const modal =
  document.getElementById("modal");

const closeModal =
  document.getElementById("closeModal");

const paidButton =
  document.getElementById("paidButton");

const paymentAmount =
  document.getElementById("paymentAmount");

const paymentGame =
  document.getElementById("paymentGame");

const paymentPlayerId =
  document.getElementById("paymentPlayerId");

const successModal =
  document.getElementById("successModal");

const successClose =
  document.getElementById("successClose");


/* =========================
   HAPTIC
========================= */

function haptic(type = "light") {

  try {

    if (
      tg &&
      tg.HapticFeedback
    ) {

      tg.HapticFeedback.impactOccurred(type);

    }

  } catch (error) {}

}


/* =========================
   ALERT
========================= */

function showAlert(message) {

  if (
    tg &&
    typeof tg.showAlert === "function"
  ) {

    tg.showAlert(message);

  } else {

    alert(message);

  }

}


/* =========================
   USER
========================= */

function updateUser() {

  if (
    !tg ||
    !tg.initDataUnsafe ||
    !tg.initDataUnsafe.user
  ) {

    return;

  }

  const user =
    tg.initDataUnsafe.user;

  const name = [
    user.first_name,
    user.last_name
  ]
    .filter(Boolean)
    .join(" ");

  userName.textContent =
    name ||
    user.username ||
    "Истифодабаранда";


  if (user.photo_url) {

    const img =
      document.createElement("img");

    img.src =
      user.photo_url;

    img.alt =
      "User";

    userAvatar.innerHTML =
      "";

    userAvatar.appendChild(img);

  }

}


/* =========================
   ХУЛОСА
========================= */

function updateSummary() {

  const game =
    games[selectedGame];

  const id =
    playerIdEl.value.trim();


  orderGameEl.textContent =
    game.name;


  orderIdEl.textContent =
    id || "—";


  orderAmountEl.textContent =
    `${selectedPackage.amount.toLocaleString()} ${game.icon}`;


  totalPriceEl.textContent =
    `${selectedPackage.price} сомонӣ`;

}


/* =========================
   ПАКЕТҲО
========================= */

function renderPackages() {

  const game =
    games[selectedGame];


  packageTitle.textContent =
    game.unit;


  packageIcon.textContent =
    game.icon;


  packagesEl.innerHTML =
    "";


  selectedPackage =
    game.packages[0];


  game.packages.forEach(
    (item, index) => {

      const button =
        document.createElement("button");

      button.type =
        "button";

      button.className =
        "package";


      if (index === 0) {

        button.classList.add(
          "selected"
        );

      }


      const amount =
        document.createElement("div");

      amount.className =
        "amount";

      amount.textContent =
        `${item.amount.toLocaleString()} ${game.icon}`;


      const price =
        document.createElement("div");

      price.className =
        "price";

      price.textContent =
        `${item.price} сомонӣ`;


      button.appendChild(amount);
      button.appendChild(price);


      button.addEventListener(
        "click",
        function () {

          selectedPackage =
            item;


          document
            .querySelectorAll(".package")
            .forEach(
              function (element) {

                element.classList.remove(
                  "selected"
                );

              }
            );


          button.classList.add(
            "selected"
          );


          updateSummary();

          haptic();

        }
      );


      packagesEl.appendChild(
        button
      );

    }
  );


  updateSummary();

}


/* =========================
   ИНТИХОБИ БОЗӢ
========================= */

document
  .querySelectorAll(".game-card")
  .forEach(
    function (card) {

      card.addEventListener(
        "click",
        function () {

          document
            .querySelectorAll(".game-card")
            .forEach(
              function (item) {

                item.classList.remove(
                  "active"
                );

              }
            );


          card.classList.add(
            "active"
          );


          selectedGame =
            card.dataset.game;


          renderPackages();

          haptic();

        }
      );

    }
  );


/* =========================
   PLAYER ID
========================= */

playerIdEl.addEventListener(
  "input",
  function () {

    updateSummary();

  }
);


/* =========================
   ДОНАТ
========================= */

buyButton.addEventListener(
  "click",
  function () {

    const id =
      playerIdEl.value.trim();


    if (!id) {

      showAlert(
        "Лутфан Player ID-и худро ворид кунед."
      );

      playerIdEl.focus();

      return;

    }


    if (id.length < 3) {

      showAlert(
        "Player ID нодуруст менамояд."
      );

      playerIdEl.focus();

      return;

    }


    const game =
      games[selectedGame];


    paymentAmount.textContent =
      `${selectedPackage.price} сомонӣ`;


    paymentGame.textContent =
      game.name;


    paymentPlayerId.textContent =
      id;


    modal.classList.remove(
      "hidden"
    );


    haptic("medium");

  }
);


/* =========================
   МАН ПАРДОХТ КАРДАМ
========================= */

paidButton.addEventListener(
  "click",
  function () {

    const id =
      playerIdEl.value.trim();

    const game =
      games[selectedGame];


    if (!id) {

      showAlert(
        "Player ID ворид нашудааст."
      );

      return;

    }


    /*
      Ҳоло бот пайваст нест.
      Фармоиш танҳо дар интерфейс
      ҳамчун қабулшуда нишон дода мешавад.
    */


    modal.classList.add(
      "hidden"
    );


    successModal.classList.remove(
      "hidden"
    );


    haptic("success");

  }
);


/* =========================
   БАСТАНИ PAYMENT MODAL
========================= */

closeModal.addEventListener(
  "click",
  function () {

    modal.classList.add(
      "hidden"
    );

  }
);


/* =========================
   БАСТАНИ SUCCESS MODAL
========================= */

successClose.addEventListener(
  "click",
  function () {

    successModal.classList.add(
      "hidden"
    );

  }
);


/* =========================
   БЕРУН АЗ MODAL
========================= */

modal.addEventListener(
  "click",
  function (event) {

    if (
      event.target === modal
    ) {

      modal.classList.add(
        "hidden"
      );

    }

  }
);


successModal.addEventListener(
  "click",
  function (event) {

    if (
      event.target === successModal
    ) {

      successModal.classList.add(
        "hidden"
      );

    }

  }
);


/* =========================
   ОҒОЗ
========================= */

updateUser();

renderPackages()￼Enter
