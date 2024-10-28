const core = require('@actions/core');
const exec = require('@actions/exec');


const getPrNumbers = async () => {
    const commits = process.argv[2];
    console.log(`Submit Commits: ${commits}`);
    const prNumberRegex = /\(#(\d+)\)/g;
    const prNumberMatches = [...commits.matchAll(prNumberRegex)];
    console.log(`PR Number Match Array:`);
    console.log(prNumberMatches);
    prNumberMatches.forEach(async (match) => {
        console.log(`Loop match: ${match}`);
      const prNumber = match[1];
      const prDetails = await exec.exec(`gh pr view ${prNumber}`);
      console.log(`PR Details: ${prDetails}`);
    });

// core.setOutput("APP_SPECIFIC_JIRA_ISSUES", appFilteredCommits);
//    console.log(`App Filtered Commits: ${appFilteredCommits}`);
};

  
getPrNumbers();
