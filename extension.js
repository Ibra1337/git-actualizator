const vscode = require("vscode");
const { exec } = require("child_process");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('Congratulations, your extension "git-actualizator" is now active!');

  const disposable = vscode.commands.registerCommand("git-actualizator.helloWorld", async function () {
    const window = vscode.window;
    
    // Get the first workspace folder (assuming it's the Git repo)
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      vscode.window.showErrorMessage("No workspace folder found!");
      return;
    }
    
    const workspacePath = workspaceFolders[0].uri.fsPath; // Convert to a normal path

    console.log(`Workspace Path: ${workspacePath}`);

    // Execute git status in the workspace folder
    exec("git status", { cwd: workspacePath }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        vscode.window.showErrorMessage(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
        vscode.window.showErrorMessage(`Stderr: ${stderr}`);
        return;
      }
      console.log(`Output:\n${stdout}`);
      vscode.window.showInformationMessage(`Git Status:\n${stdout}`);
    });
  });

  vscode.window.showInformationMessage("Hello World from git-actualizator!");

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
