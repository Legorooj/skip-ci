// Copyright (c) 2020 Legorooj. 
// This file is licensed under the terms of the Apache License, version 2.0
const core = require("@actions/core");
const github = require("@actions/github");

async function main() {
    // Create the RegExp object, and load the octokit
    const pattern = core.getInput('pattern');
    const token = core.getInput('token')

    // Make sure the inputs have loaded properly
    if (!pattern) {
        core.setFailed("Unable to load pattern.");
        return 1;
    } else if (!token) {
        core.setFailed("Unable to load token")
        return 1;
    }
    
    const re = RegExp(pattern);
    const octokit = github.getOctokit(token);
    
    // Fetch the workflow run object
    octokit.actions.getWorkflowRun(
        {
            owner: github.context.repo.owner, 
            repo: github.context.repo.repo,
            run_id: github.context.runId
        }
    ).then(action => {
        // Log the data to the console for debugging.
        console.log(action);

        // Extract the commit message from the commit which triggered the workflow run
        const commit_message = action.head_commit.message;

        // And check for the pattern.
        let match = commit_message.search(re);
        if (match) {
            core.setOutput("canSkip", "true");
            console.log(`Skipping; match found: ${match}`)
        } else {
            core.setOutput("canSkip", "false")
            console.log("Not skipping, no match found.")
        }
    }).catch(e => {
        console.log(e);
        core.setFailed(e.message);
    });
}

try{
    main();
} catch (e) {
    core.setFailed(e.message)
}
