const redis = require('redis');

const redisClient = redis.createClient({
    url: 'redis://127.0.0.1:6379'
});

(async () => {
    await redisClient.connect();  // Conectar el cliente Redis de manera asíncrona
})();

redisClient.on('connect', () => {
    console.log('Conectado a Redis');
});

redisClient.on('error', (err) => {
    console.log('Error de Redis: ', err);
});

module.exports = redisClient;
