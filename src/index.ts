import bodyParser from 'body-parser';
import express, { Express } from "express";

import bullBoardAdapter from "./config/bullBoardConfig";
import logger from "./config/loggerConfig";
import serverConfig from "./config/serverConfig";
import sampleQueueProducer from "./producers/sampleQueueProducer";
import apiRouter from "./routes";
import SampleWorker from "./workers/SampleWorker";

const app: Express = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(bodyParser.text());

app.use('/api', apiRouter);
app.use('/ui', bullBoardAdapter.getRouter());

app.listen(serverConfig.PORT, () => {
    console.log(`Server started at *:${serverConfig.PORT}`);
    logger.info(`LOGGER: Server started at *:${serverConfig.PORT}`);
    console.log(`BullBoard dashboard running on: http://localhost:${serverConfig.PORT}/ui`);

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