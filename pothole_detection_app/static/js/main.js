// Function to update confidence threshold display value
function updateConfidenceValue(value) {
    document.getElementById('confidenceValue').textContent = value;
}

// Handle file uploads and preview
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('file');
    const previewContainer = document.getElementById('imagePreview');
    const previewImage = document.getElementById('previewImage');
    const dropZone = document.getElementById('dropZone');
    const browseBtn = document.getElementById('browseBtn');

    // Initialize animations
    initAnimations();

    // File upload handling
    browseBtn.addEventListener('click', function() {
        fileInput.click();
    });

    fileInput.addEventListener('change', function() {
        handleFileSelect(this.files[0]);
    });

    // Drag and drop functionality
    dropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('active');
    });

    dropZone.addEventListener('dragleave', function() {
        this.classList.remove('active');
    });

    dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('active');

        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            handleFileSelect(e.dataTransfer.files[0]);
        }
    });

    function handleFileSelect(file) {
        if (file) {
            const reader = new FileReader();

            reader.addEventListener('load', function() {
                previewImage.setAttribute('src', this.result);
                previewContainer.style.display = 'block';

                gsap.fromTo('#imagePreview',
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
                );

                // Minimize the drop zone after upload
                gsap.to(dropZone, {
                    padding: '15px',
                    duration: 0.3
                });
            });

            reader.readAsDataURL(file);
        }
    }

    // Add ripple effect to detect button
    const detectBtn = document.querySelector('.btn-detect');
    detectBtn.addEventListener('mousedown', function(e) {
        const x = e.clientX - e.target.getBoundingClientRect().left;
        const y = e.clientY - e.target.getBoundingClientRect().top;

        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.width = '1px';
        ripple.style.height = '1px';
        ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
        ripple.style.borderRadius = '50%';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        this.appendChild(ripple);

        gsap.to(ripple, {
            width: '300px',
            height: '300px',
            opacity: 0,
            duration: 0.8,
            onComplete: function() {
                ripple.remove();
            }
        });
    });

    // Accordion animation
    const accordionButtons = document.querySelectorAll('.accordion-button');
    accordionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const isCollapsed = this.classList.contains('collapsed');
            const targetId = this.getAttribute('data-bs-target');
            const targetContent = document.querySelector(targetId);

            if (isCollapsed) {
                // Opening
                gsap.fromTo(targetContent,
                    { height: 0, opacity: 0 },
                    {
                        height: 'auto',
                        opacity: 1,
                        duration: 0.3,
                        ease: 'power2.out',
                        onComplete: function() {
                            targetContent.style.height = 'auto';
                        }
                    }
                );
            }
        });
    });

    // Tech feature hover animations
    const techFeatures = document.querySelectorAll('.tech-feature');
    techFeatures.forEach(feature => {
        feature.addEventListener('mouseenter', function() {
            gsap.to(this.querySelector('i'), {
                y: -5,
                scale: 1.2,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        feature.addEventListener('mouseleave', function() {
            gsap.to(this.querySelector('i'), {
                y: 0,
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // Form submission handling
    const detectionForm = document.getElementById('detectionForm');
    if (detectionForm) {
        detectionForm.addEventListener('submit', function(e) {
            // Only if no file is selected
            if (!fileInput.files || fileInput.files.length === 0) {
                e.preventDefault();
                showAlert('Please select an image to detect potholes.', 'danger');
            } else {
                // Show loading animation
                showLoading();
            }
        });
    }
});

// Initialize all animations
function initAnimations() {
    // Navbar animation
    gsap.fromTo('.navbar',
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    );

    // Header animations
    gsap.to('.app-header', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.3,
        ease: 'power3.out'
    });

    // Main card animation
    gsap.to('.app-card', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: 0.5,
        ease: 'power3.out'
    });

    // Info cards animations with staggered delay
    gsap.to('.info-card', {
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.2,
        delay: 0.7,
        ease: 'power3.out'
    });

    // Handle existing alerts
    const alertElement = document.querySelector('.alert');
    if (alertElement) {
        gsap.to(alertElement, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: 0.2,
            ease: 'power2.out'
        });

        // Auto-dismiss alert after 5 seconds
        setTimeout(() => {
            gsap.to(alertElement, {
                opacity: 0,
                y: -20,
                duration: 0.5,
                ease: 'power2.in',
                onComplete: function() {
                    alertElement.remove();
                }
            });
        }, 5000);
    }
}

// Function to show alert messages
function showAlert(message, type = 'info') {
    // Remove any existing alerts
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    // Create new alert
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    alertDiv.style.opacity = '0';
    alertDiv.style.transform = 'translateY(-20px)';

    // Insert after app-header
    const appHeader = document.querySelector('.app-header');
    appHeader.parentNode.insertBefore(alertDiv, appHeader.nextSibling);

    // Animate the alert
    gsap.to(alertDiv, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out'
    });

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        gsap.to(alertDiv, {
            opacity: 0,
            y: -20,
            duration: 0.5,
            ease: 'power2.in',
            onComplete: function() {
                alertDiv.remove();
            }
        });
    }, 5000);
}

// Show loading animation when form is submitted
function showLoading() {
    const detectBtn = document.querySelector('.btn-detect');
    const originalText = detectBtn.innerHTML;

    // Change button text and add spinner
    detectBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
    detectBtn.disabled = true;

    // Restore original state after processing (you may want to handle this in your backend response)
    setTimeout(() => {
        detectBtn.innerHTML = originalText;
        detectBtn.disabled = false;
    }, 30000); // Timeout after 30 seconds as fallback
}

// Window resize handler for responsive adjustments
window.addEventListener('resize', function() {
    // Any resize-specific adjustments can be added here
    // For example, recalculating dimensions for canvas elements if needed
});

// Scroll animations for elements that come into view
function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(element => {
        gsap.fromTo(element,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                scrollTrigger: {
                    trigger: element,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none none"
                }
            }
        );
    });
}

// Initialize scroll animations if ScrollTrigger is available
if (typeof ScrollTrigger !== 'undefined') {
    // Initialize ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    initScrollAnimations();
}