from PIL import Image, ImageDraw, ImageFont
import os

def create_placeholder_image(filename, width, height, text, bg_color=(200, 200, 200), text_color=(50, 50, 50)):
    """Create a placeholder image with text."""
    img = Image.new('RGB', (width, height), color=bg_color)
    draw = ImageDraw.Draw(img)

    # Try to use a system font, or fall back to default
    try:
        font = ImageFont.truetype("Arial", 30)
    except IOError:
        font = ImageFont.load_default()

    # Calculate text position to center it
    try:
        # For newer versions of Pillow
        text_bbox = draw.textbbox((0, 0), text, font=font)
        text_width = text_bbox[2] - text_bbox[0]
        text_height = text_bbox[3] - text_bbox[1]
    except AttributeError:
        # For older versions of Pillow
        text_width, text_height = draw.textsize(text, font=font)

    position = ((width - text_width) // 2, (height - text_height) // 2)

    # Draw text
    draw.text(position, text, font=font, fill=text_color)

    # Save the image
    img.save(os.path.join('static', 'images', filename))
    print(f"Created {filename}")

def main():
    """Generate all placeholder images for the website."""
    # Create images directory if it doesn't exist
    os.makedirs(os.path.join('static', 'images'), exist_ok=True)

    # Create hero image
    create_placeholder_image('hero-image.png', 800, 500, 'Bifold Hero Image', bg_color=(100, 150, 200))

    # Create about images
    create_placeholder_image('about-preview.jpg', 600, 400, 'About Bifold', bg_color=(150, 200, 150))
    create_placeholder_image('about-main.jpg', 600, 400, 'Our Story', bg_color=(150, 200, 150))

    # Create product images
    for i in range(1, 7):
        create_placeholder_image(f'product-{i}.jpg', 400, 300, f'Product {i}', bg_color=(200, 150, 150))

    # Create PDF preview images
    create_placeholder_image('pdf-preview.jpg', 400, 500, 'PDF Preview', bg_color=(150, 150, 200))
    create_placeholder_image('brochure-preview.jpg', 400, 500, 'Brochure Preview', bg_color=(150, 150, 200))

if __name__ == "__main__":
    main()
