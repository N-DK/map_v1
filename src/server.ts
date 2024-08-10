import express from 'express';
import route from './routes';
import redisClient from './services/redis';
import { initializeDB } from './config/db/executor';
import { SERVER } from './config/config';
import bodyParser from 'body-parser';
import MQTTService from './services/mqtt';
import loadMapData from './utils/loadMapData';

const app = express();
const port = SERVER.PORT || 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Connect Redis && PostgreSQL
const connect = async () => {
    try {
        await initializeDB();
        await redisClient.connect();
    } catch (error) {
        console.log(error);
    }
};

connect();

const mqtt = new MQTTService(SERVER.MQTT_HOST);
mqtt.connect();

route(app);

app.listen(port, () => {
    console.log(
        `Server is running on http://${SERVER.HOSTNAME}:${SERVER.PORT}`,
    );
    mqtt.subscribe('live/status');
});
