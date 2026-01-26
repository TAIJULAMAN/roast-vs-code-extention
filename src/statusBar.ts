/**
 * Status Bar Manager
 * Manages the status bar item showing roast count
 */

import * as vscode from 'vscode';

export class StatusBarManager {
    private statusBarItem: vscode.StatusBarItem;
    private isEnabled: boolean = true;

    constructor() {
        this.statusBarItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right,
            100
        );
        this.statusBarItem.command = 'vs-roast.toggleRoastMode';
        this.statusBarItem.tooltip = 'Click to toggle VS Roast';
        this.updateStatusBar(0);
        this.statusBarItem.show();
    }

    /**
     * Update status bar with current roast count
     */
    public updateStatusBar(count: number): void {
        const icon = this.isEnabled ? '🔥' : '💤';
        const status = this.isEnabled ? 'ON' : 'OFF';
        this.statusBarItem.text = `${icon} Roasts: ${count} (${status})`;
    }

    /**
     * Toggle enabled state
     */
    public toggleEnabled(): void {
        this.isEnabled = !this.isEnabled;
    }

    /**
     * Get enabled state
     */
    public getEnabled(): boolean {
        return this.isEnabled;
    }

    /**
     * Set enabled state
     */
    public setEnabled(enabled: boolean): void {
        this.isEnabled = enabled;
    }

    /**
     * Dispose status bar item
     */
    public dispose(): void {
        this.statusBarItem.dispose();
    }
}
