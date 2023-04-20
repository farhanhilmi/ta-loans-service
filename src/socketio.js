import { Server as Socket } from 'socket.io';

const createSocketServer = (server) => {
    const io = new Socket(server);
    io.on('connection', (socket) => {
        try {
            console.log('MASUKKK');
            console.log(`A user connected with socket ID: ${socket.id}`);

            socket.on('disconnect', () => {
                if (socket.conn) {
                    console.log(
                        `A user disconnected with socket ID: ${socket.id}`,
                    );
                } else {
                    console.log('A socket disconnected before connecting');
                }
            });

            // Listen for messages from the client
            socket.on('message', (data) => {
                console.log(`Received message from client: ${data}`);
            });

            // sendDataToClient((data) => {
            //     console.log('sending data to client');
            //     socket.emit('notification', data);
            // });

            socket.on('user login', (data) => {
                console.log('user login', data);
                const socketid = data.userId;
                // Send a message to the client
                socket.emit('notification', `Hello, client! ${socketid}`);
                // socket.broadcast.to(socket.id).emit('user login', 'hello');
            });
        } catch (error) {
            console.log('Error at socket io', error);
        }
    });

    return io;
};

export default createSocketServer;
