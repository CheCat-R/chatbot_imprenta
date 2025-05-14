const axios = require("axios");
require("dotenv").config();

const WHATSAPP_API_URL = `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`;
const ACCESS_TOKEN = process.env.WHATSAPP_TOKEN;

async function sendTemplate(recipientNumber, templateName) {
  try {
    const response = await axios.post(
      WHATSAPP_API_URL,
      {
        messaging_product: "whatsapp",
        to: recipientNumber,
        type: "template",
        template: {
          name: templateName,
          language: {
            code: "es_AR", // Cambiar si el idioma del template es diferente
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`Plantilla enviada: ${templateName} a ${recipientNumber}`);
  } catch (error) {
    console.error(
      "Error enviando plantilla:",
      error.response?.data || error.message
    );
  }
}

module.exports = {
  sendTemplate,
};