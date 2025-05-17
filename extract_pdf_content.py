import PyPDF2
import json
import os
import fitz  # PyMuPDF
import io
from PIL import Image

def extract_text_from_pdf(pdf_path):
    """Extract text from a PDF file using PyPDF2."""
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page_num in range(len(reader.pages)):
            page = reader.pages[page_num]
            text += page.extract_text() + "\n\n"
        return text

def extract_images_from_pdf(pdf_path, output_folder):
    """Extract images from a PDF file using PyMuPDF."""
    # Open the PDF
    doc = fitz.open(pdf_path)

    # Create output folder if it doesn't exist
    os.makedirs(output_folder, exist_ok=True)

    # List to store image info
    image_list = []

    # Iterate through pages
    for page_index in range(len(doc)):
        # Get the page
        page = doc[page_index]

        # Get image list
        image_dict = page.get_images(full=True)

        # Process each image
        for img_index, img in enumerate(image_dict):
            # Get the XREF of the image
            xref = img[0]

            # Extract the image bytes
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]

            # Get the image extension
            image_ext = base_image["ext"]

            # Generate a unique filename
            filename = f"page{page_index+1}_img{img_index+1}.{image_ext}"
            filepath = os.path.join(output_folder, filename)

            # Save the image
            with open(filepath, "wb") as img_file:
                img_file.write(image_bytes)

            # Add to image list
            image_list.append({
                "filename": filename,
                "page": page_index + 1,
                "width": base_image["width"],
                "height": base_image["height"]
            })

            print(f"Extracted image: {filename}")

    return image_list

def save_to_json(data, output_file):
    """Save extracted data to a JSON file."""
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

def main():
    # Define paths
    pdf_dir = os.path.join('static', 'pdfs')
    output_dir = 'extracted_content'
    images_dir = os.path.join('static', 'images', 'extracted')

    # Create output directories if they don't exist
    os.makedirs(output_dir, exist_ok=True)
    os.makedirs(images_dir, exist_ok=True)

    # Process Bifold Brochure
    brochure_path = os.path.join(pdf_dir, 'Bifold Brochure- SM81.pdf')
    brochure_text = extract_text_from_pdf(brochure_path)
    brochure_images = extract_images_from_pdf(brochure_path, os.path.join(images_dir, 'brochure'))

    # Save brochure content
    save_to_json({
        'text': brochure_text,
        'images': brochure_images
    }, os.path.join(output_dir, 'brochure_content.json'))
    print(f"Extracted content from Bifold Brochure- SM81.pdf")

    # Process Company Profile
    profile_path = os.path.join(pdf_dir, 'Company Profile.pdf')
    profile_text = extract_text_from_pdf(profile_path)
    profile_images = extract_images_from_pdf(profile_path, os.path.join(images_dir, 'profile'))

    # Save company profile content
    save_to_json({
        'text': profile_text,
        'images': profile_images
    }, os.path.join(output_dir, 'company_profile_content.json'))
    print(f"Extracted content from Company Profile.pdf")

    # Print first 500 characters of each for verification
    print("\nBrochure Preview (first 500 chars):")
    print(brochure_text[:500])
    print("\nCompany Profile Preview (first 500 chars):")
    print(profile_text[:500])

    # Print image summary
    print(f"\nExtracted {len(brochure_images)} images from brochure")
    print(f"Extracted {len(profile_images)} images from company profile")

if __name__ == "__main__":
    main()
