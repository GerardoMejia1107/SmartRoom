import app from './app';
import config from './config/config';
import mongoose from "mongoose";
import mqtt_client from "./mqtt/mqtt_client";

mongoose.connect(config.mongoUri).then(() => {
    console.log('Connected to MongoDB');
    app.listen(config.port, () => {
        console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
    })
}).catch((err) => {
    console.log('Failed to connect to MongoDB', err);
})


