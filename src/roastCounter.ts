/**
 * Roast Counter and Statistics Tracker
 * Tracks roast counts, achievements, and statistics
 */

import * as vscode from 'vscode';

export class RoastCounter {
    private sessionCount: number = 0;
    private fileRoastCounts: Map<string, number> = new Map();
    private ruleViolationCounts: Map<string, number> = new Map();
    private achievements: Set<string> = new Set();

    /**
     * Increment roast count for current session and file
     */
    public incrementCount(fileName: string, ruleId: string): void {
        this.sessionCount++;

        // Track per-file counts
        const currentFileCount = this.fileRoastCounts.get(fileName) || 0;
        this.fileRoastCounts.set(fileName, currentFileCount + 1);

        // Track per-rule counts
        const currentRuleCount = this.ruleViolationCounts.get(ruleId) || 0;
        this.ruleViolationCounts.set(ruleId, currentRuleCount + 1);

        // Check for achievements
        this.checkAchievements();
    }

    /**
     * Get total session roast count
     */
    public getSessionCount(): number {
        return this.sessionCount;
    }

    /**
     * Get roast count for specific file
     */
    public getFileCount(fileName: string): number {
        return this.fileRoastCounts.get(fileName) || 0;
    }

    /**
     * Get most violated rule
     */
    public getMostViolatedRule(): { ruleId: string; count: number } | null {
        let maxRule: string | null = null;
        let maxCount = 0;

        this.ruleViolationCounts.forEach((count, ruleId) => {
            if (count > maxCount) {
                maxCount = count;
                maxRule = ruleId;
            }
        });

        return maxRule ? { ruleId: maxRule, count: maxCount } : null;
    }

    /**
     * Check and unlock achievements
     */
    private checkAchievements(): void {
        const milestones = [
            { count: 10, id: 'rookie', title: 'Rookie Mistakes', message: '10 roasts! You\'re just getting started.' },
            { count: 50, id: 'collector', title: 'Code Smell Collector', message: '50 roasts! Your code has a unique aroma.' },
            { count: 100, id: 'enthusiast', title: 'Anti-Pattern Enthusiast', message: '100 roasts! You\'re committed to bad practices.' },
            { count: 500, id: 'dangerous', title: 'Officially Dangerous', message: '500 roasts! Please stop coding. 🔥' }
        ];

        milestones.forEach(milestone => {
            if (this.sessionCount >= milestone.count && !this.achievements.has(milestone.id)) {
                this.achievements.add(milestone.id);
                this.showAchievementNotification(milestone.title, milestone.message);
            }
        });
    }

    /**
     * Show achievement notification
     */
    private showAchievementNotification(title: string, message: string): void {
        vscode.window.showInformationMessage(
            `🏆 Achievement Unlocked: ${title} - ${message}`
        );
    }

    /**
     * Get statistics summary
     */
    public getStatistics(): string {
        const mostViolated = this.getMostViolatedRule();

        let stats = `📊 Roast Statistics\n\n`;
        stats += `Total Roasts This Session: ${this.sessionCount}\n`;
        stats += `Files Roasted: ${this.fileRoastCounts.size}\n`;
        stats += `Achievements Unlocked: ${this.achievements.size}/4\n\n`;

        if (mostViolated) {
            stats += `Most Common Violation: ${mostViolated.ruleId} (${mostViolated.count} times)\n\n`;
        }

        stats += `Achievements:\n`;
        const achievementList = [
            { id: 'rookie', name: 'Rookie Mistakes (10)' },
            { id: 'collector', name: 'Code Smell Collector (50)' },
            { id: 'enthusiast', name: 'Anti-Pattern Enthusiast (100)' },
            { id: 'dangerous', name: 'Officially Dangerous (500)' }
        ];

        achievementList.forEach(achievement => {
            const unlocked = this.achievements.has(achievement.id);
            stats += `${unlocked ? '✅' : '⬜'} ${achievement.name}\n`;
        });

        return stats;
    }

    /**
     * Get shareable summary for social media
     */
    public getShareableSummary(): string {
        const mostViolated = this.getMostViolatedRule();
        const emojiLevel = this.sessionCount > 100 ? '💀' : this.sessionCount > 50 ? '🔥' : '🌱';

        let shareText = `🔥 My Roast Stats ${emojiLevel}\n\n`;
        shareText += `Total Roasts: ${this.sessionCount}\n`;
        shareText += `Files Roasted: ${this.fileRoastCounts.size}\n`;
        shareText += `Most Common Fail: ${mostViolated?.ruleId || 'None'}\n\n`;
        shareText += `#RoastExtension #CodeRoast #VSCode`;

        return shareText;
    }

    /**
     * Reset session statistics
     */
    public reset(): void {
        this.sessionCount = 0;
        this.fileRoastCounts.clear();
        this.ruleViolationCounts.clear();
        // Keep achievements - they persist across resets
    }
}
