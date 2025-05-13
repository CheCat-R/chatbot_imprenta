const axios = require("axios");

const WHATSAPP_API_URL =
  "https://graph.facebook.com/v18.0/YOUR_PHONE_NUMBER_ID/messages";
const ACCESS_TOKEN = "YOUR_ACCESS_TOKEN";

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
            code: "es_AR", // o el que estés usando
          },
        },
      },
      {
        headers: {
          Authorization: "Bearer ${ACCESS_TOKEN}",
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Plantilla enviada: ${templateName} a ${recipientNumber}");
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
