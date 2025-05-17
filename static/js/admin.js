// Admin Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the admin dashboard functionality
    initAdminDashboard();
});

function initAdminDashboard() {
    // Initialize How It Works editor if on that page
    if (document.getElementById('stepsContainer')) {
        initHowItWorksEditor();
    }

    // Initialize content editor if on a content edit page
    if (document.getElementById('contentEditForm')) {
        initContentEditor();
    }

    // Initialize documentation page if on that page
    if (document.querySelector('.doc-nav')) {
        initDocumentation();
    }
}

// How It Works Editor Functions
function initHowItWorksEditor() {
    // Handle step reordering
    initStepReordering();

    // Handle image uploads
    initImageUploads();

    // Handle adding new steps
    initAddStep();

    // Handle app screen type selection
    initAppScreenTypeSelection();

    // Handle saving all changes
    initSaveChanges();
}

function initStepReordering() {
    // Move step up
    document.querySelectorAll('.move-up-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const stepCard = this.closest('.step-card');
            const prevStepCard = stepCard.previousElementSibling;

            if (prevStepCard) {
                stepCard.parentNode.insertBefore(stepCard, prevStepCard);
                updateStepOrder();
                updateMoveButtons();
            }
        });
    });

    // Move step down
    document.querySelectorAll('.move-down-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const stepCard = this.closest('.step-card');
            const nextStepCard = stepCard.nextElementSibling;

            if (nextStepCard) {
                stepCard.parentNode.insertBefore(nextStepCard, stepCard);
                updateStepOrder();
                updateMoveButtons();
            }
        });
    });

    // Delete step
    document.querySelectorAll('.delete-step-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const stepCard = this.closest('.step-card');
            const stepsContainer = document.getElementById('stepsContainer');

            // Only allow deletion if there's more than one step
            if (stepsContainer.children.length > 1) {
                if (confirm('Are you sure you want to delete this step?')) {
                    stepCard.remove();
                    updateStepOrder();
                    updateMoveButtons();
                    updateDeleteButtons();
                }
            }
        });
    });
}

function updateStepOrder() {
    // Update step numbers
    const stepCards = document.querySelectorAll('.step-card');
    stepCards.forEach((card, index) => {
        const stepOrder = card.querySelector('.step-order');
        stepOrder.textContent = index + 1;
    });
}

function updateMoveButtons() {
    // Update move up/down buttons based on position
    const stepCards = document.querySelectorAll('.step-card');
    stepCards.forEach((card, index) => {
        const moveUpBtn = card.querySelector('.move-up-btn');
        const moveDownBtn = card.querySelector('.move-down-btn');

        // First step can't move up
        if (index === 0) {
            moveUpBtn.disabled = true;
        } else {
            moveUpBtn.disabled = false;
        }

        // Last step can't move down
        if (index === stepCards.length - 1) {
            moveDownBtn.disabled = true;
        } else {
            moveDownBtn.disabled = false;
        }
    });
}

function updateDeleteButtons() {
    // Update delete buttons based on number of steps
    const stepCards = document.querySelectorAll('.step-card');
    const deleteButtons = document.querySelectorAll('.delete-step-btn');

    // Disable delete buttons if only one step remains
    if (stepCards.length <= 1) {
        deleteButtons.forEach(btn => {
            btn.disabled = true;
        });
    } else {
        deleteButtons.forEach(btn => {
            btn.disabled = false;
        });
    }
}

function initImageUploads() {
    // Handle image change button clicks
    document.querySelectorAll('.change-image-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const stepCard = this.closest('.step-card');
            const fileInput = stepCard.querySelector('.image-upload');
            fileInput.click();
        });
    });

    // Handle file selection
    document.querySelectorAll('.image-upload').forEach(input => {
        input.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const stepCard = this.closest('.step-card');
                const img = stepCard.querySelector('.step-image img');

                const reader = new FileReader();
                reader.onload = function(e) {
                    img.src = e.target.result;
                };
                reader.readAsDataURL(this.files[0]);
            }
        });
    });
}

function initAddStep() {
    const addStepBtn = document.getElementById('addStepBtn');
    if (addStepBtn) {
        addStepBtn.addEventListener('click', function() {
            const stepsContainer = document.getElementById('stepsContainer');
            const stepCards = document.querySelectorAll('.step-card');
            const newStepId = stepCards.length + 1;

            // Create new step card
            const newStepCard = document.createElement('div');
            newStepCard.className = 'step-card';
            newStepCard.dataset.stepId = newStepId;

            // Generate HTML for new step
            newStepCard.innerHTML = `
                <div class="step-order">${newStepId}</div>
                <div class="step-header">
                    <h3 class="step-title">New Step</h3>
                    <div class="step-actions">
                        <button type="button" class="btn btn-sm btn-outline-primary move-up-btn">
                            <i class="fas fa-arrow-up"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-primary move-down-btn" disabled>
                            <i class="fas fa-arrow-down"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-danger delete-step-btn">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="step-body">
                    <div class="step-preview">
                        <div class="step-image">
                            <div class="phone-mockup-preview">
                                <div class="phone-notch-preview"></div>
                                <div class="phone-screen-preview">
                                    <img src="/static/images/how_it_works/placeholder.png" alt="New step">
                                </div>
                            </div>
                            <div class="step-image-overlay">
                                <button type="button" class="btn btn-light change-image-btn">
                                    <i class="fas fa-camera"></i>
                                    Change Image
                                </button>
                            </div>
                        </div>
                        <div class="step-form">
                            <form class="step-edit-form">
                                <input type="hidden" name="id" value="${newStepId}">
                                <div class="form-group">
                                    <label class="form-label">Step Title</label>
                                    <input type="text" class="form-control" name="title" value="New Step">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Step Description</label>
                                    <textarea class="form-control" name="description" rows="3">Enter step description here</textarea>
                                </div>

                                <div class="form-group">
                                    <label class="form-label">App Screen Type</label>
                                    <select class="form-control app-screen-type" name="screen_type">
                                        <option value="welcome">Welcome Screen</option>
                                        <option value="registration">Registration</option>
                                        <option value="parent_connection">Parent Connection</option>
                                        <option value="focus_mode">Focus Mode</option>
                                        <option value="app_permissions">App Permissions</option>
                                        <option value="screen_time">Screen Time</option>
                                        <option value="resources">Educational Resources</option>
                                        <option value="progress">Progress Tracking</option>
                                        <option value="notifications">Notifications</option>
                                        <option value="rewards">Rewards</option>
                                        <option value="communication">Communication</option>
                                        <option value="emergency">Emergency Access</option>
                                        <option value="reports">Usage Reports</option>
                                        <option value="settings">Settings</option>
                                        <option value="support">Support</option>
                                        <option value="custom">Custom Screen</option>
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label class="form-label">App Header Title</label>
                                    <input type="text" class="form-control" name="app_header_title" value="New Step">
                                </div>

                                <div class="form-group">
                                    <label class="form-label">App Icon</label>
                                    <select class="form-control" name="app_icon">
                                        <option value="home">Home</option>
                                        <option value="user">User</option>
                                        <option value="link">Link</option>
                                        <option value="clock">Clock</option>
                                        <option value="shield-alt">Shield</option>
                                        <option value="book">Book</option>
                                        <option value="chart-line">Chart</option>
                                        <option value="bell">Bell</option>
                                        <option value="award">Award</option>
                                        <option value="comments">Comments</option>
                                        <option value="exclamation-triangle">Warning</option>
                                        <option value="file-alt">File</option>
                                        <option value="cog">Settings</option>
                                        <option value="headset">Support</option>
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label class="form-label">Active Navigation Tab</label>
                                    <select class="form-control" name="active_tab">
                                        <option value="home">Home</option>
                                        <option value="focus">Focus</option>
                                        <option value="learn">Learn</option>
                                        <option value="progress">Progress</option>
                                        <option value="settings">Settings</option>
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label class="form-label">Feature 1 Title</label>
                                    <input type="text" class="form-control" name="feature1_title" value="Key Benefit">
                                </div>

                                <div class="form-group">
                                    <label class="form-label">Feature 1 Description</label>
                                    <input type="text" class="form-control" name="feature1_description" value="This feature helps students stay focused and achieve better academic results.">
                                </div>

                                <div class="form-group">
                                    <label class="form-label">Feature 2 Title</label>
                                    <input type="text" class="form-control" name="feature2_title" value="Added Value">
                                </div>

                                <div class="form-group">
                                    <label class="form-label">Feature 2 Description</label>
                                    <input type="text" class="form-control" name="feature2_description" value="Parents and educators appreciate the additional control and insights provided.">
                                </div>

                                <div class="form-group">
                                    <label class="form-label">Image Alt Text</label>
                                    <input type="text" class="form-control" name="alt" value="New step image">
                                </div>
                                <input type="file" class="form-control d-none image-upload" name="image" accept="image/*">
                            </form>
                        </div>
                    </div>
                </div>
            `;

            // Add the new step to the container
            stepsContainer.appendChild(newStepCard);

            // Update buttons
            updateMoveButtons();
            updateDeleteButtons();

            // Initialize event listeners for the new step
            initStepReordering();
            initImageUploads();

            // Scroll to the new step
            newStepCard.scrollIntoView({ behavior: 'smooth' });
        });
    }
}

function initAppScreenTypeSelection() {
    // Handle app screen type selection
    document.querySelectorAll('.app-screen-type').forEach(select => {
        select.addEventListener('change', function() {
            const stepCard = this.closest('.step-card');
            const stepId = stepCard.dataset.stepId;
            const screenType = this.value;

            // Update form fields based on screen type
            updateFormFieldsForScreenType(stepCard, screenType, stepId);
        });
    });
}

function updateFormFieldsForScreenType(stepCard, screenType, stepId) {
    // Get form elements
    const form = stepCard.querySelector('.step-edit-form');
    const appHeaderTitle = form.querySelector('input[name="app_header_title"]');
    const appIcon = form.querySelector('select[name="app_icon"]');
    const activeTab = form.querySelector('select[name="active_tab"]');
    const feature1Title = form.querySelector('input[name="feature1_title"]');
    const feature1Description = form.querySelector('input[name="feature1_description"]');
    const feature2Title = form.querySelector('input[name="feature2_title"]');
    const feature2Description = form.querySelector('input[name="feature2_description"]');

    // Set default values based on screen type
    switch (screenType) {
        case 'welcome':
            appHeaderTitle.value = 'Welcome';
            appIcon.value = 'home';
            activeTab.value = 'home';
            feature1Title.value = 'Distraction-Free Design';
            feature1Description.value = 'Clean interface that eliminates distractions and helps students focus on what matters.';
            feature2Title.value = 'Secure Environment';
            feature2Description.value = 'Built with privacy and security in mind to protect student data and activity.';
            break;
        case 'registration':
            appHeaderTitle.value = 'Create Your Profile';
            appIcon.value = 'user';
            activeTab.value = 'home';
            feature1Title.value = 'Personalized Experience';
            feature1Description.value = 'Create a profile tailored to your educational needs and goals.';
            feature2Title.value = 'Grade-Specific Content';
            feature2Description.value = 'Access resources and tools appropriate for your academic level.';
            break;
        case 'parent_connection':
            appHeaderTitle.value = 'Connect with Parent';
            appIcon.value = 'link';
            activeTab.value = 'home';
            feature1Title.value = 'Seamless Connection';
            feature1Description.value = 'Simple QR code or link sharing to connect parent and student accounts.';
            feature2Title.value = 'Transparent Monitoring';
            feature2Description.value = 'Students always know what information parents can see, building trust and accountability.';
            break;
        case 'focus_mode':
            appHeaderTitle.value = 'Focus Mode';
            appIcon.value = 'clock';
            activeTab.value = 'focus';
            feature1Title.value = 'Scheduled Focus Time';
            feature1Description.value = 'Set specific times when only educational apps are accessible.';
            feature2Title.value = 'Customizable Schedules';
            feature2Description.value = 'Create different schedules for school days, weekends, and study sessions.';
            break;
        case 'app_permissions':
            appHeaderTitle.value = 'App Permissions';
            appIcon.value = 'shield-alt';
            activeTab.value = 'settings';
            feature1Title.value = 'Granular Control';
            feature1Description.value = 'Parents can approve which apps are accessible during different times of day.';
            feature2Title.value = 'App Categories';
            feature2Description.value = 'Apps are organized by category to make permission management easier.';
            break;
        // Add more cases for other screen types
        default:
            // For custom or other types, keep the current values
            break;
    }
}

function initSaveChanges() {
    const saveAllBtn = document.getElementById('saveAllBtn');
    if (saveAllBtn) {
        saveAllBtn.addEventListener('click', function() {
            // In a real implementation, this would collect all form data and send it to the server
            alert('Changes saved successfully!');
        });
    }
}

// Content Editor Functions
function initContentEditor() {
    // Initialize rich text editors
    initRichTextEditors();

    // Handle image uploads
    initContentImageUploads();

    // Handle form submission
    initContentFormSubmission();
}

function initRichTextEditors() {
    // This would initialize rich text editors for content fields
    // For simplicity, we're not implementing the actual rich text editor here
    console.log('Rich text editors initialized');
}

function initContentImageUploads() {
    // Handle content image uploads
    document.querySelectorAll('.content-image-upload').forEach(btn => {
        btn.addEventListener('click', function() {
            const fileInput = this.nextElementSibling;
            fileInput.click();
        });
    });
}

function initContentFormSubmission() {
    const contentForm = document.getElementById('contentEditForm');
    if (contentForm) {
        contentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // In a real implementation, this would submit the form data to the server
            alert('Content updated successfully!');
        });
    }
}

// Documentation Page Functions
function initDocumentation() {
    // Handle navigation links
    document.querySelectorAll('.doc-nav-link, .doc-nav-sublink').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Remove active class from all links
            document.querySelectorAll('.doc-nav-link, .doc-nav-sublink').forEach(l => {
                l.classList.remove('active');
            });

            // Add active class to clicked link
            this.classList.add('active');

            // Scroll to the target section
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 20,
                    behavior: 'smooth'
                });
            }
        });
    });
}
