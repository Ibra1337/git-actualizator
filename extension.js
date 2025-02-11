const vscode = require("vscode");
const { exec } = require("child_process");
const fs = require('fs');
const path = require('path')
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

  const disposable = vscode.commands.registerCommand("git-actualizator.helloWorld", async function () {
    const window = vscode.window;
    

    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      vscode.window.showErrorMessage("No workspace folder found!");
      return;
    }
    
    const workspacePath = workspaceFolders[0].uri.fsPath;

    commitDialog()
    console.log(`Workspace Path: ${workspacePath}`);

  });

  vscode.window.showInformationMessage("Hello World from git-actualizator!");

  context.subscriptions.push(disposable);
}


/*********** ON INIT ************************* 
 * create log directory
 * on update create txt file/ update json , and commmit the cahnge
 * 
*/

function getWebviewContent() {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>My Webview</title>
  </head>
  <body>
      <h1>Hello, Webview!</h1>
      <p>This is a custom VS Code webview.</p>
      <button onclick="sendMessage()">Click Me</button>

      <script>
          const vscode = acquireVsCodeApi();
          function sendMessage() {
              vscode.postMessage({ command: 'alert', text: 'Hello from Webview!' });
          }
      </script>
  </body>
  </html>`;
}

function commitDialog(){
          const panel = vscode.window.createWebviewPanel(
            'myWebview', // Unique identifier for the panel
            'My Webview', // Title of the panel
            vscode.ViewColumn.One, // Editor column where it will show
            { enableScripts: true } // Enable JavaScript inside the webview
        );

        // Set the HTML content for the webview
        panel.webview.html = getWebviewContent();


}

function execCommand(command , workspacePath){
  exec(command, { cwd: workspacePath }, (error, stdout, stderr) => {
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
}

function logMessageJson(message , logDir) {
 
  if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
  }

  const logFile = path.join(logDir, "dev-logs.json");
  const timestamp = new Date().toISOString().replace("T", " ").split(".")[0];
  const logEntry = { timestamp, message };

  let logs = [];
  if (fs.existsSync(logFile)) {
      logs = JSON.parse(fs.readFileSync(logFile, "utf8"));
  }
  logs.push(logEntry);

  fs.writeFileSync(logFile, JSON.stringify(logs, null, 4), "utf8");
}



function createLogDb(){}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
