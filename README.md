# UDelaWhere?

A React-based web application that lets users explore the University of Delaware campus through a fun guessing game using 360° panoramic images.

## Overview

UDelaWhere? is a GeoGuessr-style game focused on the University of Delaware campus. Players are placed in a random location on campus (displayed as an interactive 360° panorama) and must guess where they are on a map. Points are awarded based on the accuracy of their guess.

## Project Structure

```
UDelaWhere?/
├── public/
│   ├── assets/                # Original panorama images with coordinates
│   │   ├── img1/              # Each image folder 
│   │   │   ├── image.jpg      # Original panorama image
│   │   │   └── cords.txt      # Coordinate text file
│   ├── locations/             # Processed cubemap images for the game
│   │   ├── img1/
│   │   │   ├── skybox/        # Cubemap images (px.jpg, nx.jpg, etc.)
│   │   │   └── cords.txt      # Coordinate text file (copied)
├── scripts/
│   ├── pano2cubemap.sh        # Script to convert panoramas to cubemaps
│   └── generate_locations.js  # Script to generate locations data for the game
├── src/
│   ├── data/
│   │   └── locations.json     # Generated file with all location data
```

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Process panorama images (if you have new images):
   ```
   ./scripts/pano2cubemap.sh
   ```
4. Generate locations data:
   ```
   ./scripts/generate_locations.js
   ```
5. Start the development server:
   ```
   npm start
   ```

## Image Processing Pipeline

The game uses a two-step process to prepare panoramic images:

1. **Image Organization**: Place panorama JPGs in individual folders under `public/assets/img#/` with their corresponding coordinates in a `cords.txt` file.

2. **Image Conversion**: The `pano2cubemap.sh` script converts each equirectangular panorama into a set of 6 cubemap images (for a skybox) using FFmpeg.

3. **Data Generation**: The `generate_locations.js` script creates a structured JSON file with all location data for use in the game.

## Coordinate Format

Coordinates should be stored in each `cords.txt` file in the format:
```
39.68010N,75.75369W
```

## Dependencies

- React
- Three.js for 3D panorama viewing
- FFmpeg for image processing

## Scripts

### pano2cubemap.sh

Converts equirectangular panorama images to cubemap format for use in Three.js skyboxes.

Usage:
```
./scripts/pano2cubemap.sh
```

### generate_locations.js

Generates the locations.json file that the application uses to load panorama locations.

Usage:
```
./scripts/generate_locations.js
```

## Running the Game

After setting up, run the game with:
```
npm start
```

The game will be available at http://localhost:3000 