import YAML from "yaml";
import pkg from "template-file";
const { renderFile } = pkg;

export default class Bot {
  constructor(octokit, payload) {
    if (!payload.issue.pull_request) {
      return undefined;
    }
    this.payload = payload;
    this.octokit = octokit;
  }

  async comment(body) {
    await this.octokit.rest.issues.createComment({
      owner: this.payload.repository.owner.login,
      repo: this.payload.repository.name,
      issue_number: this.payload.issue.number,
      body: body,
    });
  }

  async react(content) {
    await this.octokit.rest.reactions.createForIssueComment({
      owner: this.payload.repository.owner.login,
      repo: this.payload.repository.name,
      comment_id: this.payload.comment.id,
      content: content,
    });
  }

  async fetchRepoScripts() {
    this.scriptsPath = process.env.REPO_SCRIPTS_FILE_PATH ?? "command.yaml";

    console.log(this.scriptPath);
    try {
      this.scriptFile = await this.octokit.rest.repos.getContent({
        owner: this.payload.repository.owner.login,
        repo: this.payload.repository.name,
        path: this.scriptsPath,
      });
      this.scripts = YAML.parse(
        Buffer.from(this.scriptFile.data.content, "base64").toString()
      );

      return this.scripts;
    } catch {
      return;
    }
  }

  getCommand() {
    const initiatorString = process.env.INITIATOR_STRING ?? "shell run";
    this.command = this.payload.comment.body.split(initiatorString + " ")[1];
    if (!this.command) {
      return undefined;
    }
    return this.command;
  }

  async reportNotFound() {
    await this.comment(
      await renderFile("./static/file-not-found.md", {
        scriptsPath: this.scriptsPath,
      })
    );
  }

  async reportResults(result) {
    await this.comment(
      await renderFile("./static/report.md", {
        command: this.command,
        result: result,
      })
    );
  }
}
