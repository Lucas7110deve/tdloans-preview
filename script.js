// Mobile Menu Toggle
document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
    const nav = document.querySelector('nav ul');
    nav.classList.toggle('show');
});

// Loan Calculator
const loanAmount = document.getElementById('loanAmount');
const amountValue = document.getElementById('amountValue');
const loanTerm = document.getElementById('loanTerm');
const monthlyRepayment = document.getElementById('monthlyRepayment');
const totalRepayment = document.getElementById('totalRepayment');

function calculateLoan() {
    const amount = parseInt(loanAmount.value);
    const term = parseInt(loanTerm.value);
    const interestRate = 0.10; // 10% interest
    
    const totalInterest = amount * interestRate * term;
    const total = amount + totalInterest;
    const monthly = total / term;
    
    amountValue.textContent = amount.toLocaleString();
    monthlyRepayment.textContent = 'R' + monthly.toFixed(0).toLocaleString();
    totalRepayment.textContent = 'R' + total.toFixed(0).toLocaleString();
}

loanAmount.addEventListener('input', calculateLoan);
loanTerm.addEventListener('change', calculateLoan);

// Initialize calculator
calculateLoan();

// FAQ Accordion
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        const isOpen = question.classList.contains('active');
        
        // Close all other FAQs
        document.querySelectorAll('.faq-question').forEach(q => {
            q.classList.remove('active');
            q.nextElementSibling.classList.remove('show');
        });
        
        // Toggle current FAQ if it wasn't already open
        if (!isOpen) {
            question.classList.add('active');
            answer.classList.add('show');
        }
    });
});

// Form Submissions
if (document.getElementById('contactForm')) {
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Formspree integration
        const form = e.target;
        const formData = new FormData(form);
        
        fetch('https://formspree.io/f/YOUR_FORMSPREE_ID', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                alert('Message sent successfully! We will get back to you soon.');
                form.reset();
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .catch(error => {
            alert('There was a problem sending your message. Please try again later.');
            console.error('Error:', error);
        });
    });
}

if (document.getElementById('loanApplication')) {
    document.getElementById('loanApplication').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Formspree integration for loan application
        const form = e.target;
        const formData = new FormData(form);
        
        fetch('https://formspree.io/f/YOUR_LOAN_FORM_ID', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                alert('Application submitted successfully! We will contact you within 24 hours.');
                form.reset();
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .catch(error => {
            alert('There was a problem submitting your application. Please try again later.');
            console.error('Error:', error);
        });
    });
}

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            document.querySelector('nav ul').classList.remove('show');
        }
    });
});

// Sticky Header
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Close mobile menu when clicking a link
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', () => {
            document.querySelector('nav ul').classList.remove('show');
        });
    });
});
// Form Validation for Loan Application
// Updated Form Submission for loanApplication
if (document.getElementById('loanApplication')) {
    const form = document.getElementById('loanApplication');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) return;
        
        // Show loading state
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;
        
        try {
            // Process file uploads first if any
            const formData = new FormData(form);
            
            // Send to PHP backend
            const response = await fetch('php/submit.php', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Show success and reset form
                showAlert('success', 'Application submitted successfully! Check your email.');
                form.reset();
                
                // Update process steps
                updateProcessSteps(3); // Mark all steps as complete
            } else {
                showAlert('error', result.error || 'Submission failed');
                console.error('Error details:', result.debug);
            }
        } catch (error) {
            showAlert('error', 'Network error - please try again');
            console.error('Submission error:', error);
        } finally {
            // Reset button
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });
    
    // Real-time validation
    form.addEventListener('input', function(e) {
        validateField(e.target);
    });
    
    // Form validation functions
    function validateForm() {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            showAlert('error', 'Please fill all required fields correctly');
        }
        
        return isValid;
    }
    
    function validateField(field) {
        const errorElement = field.parentElement.querySelector('.error-message');
        errorElement.textContent = '';
        
        if (field.required && !field.value.trim()) {
            errorElement.textContent = 'This field is required';
            return false;
        }
        
        // Add your specific validation rules here
        if (field.id === 'idNumber' && !/^[0-9]{13}$/.test(field.value)) {
            errorElement.textContent = 'Please enter a valid 13-digit ID number';
            return false;
        }
        
        if (field.id === 'phone' && !/^[0-9]{10}$/.test(field.value)) {
            errorElement.textContent = 'Please enter a valid 10-digit phone number';
            return false;
        }
        
        if (field.type === 'file' && field.required && field.files.length === 0) {
            errorElement.textContent = 'This file is required';
            return false;
        }
        
        return true;
    }
    
    function updateProcessSteps(activeStep) {
        const steps = document.querySelectorAll('.process-steps .step');
        steps.forEach((step, index) => {
            if (index < activeStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }
    
    function showAlert(type, message) {
        // Remove existing alerts
        const existingAlert = form.querySelector('.alert');
        if (existingAlert) existingAlert.remove();
        
        // Create new alert
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            ${message}
        `;
        
        form.prepend(alertDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }
}
// Add this to your CSS:
/*
.alert {
    padding: 15px;
    margin-bottom: 20px;
    border-radius: 4px;
    font-weight: 600;
}

.alert-success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

.alert-error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}
*/
// In apply.html, change the form submission to:
document.getElementById("loanForm").addEventListener("submit", function(e) {
    e.preventDefault();
    
    fetch("apply/submit.php", {
        method: "POST",
        body: new FormData(this)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Application submitted! Check your email.");
        } else {
            alert("Error: " + (data.error || "Submission failed"));
        }
    });
});