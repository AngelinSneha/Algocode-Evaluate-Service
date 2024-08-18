import DockerStreamOutput from "../types/dockerStreamOutput";
import { DOCKER_STREAM_HEADER_SIZE } from "../utils/constants";

// buffer stores the header and the value
function decodeDockerStream(buffer: Buffer): DockerStreamOutput {
    let offset = 0; // This variable keeps track of the current position in the buffer while parsing

    // The output that will store the accumulated stdout and stderr output as strings
    const output: DockerStreamOutput = { stdout: '', stderr: '' };

    // loop until offset reaches end of the buffer
    while (offset < buffer.length) {
        //  typeOfStream is read from buffer and has value of type of stream
        // header value of buffer
        const typeOfStream = buffer[offset];

        // this length variables holds the length of the value
        // we will read this variable on an offset of 4 bytes from the start of the chunk
        const length = buffer.readUint32BE(offset + 4);

        // get the value of the chunk
        offset += DOCKER_STREAM_HEADER_SIZE;

        if (typeOfStream === 1) {
            // stdout stream
            output.stdout += buffer.toString('utf-8', offset, offset + length);
        } else if (typeOfStream === 2) {
            // stderr stream
            output.stderr += buffer.toString('utf-8', offset, offset + length);
        }

        offset += length;
    }
    return output;
}
async function fetchDecodedStream(loggerStream: NodeJS.ReadableStream, rawLogBuffer: Buffer[]): Promise<string> {

    return await new Promise((res, rej) => {
        const timeout = setTimeout(() => {
            console.log("Timeout Called");
            rej('Time Limit Exceeded');
        }, 2000); //take time limit for each language
        loggerStream.on('end', () => {
            console.log('end: ', rawLogBuffer);
            // concat all chunks in buffer array
            clearTimeout(timeout)
            const completeBuffer = Buffer.concat(rawLogBuffer);
            const decodedStream = decodeDockerStream(completeBuffer);
            console.log(decodedStream);
            console.log(decodedStream.stdout);
            if (decodedStream.stderr) {
                rej(decodedStream.stderr);
            } else
                res(decodedStream.stdout);
        });
    });
}
export {
    decodeDockerStream,
    fetchDecodedStream
};