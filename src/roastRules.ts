export interface RoastRule {
    id: string;
    name: string;
    pattern: RegExp;
    languages?: string[];
    category: 'anti-pattern' | 'code-smell' | 'procrastination' | 'modern-practice' | 'security';
    getInsult: () => string;
    enabled: boolean;
}

// Insult collections
const insults = {
    var: [
        " << What is this, 2015? Use let/const.",
        " << var? seriously? ok boomer.",
        " << You are polluting the global scope.",
        " << ES6 called, they want their syntax back.",
        " << Function scope? How retro."
    ],
    consoleLog: [
        " << classic debugger technique.",
        " << don't forget to delete this.",
        " << your code is screaming for help.",
        " << Production logs go brrr.",
        " << Real developers use a debugger."
    ],
    anyType: [
        " << 'any'? just say you gave up.",
        " << Type safety left the chat.",
        " << laziness detected.",
        " << TypeScript is crying right now.",
        " << Why even use TypeScript?"
    ],
    todo: [
        " << You and I both know you won't do this.",
        " << Lies. Pure lies.",
        " << Ticket #NEVER-HAPPENING",
        " << TODO: Actually do the TODO.",
        " << This will be here in 5 years."
    ],
    nested: [
        " << You are building a pyramid, not a feature.",
        " << Cyclomatic complexity is over 9000.",
        " << Flatten this or I quit.",
        " << Callback hell's cousin.",
        " << Extract a function, please."
    ],
    longFunction: [
        " << I am not reading all of that.",
        " << Refactor this monstrosity.",
        " << SRP violation in progress.",
        " << This function does EVERYTHING.",
        " << TL;DR"
    ],
    looseEquality: [
        " << == is for the weak.",
        " << Type coercion is not your friend.",
        " << === exists for a reason.",
        " << Enjoy your bugs.",
        " << JavaScript quirks incoming."
    ],
    magicNumber: [
        " << What does this number mean?",
        " << Extract to a constant.",
        " << Magic numbers are not magical.",
        " << Future you will hate this.",
        " << const WHAT_IS_THIS = ?"
    ],
    emptyBlock: [
        " << Empty catch? Bold strategy.",
        " << Swallowing errors like a pro.",
        " << Error handling: 404 not found.",
        " << At least log something.",
        " << Silent failures are the best failures."
    ],
    eval: [
        " << eval() is evil.",
        " << Security vulnerability detected.",
        " << There's ALWAYS a better way.",
        " << Your code just got pwned.",
        " << This is how hacks happen."
    ],
    react: [
        " << manual DOM manipulation in React? Brave.",
        " << dangerouslySetInnerHTML: living life on the edge.",
        " << index as key? Enjoy your weird re-renders.",
        " << inline functions in props: performance says hi.",
        " << useMemo( ( ) => { stop_over-optimizing }, [] )"
    ],
    security: [
        " << http://? Welcome to 1995. Use HTTPS.",
        " << Hardcoded secret? I'm stealing this.",
        " << Your security is a screen door.",
        " << Vulnerability detected: laziness.",
        " << Is this a backdoor or just bad code?"
    ]
};

// Helper to get random insult
function getRandomInsult(category: keyof typeof insults): string {
    const list = insults[category];
    return list[Math.floor(Math.random() * list.length)];
}

// all roast rules
export const roastRules: RoastRule[] = [
    {
        id: 'varUsage',
        name: 'var keyword usage',
        pattern: /\bvar\s+/g,
        category: 'anti-pattern',
        getInsult: () => getRandomInsult('var'),
        enabled: true
    },
    {
        id: 'consoleLog',
        name: 'console.log statements',
        pattern: /console\.log\(/g,
        category: 'code-smell',
        getInsult: () => getRandomInsult('consoleLog'),
        enabled: true
    },
    {
        id: 'anyType',
        name: 'any type usage',
        pattern: /:\s*any\b/g,
        languages: ['typescript', 'typescriptreact'],
        category: 'anti-pattern',
        getInsult: () => getRandomInsult('anyType'),
        enabled: true
    },
    {
        id: 'todoComments',
        name: 'TODO comments',
        pattern: /\/\/\s*TODO/gi,
        category: 'procrastination',
        getInsult: () => getRandomInsult('todo'),
        enabled: true
    },
    {
        id: 'looseEquality',
        name: 'loose equality (==)',
        pattern: /[^=!<>]==[^=]/g,
        category: 'anti-pattern',
        getInsult: () => getRandomInsult('looseEquality'),
        enabled: true
    },
    {
        id: 'eval',
        name: 'eval() usage',
        pattern: /\beval\s*\(/g,
        category: 'security',
        getInsult: () => getRandomInsult('eval'),
        enabled: true
    },
    {
        id: 'emptyBlock',
        name: 'empty catch blocks',
        pattern: /catch\s*\([^)]*\)\s*\{\s*\}/g,
        category: 'code-smell',
        getInsult: () => getRandomInsult('emptyBlock'),
        enabled: true
    },
    {
        id: 'dangerouslySetInnerHTML',
        name: 'Dangerously Set Inner HTML',
        pattern: /dangerouslySetInnerHTML/g,
        languages: ['javascriptreact', 'typescriptreact'],
        category: 'security',
        getInsult: () => getRandomInsult('react'),
        enabled: true
    },
    {
        id: 'indexAsKey',
        name: 'Index as Key',
        pattern: /\.map\s*\(\s*\([^)]+,\s*index\)\s*=>\s*[^}]*key=\{index\}/g,
        languages: ['javascriptreact', 'typescriptreact'],
        category: 'anti-pattern',
        getInsult: () => getRandomInsult('react'),
        enabled: true
    },
    {
        id: 'httpUsage',
        name: 'Unsecure HTTP Usage',
        pattern: /http:\/\/[a-z0-9]/gi,
        category: 'security',
        getInsult: () => getRandomInsult('security'),
        enabled: true
    },
    {
        id: 'hardcodedSecret',
        name: 'Hardcoded Secrets',
        pattern: /(password|secret|api_key|token)\s*[:=]\s*['"`][^'"`]{8,}['"`]/gi,
        category: 'security',
        getInsult: () => getRandomInsult('security'),
        enabled: true
    }
];

export function getEnabledRules(languageId: string, config: any): RoastRule[] {
    return roastRules.filter(rule => {
        // Check if rule is enabled in config
        const ruleEnabled = config?.rules?.[rule.id] !== false;

        // Check if rule applies to this language
        const languageMatch = !rule.languages || rule.languages.includes(languageId);

        return ruleEnabled && languageMatch && rule.enabled;
    });
}

export function checkDeepNesting(line: string, lineNumber: number): { hasNesting: boolean; insult: string } {
    const hasDeepNesting = /^\s{12,}/.test(line) || /^\t{3,}/.test(line);

    if (hasDeepNesting) {
        const trimmed = line.trim();
        if (trimmed.startsWith('if') || trimmed.startsWith('for') ||
            trimmed.startsWith('while') || trimmed.startsWith('switch')) {
            return {
                hasNesting: true,
                insult: getRandomInsult('nested')
            };
        }
    }

    return { hasNesting: false, insult: '' };
}

export function checkLongFunction(text: string, position: number): { isLong: boolean; insult: string } {
    const beforeText = text.substring(0, position);
    const afterText = text.substring(position);

    const functionStart = beforeText.lastIndexOf('function');
    const functionEnd = afterText.indexOf('}');

    if (functionStart !== -1 && functionEnd !== -1) {
        const functionText = text.substring(functionStart, position + functionEnd);
        const lineCount = functionText.split('\n').length;

        if (lineCount > 50) {
            return {
                isLong: true,
                insult: getRandomInsult('longFunction')
            };
        }
    }

    return { isLong: false, insult: '' };
}
