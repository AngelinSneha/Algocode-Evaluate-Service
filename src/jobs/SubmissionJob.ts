import { Job } from "bullmq";

import logger from "../config/loggerConfig";
import { IJob } from "../types/bullMqJobDefinition";
import { ExecutionResponse } from "../types/CodeExecuterStrategy";
import { SubmissionPayload } from "../types/submissionPayload";
import createExecuter from "../utils/ExecuterFactory";

export default class SubmissionJob implements IJob {
    name: string;
    payload: Record<string, SubmissionPayload>;

    constructor(payload: Record<string, SubmissionPayload>) {
        this.payload = payload;
        this.name = this.constructor.name;
    }

    handle = async (job?: Job) => {
        logger.info('Handler of the job called');
        if (job) {
            const key = Object.keys(this.payload)[0];
            const codeLanguage = (this.payload[key].language);
            const code = this.payload[key].code;
            const inputTestCase = this.payload[key].inputCase;
            const outputTestCase = this.payload[key].outputCase;

            const strategy = createExecuter(codeLanguage?.toUpperCase());
            if (strategy !== null) {
                const response: ExecutionResponse = await strategy.execute(code, inputTestCase, outputTestCase);
                if (response.status === "COMPLETED") {
                    console.log("Code Executed Successfully", response);
                } else {
                    console.log("Something went wrong with code execution", response);
                    logger.error("Something went wrong with code execution");
                }
            }
        }
    };

    failed = (job?: Job) => {
        console.log('Job failed');
        if (job) {
            console.log(job.id);
        }
    };
}