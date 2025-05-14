const express = require("express");
const app = express();
require("dotenv").config();

const plantillaMap = require("./plantillaMap");
const { sendTemplate } = require("./sendTemplate");

app.use(express.json());

// Ruta GET para verificación del Webhook con Meta
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
    console.log("Webhook verificado correctamente");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Ruta POST del Webhook para recibir mensajes de WhatsApp
app.post("/webhook", async (req, res) => {
  console.log("Webhook recibido:", JSON.stringify(req.body, null, 2));
  const entry = req.body.entry?.[0];
  const changes = entry?.changes?.[0];
  const messages = changes?.value?.messages;

  if (!messages) return res.sendStatus(200);

  const message = messages[0];
  const from = message.from;

  // Mensaje de texto
  if (message.type === "text") {
    const text = message.text.body.toLowerCase();
    if (text.includes("hola") || text.includes("inicio")) {
      await sendTemplate(from, "menu_bienvenida01");
    }
  }

  // Mensaje de botón interactivo
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

// Ruta temporal para probar envío de plantilla manualmente
app.post("/enviar-template", async (req, res) => {
  const { numero, template } = req.body;

  if (!numero || !template) {
    return res.status(400).json({ error: "Faltan datos: numero o template" });
  }

  try {
    await sendTemplate(numero, template);
    res.json({ mensaje: "Plantilla enviada correctamente" });
  } catch (error) {
    console.error("Error en /enviar-template:", error.response?.data || error.message);
    res.status(500).json({ error: "No se pudo enviar la plantilla" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Servidor corriendo en puerto ${PORT}');
});