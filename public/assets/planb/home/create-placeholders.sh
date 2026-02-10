#!/bin/bash

# Create placeholder images using ImageMagick (if available) or simple solid color PNGs

# Function to create a placeholder image
create_placeholder() {
    local filename=$1
    local width=$2
    local height=$3
    local text=$4
    local bg_color=$5
    
    if command -v convert &> /dev/null; then
        # Using ImageMagick
        convert -size ${width}x${height} xc:${bg_color} \
                -gravity center \
                -pointsize 40 \
                -fill white \
                -annotate +0+0 "${text}" \
                "${filename}"
    else
        # Create a simple colored square using printf (fallback)
        # This won't work for actual images, but we'll use a different method
        echo "ImageMagick not available. Skipping placeholder creation."
        return 1
    fi
}

# Create placeholders
create_placeholder "logo-planb.png" 120 120 "Plan B\nLogo" "#8B4513"
create_placeholder "hero-sea-view.jpg" 1920 1080 "Hero\nSea View" "#4A90E2"
create_placeholder "home-grid-1.jpg" 600 600 "Blue\nCocktail" "#1E90FF"
create_placeholder "home-grid-2.jpg" 600 600 "Coffee\nArt" "#8B4513"
create_placeholder "home-grid-3.jpg" 600 600 "Cheesecake" "#FFD700"
create_placeholder "home-grid-4.jpg" 600 600 "Fresh\nSalad" "#32CD32"
create_placeholder "home-grid-5.jpg" 600 600 "Main\nDish" "#FF6347"
create_placeholder "home-atmosphere.jpg" 1200 800 "Sunset\nSeating" "#FF8C00"

echo "Placeholder creation complete!"
