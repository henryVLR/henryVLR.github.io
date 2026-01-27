const fs = require('fs');
require('dotenv').config();

// Read the HTML file
let html = fs.readFileSync('index.html', 'utf8');

// Inject environment variables
html = html.replace(
  '<script>\n  // Environment variables',
  `<script>
  // Environment variables (injected during build)
  window.env = {
    GITHUB_TOKEN: '${process.env.GITHUB_TOKEN}',
    GITHUB_USER: '${process.env.GITHUB_USER}',
    GITHUB_REPO: '${process.env.GITHUB_REPO}'
  };`
);

// Write the built file
fs.writeFileSync('dist/index.html', html);
console.log('Build complete!');
