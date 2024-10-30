const core = require('@actions/core');
const exec = require('@actions/exec');

const getPrNumbers = async () => {
    const commits = process.argv[2];
    const jiraProjectPrefix = process.argv[3];

    const prNumberRegex = /\s\(#(\d+)\)$/gm;
    const prNumberMatches = [...commits.matchAll(prNumberRegex)];

    const jiraIssueIds = [];
    let prDetailErrors = '';
    for (const match of prNumberMatches) {
        const prNumber = match[1];
        console.log(`Matched PR Number: ${prNumber}`);
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
        console.log(prDetails);
        const prSearchArea = prDetails.split('## What It Does')[0];
        const jiraIssueRegex = new RegExp(`\\[(${ jiraProjectPrefix }\-\\d+)\\]\\(`, "g");
        while ((jiraIssueMatches = jiraIssueRegex.exec(prSearchArea)) !== null) {
            jiraIssueIds.push(jiraIssueMatches[1]);
        };
    };

    if(prDetailErrors) {
        core.error(`Jira Issue ID PR Errors: ${prDetailErrors}`);
    }
   
    const uniqueJiraIssueIds = [...new Set([...jiraIssueIds])];
    core.setOutput("JIRA_ISSUE_IDS", uniqueJiraIssueIds.join());
    
};
getPrNumbers();
