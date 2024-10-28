const core = require('@actions/core');
const exec = require('@actions/exec');


const getPrNumbers = async () => {
    const commits = process.argv[2];
    console.log(`Submit Commits: ${commits}`);
    const prNumberRegex = /\(#(\d+)\)\n/g;
    const prNumberMatches = [...commits.matchAll(prNumberRegex)];
    console.log(`Pr Number Match Array: ${prNumberMatches}`);
    prNumberMatches.forEach(async (match) => {
      const prNumber = match[1];
      const prDetails = await exec.exec(`gh pr view ${prNumber}`);
      console.log(`PR Details: ${prDetails}`);
    });

// core.setOutput("APP_SPECIFIC_JIRA_ISSUES", appFilteredCommits);
//    console.log(`App Filtered Commits: ${appFilteredCommits}`);
};

  
getPrNumbers();
