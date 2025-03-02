#!/bin/bash

# UDelaWhere? - Panorama to Cubemap Conversion Script
# This script converts 360° panorama images to cubemap format for use with Three.js

# Check if both input and output directories are provided
if [ $# -lt 2 ]; then
    echo "Usage: $0 <input_directory> <output_directory>"
    echo "Example: $0 public/assets public/locations"
    exit 1
fi

input_dir=$1
output_dir=$2

# Check if input directory exists
if [ ! -d "$input_dir" ]; then
    echo "Input directory does not exist: $input_dir"
    exit 1
fi

# Create output directory if it doesn't exist
mkdir -p "$output_dir"

echo "Input directory: $input_dir"
echo "Output directory: $output_dir"

# Function to process panorama images
process_panorama() {
    local panorama="$1"
    local dest_dir="$2"
    
    # Create output directory if needed
    mkdir -p "$dest_dir"
    
    echo "Processing panorama: $panorama"
    
    # Extract the relative path (e.g., img31/Book.jpg from public/assets/img31/Book.jpg)
    rel_path="${panorama#$input_dir/}"
    # Extract just the directory part (e.g., img31 from img31/Book.jpg)
    dir_name=$(dirname "$rel_path")
    
    # Create the destination directory
    dest_dir="$output_dir/$dir_name"
    mkdir -p "$dest_dir"
    
    # Generate the six faces of the cubemap with higher resolution (2048x2048) and better quality (q:v=2)
    # Added h_flip=1 to mirror each face
    # Right face (positive X)
    ffmpeg -i "$panorama" -vf "v360=input=e:output=flat:yaw=0:pitch=0:h_fov=90:v_fov=90:h_flip=1:w=2048:h=2048" -q:v 2 -y -update 1 "$dest_dir/posx.jpg"
    
    # Left face (negative X)
    ffmpeg -i "$panorama" -vf "v360=input=e:output=flat:yaw=180:pitch=0:h_fov=90:v_fov=90:h_flip=1:w=2048:h=2048" -q:v 2 -y -update 1 "$dest_dir/negx.jpg"
    
    # Up face (positive Y) - saved to negy.jpg
    ffmpeg -i "$panorama" -vf "v360=input=e:output=flat:yaw=0:pitch=-90:h_fov=90:v_fov=90:roll=90:h_flip=1:w=2048:h=2048" -q:v 2 -y -update 1 "$dest_dir/negy.jpg"
    
    # Down face (negative Y) - saved to posy.jpg
    ffmpeg -i "$panorama" -vf "v360=input=e:output=flat:yaw=0:pitch=90:h_fov=90:v_fov=90:roll=90:h_flip=1:w=2048:h=2048" -q:v 2 -y -update 1 "$dest_dir/posy.jpg"
    
    # Front face (positive Z)
    ffmpeg -i "$panorama" -vf "v360=input=e:output=flat:yaw=-90:pitch=0:h_fov=90:v_fov=90:h_flip=1:w=2048:h=2048" -q:v 2 -y -update 1 "$dest_dir/posz.jpg"
    
    # Back face (negative Z)
    ffmpeg -i "$panorama" -vf "v360=input=e:output=flat:yaw=90:pitch=0:h_fov=90:v_fov=90:h_flip=1:w=2048:h=2048" -q:v 2 -y -update 1 "$dest_dir/negz.jpg"
    
    # Check if all six faces were created successfully
    if [ -f "$dest_dir/posx.jpg" ] && [ -f "$dest_dir/negx.jpg" ] && [ -f "$dest_dir/posy.jpg" ] && [ -f "$dest_dir/negy.jpg" ] && [ -f "$dest_dir/posz.jpg" ] && [ -f "$dest_dir/negz.jpg" ]; then
        echo "✅ Successfully created cubemap for: $panorama"
        
        # Copy the coordinates file if it exists
        if [ -f "${panorama%.*}_cords.txt" ]; then
            cp "${panorama%.*}_cords.txt" "$dest_dir/cords.txt"
        fi
    else
        echo "❌ Failed to create cubemap for: $panorama"
    fi
}

# Process panorama images directly in the input directory
echo "Looking for panoramas in input directory..."
find "$input_dir" -maxdepth 1 -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) | while read panorama; do
    # Get the base name without extension
    base_name=$(basename "${panorama%.*}")
    dest_dir="$output_dir/$base_name"
    
    # Process the panorama
    process_panorama "$panorama" "$dest_dir"
done

# Find all image directories and process them
echo "Looking for panoramas in subdirectories..."
find "$input_dir" -mindepth 1 -type d | grep -v "node_modules" | grep -v "^$input_dir$" | while read dir; do
    # Get the directory name
    dir_name=$(basename "$dir")
    dest_dir="$output_dir/$dir_name"
    
    # Find all panorama images in this directory
    find "$dir" -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) | while read panorama; do
        # Process the panorama
        process_panorama "$panorama" "$dest_dir"
    done
done

echo "All panoramas processed." 