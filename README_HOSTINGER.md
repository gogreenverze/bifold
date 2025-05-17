# Bifold Website - Hostinger Deployment Guide

This guide provides simple steps to deploy the Bifold website on Hostinger using your bifold subdomain.

## Files Included

- `app.py` - The main Flask application (use this for development)
- `app_production.py` - Production version of the Flask app (rename to `app.py` for deployment)
- `wsgi.py` - WSGI entry point for the application
- `requirements.txt` - List of Python dependencies
- Other project files (templates, static files, etc.)

## Deployment Steps

1. **Prepare for Upload**
   - Rename `app_production.py` to `app.py` (replacing the development version)
   - Zip all files except any virtual environment folders (venv, env, etc.)

2. **Upload to Hostinger**
   - Log in to your Hostinger account
   - Go to your domain management
   - Navigate to the Python application section
   - Create a new Python application for your bifold subdomain
   - Upload and extract your zip file

3. **Configure the Application**
   - Set the application startup file to `wsgi.py`
   - Set WSGI handler to `wsgi.app`
   - Choose Python 3.8 or newer

4. **Install Dependencies**
   - Open the console in Hostinger's Python panel
   - Run: `pip install -r requirements.txt`

5. **Start the Application**
   - Click "Restart" in the Python application panel
   - Your site should now be accessible at your bifold subdomain

## Troubleshooting

If you encounter issues:
- Check the application logs in Hostinger
- Verify file permissions (755 for directories, 644 for files)
- Make sure all paths in the application are relative, not absolute

## Support

For additional help, contact the developer who provided this package.
