import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "dist");
const assetsDir = path.join(distDir, "assets");
const pagesDir = path.join(distDir, "pages");

// Dynamically find the built CSS and JS files
function findAssetFiles() {
  const files = fs.readdirSync(assetsDir);
  
  const cssFile = files.find(
    (file) => file.startsWith("index-") && file.endsWith(".css")
  );
  const jsFile = files.find(
    (file) => file.startsWith("index-") && file.endsWith(".js")
  );

  if (!cssFile || !jsFile) {
    console.error("❌ Could not find built CSS or JS files in /assets/");
    console.log("Available files:", files);
    process.exit(1);
  }

  return { cssFile, jsFile };
}

function updateHtmlFile(filePath, cssFileName, jsFileName) {
  let html = fs.readFileSync(filePath, "utf-8");

  // Remove all development CSS links
  html = html.replace(
    /<link rel="stylesheet" href="\/src\/css[^"]*" ?\/?>\n*/g,
    ""
  );

  // Remove all development JS script tags
  html = html.replace(
    /<script type="module" src="\/src\/js[^"]*"><\/script>\n*/g,
    ""
  );

  // Inject production assets before </head>
  const injection = `  <link rel="stylesheet" href="/assets/${cssFileName}" crossorigin>
  <script type="module" src="/assets/${jsFileName}" crossorigin></script>`;

  html = html.replace("</head>", `${injection}\n</head>`);

  fs.writeFileSync(filePath, html, "utf-8");
  console.log(`✅ Updated ${path.basename(filePath)}`);
}

function main() {
  console.log("🔧 Starting HTML update process...\n");

  // Check if pages directory exists
  if (!fs.existsSync(pagesDir)) {
    console.error("❌ Pages directory not found:", pagesDir);
    process.exit(1);
  }

  // Find the built assets
  const { cssFile, jsFile } = findAssetFiles();
  console.log(`📦 Found assets:\n  - CSS: ${cssFile}\n  - JS: ${jsFile}\n`);

  // Update all HTML files in pages directory
  const htmlFiles = fs
    .readdirSync(pagesDir)
    .filter((file) => file.endsWith(".html"));

  if (htmlFiles.length === 0) {
    console.warn("⚠️  No HTML files found in pages directory");
    return;
  }

  htmlFiles.forEach((file) => {
    updateHtmlFile(path.join(pagesDir, file), cssFile, jsFile);
  });

  console.log(`\n✅ Successfully updated ${htmlFiles.length} HTML file(s)`);
}

main();
