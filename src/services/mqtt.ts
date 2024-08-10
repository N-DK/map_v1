import mqtt from 'mqtt';
import { SERVER } from '../config/config';
import loadMapData from '../utils/loadMapData';
import fs from 'fs';

class MQTTService {
    host: string; // Declare the 'host' property
    mqttClient: any; // Declare the 'mqttClient' property

    constructor(host: string) {
        this.mqttClient = null;
        this.host = host;
    }

    connect() {
        this.mqttClient = mqtt.connect(this.host, {
            username: SERVER.MQTT_USERNAME,
            password: SERVER.MQTT_PASS,
        });

        // MQTT Callback for 'error' event
        this.mqttClient.on('error', (err: any) => {
            console.log(err);
            this.mqttClient.end();
        });

        // MQTT Callback for 'connect' event
        this.mqttClient.on('connect', () => {
            console.log(`MQTT client connected`);
        });

        // Call the message callback function when message arrived
        this.mqttClient.on('message', (topic: string, message: string) => {
            const data = JSON.parse(message.toString())[0];
            const vehicles = JSON.parse(
                fs.readFileSync('./src/data.json', 'utf8'),
            );
            if (vehicles.includes(data.vid)) {
                const { lat, lng } = { lat: data.mlat, lng: data.mlng };
                loadMapData(lat, lng);
            }
        });

        this.mqttClient.on('close', () => {
            console.log(`MQTT client disconnected`);
        });
    }

    // Subscribe to MQTT Message
    subscribe(topic: string, options?: mqtt.IClientSubscribeOptions) {
        this.mqttClient.subscribe(topic, options);
    }
}

export default MQTTService;
