import config from './config/index.js';
import { server } from './server.js';

try {
    server
        .listen(config.app.port, () => {
            console.log(
                `[${config.app.name}] listening to port ${config.app.port}`,
            );
            // console.log('process.env', process.env);
        })
        .on('error', (err) => {
            console.log(err);
            process.exit();
        });
    if (!server) {
        console.log('Error creating server object');
        process.exit(1);
    }
} catch (error) {
    console.log('Error at startServer', error);
}
