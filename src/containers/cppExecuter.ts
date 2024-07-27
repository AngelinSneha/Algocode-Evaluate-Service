// import Docker from "dockerode";

// import { TestCases } from "../types/testCases";
import CodeExecuterStrategy, { ExecutionResponse } from "../types/CodeExecuterStrategy";
import { CPP_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";
import { decodeDockerStream, fetchDecodedStream } from "./dockerHelper";
import pullImage from "./pullImage";

const rawLogBuffer: Buffer[] = [];

// docker for CPP code
class cppExecuter implements CodeExecuterStrategy {
    async execute(code: string, inputTestCase: string, outputTestCase: string): Promise<ExecutionResponse> {
        console.log('Initializing a new cpp docker container', outputTestCase);
        await pullImage(CPP_IMAGE);
        // store the code in main.cpp file and compiler the code (g++ main.cpp -o main) to get byte code, now get the input test cases and then run the byte code (stdbuf -oL -eL ./main)
        // option 1: Buffer has to be flushed - stdbuf: - chnage the buffering of the ip & op, oL: sets stdout to line buffer, eL: sets stderr to line buffer
        // const runCommand= `echo '${code.replace(/'/g, `'\\"`)}' > main.cpp && g++ main.cpp -o main && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | stdbuf -oL -eL ./main`;
        // option 2: Flush buffer in code directly
        const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > main.cpp && g++ main.cpp -o main && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | ./main`;

        const cppDockerContainer = await createContainer(CPP_IMAGE,
            ['/bin/sh', '-c', runCommand]
        );
        // starting/booting the corresponding cpp docker container
        await cppDockerContainer.start();

        console.log('Started the docker container');

        const loggerStream = await cppDockerContainer.logs({
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
            return { output: codeResponse as string, status: "COMPLETED" };
        } catch (error) {

            return { output: error as string, status: "ERROR" };
        } finally {
            // remove python container
            await cppDockerContainer.remove();
        }
    }
}

export default cppExecuter;