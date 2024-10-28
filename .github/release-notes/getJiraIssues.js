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
    
        const prLinksOnly = prDetails.split('## What It Does')[0].split('--')[1]);
        const jiraIssueRegex = new RegExp(`\\[(${ jiraProjectKey }\-\\d+)\\]\\(`, "g");
        while ((jiraIssueMatches = jiraIssueRegex.exec(prLinksOnly)) !== null) {
            jiraIssueIds.push(jiraIssueMatches[1]);
        };
    };
   
    console.log('Jira Issue IDs');
    console.log(jiraIssueIds);
    const uniqueJiraIssueIds = [...new Set([...jiraIssueIds])];
    console.log('Unique:');
    console.log(uniqueJiraIssueIds);
    core.setOutput("JIRA_ISSUE_IDS", uniqueJiraIssueIds.join());
};

  
getPrNumbers();
