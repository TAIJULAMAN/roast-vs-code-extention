import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as path from 'path';

export async function getBlameForLine(filePath: string, lineNumber: number): Promise<string | undefined> {
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(filePath));
    if (!workspaceFolder) {
        return undefined;
    }

    try {
        const cwd = workspaceFolder.uri.fsPath;
        // git blame -L 5,5 --porcelain src/file.ts
        // -L n,m means lines n to m. lineNumber is 0-indexed in VS Code, 1-indexed in git blame usually?
        // VS Code TextDocument lines are 0-indexed. Git blame -L takes 1-indexed.
        const gitLine = lineNumber + 1;

        const cmd = `git blame -L ${gitLine},${gitLine} --porcelain "${filePath}"`;

        return new Promise((resolve) => {
            cp.exec(cmd, { cwd }, (error, stdout, stderr) => {
                if (error) {
                    console.error('Git blame error:', stderr);
                    resolve(undefined);
                    return;
                }

                // Parse porcelain output
                // author Of The Code
                // author-mail <email>
                // author-time 1234567890

                const authorLine = stdout.split('\n').find(line => line.startsWith('author '));
                if (authorLine) {
                    const authorName = authorLine.substring(7).trim(); // Remove 'author '
                    if (authorName && authorName !== 'Not Committed Yet') {
                        resolve(authorName);
                        return;
                    }
                }
                resolve(undefined);
            });
        });
    } catch (e) {
        console.error('Error getting git blame:', e);
        return undefined;
    }
}
