import dotenv from 'dotenv';

dotenv.config();

export const DEVELOPMENT = process.env.NODE_ENV === 'development';
export const TEST = process.env.NODE_ENV === 'test';

export const PORT = process.env.PORT || 3000;
export const HOSTNAME = process.env.HOSTNAME || 'localhost';
export const REDIS_PORT = process.env.REDIS_PORT || 6379;
export const POSTGRES_CONNECT_URI = process.env.POSTGRES_CONNECT_URI || '';
export const MQTT_HOST = process.env.MQTT_HOST || 'mqtt://localhost';
export const MQTT_USERNAME = process.env.MQTT_USERNAME || '';
export const MQTT_PASS = process.env.MQTT_PASS || '';

export const SERVER = {
    PORT,
    HOSTNAME,
    REDIS_PORT,
    POSTGRES_CONNECT_URI,
    MQTT_HOST,
    MQTT_PASS,
    MQTT_USERNAME,
};
