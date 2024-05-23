import { Job, Worker } from 'bullmq';

import logger from '../config/loggerConfig';
import redisConnection from '../config/redisConfig';
import SubmissionJob from '../jobs/SubmissionJob';

export default function SubmissionWorker(queueName: string) {
    new Worker(
        queueName,
        async (job: Job) => {
            logger.info('Submission Job worker called');
            if (job.name == "SubmissionJob") {
                const submissionJobInstance = new SubmissionJob(job.data);

                submissionJobInstance.handle(job);

                return true;
            }
        }, { connection: redisConnection });
}