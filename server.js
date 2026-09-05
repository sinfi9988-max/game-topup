const express = require("express");

const app = express();

const PORT = process.env.PORT || 10000;

const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_ID = "6494822347";

app.use(express.json());


// =========================
// TEST
// =========================

app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "GAME TOP UP server is working"
  });
});


// =========================
// HEALTH
// =========================

app.get("/health", (req, res) => {
  res.json({
    ok: true
  });
});


// =========================
// SEND TELEGRAM MESSAGE
// =========================

async function sendTelegramMessage(text, keyboard = null) {

  if (!BOT_TOKEN) {
    throw new Error("BOT_TOKEN is not configured");
  }

  const body = {
    chat_id: ADMIN_ID,
    text: text,
    parse_mode: "HTML"
  };

  if (keyboard) {
    body.reply_markup = {
      inline_keyboard: keyboard
    };
  }

  const response = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(body)
    }
  );

  const data = await response.json();

  if (!data.ok) {
    throw new Error(
      data.description || "Telegram API error"
    );
  }

  return data;
}


// =========================
// CREATE ORDER
// =========================

app.post("/api/order", async (req, res) => {

  try {

    const {
      game,
      playerId,
      amount,
      price,
      paymentMethod
    } = req.body;


    if (!game) {
      return res.status(400).json({
        ok: false,
        error: "Game is required"
      });
    }


    if (!playerId) {
      return res.status(400).json({
        ok: false,
        error: "Player ID is required"
      });
    }


    if (!amount || !price) {
      return res.status(400).json({
        ok: false,
        error: "Package information is required"
      });
    }


    const orderText =
      `🛒 <b>ФАРМОИШИ НАВ</b>\n\n` +

      `🎮 <b>Бозӣ:</b> ${game}\n` +

      `🆔 <b>Player ID:</b> ${playerId}\n` +

      `💎 <b>Пакет:</b> ${amount}\n` +

      `💰 <b>Маблағ:</b> ${price} сомонӣ\n` +

      `💳 <b>Пардохт:</b> ${paymentMethod || "Alif"}\n\n` +

      `⏳ <b>Статус:</b> Интизорӣ`;


    const keyboard = [

      [
        {
          text: "✅ Тасдиқ",
          callback_data: "approve_order"
        },

        {
          text: "❌ Рад",
          callback_data: "reject_order"
        }
      ]

    ];


    await sendTelegramMessage(
      orderText,
      keyboard
    );


    res.json({
      ok: true,
      message: "Order sent to admin"
    });


  } catch (error) {

    console.error(error);

    res.status(500).json({
      ok: false,
      error: "Could not send order"
    });

  }

});


// =========================
// START SERVER
// =========================

app.listen(PORT, () => {

  console.log(
    `GAME TOP UP server running on port ${PORT}`
  );

});
