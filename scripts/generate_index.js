const fs = require('fs');
const path = require('path');

// Read the catalog.json file
const catalogPath = path.join('output_md', 'catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

// Group items by category
const categories = {};
catalog.forEach(item => {
  if (!item.category) {
    item.category = 'uncategorized';
  }
  
  if (!categories[item.category]) {
    categories[item.category] = [];
  }
  
  categories[item.category].push(item);
});

// Generate HTML
let html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Documentation Index</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      border-bottom: 1px solid #eaecef;
      padding-bottom: 0.3em;
    }
    h2 {
      margin-top: 24px;
      margin-bottom: 16px;
      font-weight: 600;
      line-height: 1.25;
      padding-bottom: 0.3em;
      border-bottom: 1px solid #eaecef;
    }
    ul {
      padding-left: 2em;
    }
    li {
      margin: 8px 0;
    }
    a {
      color: #0366d6;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .category {
      margin-bottom: 30px;
    }
  </style>
</head>
<body>
  <h1>Documentation Index</h1>
`;

// Sort categories alphabetically
const sortedCategories = Object.keys(categories).sort();

// Add each category and its items
sortedCategories.forEach(category => {
  // Format category name for display (replace hyphens with spaces, capitalize)
  const displayCategory = category
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
  
  html += `
  <div class="category">
    <h2>${displayCategory}</h2>
    <ul>
  `;
  
  // Sort items by title
  categories[category].sort((a, b) => {
    if (a.title < b.title) return -1;
    if (a.title > b.title) return 1;
    return 0;
  });
  
  // Add each item
  categories[category].forEach(item => {
    html += `      <li><a href="/${item.path}">${item.title}</a></li>\n`;
  });
  
  html += `    </ul>
  </div>
  `;
});

html += `
</body>
</html>
`;

// Write the HTML to a file
fs.writeFileSync(path.join('output_md', 'index.html'), html);
console.log('Generated index.html in output_md directory');