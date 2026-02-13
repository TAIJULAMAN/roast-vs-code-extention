/**
 * Roast Extension
 * A linter that hurts your feelings
 */

import * as vscode from 'vscode';
import { getEnabledRules, checkDeepNesting } from './roastRules';
import { RoastCounter } from './roastCounter';
import { StatusBarManager } from './statusBar';
import { RoastActionProvider } from './roastActions';
import { RoastHoverProvider } from './roastHovers';
import { getBlameForLine } from './gitUtils';

// Global instances
let roastCounter: RoastCounter;
let statusBarManager: StatusBarManager;
let roastDecorationType: vscode.TextEditorDecorationType;
let roastDiagnosticCollection: vscode.DiagnosticCollection;
let updateTimeout: NodeJS.Timeout | undefined;

export function activate(context: vscode.ExtensionContext) {
	console.log('Roast is now active! 🔥');

	// Check for Roast of the Day
	checkRoastOfTheDay(context);

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

	// Create diagnostic collection for Problems view
	roastDiagnosticCollection = vscode.languages.createDiagnosticCollection('roast');

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

	const showStatsCommand = vscode.commands.registerCommand('vs-roast.showStats', async () => {
		const stats = roastCounter.getStatistics();
		const shareStats = "Copy for Sharing 📋";

		const selection = await vscode.window.showInformationMessage(stats, { modal: true }, shareStats);

		if (selection === shareStats) {
			const shareText = roastCounter.getShareableSummary();
			await vscode.env.clipboard.writeText(shareText);
			vscode.window.showInformationMessage('📋 Stats copied to clipboard! Time to brag (or cry).');
		}
	});

	// Register Providers
	const actionProvider = vscode.languages.registerCodeActionsProvider(
		{ scheme: 'file', language: '*' },
		new RoastActionProvider(),
		{ providedCodeActionKinds: RoastActionProvider.providedCodeActionKinds }
	);

	const hoverProvider = vscode.languages.registerHoverProvider(
		{ scheme: 'file', language: '*' },
		new RoastHoverProvider()
	);

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
		roastDecorationType,
		roastDiagnosticCollection,
		actionProvider,
		hoverProvider
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
	async function updateDecorations() {
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
		const diagnostics: vscode.Diagnostic[] = [];
		const enabledRules = getEnabledRules(languageId, config);

		let currentRoastCount = 0;

		// Apply regex-based rules
		// We use a for...of loop to handle async operations if needed (though we only need async for blame, which is per-match)
		// But regex.exec in a loop is synchronous.
		// We will collect all matches first, then process them (to handle async blame).

		const allMatches: { ruleId: string, insult: string, range: vscode.Range }[] = [];

		enabledRules.forEach(rule => {
			let match;
			const regex = new RegExp(rule.pattern);

			while ((match = regex.exec(text))) {
				const startPos = document.positionAt(match.index);
				const endPos = document.positionAt(match.index + match[0].length);
				const insult = rule.getInsult();

				allMatches.push({
					ruleId: rule.id,
					insult: insult,
					range: new vscode.Range(startPos, endPos)
				});

				currentRoastCount++;
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

					allMatches.push({
						ruleId: 'deepNesting',
						insult: nestingCheck.insult,
						range: range
					});

					currentRoastCount++;
					roastCounter.incrementCount(document.fileName, 'deepNesting');
				}
			});
		}

		// Now process all matches, potentially adding Git Blame
		// We process in parallel for speed
		const processedMatches = await Promise.all(allMatches.map(async match => {
			let finalInsult = match.insult;

			// Get git blame for the line
			try {
				const blame = await getBlameForLine(document.fileName, match.range.start.line);
				if (blame) {
					// Clean up the insult (remove << prefix if present for cleaner formatting)
					const cleanInsult = finalInsult.replace(' << ', '');
					finalInsult = ` << Hey ${blame}, ${cleanInsult}`;
				}
			} catch (e) {
				// Ignore blame errors
			}

			return { ...match, insult: finalInsult };
		}));

		processedMatches.forEach(match => {
			roasts.push({
				range: match.range,
				renderOptions: {
					after: {
						contentText: match.insult
					}
				}
			});

			diagnostics.push(new vscode.Diagnostic(
				match.range,
				match.insult.replace(' << ', ''),
				vscode.DiagnosticSeverity.Information
			));
		});

		// Apply decorations and diagnostics
		if (activeEditor && activeEditor.document === document) {
			activeEditor.setDecorations(roastDecorationType, roasts);
			roastDiagnosticCollection.set(document.uri, diagnostics);
		}

		// Update status bar
		statusBarManager.updateStatusBar(roastCounter.getSessionCount());
	}

	/**
	 * Roast of the Day
	 */
	function checkRoastOfTheDay(context: vscode.ExtensionContext) {
		const lastRoastDate = context.globalState.get<string>('lastRoastDate');
		const today = new Date().toDateString();

		if (lastRoastDate !== today) {
			const dailyRoasts = [
				"Your code is like a horror movie: full of jump scares and everyone dies at the end.",
				"I've seen better code written on a napkin during a blackout.",
				"Your variable names are so vague, even a psychic couldn't debug this.",
				"This repo belongs in an art gallery... as a warning about the dangers of over-engineering.",
				"If coding was a sport, you'd be the mascot. Great presence, questionable performance."
			];
			const randomRoast = dailyRoasts[Math.floor(Math.random() * dailyRoasts.length)];

			vscode.window.showInformationMessage(`🔥 Roast of the Day: ${randomRoast}`);
			context.globalState.update('lastRoastDate', today);
		}
	}

	/**
	 * Clear all decorations
	 */
	function clearAllDecorations() {
		if (activeEditor) {
			activeEditor.setDecorations(roastDecorationType, []);
			roastDiagnosticCollection.clear();
		}
	}
}

export function deactivate() {
	if (statusBarManager) {
		statusBarManager.dispose();
	}
}

