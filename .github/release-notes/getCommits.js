const core = require('@actions/core');
const exec = require('@actions/exec');

const getCommits = async () => {
    core.info(process.argv);
    const releaseVersion = process.argv[3];

    let myOutput = '';
    let myError = '';

    const options = {};
    options.listeners = {
    stdout: (data) => {
        myOutput += data.toString();
    },
    stderr: (data) => {
        myError += data.toString();
    }
    };

    await exec.exec('git', ['log', `--pretty=format:%s`, `HEAD...${releaseVersion}`], options);
    if(myError){
        core.error(myError)
    }
    core.info(JSON.stringify(myOutput));
    return JSON.stringify(myOutput);
};
getCommits();
