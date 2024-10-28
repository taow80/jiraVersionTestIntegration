const core = require('@actions/core');
const exec = require('@actions/exec');

const getJiraIssueIds = (prDetails) => {
    const jiraIssueRegex = new RegExp(`${ jiraProjectKey }\-\\d+`, "g");
    const jiraIssueMatches = [...jiraIssueRegex.exec(prDetails)];
}

const getPrNumbers = async () => {
    const commits = process.argv[2];
    const jiraProjectKey = process.argv[3];

    const prNumberRegex = /\(#(\d+)\)/g;
    const prNumberMatches = [...commits.matchAll(prNumberRegex)];

    const jiraIssueIds = [];
    let prDetailErrors = '';
    prNumberMatches.forEach(async (match) => {
        const prNumber = match[1];
        let prDetails = '';
        
        const options = {
            silent: true,
            listeners: {
                stdout: (data) => {
                    prDetails += data.toString();
                },
                stderr: (data) => {
                    prDetailErrors += data.toString();
                }
            }
        };
        
        await exec.exec(`gh pr view ${prNumber}`,[],options);
        
        const jiraIssueRegex = new RegExp(`${ jiraProjectKey }\-\\d+`, "g");
        jiraIssueIds.push.apply(jiraIssueIds, [...jiraIssueRegex.exec(prDetails)]);
    });
    const uniqueJiraIssueIds = [...new Set(jiraIssueIds)];
    console.log('Jira Issue IDs');
    console.log(jiraIssueIds);
    console.log('Unique:');
    console.log(uniqueJiraIssueIds);
// core.setOutput("APP_SPECIFIC_JIRA_ISSUES", appFilteredCommits);
//    console.log(`App Filtered Commits: ${appFilteredCommits}`);
};

  
getPrNumbers();
