import Docker from 'dockerode';


export default async function pullImage(imageName: string) {
    try {
        const docker = new Docker();
        return new Promise((res, rej)=>{
            docker.pull(imageName, (err: Error, stream: NodeJS.ReadableStream)=>{
                if(err) throw err;
                // since pulling docker image is a time consuming process, you can show the progrress of the pull
                docker.modem.followProgress(stream, (err, response)=> err? rej(err): res(response), (event)=>{
                    console.log(event.status);
                });
            });
        });
    } catch(error) {
        console.log(error);
    }
}