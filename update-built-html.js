import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "dist");
const assetsDir = path.join(distDir, "assets");
const pagesDir = path.join(distDir, "pages");

// Find CSS file (shared across all pages)
function findCssFile() {
  const files = fs.readdirSync(assetsDir);
  const cssFile = files.find(
    (file) => file.startsWith("index-") && file.endsWith(".css")
  );

  if (!cssFile) {
    console.error("❌ Could not find built CSS file in /assets/");
    console.log("Available files:", files);
    process.exit(1);
  }

  return cssFile;
}

// Find JS file for a specific page (e.g., "index", "detail", "form")
function findJsFileForPage(pageName) {
  const files = fs.readdirSync(assetsDir);
  const jsFile = files.find(
    (file) => file.startsWith(`${pageName}-`) && file.endsWith(".js")
  );

  if (!jsFile) {
    console.error(`❌ Could not find JS file for page: ${pageName}`);
    console.log(
      "Available JS files:",
      files.filter((f) => f.endsWith(".js"))
    );
    process.exit(1);
  }

  return jsFile;
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
  console.log(`✅ Updated ${path.basename(filePath)} → JS: ${jsFileName}`);
}

function main() {
  console.log("🔧 Starting HTML update process...\n");

  // Find shared CSS file
  const cssFile = findCssFile();
  console.log(`📦 Found CSS: ${cssFile}\n`);

  // Update root index.html with index.js bundle
  const rootIndexPath = path.join(distDir, "index.html");
  if (fs.existsSync(rootIndexPath)) {
    const indexJsFile = findJsFileForPage("index");
    updateHtmlFile(rootIndexPath, cssFile, indexJsFile);
  } else {
    console.warn("⚠️  Root index.html not found in dist/");
  }

  // Update HTML files in pages directory
  if (fs.existsSync(pagesDir)) {
    const htmlFiles = fs
      .readdirSync(pagesDir)
      .filter((file) => file.endsWith(".html"));

    if (htmlFiles.length === 0) {
      console.warn("⚠️  No HTML files found in pages directory");
    } else {
      htmlFiles.forEach((file) => {
        const pageName = path.basename(file, ".html"); // e.g., "detail" or "form"
        const pageJsFile = findJsFileForPage(pageName);
        updateHtmlFile(path.join(pagesDir, file), cssFile, pageJsFile);
      });
    }
  } else {
    console.warn("⚠️  Pages directory not found:", pagesDir);
  }

  console.log(
    `\n✅ Build complete! All HTML files updated with correct bundles.`
  );
}

main();
