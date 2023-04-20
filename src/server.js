import express from 'express';
import http from 'http';
import dbConnection from './database/connection.js';
import config from './config/index.js';
import expressApp from './app.js';
import { CreateChannel } from './utils/messageBroker.js';
import createSocketServer from './socketio.js';
// import errorHandler from './utils/error/index.js';

const channel = await CreateChannel();
const app = await expressApp(channel);
const server = http.createServer(app);
const io = createSocketServer(server);
export { server, io };
// const startServer = async () => {
//     try {
//         // Moment().tz('Asia/Calcutta').format();
//         // moment.tz.setDefault('Asia/Calcutta');

//         //  database connection
//         // await dbConnection();

//         // const channel = await CreateChannel();
//         const channel = '';

//         const app = await expressApp(channel);
//         const server = http.createServer(app);

//         // .on('close', () => {
//         //     channel.close();
//         // });
//         // Create new socket io

//         // SOCKET.IO SERVER

//         // app.set('socketio', io);
//     } catch (error) {
//         console.log('ERROR', error);
//     }
// };

// startServer();
