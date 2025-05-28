const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Function to get files with .md or .mdx extension
function getMarkdownFiles() {
  const mdFiles = [];
  
  // Root .md files
  const rootMdFiles = fs.readdirSync('.')
    .filter(file => file.endsWith('.md'))
    .map(file => path.join('.', file));
  
  // MDX files in src/app
  function walkDir(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        walkDir(filePath);
      } else if (file.endsWith('.mdx') || file.endsWith('.md')) {
        mdFiles.push(filePath);
      }
    }
  }
  
  walkDir('./src/app');
  return [...rootMdFiles, ...mdFiles];
}

// Function to extract title from frontmatter or content
function getFileTitle(filePath, content) {
  try {
    const { data, content: markdownContent } = matter(content);
    
    // Try to get title from frontmatter
    if (data.title) {
      return data.title;
    }
    
    // Try to get first heading from content
    const headingMatch = markdownContent.match(/^#\s+(.*)/m);
    if (headingMatch) {
      return headingMatch[1];
    }
    
    // Fallback to file name
    return path.basename(filePath, path.extname(filePath));
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return path.basename(filePath, path.extname(filePath));
  }
}

// Main function
function concatenateFiles() {
  const files = getMarkdownFiles();
  console.log(`Found ${files.length} markdown files to concatenate.`);
  
  let outputContent = '';
  
  for (const filePath of files) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const title = getFileTitle(filePath, content);
      
      // Add separator and title
      outputContent += '\n\n' + '='.repeat(80) + '\n';
      outputContent += `# ${title}\n`;
      outputContent += `File: ${filePath}\n`;
      outputContent += '='.repeat(80) + '\n\n';
      
      // Add file content
      outputContent += content;
    } catch (error) {
      console.error(`Error reading ${filePath}:`, error);
    }
  }
  
  // Write the concatenated content to a file
  fs.writeFileSync('all_documentation.md', outputContent);
  console.log('All documentation concatenated to all_documentation.md');
}

// Run the main function
concatenateFiles();