from flask import Flask, render_template, request, redirect, url_for, send_from_directory, session, flash, jsonify
import os
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'bifold_secret_key_2024'
app.config['UPLOAD_FOLDER'] = os.path.join('static', 'pdfs')

# PDF file paths
bifold_brochure = os.path.join('pdfs', 'Bifold Brochure- SM81.pdf')
company_profile = os.path.join('pdfs', 'Company Profile.pdf')

# Load extracted content
def load_content():
    content = {}
    try:
        with open(os.path.join('extracted_content', 'brochure_content.json'), 'r') as f:
            content['brochure'] = json.load(f)
        with open(os.path.join('extracted_content', 'company_profile_content.json'), 'r') as f:
            content['profile'] = json.load(f)
        with open(os.path.join('extracted_content', 'how_it_works.json'), 'r') as f:
            content['how_it_works'] = json.load(f)
    except Exception as e:
        print(f"Error loading content: {e}")
        content = {
            'brochure': {'text': '', 'images': []},
            'profile': {'text': '', 'images': []},
            'how_it_works': {'steps': []}
        }
    return content

# Extract company and product info
def extract_info(content):
    brochure_text = content['brochure']['text']

    # Extract company name
    company_name = "Sudhan Mobiles SG"

    # Extract product name
    product_name = "Students Mobile SM-81"

    # Extract key features
    features = [
        "No social media, no video platforms, just essential tools",
        "Parental Control with built-in screen time tools",
        "Safe, Simple, Secure Design",
        "Essential Apps Only (WhatsApp, Phone, Maps, File Manager, Gallery & Gmail)",
        "App Restrictions - No social media, No video platforms allowed"
    ]

    # Extract company description
    company_description = "Founded in 2025 by Sudhan Ponnuthurai, a mobile industry expert with over a decade of experience, Sudhan Mobiles was created to solve a growing problem — kids being consumed by smartphones."

    # Extract product description
    product_description = "The Students Mobile SM81 is designed for focus and built for growth. It helps parents, educators, and coaching centers protect young minds from distractions and unlock focused learning through responsible technology."

    return {
        'company_name': company_name,
        'product_name': product_name,
        'features': features,
        'company_description': company_description,
        'product_description': product_description
    }

# Load content
content = load_content()
info = extract_info(content)

@app.route('/')
def index():
    return render_template('index.html',
                          bifold_brochure=bifold_brochure,
                          company_profile=company_profile,
                          content=content,
                          info=info)

@app.route('/about')
def about():
    return render_template('about.html',
                          bifold_brochure=bifold_brochure,
                          company_profile=company_profile,
                          content=content,
                          info=info)

@app.route('/products')
def products():
    return render_template('products.html',
                          bifold_brochure=bifold_brochure,
                          company_profile=company_profile,
                          content=content,
                          info=info)

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        # Here you would process the form data
        # For now, we'll just redirect back to the contact page
        return redirect(url_for('contact'))
    return render_template('contact.html',
                          bifold_brochure=bifold_brochure,
                          company_profile=company_profile,
                          content=content,
                          info=info)

@app.route('/view_pdf/<filename>')
def view_pdf(filename):
    return render_template('view_pdf.html',
                          filename=filename,
                          bifold_brochure=bifold_brochure,
                          company_profile=company_profile,
                          content=content,
                          info=info)

@app.route('/how-it-works')
def how_it_works():
    return render_template('how_it_works_new.html',
                          bifold_brochure=bifold_brochure,
                          company_profile=company_profile,
                          content=content,
                          info=info,
                          how_it_works=content['how_it_works'])

# Admin authentication decorator
def admin_required(f):
    def decorated_function(*args, **kwargs):
        if 'admin_logged_in' not in session or not session['admin_logged_in']:
            return redirect(url_for('admin_login'))
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

# Admin routes
@app.route('/admin', methods=['GET'])
def admin_login_redirect():
    return redirect(url_for('admin_login'))

@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    error = None
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        # Simple authentication - in a real app, use secure password hashing
        if username == 'admin' and password == 'bifold2024':
            session['admin_logged_in'] = True
            return redirect(url_for('admin_dashboard'))
        else:
            error = 'Invalid credentials. Please try again.'

    return render_template('admin/login.html', error=error)

@app.route('/admin/logout')
def admin_logout():
    session.pop('admin_logged_in', None)
    return redirect(url_for('admin_login'))

@app.route('/admin/dashboard')
@admin_required
def admin_dashboard():
    # Count images in the static/images directory
    image_count = 0
    for root, dirs, files in os.walk('static/images'):
        for file in files:
            if file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
                image_count += 1

    # Example recent updates - in a real app, these would come from a database
    recent_updates = [
        {
            'icon': 'mobile-alt',
            'title': 'How It Works Page Added',
            'description': 'Added new How It Works page with 15 mobile app screens',
            'time': 'Today'
        },
        {
            'icon': 'user-shield',
            'title': 'Admin Dashboard Created',
            'description': 'Implemented secure admin dashboard for content management',
            'time': 'Today'
        }
    ]

    return render_template('admin/dashboard.html',
                          image_count=image_count,
                          recent_updates=recent_updates)

@app.route('/admin/edit/<page>')
@admin_required
def admin_edit_content(page):
    # Map page names to their templates and titles
    page_templates = {
        'home': {
            'template': 'admin/edit_home.html',
            'title': 'Home Page'
        },
        'about': {
            'template': 'admin/edit_about.html',
            'title': 'About Page'
        },
        'products': {
            'template': 'admin/edit_products.html',
            'title': 'Products Page'
        },
        'contact': {
            'template': 'admin/edit_contact.html',
            'title': 'Contact Page'
        }
    }

    # Check if the page exists in our templates
    if page in page_templates:
        return render_template(
            page_templates[page]['template'],
            page=page,
            page_title=page_templates[page]['title'],
            content=content,
            info=info
        )
    else:
        # If page doesn't exist, redirect to dashboard
        return redirect(url_for('admin_dashboard'))

@app.route('/admin/how-it-works')
@admin_required
def admin_edit_how_it_works():
    return render_template('admin/edit_how_it_works.html',
                          how_it_works=content['how_it_works'])

@app.route('/admin/documentation')
@admin_required
def admin_documentation():
    return render_template('admin/documentation.html')

@app.route('/admin/api/save-how-it-works', methods=['POST'])
@admin_required
def admin_save_how_it_works():
    # This would save the updated How It Works content
    # For now, we'll just return a success response
    return jsonify({'success': True})

@app.route('/admin/api/upload-image', methods=['POST'])
@admin_required
def admin_upload_image():
    # This would handle image uploads
    # For now, we'll just return a success response
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=True, port=5002)
