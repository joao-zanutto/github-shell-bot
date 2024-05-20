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
  if (!command) {
    return;
  }
  if (!scripts) {
    await bot.reportNotFound();
    return;
  }

  const executor = new Executor(scripts, command);
  // validate command exists
  if (JSON.stringify(executor) == "{}") {
    await bot.react("-1");
    return;
  }
  await bot.react("+1");

  const result = executor.execute();
  await bot.reportResults(result);
};
