import bodyParser from 'body-parser';
import express, { Express } from "express";

import bullBoardAdapter from "./config/bullBoardConfig";
import logger from "./config/loggerConfig";
import serverConfig from "./config/serverConfig";
import submissionQueueProducer from './producers/submissionQueueProducer';
import apiRouter from "./routes";
import { submission_queue } from './utils/constants';
import SampleWorker from "./workers/SampleWorker";
import SubmissionWorker from './workers/SubmissionWorker';

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
    SubmissionWorker(submission_queue);

    //sample jobs - producer
    // sampleQueueProducer('SampleJob', {
    //     name: "Demo 1",
    //     working: true
    // }, 2);
    // sampleQueueProducer('SampleJob', {
    //     name: "Demo 2",
    //     working: false
    // }, 1);

// sample input python
//     const code = `x = input()
// print("value of x is", x)
// for i in range(int(x)):
//     print(i)
// `;

// sample input java
// const code = `
// import java.util.*;
// public class Main {
//     public static void main(String[] args) {
//         Scanner sc = new Scanner(System.in);
//         int input = sc.nextInt();
//         System.out.println("Input value given by the user: " + input);
//         for(int i = 0; i < input; i++) {
//             System.out.println(i);
//         }
//     }
// }
// `;

// sample input CPP
const code = `
#include<iostream>
using namespace std;

int main() {
    int x;
    cin>>x;
    cout<<"Input value given by the user is "<<x<<endl;
    for(int i = 0; i < x; i++) {
        cout<<i << " ";
    }
    cout<<endl;
    return 0;
}
`;
//     runCPP(code, "100");


submissionQueueProducer({"1234":{
    "language":"CPP",
    "inputCase":"10",
    code
}});
});