export const PYTHON_IMAGE = "python:3.8-slim";

// size of header in docker stream
// docker stream header will contain data about type of stream i.e. stdout/stderr (4 Bytes)
// and the length of data (4 Bytes)
export const DOCKER_STREAM_HEADER_SIZE = 8;