const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Function to extract frontmatter and create JSON from it
function processMdxFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { data, content: markdownContent } = matter(content);
    
    // Extract the first heading from content if it exists
    let title = data.title;
    if (!title) {
      const headingMatch = markdownContent.match(/^#\s+(.*)/m);
      if (headingMatch) {
        title = headingMatch[1];
      }
    }
    
    // Get folder path to determine category
    const relativePath = path.relative('/Users/dwertheimer/Developer/plugin-documentation', filePath);
    const pathParts = relativePath.split(path.sep);
    let category = '';
    
    // For app directory structure, use the first folder after 'app' as category
    if (pathParts.includes('app')) {
      const appIndex = pathParts.indexOf('app');
      if (appIndex + 1 < pathParts.length) {
        category = pathParts[appIndex + 1];
      }
    }
    
    // Calculate slug from file path
    const slug = path.basename(path.dirname(filePath));
    
    return {
      title: title || slug,
      slug,
      category,
      description: data.description || '',
      path: relativePath,
      tags: data.tags || [],
      frontmatter: data
    };
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return null;
  }
}

// Get all .mdx files from src/app
const mdxFiles = process.argv.slice(2);

// Process each file
const results = [];
mdxFiles.forEach(filePath => {
  const result = processMdxFile(filePath);
  if (result) {
    results.push(result);
  }
});

// Write results to output file
const outputDir = 'output_md';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Write individual JSON files
results.forEach(result => {
  if (result.slug) {
    const outputPath = path.join(outputDir, `${result.slug}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
  }
});

// Write combined catalog
fs.writeFileSync(
  path.join(outputDir, 'catalog.json'), 
  JSON.stringify(results, null, 2)
);

console.log(`Processed ${results.length} files. Output saved to ${outputDir}/catalog.json`);