const core = require('@actions/core');
const exec = require('@actions/exec');

const createRelease = () => {
    const application = process.argv[2].toLowerCase();
    const packageVersion = process.argv[3];
    const commits = process.argv[4];

    core.info(`ℹ️ Creating release for application: ${application} version ${packageVersion}`);

    if (!commits || !application || !packageVersion) {
        core.error(`❌ Error: one or more of the required arguments is missing`);
    } else {
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
            core.info(`ℹ️ Filtering commits for Channel and PWA`);
            releaseProjects.push('channel', 'pwa', 'branding');
            //const appRegex = new RegExp(`\\((\\bchannel|\\bpwa)\\):`, 'mi');
        } else if(application === 'backoffice') {
            core.info(`ℹ️ Filtering commits for Backoffice`);
            releaseProjects.push('backoffice', 'backoffice-v2');
        }

        filteredCommits = commitArray.filter(commit => {
            project = commit.match(projectRegex);
            return(project && releaseProjects.includes(project[1].toLowerCase()))
        });

        const notes = filteredCommits.join('\r\n').replace(/"/g,``).replace(/'/g,``);
        core.info(`ℹ️ Release notes: \r\n ${notes}`);

        if (notes) {
            exec.exec(`gh release create "${application}@v${packageVersion}" --notes "${notes}"`);
        } else {
            core.warning(`⚠️ No commits were found to create release notes`);
            exec.exec(`gh release create "${application}@v${packageVersion}"`);
        }
    }
};
createRelease();
