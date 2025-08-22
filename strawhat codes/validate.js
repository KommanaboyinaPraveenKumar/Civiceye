document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.form');
    const fullNameInput = document.getElementById('regFullName');
    const emailInput = document.getElementById('regEmail');
    const phoneInput = document.getElementById('regPhone');
     const designationInput = document.getElementById('regDesignation');
    const userTypeInput = document.getElementById('userType');
    const passwordInput = document.querySelector('input[type="password"]:nth-of-type(1)');
    const confirmPasswordInput = document.querySelector('input[type="password"]:nth-of-type(2)');

    
    window.toggleUserTypeFields = function() {
        console.log('toggleUserTypeFields called, userType:', userTypeInput.value);
        if (userTypeInput.value === 'official') {
            designationLabel.style.display = 'block';
            designationInput.required = true;
            console.log('Designation ID field shown');
        } else {
            designationLabel.style.display = 'none';
            designationInput.required = false;
            designationInput.value = ''; 
            clearError(designationInput);
            console.log('Designation ID field hidden');
        }
    };
 
    
    function validateFullName(name) {
        const nameRegex = /^[a-zA-Z\s]{2,50}$/;
        return nameRegex.test(name);
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePhone(phone) {
        const phoneRegex = /^\+?[\d\s-]{10,15}$/;
        return phoneRegex.test(phone);
    }

    function validatePassword(password) {
        return password.length >= 8;
    }

    function showError(input, message) {
        const label = input.parentElement;
        let errorSpan = label.querySelector('.error-message');
        if (!errorSpan) {
            errorSpan = document.createElement('span');
            errorSpan.className = 'error-message';
            errorSpan.style.color = '#ff5555';
            errorSpan.style.fontSize = '0.8em';
            errorSpan.style.marginTop = '5px';
            label.appendChild(errorSpan);
        }
        errorSpan.textContent = message;
    }

    function clearError(input) {
        const label = input.parentElement;
        const errorSpan = label.querySelector('.error-message');
        if (errorSpan) {
            errorSpan.remove();
        }
    }


    form.addEventListener('submit', function(e) {
        e.preventDefault();
        let isValid = true;

 
        [fullNameInput, emailInput, phoneInput, userTypeInput, passwordInput, confirmPasswordInput].forEach(input => clearError(input));

        if (!fullNameInput.value.trim()) {
            showError(fullNameInput, 'Full Name is required');
            isValid = false;
        } else if (!validateFullName(fullNameInput.value.trim())) {
            showError(fullNameInput, 'Full Name must be 2-50 characters and contain only letters and spaces');
            isValid = false;
        }

   
        if (!emailInput.value.trim()) {
            showError(emailInput, 'Email is required');
            isValid = false;
        } else if (!validateEmail(emailInput.value.trim())) {
            showError(emailInput, 'Please enter a valid email address');
            isValid = false;
        }

        // Validate Phone
        if (!phoneInput.value.trim()) {
            showError(phoneInput, 'Phone Number is required');
            isValid = false;
        } else if (!validatePhone(phoneInput.value.trim())) {
            showError(phoneInput, 'Please enter a valid phone number (10-15 digits)');
            isValid = false;
        }


        if (!userTypeInput.value) {
            showError(userTypeInput, 'Please select a user type');
            isValid = false;
        }


        if (!passwordInput.value) {
            showError(passwordInput, 'Password is required');
            isValid = false;
        } else if (!validatePassword(passwordInput.value)) {
            showError(passwordInput, 'Password must be at least 8 characters long');
            isValid = false;
        }

        if (!confirmPasswordInput.value) {
            showError(confirmPasswordInput, 'Please confirm your password');
            isValid = false;
        } else if (passwordInput.value !== confirmPasswordInput.value) {
            showError(confirmPasswordInput, 'Passwords do not match');
            isValid = false;
        }

        if (isValid) {
            
            console.log({
                fullName: fullNameInput.value,
                email: emailInput.value,
                phone: phoneInput.value,
                userType: userTypeInput.value,
                password: passwordInput.value
            });
            alert('Form validated successfully! Check console for form data.');
            form.reset();
        }
    });
});