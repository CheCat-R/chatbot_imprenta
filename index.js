const express = require("express");
const app = express();
const plantillaMap = require("./plantillaMap");
const { sendTemplate } = require("./sendTemplate"); // este sería el helper para enviar mensajes

app.use(express.json());

app.post("/webhook", async (req, res) => {
  const entry = req.body.entry?.[0];
  const changes = entry?.changes?.[0];
  const messages = changes?.value?.messages;

  if (!messages) return res.sendStatus(200);

  const message = messages[0];
  const from = message.from;

  // Mensajes de texto como "hola" o "inicio"
  if (message.type === "text") {
    const text = message.text.body.toLowerCase();
    if (text.includes("hola") || text.includes("inicio")) {
      await sendTemplate(from, "menu_bienvenida01");
    }
  }

  // Botones
  if (message.type === "interactive") {
    const buttonId = message.interactive?.button_reply?.id;
    const plantilla = plantillaMap[buttonId];

    if (plantilla) {
      await sendTemplate(from, plantilla);
    } else {
      console.log("Botón no reconocido:", buttonId);
    }
  }

  res.sendStatus(200);
});
