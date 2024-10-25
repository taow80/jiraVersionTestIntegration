const core = require('@actions/core');
const exec = require('@actions/exec');

const getCommits = async () => {
    const releaseVersion = process.argv[2];

    let myOutput = '';
    let myError = '';

    const options = {
        silent: true,
        listeners: {
    stdout: (data) => {
        myOutput += data.toString();
    },
    stderr: (data) => {
        myError += data.toString();
    }
    }
};

    await exec.exec('git', ['log', `--pretty=format:%s`, `HEAD...${releaseVersion}`], options);
    if(myError){
        core.error(myError)
    } 
    core.exportVariable('COMMITS', JSON.stringify(myOutput));
};
getCommits();
