#!/usr/bin/env node

/**
 * Script to generate the locations data for the UDelaWhere? game
 * This reads all coordinates from the text files and formats them for use in the game
 */

const fs = require('fs');
const path = require('path');

// Configuration
const ASSETS_DIR = path.join(__dirname, '../public/assets');
const LOCATIONS_DIR = path.join(__dirname, '../public/locations');
const OUTPUT_FILE = path.join(__dirname, '../src/data/locations.json');

function parseCoordinates(coordString) {
  // Format expected: "39.68010N,75.75369W"
  // Also handle with space: "39.68010N, 75.75369W"
  const regex = /(\d+\.\d+)\s*([NS]),\s*(\d+\.\d+)\s*([EW])/;
  const match = coordString.match(regex);
  
  if (!match) {
    console.error(`Invalid coordinate format: ${coordString}`);
    return null;
  }
  
  let lat = parseFloat(match[1]);
  if (match[2] === 'S') lat = -lat;
  
  let lng = parseFloat(match[3]);
  if (match[4] === 'W') lng = -lng;
  
  return [lat, lng];
}

function generateLocationsData() {
  const locations = [];
  
  // Get all directories in the assets folder
  const dirs = fs.readdirSync(ASSETS_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .filter(name => name.startsWith('img'));
  
  // Sort numerically by extracting the number from the folder name
  dirs.sort((a, b) => {
    const numA = parseInt(a.replace('img', ''));
    const numB = parseInt(b.replace('img', ''));
    return numA - numB;
  });
  
  // Process each directory
  for (const dir of dirs) {
    const dirPath = path.join(ASSETS_DIR, dir);
    const coordsFile = path.join(dirPath, 'cords.txt');
    
    // Skip if there's no coordinates file
    if (!fs.existsSync(coordsFile)) {
      console.warn(`No coordinates file found for ${dir}, skipping...`);
      continue;
    }
    
    // Read and parse coordinates
    const coordsContent = fs.readFileSync(coordsFile, 'utf8').trim();
    const coordinates = parseCoordinates(coordsContent);
    
    if (!coordinates) {
      console.warn(`Could not parse coordinates for ${dir}: "${coordsContent}"`);
      continue;
    }
    
    // Check if the corresponding location directory exists
    const locationDirPath = path.join(LOCATIONS_DIR, dir);
    if (!fs.existsSync(locationDirPath)) {
      console.warn(`No location directory found for ${dir} at ${locationDirPath}, skipping...`);
      continue;
    }
    
    // Find the image file in the assets directory (for the name)
    const imageFiles = fs.readdirSync(dirPath)
      .filter(file => file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png'));
    
    if (imageFiles.length === 0) {
      console.warn(`No image file found in ${dir}, using directory name as image name`);
      imageName = dir;
    } else {
      // Get the image name for description
      imageName = path.basename(imageFiles[0], path.extname(imageFiles[0]));
    }
    
    // Create location object
    const location = {
      id: dir,
      image: `/locations/${dir}/`,  // Path to cubemap directory
      coordinates,
      name: imageName
    };
    
    locations.push(location);
    console.log(`Added location: ${dir} - ${imageName}`);
  }
  
  return locations;
}

// Main execution
try {
  const locations = generateLocationsData();
  
  // Create output directory if it doesn't exist
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Write the output file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(locations, null, 2));
  
  console.log(`Successfully generated locations data with ${locations.length} locations.`);
  console.log(`Output saved to: ${OUTPUT_FILE}`);
} catch (error) {
  console.error('Error generating locations data:', error);
  process.exit(1);
} 