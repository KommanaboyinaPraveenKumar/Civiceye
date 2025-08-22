document.addEventListener('DOMContentLoaded', function() {
  const API_BASE = 'http://localhost:3000/api';
  const form = document.querySelector('.form');
  const fullNameInput = document.getElementById('regFullName');
  const emailInput = document.getElementById('regEmail');
  const phoneInput = document.getElementById('regPhone');
  const userTypeInput = document.getElementById('userType');
  const aadharInput = document.getElementById('aadharNumber');
  const designationInput = document.getElementById('designation');
  const designationIdInput = document.getElementById('designationId');
  const passwordInput = document.getElementById('regPassword');
  const confirmPasswordInput = document.getElementById('regConfirmPassword');

  window.toggleUserTypeFields = function() {
    const userType = userTypeInput.value;
    document.getElementById('citizenFields').style.display = userType === 'citizen' ? 'block' : 'none';
    document.getElementById('officialFields').style.display = userType === 'official' ? 'block' : 'none';
    aadharInput.required = userType === 'citizen';
    designationInput.required = userType === 'official';
    designationIdInput.required = userType === 'official';
    [aadharInput, designationInput, designationIdInput].forEach(input => {
      if (!input.required) {
        input.value = '';
        clearError(input);
      }
    });
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

  function validateAadhar(aadhar) {
    const aadharRegex = /^\d{12}$/;
    return aadhar ? aadharRegex.test(aadhar) : true;
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
    if (errorSpan) errorSpan.remove();
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let isValid = true;

    [fullNameInput, emailInput, phoneInput, userTypeInput, aadharInput, designationInput, designationIdInput, passwordInput, confirmPasswordInput].forEach(input => clearError(input));

    if (!fullNameInput.value.trim()) {
      showError(fullNameInput, 'Full Name is required');
      isValid = false;
    } else if (!validateFullName(fullNameInput.value.trim())) {
      showError(fullNameInput, 'Full Name must be 2-50 characters, letters and spaces only');
      isValid = false;
    }

    if (!emailInput.value.trim()) {
      showError(emailInput, 'Email is required');
      isValid = false;
    } else if (!validateEmail(emailInput.value.trim())) {
      showError(emailInput, 'Please enter a valid email address');
      isValid = false;
    }

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

    if (userTypeInput.value === 'citizen' && !validateAadhar(aadharInput.value.trim())) {
      showError(aadharInput, 'Aadhar must be 12 digits');
      isValid = false;
    }

    if (userTypeInput.value === 'official' && !designationInput.value) {
      showError(designationInput, 'Designation is required');
      isValid = false;
    }

    if (userTypeInput.value === 'official' && !designationIdInput.value.trim()) {
      showError(designationIdInput, 'Designation ID is required');
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
      try {
        const userData = {
          fullName: fullNameInput.value.trim(),
          email: emailInput.value.trim(),
          phone: phoneInput.value.trim(),
          userType: userTypeInput.value,
          password: passwordInput.value,
          aadharNumber: aadharInput.value.trim() || undefined,
          designationId: designationIdInput.value.trim() || undefined,
          designation: designationInput.value || undefined
        };
        const res = await fetch(`${API_BASE}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed');
        alert('Registration successful! Please log in.');
        window.location.href = userTypeInput.value === 'citizen' ? 'Citizenlogin.html' : 'Official_login.html';
      } catch (error) {
        alert(error.message);
      }
    }
  });
});