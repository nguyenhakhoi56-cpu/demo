const fs = require("fs");
const { execSync } = require("child_process");

const target = process.argv[2];

function formatDecls(declsText) {
    let cleaned = declsText
       .replace(/\r\n/g, "\n")
       .replace(/\s+/g, " ") // Collapse whitespace
       .replace(/\/\*[\s\S]*?\*\//g, ""); // Strip comments

    const lines = cleaned.split(';');
    const formatted = [];
    
    for (let line of lines) {
        line = line.trim();
        if (!line) continue;
        
        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) {
            formatted.push(line + ';');
            continue;
        }

        const prop = line.substring(0, colonIndex).trim();
        const val = line.substring(colonIndex + 1).trim();
        formatted.push(`${prop}: ${val};`);
    }

    return formatted.join('');
}

function formatSelector(selector) {
    selector = selector.trim().replace(/\s+/g, " ");
    // Remove space after @media and space after : inside query
    selector = selector.replace(/@media\s*\(\s*([a-zA-Z0-9_-]+)\s*:\s*([^)]+)\)/g, (match, prop, val) => {
        return `@media(${prop.trim()}:${val.trim()})`;
    });
    return selector;
}

function processCssCode(code) {
    const hasSelectors = /[^\s{}]+[\s\S]*?\{/.test(code);
    if (!hasSelectors) {
        return formatDecls(code);
    }

    let normalizedCode = code.replace(/\/\*[\s\S]*?\*\//g, "");

    function parseBlocks(input) {
        let result = "";
        let i = 0;
        
        while (i < input.length) {
            let braceIdx = input.indexOf('{', i);
            if (braceIdx === -1) {
                result += input.substring(i);
                break;
            }
            
            let selector = formatSelector(input.substring(i, braceIdx));
            
            let depth = 1;
            let j = braceIdx + 1;
            while (j < input.length && depth > 0) {
                if (input[j] === '{') depth++;
                else if (input[j] === '}') depth--;
                j++;
            }
            
            let innerContent = input.substring(braceIdx + 1, j - 1);
            i = j;
            
            if (selector.startsWith('@media') || selector.startsWith('@keyframes') || selector.startsWith('@supports')) {
                let cleanedInner = parseBlocks(innerContent).trim();
                if (cleanedInner) {
                    result += `${selector}{\n${cleanedInner}\n}\n`;
                }
            } else {
                let cleanedDecls = formatDecls(innerContent);
                if (cleanedDecls) {
                    result += `${selector}{${cleanedDecls}}\n`;
                }
            }
        }
        
        return result;
    }

    let parsed = parseBlocks(normalizedCode);
    
    // Apply indentation line-by-line
    let rawLines = parsed.split(/\r\n|\r|\n/);
    rawLines = rawLines.map(line => line.trim()).filter(line => line.length > 0);
    
    let indentLevel = 0;
    let finalLines = [];
    
    for (let line of rawLines) {
        let isClosing = line.startsWith('}');
        let displayIndent = isClosing ? Math.max(0, indentLevel - 1) : indentLevel;
        let indentStr = '\t'.repeat(displayIndent);
        finalLines.push(indentStr + line);
        
        let openBraces = (line.match(/\{/g) || []).length;
        let closeBraces = (line.match(/\}/g) || []).length;
        indentLevel += (openBraces - closeBraces);
        if (indentLevel < 0) indentLevel = 0;
    }
    
    return finalLines.join('\n');
}

function copyToClipboard(text) {
    try {
        execSync("clip", { input: text });
    } catch (e) {
        console.error("⚠️ Failed to copy to clipboard:", e.message);
    }
}

if (target) {
    try {
        let code = fs.readFileSync(target, "utf8");
        const result = processCssCode(code);
        fs.writeFileSync(target, result);
        copyToClipboard(result);
        console.log(`✅ [Modify] Processed "${target}" and copied to clipboard.`);
    } catch (error) {
        console.error(`❌ [Modify] Error processing "${target}":`, error.message);
    }
}
