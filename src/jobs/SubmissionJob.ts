import { Job } from "bullmq";

import logger from "../config/loggerConfig";
import runCPP from "../containers/runCppDocker";
import { IJob } from "../types/bullMqJobDefinition";
import { SubmissionPayload } from "../types/submissionPayload";

export default class SubmissionJob implements IJob {
    name: string;
    payload: Record<string, SubmissionPayload>;

    constructor(payload: Record<string, SubmissionPayload>) {
        this.payload = payload;
        this.name = this.constructor.name;
    }

    handle = async(job?: Job) => {
        logger.info('Handler of the job called');
        if (job) {
            const key = Object.keys(this.payload)[0];
            console.log(this.payload[key].language);
            if(this.payload[key].language == "CPP") {
                const response = await runCPP(this.payload[key].code, this.payload[key].inputCase);
                console.log("Evaluated res is ", response);
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