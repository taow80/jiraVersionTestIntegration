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
    
        console.log(`PR Details:`);
        console.log(prDetails);
        console.log('TRIMMED:');
        console.log(prDetails.replace(/## What It Does[\s\S.]*?/g, ''));
        const jiraIssueRegex = new RegExp(`\\[(${ jiraProjectKey }\-\\d+)\\]\\(.*?## What It Does`, "gm");
        while ((jiraIssueMatches = jiraIssueRegex.exec(prDetails)) !== null) {
            console.log('MATCHED', jiraIssueMatches);
            jiraIssueIds.push(jiraIssueMatches[1]);
        };
        //console.log('jiraIssueMatches:');
        //console.log(jiraIssueMatches);
        //console.log(jiraIssueRegex.exec(prDetails));
        //jiraIssueIds.push(jiraIssueMatches[1]);
    };
   
    console.log('Jira Issue IDs');
    console.log(jiraIssueIds);
    const uniqueJiraIssueIds = [...new Set([...jiraIssueIds])];
    console.log('Unique:');
    console.log(uniqueJiraIssueIds);
    core.setOutput("JIRA_ISSUE_IDS", uniqueJiraIssueIds.join());
};

  
getPrNumbers();
