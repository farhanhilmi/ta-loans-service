import amqplib from 'amqplib';
import config from '../config/index.js';

//Message Broker
export const CreateChannel = async () => {
    try {
        const connection = await amqplib.connect(config.RABBITMQ.URL);
        connection.on('error', function (err) {
            console.log('amqp connection error');
            throw new Error(err);
        });
        const channel = await connection.createChannel();
        await channel.assertQueue(config.RABBITMQ.EXCHANGE_NAME, 'direct', {
            durable: true,
        });
        return channel;
    } catch (error) {
        throw error;
    }
};

export const PublishMessage = (channel, service, msg) => {
    try {
        channel.publish(
            config.RABBITMQ.EXCHANGE_NAME,
            service,
            Buffer.from(msg),
        );
        console.log('Sent: ', msg);
    } catch (error) {
        throw error;
    }
};

export const SubscribeMessage = async (channel, subscribeEvents) => {
    try {
        await channel.assertExchange(config.RABBITMQ.EXCHANGE_NAME, 'direct', {
            durable: true,
        });
        const q = await channel.assertQueue('', { exclusive: true });
        console.log(`Waiting for messages in queue: ${q.queue}`);

        channel.bindQueue(
            q.queue,
            config.RABBITMQ.EXCHANGE_NAME,
            config.RABBITMQ.CHANNEL.AUTH_SERVICE,
        );

        channel.consume(
            q.queue,
            (msg) => {
                if (msg.content) {
                    console.log('the message is:', msg.content.toString());
                    subscribeEvents(msg.content.toString());
                }
                console.log('[X] received');
            },
            {
                noAck: true,
            },
        );
    } catch (error) {
        throw error;
    }
};
