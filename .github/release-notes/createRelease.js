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

        let filteredCommits = [];
        let appRegex = new RegExp();

        if (application === 'channel') {
            core.info(`ℹ️ Filtering commits for Channel and PWA`);
            appRegex = new RegExp(`\\(.*(\bchannel|\bpwa).*\\):`, 'mi');
            filteredCommits = commitArray.filter(commit => {
                return appRegex.test(commit);
            });
        } else if(application === 'backoffice') {
            core.info(`ℹ️ Filtering commits for Backoffice`);
            appRegex = new RegExp(`\\(.*(\bbackoffice|\bov2).*\\):`, 'mi');
            filteredCommits = commitArray.filter(commit => {
                return appRegex.test(commit);
            });
        }

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
