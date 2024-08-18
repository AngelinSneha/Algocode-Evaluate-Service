import logger from "../config/loggerConfig";
import evaluationQueue from "../queues/evaluationQueue";

export default async function (payload: Record<string, unknown>) {
    logger.info('LOGGER: successfully added a new evaluation job');
    await evaluationQueue.add("EvaluationJob", payload);
}