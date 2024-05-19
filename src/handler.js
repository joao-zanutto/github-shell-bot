import Bot from "./Bot.js";
import Executor from "./Executor.js";

export default async ({ octokit, payload }) => {
  const bot = new Bot(octokit, payload);
  // validate event is a PR
  if (!bot) {
    return;
  }

  const scripts = await bot.fetchRepoScripts();
  const command = bot.getCommand();
  // validate initializer string is used
  if (!command) {
    return;
  }

  const executor = new Executor(scripts, command);
  // validate command exists
  if (JSON.stringify(executor) == "{}") {
    await bot.denyCommand();
    return;
  }
  await bot.acknowledgeCommand();

  const result = executor.execute();
  await bot.reportResults(result);
};
