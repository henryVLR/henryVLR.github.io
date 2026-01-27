const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Read the original HTML file
const htmlPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Check if environment variables are loaded
if (!process.env.GITHUB_TOKEN || !process.env.GITHUB_USER || !process.env.GITHUB_REPO) {
  console.error('❌ Missing environment variables in .env file!');
  console.error('Please create a .env file with:');
  console.error('GITHUB_TOKEN=ghp_your_token_here');
  console.error('GITHUB_USER=your-username');
  console.error('GITHUB_REPO=your-repo-name');
  process.exit(1);
}

// Replace the placeholder script with actual environment variables
const envScript = `<script>
  // Environment variables (injected during build)
  window.env = {
    GITHUB_TOKEN: '${process.env.GITHUB_TOKEN}',
    GITHUB_USER: '${process.env.GITHUB_USER}',
    GITHUB_REPO: '${process.env.GITHUB_REPO}'
  };
</script>`;

// Find and replace the script section
const scriptStart = html.indexOf('<script>');
const scriptEnd = html.indexOf('</script>', scriptStart);

if (scriptStart !== -1 && scriptEnd !== -1) {
  const oldScript = html.substring(scriptStart, scriptEnd + 9);
  html = html.replace(oldScript, envScript);
} else {
  // If no script tag found, add it before the closing head tag
  html = html.replace('</head>', envScript + '\n</head>');
}

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// Copy other assets to dist folder
const assetsToCopy = ['images', 'media', 'fonts', 'musics'];
assetsToCopy.forEach(folder => {
  const source = path.join(__dirname, folder);
  const dest = path.join(distDir, folder);
  
  if (fs.existsSync(source)) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    // Simple file copy (for small projects)
    const files = fs.readdirSync(source);
    files.forEach(file => {
      const sourceFile = path.join(source, file);
      const destFile = path.join(dest, file);
      fs.copyFileSync(sourceFile, destFile);
    });
  }
});

// Write the built HTML file
const outputPath = path.join(distDir, 'index.html');
fs.writeFileSync(outputPath, html);

console.log('✅ Build complete! Files saved to /dist folder');
console.log(`✅ GitHub User: ${process.env.GITHUB_USER}`);
console.log(`✅ GitHub Repo: ${process.env.GITHUB_REPO}`);
console.log(`✅ Token loaded: ${process.env.GITHUB_TOKEN ? 'Yes' : 'No'}`);
