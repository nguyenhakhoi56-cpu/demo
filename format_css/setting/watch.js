const fs = require("fs");
const { execSync } = require("child_process");

console.log(`\n🚀 [CSS Multi-Watcher Active]`);
console.log(`👀 Watching "clean.txt"  -> Will run: node clean.js clean.txt`);
console.log(`👀 Watching "modify.txt" -> Will run: node modify.js modify.txt`);
console.log(`💡 Press Ctrl+C in this terminal to stop the watcher.\n`);

function setupWatcher(targetFile, scriptToRun) {
    let fsWait = false;
    
    // Create file if it doesn't exist
    if (!fs.existsSync(targetFile)) {
        fs.writeFileSync(targetFile, "\n");
    }

    fs.watch(targetFile, (event, filename) => {
        if (filename && event === "change") {
            if (fsWait) return;
            fsWait = setTimeout(() => {
                fsWait = false;
            }, 300); // Debounce to prevent double-firing

            console.log(`⚡ [${new Date().toLocaleTimeString()}] "${targetFile}" saved! Running ${scriptToRun}...`);
            try {
                execSync(`node ${scriptToRun} ${targetFile}`, { stdio: "inherit" });
            } catch (error) {
                console.error(`❌ Error running ${scriptToRun}:`, error.message);
            }
        }
    });
}

// Start both watchers in parallel
setupWatcher("clean.txt", "setting/clean.js");
setupWatcher("modify.txt", "setting/modify.js");
