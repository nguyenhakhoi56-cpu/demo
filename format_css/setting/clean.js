const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const target = process.argv[2];

function hasDecimal(value) {
   return /-?\d*\.\d+/.test(value);
}

function cleanDecls(declsText) {
    let cleaned = declsText
       .replace(/\r\n/g, "\n")
       .replace(/\/\*[\s\S]*?\*\//g, "")
       .replace(/(?<!-)\b(box-sizing|position|top|right|bottom|left|display|flex|flex[a-z-]*|grid|grid-[a-z-]*|justify-content|justify-[a-z-]*|align-items|align-content|align-self|gap|order|width|max-width|min-width|max-height|min-height|margin|margin-[a-z-]*|font-style|text-align|clip-path|path|transform|vertical-align|content|float|clear|flex-shrink|flex-grow|flex-basis|leading-trim|text-edge|isolation)\s*:\s*[^;]+;\s*/g, "")
       .replace(/(?<!-)\bheight\s*:\s*[^;]+;\s*/g, "")
       .replace(/padding\s*:\s*([^;]+);\s*/g, (match, value) => {
          if (hasDecimal(value)) return "";
          const v = value.trim().toLowerCase().replace(/\s+/g, " ");
          if (/^0(?:px)?(?:\s+0(?:px)?)*$/.test(v)) return "";
          return match;
       })
       .replace(/padding-(top|right|bottom|left)\s*:\s*[^;]+;\s*/g, "")
       .replace(/font-family:\s*'?Pretendard'?;\s*/g, "")
       .replace(/#([0-9a-fA-F]{6})/g, (m, hex) => {
          hex = hex.toLowerCase();
          if (hex[0] === hex[1] && hex[2] === hex[3] && hex[4] === hex[5]) {
             return "#" + hex[0] + hex[2] + hex[4];
          }
          return "#" + hex;
       });

    const lines = cleaned.split(/[\n;]/);
    const declarations = [];
    const lastIndexMap = new Map();

    let index = 0;
    for (let line of lines) {
       line = line.trim();
       if (!line) continue;
       
       const colonIndex = line.indexOf(':');
       if (colonIndex === -1) continue;

       const prop = line.substring(0, colonIndex).trim().toLowerCase();
       const val = line.substring(colonIndex + 1).trim();
       const raw = `${prop}: ${val};`;

       if (lastIndexMap.has(raw)) {
          const lastIdx = lastIndexMap.get(raw);
          if (index - lastIdx <= 3) {
             continue;
          }
       }

       declarations.push(raw);
       lastIndexMap.set(raw, index);
       index++;
    }

    const uniqueDecls = Array.from(new Set(declarations));
    return uniqueDecls.join('');
}

function formatIndentationAndSpacing(code) {
    let rawLines = code.split(/\r\n|\r|\n/);
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

function formatSelector(selector) {
    selector = selector.trim();
    // Remove space after @media and space after : inside query
    selector = selector.replace(/@media\s*\(\s*([a-zA-Z0-9_-]+)\s*:\s*([^)]+)\)/g, (match, prop, val) => {
        return `@media(${prop.trim()}:${val.trim()})`;
    });
    return selector;
}

function cleanSelectorBased(code) {
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
                let cleanedDecls = cleanDecls(innerContent);
                if (cleanedDecls) {
                    result += `${selector}{${cleanedDecls}}\n`;
                }
            }
        }
        
        return result;
    }

    let parsed = parseBlocks(normalizedCode);
    return formatIndentationAndSpacing(parsed);
}

function cleanRawFigma(code) {
   code = code.replace(/[{}]/g, "");

   let preCleaned = "";
   const parts = code.split(/\/\*([\s\S]*?)\*\//);
   preCleaned = parts[0] || "";

   for (let i = 1; i < parts.length; i += 2) {
      const comment = parts[i];
      const content = parts[i + 1] || "";
      const trimmedComment = comment.trim();
      
      if (
         /path|vector/i.test(trimmedComment) ||
         /\bg\d+\b/i.test(trimmedComment) ||
         /\bgroup \d+\b/i.test(trimmedComment)
      ) {
         continue;
      }
      
      preCleaned += `/*${comment}*/${content}`;
   }

   let cleaned = preCleaned
      .replace(/\r\n/g, "\n")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/(?<!-)\b(box-sizing|position|top|right|bottom|left|display|flex|flex[a-z-]*|justify-content|align-items|align-self|gap|order|width|max-width|min-width|max-height|min-height|margin|font-style|text-align|clip-path|path|transform|leading-trim|text-edge|isolation)\s*:\s*[^;]+;\s*/g, "")
      .replace(/(?<!-)\bheight\s*:\s*[^;]+;\s*/g, "")
      .replace(/padding\s*:\s*([^;]+);\s*/g, (match, value) => {
         if (hasDecimal(value)) return "";
         const v = value.trim().toLowerCase().replace(/\s+/g, " ");
         if (/^0(?:px)?(?:\s+0(?:px)?)*$/.test(v)) return "";
         return match;
      })
      .replace(/font-family:\s*'?Pretendard'?;\s*/g, "")
      .replace(/#([0-9a-fA-F]{6})/g, (m, hex) => {
         hex = hex.toLowerCase();
         if (hex[0] === hex[1] && hex[2] === hex[3] && hex[4] === hex[5]) {
            return "#" + hex[0] + hex[2] + hex[4];
         }
         return "#" + hex;
      });

   const lines = cleaned.split(/[\n;]/);
   const declarations = [];
   const lastIndexMap = new Map();
   const fontProps = new Set(['font-family', 'font-style', 'font-weight', 'font-size', 'line-height', 'letter-spacing', 'color']);

   let index = 0;
   for (let line of lines) {
      line = line.trim();
      if (!line) continue;
      
      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) continue;

      const prop = line.substring(0, colonIndex).trim().toLowerCase();
      const val = line.substring(colonIndex + 1).trim();
      const raw = `${prop}: ${val};`;

      if (lastIndexMap.has(raw)) {
         const lastIdx = lastIndexMap.get(raw);
         if (index - lastIdx <= 3) {
            continue;
         }
      }

      declarations.push({ prop, val, raw });
      lastIndexMap.set(raw, index);
      index++;
   }

   const groups = [];
   let currentGroup = [];
   let currentGroupProps = new Set();
   let currentGroupIsFont = null;

   for (const decl of declarations) {
      const isFont = fontProps.has(decl.prop);
      const shouldStartNew = 
         (currentGroupIsFont !== null && currentGroupIsFont !== isFont) ||
         currentGroupProps.has(decl.prop);

      if (shouldStartNew) {
         if (currentGroup.length > 0) {
            groups.push('{' + currentGroup.join('') + '}');
         }
         currentGroup = [];
         currentGroupProps = new Set();
      }

      if (!currentGroup.includes(decl.raw)) {
         currentGroup.push(decl.raw);
         currentGroupProps.add(decl.prop);
         currentGroupIsFont = isFont;
      }
   }

   if (currentGroup.length > 0) {
      groups.push('{' + currentGroup.join('') + '}');
   }

   const uniqueGroups = Array.from(new Set(groups));
   return uniqueGroups.join('\n');
}

function cleanCss(code) {
   const hasSelectors = /[^\s{}]+[\s\S]*?\{/.test(code);
   if (hasSelectors) {
      return cleanSelectorBased(code);
   } else {
      return cleanRawFigma(code);
   }
}

function copyToClipboard(text) {
   execSync("clip", { input: text });
}

function processFile(file, shouldCopy = false) {
   let code = fs.readFileSync(file, "utf8");
   code = cleanCss(code);
   fs.writeFileSync(file, code);
   if (shouldCopy) {
      copyToClipboard(code);
   }
   console.log(`✅ ${file}`);
}

function scanCss(dir) {
   const files = fs.readdirSync(dir);
   for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
         scanCss(fullPath);
      } else if (file.endsWith(".css")) {
         processFile(fullPath);
      }
   }
}

if (target) {
   processFile(target, true);
} else {
   scanCss(".");
}