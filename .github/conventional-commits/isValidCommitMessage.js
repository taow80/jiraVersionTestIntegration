const core = require('@actions/core');

const DEFAULT_COMMIT_TYPES = [
    'feat',
    'fix',
    'docs',
    'style',
    'refactor',
    'test',
    'build',
    'perf',
    'ci',
    'chore',
    'revert',
    'merge',
    'wip',
    'version',
];

function checkMessage(message){
    // Commit message doesn't fall into the exceptions group. Let's do the validation.
    let [possiblyValidCommitType] = message.split(':');
    possiblyValidCommitType = possiblyValidCommitType.toLowerCase();

    // Let's remove scope if present.
    if (possiblyValidCommitType.match(/\(\S*?\)/)) {
        possiblyValidCommitType = possiblyValidCommitType.replace(/\(\S*?\)/, '');
    }

    possiblyValidCommitType = possiblyValidCommitType
        .replace(/\s/g, '') // Remove all whitespace
        .replace(/\!/g, '') // Remove bang for notify breaking change
        .replace(/()/g, '') // Remove all whitespace
        .replace(/[^a-z]/g, ''); // Only leave [a-z] characters

    const isMessageValid = DEFAULT_COMMIT_TYPES.includes(possiblyValidCommitType);

    if(!isMessageValid){
        core.setFailed(`❌ ${message} is not valid conventional commit syntax.`);
        throw new Error(`${message} is not valid conventional commit syntax.`); 
    }
    core.setOutput('✅ Commit message is valid. ')
    return isMessageValid;
}

const isValidCommitMessage = () => {
    const message = process.argv[2];
    if(message.match(/\r?\n/)){
        const messageList = message.split(/\r?\n/);
        messageList.forEach(message => {
            checkMessage(message);
        });
    }
    checkMessage(message);
};
isValidCommitMessage();