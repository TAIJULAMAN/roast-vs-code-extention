import * as vscode from 'vscode';
import { RoastRule } from './roastRules';

export class RoastActionProvider implements vscode.CodeActionProvider {
    public static readonly providedCodeActionKinds = [
        vscode.CodeActionKind.QuickFix
    ];

    provideCodeActions(document: vscode.TextDocument, range: vscode.Range | vscode.Selection, context: vscode.CodeActionContext, token: vscode.CancellationToken): vscode.CodeAction[] {
        const actions: vscode.CodeAction[] = [];

        context.diagnostics.forEach(diagnostic => {
            if (diagnostic.source === 'roast') { 
                // We need a way to map diagnostic back to rule ID. 
                // For now, let's rely on the message text or modify how we store diagnostics.
                // Actually, let's just use text analysis of the range since we don't store the rule ID in the diagnostic easily without subclassing.
                // A better approach for the future is to set `code` on the Diagnostic to the rule ID.
                
                // For this implementation, let's check the text covered by the diagnostic
                const text = document.getText(diagnostic.range);

                if (text.includes('var ')) {
                    actions.push(this.createFix(document, diagnostic.range, 'let', 'Upgrade to this century (Change to let)'));
                    actions.push(this.createFix(document, diagnostic.range, 'const', 'Make it immutable (Change to const)'));
                } else if (text.includes('console.log')) {
                    actions.push(this.createDeleteFix(document, diagnostic.range, 'Hide your shame (Delete console.log)'));
                } else if (text.includes('==') && !text.includes('===')) {
                    actions.push(this.createFix(document, diagnostic.range, '===', 'Stop being so loose (Change to ===)'));
                } else if (text.includes('any')) {
                     actions.push(this.createExternalLinkAction('Ask the internet how to code (Search StackOverflow for "typescript avoid any")', 'https://stackoverflow.com/search?q=typescript+avoid+any'));
                } else if (text.includes('TODO')) {
                     actions.push(this.createExternalLinkAction('Hire a freelancer to do this', 'https://www.upwork.com/search/profiles/?q=developer'));
                }

                // Generic "Stack Overflow Help" for everything else
                 actions.push(this.createExternalLinkAction(`Panic and search: ${text}`, `https://stackoverflow.com/search?q=${encodeURIComponent(text)}`));
            }
        });

        return actions;
    }

    private createFix(document: vscode.TextDocument, range: vscode.Range, newText: string, title: string): vscode.CodeAction {
        const fix = new vscode.CodeAction(title, vscode.CodeActionKind.QuickFix);
        fix.edit = new vscode.WorkspaceEdit();
        
        // We need to be careful with replacement. 
        // For 'var', we only want to replace the word 'var'.
        // For '==', we want to replace '==' with '==='.
        // This simple replacement might be too aggressive if not scoped correctly, but for a roast extension it's "character building".
        // Let's try to be slightly smarter.
        
        const text = document.getText(range);
        let replaceRange = range;
        
        if (title.includes('let') || title.includes('const')) {
             // Find 'var' in the range
             const varIndex = text.indexOf('var');
             if (varIndex !== -1) {
                 const start = range.start.translate(0, varIndex);
                 const end = start.translate(0, 3);
                 replaceRange = new vscode.Range(start, end);
             }
        } else if (title.includes('===')) {
             const eqIndex = text.indexOf('==');
             if (eqIndex !== -1) {
                 const start = range.start.translate(0, eqIndex);
                 const end = start.translate(0, 2);
                 replaceRange = new vscode.Range(start, end);
             }
        }

        fix.edit.replace(document.uri, replaceRange, newText);
        return fix;
    }

    private createDeleteFix(document: vscode.TextDocument, range: vscode.Range, title: string): vscode.CodeAction {
        const fix = new vscode.CodeAction(title, vscode.CodeActionKind.QuickFix);
        fix.edit = new vscode.WorkspaceEdit();
        // Delete the whole line if it's just console.log, or just the range?
        // Let's delete the range including the semicolon if present.
        fix.edit.delete(document.uri, range); 
        return fix;
    }

    private createExternalLinkAction(title: string, url: string): vscode.CodeAction {
        const action = new vscode.CodeAction(title, vscode.CodeActionKind.QuickFix);
        action.command = {
            command: 'vscode.open',
            title: title,
            arguments: [vscode.Uri.parse(url)]
        };
        return action;
    }
}
