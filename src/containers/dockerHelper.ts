import DockerStreamOutput from "../types/dockerStreamOutput";
import { DOCKER_STREAM_HEADER_SIZE } from "../utils/constants";

// buffer stores the header and the value
export default function decodeDockerStream(buffer: Buffer): DockerStreamOutput {
    let offset = 0; // This variable keeps track of the current position in the buffer while parsing

    // The output that will store the accumulated stdout and stderr output as strings
    const output: DockerStreamOutput = {stdout: '', stderr: ''};

    // loop until offset reaches end of the buffer
    while(offset<buffer.length) {
        //  typeOfStream is read from buffer and has value of type of stream
        // header value of buffer
        const typeOfStream = buffer[offset];

        // this length variables holds the length of the value
        // we will read this variable on an offset of 4 bytes from the start of the chunk
        const length = buffer.readUint32BE(offset+4);

        // get the value of the chunk
        offset += DOCKER_STREAM_HEADER_SIZE;

        if(typeOfStream === 1) {
            // stdout stream
            output.stdout +=  buffer.toString('utf-8', offset, offset+length);
        } else if(typeOfStream === 2) {
            // stderr stream
            output.stderr +=  buffer.toString('utf-8', offset, offset+length);
        }

        offset+=length;
    }
    return output;
}