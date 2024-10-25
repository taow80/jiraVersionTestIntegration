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
      
        core.info(`ℹ️ Release notes: \r\n ${commits}`);

        if (notes) {
            exec.exec(`gh release create "${application}@v${packageVersion}" --notes "${commits}"`);
        } else {
            core.warning(`⚠️ No commits were found to create release notes`);
            exec.exec(`gh release create "${application}@v${packageVersion}"`);
        }
    }
};
createRelease();
