const core = require('@actions/core');
const exec = require('@actions/exec');

const getPrNumbers = async () => {
    const commits = process.argv[2];
    const jiraProjectKey = process.argv[3];

    const prNumberRegex = /\(#(\d+)\)/g;
    const prNumberMatches = [...commits.matchAll(prNumberRegex)];

    const jiraIssueIds = [];
    let prDetailErrors = '';
    for await (const match of prNumberMatches) {
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
        const prBodyOnly = prDetails.split('--')[1];
        const prSearchArea = prBodyOnly.split('## What It Does')[0];
        const jiraIssueRegex = new RegExp(`\\[(${ jiraProjectKey }\-\\d+)\\]\\(`, "g");
        while ((jiraIssueMatches = jiraIssueRegex.exec(prSearchArea)) !== null) {
            jiraIssueIds.push(jiraIssueMatches[1]);
        };
    };
   
    const uniqueJiraIssueIds = [...new Set([...jiraIssueIds])];
    core.setOutput("JIRA_ISSUE_IDS", uniqueJiraIssueIds.join());
    if(prDetailErrors) {
        core.error(`Jira Issue ID PR Errors: ${prDetailErrors}`);
    }
};

  
getPrNumbers();
