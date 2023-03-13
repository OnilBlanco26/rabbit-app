const amqp = require("amqplib");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const url1 = "amqp://admin:admin@localhost:5672";
const url2 = "amqp://admin:admin@localhost:5673";

const array = [url1, url2];

// Configurar body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let connection = undefined;
let queue = "my_queue";
let channel = undefined;

const sendMessage = async (message) => {
  for (let u of array) {
    try {
      // Conexión a RabbitMQ

      if (connection === undefined) {
        connection = await amqp.connect(u);
        channel = await connection.createChannel();
        await channel.assertQueue(queue);
      }
      // ...
      // Crear un canal
      // Declarar una cola
      // Enviar mensaje
      channel.sendToQueue(queue, Buffer.from(message));
      console.log(`Mensaje enviado: ${message}`);
      // Cerrar conexión

      break;
    } catch (error) {
      try {
        await channel.close();
        await connection.close();
      } catch (err) {}
      connection = undefined;

      console.log("Conectando");
    }
  }
};

// Endpoint para enviar mensaje
app.post("/message", async (req, res) => {
  console.log("Mensaje enviado");
  const { message } = req.body;
  await sendMessage(message);
  res.send("Mensaje enviado a RabbitMQ");
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
  console.log("Servidor iniciado en el puerto 3000");
});
