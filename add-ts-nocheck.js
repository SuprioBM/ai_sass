const fs = require("fs");
const path = require("path");

const folders = [
  "./src/components/ui",
  "./prisma",
  "./src/generated",
  "./src/lib",
];

function addTsNoCheckToFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  if (content.startsWith("// @ts-nocheck")) return; // already added
  const updated = `// @ts-nocheck\n${content}`;
  fs.writeFileSync(filePath, updated, "utf8");
  console.log("✅ Patched:", filePath);
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith(".ts") || fullPath.endsWith(".tsx")) {
      addTsNoCheckToFile(fullPath);
    }
  }
}

for (const folder of folders) {
  if (fs.existsSync(folder)) {
    walk(folder);
  } else {
    console.warn("⚠️ Folder not found:", folder);
  }
}
