import Docker from 'dockerode';

async function createContainer(imageName:string, cmdExecutable:string[]) {
    const docker = new Docker;

    console.log('docker', docker, imageName);

    const container = await docker.createContainer({
        Image:imageName,
        Cmd: cmdExecutable,
        AttachStdin: true, // to enable i/p streams
        AttachStdout:true, // to enable o/p streams
        AttachStderr:true, // to enable error streams
        Tty:false,
        OpenStdin: true // keep the i/p stream open even no interaction is there
    });
    return container;
}
export default createContainer;