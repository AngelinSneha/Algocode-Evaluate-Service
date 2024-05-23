import logger from "../config/loggerConfig";
import submissionQueue from "../queues/submissionQueue";

export default async function (payload: Record<string, unknown>) {
    logger.info('LOGGER: successfully added a new submission job');
    await submissionQueue.add("SubmissionJob", payload);
}