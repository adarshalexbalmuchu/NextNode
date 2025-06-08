#!/bin/bash
# Script to generate PWA icons from a base icon
# This script requires ImageMagick to be installed

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "ImageMagick is not installed. Please install it first:"
    echo "  Ubuntu/Debian: sudo apt-get install imagemagick"
    echo "  macOS: brew install imagemagick"
    echo "  Windows: Download from https://imagemagick.org/script/download.php#windows"
    exit 1
fi

# Create a simple base icon using ImageMagick if no source icon exists
if [ ! -f "base-icon.png" ]; then
    echo "Creating base icon..."
    convert -size 512x512 xc:transparent \
        -fill "#1a1a2e" -draw "roundrectangle 50,50 462,462 80,80" \
        -fill "#16213e" -draw "roundrectangle 80,80 432,432 60,60" \
        -fill "#0f3460" -draw "roundrectangle 110,110 402,402 40,40" \
        -fill "#e94560" -draw "roundrectangle 140,140 372,372 20,20" \
        -font Liberation-Sans-Bold -pointsize 72 -fill white \
        -gravity center -annotate +0+0 "QRF" \
        base-icon.png
    
    echo "Base icon created as base-icon.png"
fi

# Generate different sizes for PWA
echo "Generating PWA icons..."

# Generate 192x192 icon
convert base-icon.png -resize 192x192 public/icons/icon-192x192.png

# Generate 512x512 icon
convert base-icon.png -resize 512x512 public/icons/icon-512x512.png

# Generate additional sizes
convert base-icon.png -resize 72x72 public/icons/icon-72x72.png
convert base-icon.png -resize 96x96 public/icons/icon-96x96.png
convert base-icon.png -resize 128x128 public/icons/icon-128x128.png
convert base-icon.png -resize 144x144 public/icons/icon-144x144.png
convert base-icon.png -resize 152x152 public/icons/icon-152x152.png
convert base-icon.png -resize 384x384 public/icons/icon-384x384.png

# Generate favicon
convert base-icon.png -resize 32x32 public/favicon-32x32.png
convert base-icon.png -resize 16x16 public/favicon-16x16.png

# Generate Apple touch icon
convert base-icon.png -resize 180x180 public/apple-touch-icon.png

echo "PWA icons generated successfully!"
echo "Icons created in public/icons/ directory:"
ls -la public/icons/

echo ""
echo "Additional icons created:"
echo "  public/favicon-32x32.png"
echo "  public/favicon-16x16.png"
echo "  public/apple-touch-icon.png"
