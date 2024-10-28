const core = require('@actions/core');
const exec = require('@actions/exec');


const filterCommits = (application, commits) => {
    const commitArray = commits.split(/\r?\n/);
        let releaseProjects = [
            'core',
            'domain',
            'domain-components',
            'fdl',
            'omega',
            'policy',
            'presentation'
        ];

        let filteredCommits = [];
        const projectRegex = /\((.+)\):/;
        
        if (application === 'channel') {
          //  core.info(`ℹ️ Filtering commits for Channel and PWA`);
            releaseProjects.push('channel', 'pwa', 'branding');
            //const appRegex = new RegExp(`\\((\\bchannel|\\bpwa)\\):`, 'mi');
        } else if(application === 'backoffice') {
          // core.info(`ℹ️ Filtering commits for Backoffice`);
            releaseProjects.push('backoffice', 'backoffice-v2');
        }
        filteredCommits = commitArray.filter(commit => {
            project = commit.match(projectRegex);
            return(project && releaseProjects.includes(project[1].toLowerCase()))
        });
        return filteredCommits.join("\r\n").replace(/"/g,``).replace(/'/g,``);

}

const getCommits = async () => {
    const application = process.argv[2].toLowerCase();
    const lastVersion = process.argv[3];

    let myOutput = '';
    let myError = '';

    const options = {
        listeners: {
    stdout: (data) => {
        myOutput += data.toString();
    },
    stderr: (data) => {
        myError += data.toString();
    }
    }
};

    await exec.exec('git', ['log', `--pretty=format:%s`, `HEAD...${lastVersion}`], options);
    if(myError){
        core.error(myError)
    } 
    const appFilteredCommits = filterCommits(application, myOutput)
    core.setOutput("COMMITS", appFilteredCommits);
    console.log(`App Filtered Commits: ${appFilteredCommits}`);
};
getCommits();
