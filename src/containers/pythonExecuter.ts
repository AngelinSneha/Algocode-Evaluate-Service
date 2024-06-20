// import Docker from "dockerode";

// import { TestCases } from "../types/testCases";
import CodeExecuterStrategy, { ExecutionResponse } from "../types/CodeExecuterStrategy";
import { PYTHON_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";
import { decodeDockerStream, fetchDecodedStream } from "./dockerHelper";
import pullImage from "./pullImage";

const rawLogBuffer: Buffer[] = [];

// docker for python code
class pythonExecuter implements CodeExecuterStrategy {
    async execute(code: string, inputTestCase: string): Promise<ExecutionResponse> {
        console.log('Initializing a new python docker container');
        await pullImage(PYTHON_IMAGE);
        const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > test.py && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | python3 test.py`;

        // const pythonDockerContainer = await createContainer(PYTHON_IMAGE, 
        //     ['python3', '-c', code, 'stty -echo']
        // );
        const pythonDockerContainer = await createContainer(PYTHON_IMAGE,
            ['/bin/sh', '-c', runCommand]
        );
        // starting/booting the corresponding python docker container
        await pythonDockerContainer.start();

        console.log('Started the docker container');

        const loggerStream = await pythonDockerContainer.logs({
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
        try {

            const codeResponse = await fetchDecodedStream(loggerStream, rawLogBuffer);
            return { output: codeResponse as string, status: "COMPLETED" }
        } catch (error) {

            return { output: error as string, status: "ERROR" };
        } finally {
            // remove python container
            await pythonDockerContainer.remove();
        }
    }

}

export default pythonExecuter;