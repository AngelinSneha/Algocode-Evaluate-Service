// import Docker from "dockerode";

// import { TestCases } from "../types/testCases";
import CodeExecuterStrategy, { ExecutionResponse } from "../types/CodeExecuterStrategy";
import { JAVA_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";
import { decodeDockerStream, fetchDecodedStream } from "./dockerHelper";
import pullImage from "./pullImage";

const rawLogBuffer: Buffer[] = [];


// docker for Java code
class javaExecuter implements CodeExecuterStrategy {
    async execute(code: string, inputTestCase: string): Promise<ExecutionResponse> {
        console.log('Initializing a new java docker container');
        await pullImage(JAVA_IMAGE);
        // store the code in Main.java file and compiler the code (javac Main.java) to get byte code, now get the input test cases and then run the byte code (java Main)
        const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > Main.java && javac Main.java && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | java Main`;

        const javaDockerContainer = await createContainer(JAVA_IMAGE,
            ['/bin/sh', '-c', runCommand]
        );
        // starting/booting the corresponding java docker container
        await javaDockerContainer.start();

        console.log('Started the docker container');

        const loggerStream = await javaDockerContainer.logs({
            stdout: true,
            stderr: true,
            timestamps: false,
            follow: true // whether the logs are streamed or returned as a string
        });

        // attach events on the stream objects to start and stop reading
        // streams help us to read these logs chunk by cunk in form of Bytes
        //  type of these Bytes is Buffer
        loggerStream.on('data', (chunk) => {
            rawLogBuffer.push(chunk);
        });
        loggerStream.on('end', () => {
            console.log('end: ', rawLogBuffer);
            // concat all chunks in buffer array
            const completeBuffer = Buffer.concat(rawLogBuffer);
            const decodedStream = decodeDockerStream(completeBuffer);
            console.log(decodedStream);
        });

        try {
            const codeResponse = await fetchDecodedStream(loggerStream, rawLogBuffer);
            return { output: codeResponse as string, status: "COMPLETED" }
        } catch (error) {

            return { output: error as string, status: "ERROR" };
        } finally {
            // remove java container
            await javaDockerContainer.remove();
        }
    }
}


export default javaExecuter;