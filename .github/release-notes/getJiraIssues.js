const core = require('@actions/core');
const exec = require('@actions/exec');


const getPrNumbers = async () => {
    const commits = process.argv[2]

    const prNumberRegex = /\(#(\d+)\)\n/g
    const prNumberMatches = [...commits.matchAll(prNumberRegex)];

    prNumberMatches.forEach(async (match) => {
      const prNumber = match[1];
      const prDetails = await exec.exec(`gh pr view ${prNumber}`);
      console.log(prDetails);
    });

core.setOutput("APP_SPECIFIC_JIRA_ISSUES", appFilteredCommits);
    console.log(`App Filtered Commits: ${appFilteredCommits}`);
};

  
getPrNumbers();
