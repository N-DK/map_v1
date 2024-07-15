import dotenv from 'dotenv';

dotenv.config();

const TYPE = {
    N: 'nodes',
    W: 'ways',
};

const URL_API = process.env.URL_API;

export { TYPE, URL_API };
