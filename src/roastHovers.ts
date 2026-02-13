import * as vscode from 'vscode';

export class RoastHoverProvider implements vscode.HoverProvider {
    provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {

        // We only want to provide hover if there is a roast (diagnostic) at this position.
        // But we can also just check the text patterns again or look up diagnostics.
        // Looking up diagnostics is safer.

        const range = document.getWordRangeAtPosition(position);
        if (!range) { return undefined; }

        const diagnostics = vscode.languages.getDiagnostics(document.uri);
        const roastDiagnostic = diagnostics.find(d => d.range.intersection(range) && d.source === 'roast');

        if (roastDiagnostic) {
            const message = roastDiagnostic.message;
            const markdown = new vscode.MarkdownString();
            markdown.isTrusted = true;

            markdown.appendMarkdown(`### 🔥 Roast \n\n`);
            markdown.appendMarkdown(`**"${message}"**\n\n`);

            // Add specific sarcastic advice based on the message or text
            if (message.includes('var')) {
                markdown.appendMarkdown(`*Did you know? ` +
                    `Using \`var\` is the software equivalent of wearing socks with sandals. ` +
                    `It works, but everyone is judging you.*`);
            } else if (message.includes('console.log')) {
                markdown.appendMarkdown(`*Fun fact: ` +
                    `Every time you commit a \`console.log\`, a unit test dies.*`);
            } else if (message.includes('any')) {
                markdown.appendMarkdown(`*Pro tip: ` +
                    `Using \`any\` defeats the entire purpose of TypeScript. ` +
                    `You might as well be writing Python.*`);
            } else {
                markdown.appendMarkdown(`*Refactoring this might save your soul. Or at least your code review.*`);
            }

            return new vscode.Hover(markdown);
        }

        return undefined;
    }
}
