import Redis from "ioredis";

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
})

redis.on("connect", () => {
    console.log("Connected to Cache DB")
})

redis.on("error", (err) => {
    console.log("Error ocurred:", err)
})

export default redis
