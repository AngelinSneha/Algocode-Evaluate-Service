import sampleQueue from "../queues/sampleQueue";

export default async function (name: string, payload: Record<string, unknown>, priority: number) {
    console.log('successfully added a new job');
    await sampleQueue.add(name, payload, { priority });
}