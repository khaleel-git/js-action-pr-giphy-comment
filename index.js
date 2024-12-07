const { octokit, Octokit } = require('@octokit/rest');
const Giphy = require('giphy-api');
const core = require('@actions/github');
const github = require('@actions/github')

async function run() {
    try {
        const githubToken = core.getInput('github-token');
        const giphyApiKey = core.getInput('giphy-api-key')

        const octokit = new Octokit( { auth: githubToken });
        const giphy = Giphy(giphyApiKey);

        const context = github.context;
        const { owner, repo, number } = context.issue;

        const prComment = await giphy.random('thank you')

        await    octokit.issues.createComment({
            owner,
            repo,
            issue_number: number,
            body: `### PR - ${number} \n ### Thank you for the contribution!`
        });

        core.setOutput('comment-url', `${prComment.data.images.downsized.url}`);
        console.log(`Giphy GIF comment added successfully! Comment URL: ${prComment.data.images.downsized.url}`);

    }
    catch (error) {
        console.error('Error:', error)
        process.exit(1);
    }
}
run ();