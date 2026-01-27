/**
 * Roast Extension
 * A linter that hurts your feelings
 */

import * as vscode from 'vscode';
import { getEnabledRules, checkDeepNesting } from './roastRules';
import { RoastCounter } from './roastCounter';
import { StatusBarManager } from './statusBar';

// Global instances
let roastCounter: RoastCounter;
let statusBarManager: StatusBarManager;
let roastDecorationType: vscode.TextEditorDecorationType;
let updateTimeout: NodeJS.Timeout | undefined;

export function activate(context: vscode.ExtensionContext) {
	console.log('Roast is now active! 🔥');

	// Initialize global instances
	roastCounter = new RoastCounter();
	statusBarManager = new StatusBarManager();

	// Create decoration type for roast comments
	roastDecorationType = vscode.window.createTextEditorDecorationType({
		after: {
			margin: '0 0 0 1em',
			color: '#888888',
			fontStyle: 'italic',
		},
		rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
	});

	// Register commands
	const toggleCommand = vscode.commands.registerCommand('vs-roast.toggleRoastMode', () => {
		statusBarManager.toggleEnabled();
		const config = vscode.workspace.getConfiguration('vsRoast');
		const newState = statusBarManager.getEnabled();
		config.update('enabled', newState, vscode.ConfigurationTarget.Global);

		statusBarManager.updateStatusBar(roastCounter.getSessionCount());

		if (newState) {
			vscode.window.showInformationMessage('🔥 Roast enabled! Prepare to be roasted.');
			triggerUpdateDecorations();
		} else {
			vscode.window.showInformationMessage('💤 Roast disabled. Your code is safe... for now.');
			clearAllDecorations();
		}
	});

	const showStatsCommand = vscode.commands.registerCommand('vs-roast.showStats', () => {
		const stats = roastCounter.getStatistics();
		vscode.window.showInformationMessage(stats, { modal: true });
	});

	// Update decorations for active editor
	let activeEditor = vscode.window.activeTextEditor;
	if (activeEditor) {
		triggerUpdateDecorations();
	}

	// Listen for active editor changes
	vscode.window.onDidChangeActiveTextEditor(editor => {
		activeEditor = editor;
		if (editor) {
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);

	// Listen for document changes
	vscode.workspace.onDidChangeTextDocument(event => {
		if (activeEditor && event.document === activeEditor.document) {
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);

	// Listen for configuration changes
	vscode.workspace.onDidChangeConfiguration(event => {
		if (event.affectsConfiguration('vsRoast')) {
			const config = vscode.workspace.getConfiguration('vsRoast');
			statusBarManager.setEnabled(config.get('enabled', true));
			statusBarManager.updateStatusBar(roastCounter.getSessionCount());
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);

	// Add to subscriptions
	context.subscriptions.push(
		toggleCommand,
		showStatsCommand,
		roastDecorationType
	);

	/**
	 * Trigger decoration update with debouncing
	 */
	function triggerUpdateDecorations() {
		if (updateTimeout) {
			clearTimeout(updateTimeout);
		}

		const config = vscode.workspace.getConfiguration('vsRoast');
		const debounceDelay = config.get<number>('debounceDelay', 500);

		updateTimeout = setTimeout(() => {
			updateDecorations();
		}, debounceDelay);
	}

	/**
	 * Main decoration update function
	 */
	function updateDecorations() {
		if (!activeEditor) {
			return;
		}

		const config = vscode.workspace.getConfiguration('vsRoast');
		const enabled = config.get<boolean>('enabled', true);

		if (!enabled || !statusBarManager.getEnabled()) {
			clearAllDecorations();
			return;
		}

		const document = activeEditor.document;
		const maxFileSize = config.get<number>('maxFileSize', 100000);

		// Skip large files for performance
		if (document.getText().length > maxFileSize) {
			console.log(`Skipping roast for large file: ${document.fileName}`);
			return;
		}

		const text = document.getText();
		const languageId = document.languageId;
		const roasts: vscode.DecorationOptions[] = [];
		const enabledRules = getEnabledRules(languageId, config);

		let roastCount = 0;

		// Apply regex-based rules
		enabledRules.forEach(rule => {
			let match;
			const regex = new RegExp(rule.pattern);

			while ((match = regex.exec(text))) {
				const startPos = document.positionAt(match.index);
				const endPos = document.positionAt(match.index + match[0].length);

				roasts.push({
					range: new vscode.Range(startPos, endPos),
					renderOptions: {
						after: {
							contentText: rule.getInsult()
						}
					}
				});

				roastCount++;
				roastCounter.incrementCount(document.fileName, rule.id);
			}
		});

		// Check for deep nesting (line-based detection)
		if (config.get('vsRoast.rules.deepNesting', true)) {
			const lines = text.split('\n');
			lines.forEach((line, index) => {
				const nestingCheck = checkDeepNesting(line, index);
				if (nestingCheck.hasNesting) {
					const range = new vscode.Range(index, line.length, index, line.length);
					roasts.push({
						range: range,
						renderOptions: {
							after: {
								contentText: nestingCheck.insult
							}
						}
					});
					roastCount++;
					roastCounter.incrementCount(document.fileName, 'deepNesting');
				}
			});
		}

		// Apply decorations
		activeEditor.setDecorations(roastDecorationType, roasts);

		// Update status bar
		statusBarManager.updateStatusBar(roastCounter.getSessionCount());
	}

	/**
	 * Clear all decorations
	 */
	function clearAllDecorations() {
		if (activeEditor) {
			activeEditor.setDecorations(roastDecorationType, []);
		}
	}
}

export function deactivate() {
	if (statusBarManager) {
		statusBarManager.dispose();
	}
}

