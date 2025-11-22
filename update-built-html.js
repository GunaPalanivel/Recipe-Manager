import fs from "fs";
import path from "path";

// Replace these with your actual generated build filenames (or read dynamically if you want)
const cssFileName = "index-BcPaCzFw.css";
const jsFileName = "index-DfaLIkMx.js";

const pagesDir = path.resolve("dist/pages");

function updateHtmlFile(filePath) {
  let html = fs.readFileSync(filePath, "utf-8");

  // Remove all <link rel="stylesheet" href="/src/css/..."> lines
  html = html.replace(
    /<link rel="stylesheet" href="\/src\/css[^"]*" ?\/?>\n*/g,
    ""
  );

  // Remove all <script src="/src/js/..."></script> lines
  html = html.replace(
    /<script type="module" src="\/src\/js[^"]*"><\/script>\n*/g,
    ""
  );

  // Inject correct built CSS/JS links before </head>
  const injection = `
<link rel="stylesheet" href="/assets/${cssFileName}" crossorigin>
<script type="module" src="/assets/${jsFileName}" crossorigin></script>
`;

  html = html.replace("</head>", injection + "\n</head>");

  fs.writeFileSync(filePath, html, "utf-8");
  console.log(`Updated ${filePath}`);
}

fs.readdirSync(pagesDir).forEach((file) => {
  if (file.endsWith(".html")) {
    updateHtmlFile(path.join(pagesDir, file));
  }
});
