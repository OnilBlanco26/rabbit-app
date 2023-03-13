const amqp = require('amqplib');

const url1 = 'amqp://admin:admin@localhost:5672';
const url2 = 'amqp://admin:admin@localhost:5673';

const array= [url1, url2]

const consumeMessage = async () => {
    while(true) for(let i = 0; i<=array.length; i++) {
        
        try {
          // Conexión a RabbitMQ
          const connection = await amqp.connect(array[i]);
          // Crear un canal
          const channel = await connection.createChannel();
          // Declarar una cola
          const queue = 'my_queue';
          await channel.assertQueue(queue);
          // Consumir mensajes
          channel.consume(queue, (message) => {
            console.log(`Mensaje recibido: ${message.content.toString()}`);
            // Eliminar mensaje
            channel.ack(message);
          });
        } catch (error) {
          continue
          console.error(error);
        }
        };
    }

// Iniciar consumo de mensajes
consumeMessage();
