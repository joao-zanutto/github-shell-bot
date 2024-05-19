import shell from "shelljs";

export default class Executor {
  constructor(scripts, command) {
    this.script = scripts[command];
    if (JSON.stringify(this.script) == "{}") {
      return undefined;
    }
  }

  individual(line) {
    const out = shell.exec(line);
    if (out.stdout == "") out.stdout = [];
    else out.stdout = [out.stdout];
    if (out.stderr == "") out.stderr = [];
    else out.stderr = [out.stderr];
    return { stdout: out.stdout, stderr: out.stderr };
  }

  execute() {
    return this.script.map((line) => {
      return { line: line, output: this.individual(line) };
    });
  }
}
