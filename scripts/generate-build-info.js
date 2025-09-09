const fs = require('fs')
const path = require('path')

// Generate build timestamp
const buildTime = new Date().toISOString()
const buildInfo = {
  buildTime,
  buildTimeFormatted: new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  }),
}

// Write to a JSON file that can be imported
const outputPath = path.join(
  __dirname,
  '..',
  'src',
  'generated',
  'build-info.json',
)
const outputDir = path.dirname(outputPath)

// Ensure the directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

fs.writeFileSync(outputPath, JSON.stringify(buildInfo, null, 2))
console.log(`Build info generated: ${buildTime}`)
