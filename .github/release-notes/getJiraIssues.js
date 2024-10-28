const core = require('@actions/core');
const exec = require('@actions/exec');


const getPrNumbers = async () => {
    const commits = process.argv[2];
    const jiraProjectKey = process.argv[3];

    const prNumberRegex = /\(#(\d+)\)/g;
    const prNumberMatches = [...commits.matchAll(prNumberRegex)];
    
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
          console.log(`PR Details: ${prDetails}`);
        const jiraIssueRegex = new RegExp(`${ jiraProjectKey }-\d+`, "g");
        const jiraIssueMatches = [...prDetails.matchAll(jiraIssueRegex)];
        console.log('jiraIssueMatches');
        console.log(jiraIssueMatches);
    });

// core.setOutput("APP_SPECIFIC_JIRA_ISSUES", appFilteredCommits);
//    console.log(`App Filtered Commits: ${appFilteredCommits}`);
};

  
getPrNumbers();
