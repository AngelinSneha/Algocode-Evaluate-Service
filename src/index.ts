import express, { Express } from "express";

import logger from "./config/loggerConfig";
import serverConfig from "./config/serverConfig";
import sampleQueueProducer from "./producers/sampleQueueProducer";
import apiRouter from "./routes";
import SampleWorker from "./workers/SampleWorker";

const app: Express = express();

app.use('/api', apiRouter);

app.listen(serverConfig.PORT, () => {
    console.log(`Server started at *:${serverConfig.PORT}`);
    logger.info(`LOGGER: Server started at *:${serverConfig.PORT}`);

    // consumer/worker calling the job
    SampleWorker('SampleQueue');

    //sample jobs - producer
    sampleQueueProducer('SampleJob', {
        name: "Demo 1",
        working: true
    }, 2);
    sampleQueueProducer('SampleJob', {
        name: "Demo 2",
        working: false
    }, 1);
});