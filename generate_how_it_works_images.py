from PIL import Image, ImageDraw, ImageFont
import os
import json

def create_mobile_mockup(filename, title, bg_color=(240, 240, 240), accent_color=(94, 161, 255)):
    """Create a mobile app mockup image."""
    # Create a mobile screen with 9:16 aspect ratio
    width = 600
    height = 1067
    img = Image.new('RGBA', (width, height), color=bg_color)
    draw = ImageDraw.Draw(img)
    
    # Draw status bar
    draw.rectangle([(0, 0), (width, 60)], fill=(50, 50, 50))
    
    # Draw app header
    draw.rectangle([(0, 60), (width, 150)], fill=accent_color)
    
    # Try to use a system font, or fall back to default
    try:
        title_font = ImageFont.truetype("Arial", 36)
        subtitle_font = ImageFont.truetype("Arial", 24)
        body_font = ImageFont.truetype("Arial", 20)
    except IOError:
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()
        body_font = ImageFont.load_default()
    
    # Draw title in header
    title_position = (width // 2, 105)
    draw.text(title_position, title, font=title_font, fill=(255, 255, 255), anchor="mm")
    
    # Draw some UI elements
    
    # Navigation bar at bottom
    draw.rectangle([(0, height-80), (width, height)], fill=(250, 250, 250))
    
    # Draw some nav icons
    icon_positions = [(width//4, height-40), (width//2, height-40), (3*width//4, height-40)]
    for pos in icon_positions:
        draw.ellipse([(pos[0]-15, pos[1]-15), (pos[0]+15, pos[1]+15)], fill=accent_color)
    
    # Draw some content blocks
    y_offset = 200
    for i in range(4):
        # Content block
        block_height = 120
        draw.rounded_rectangle(
            [(40, y_offset), (width-40, y_offset+block_height)],
            radius=10,
            fill=(255, 255, 255),
            outline=accent_color
        )
        
        # Block title
        draw.text(
            (60, y_offset + 30),
            f"Feature {i+1}",
            font=subtitle_font,
            fill=(50, 50, 50)
        )
        
        # Block description
        draw.text(
            (60, y_offset + 70),
            "Tap to learn more",
            font=body_font,
            fill=(100, 100, 100)
        )
        
        y_offset += block_height + 30
    
    # Save the image with transparency
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    img.save(filename, "PNG")
    print(f"Created {filename}")

def main():
    """Generate all mockup images for the How It Works page."""
    # Load the how_it_works.json file to get step information
    with open('extracted_content/how_it_works.json', 'r') as f:
        how_it_works = json.load(f)
    
    # Create images directory if it doesn't exist
    os.makedirs('static/images/how_it_works', exist_ok=True)
    
    # Create a mockup for each step
    for step in how_it_works['steps']:
        filename = os.path.join('static/images/how_it_works', step['image'])
        create_mobile_mockup(filename, step['title'])

if __name__ == "__main__":
    main()
