// Global variables to store user data
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = null;

// DOM elements
const mainLoginSection = document.getElementById('mainLoginSection');
const loginFormCard = document.querySelector('.login-form-card');
const registrationFormCard = document.getElementById('registrationFormCard');
const citizenDashboard = document.getElementById('citizenDashboard');
const officialDashboard = document.getElementById('officialDashboard');

// Registration form elements
const registrationForm = document.getElementById('registrationForm');
const userTypeSelect = document.getElementById('userType');
const citizenFields = document.getElementById('citizenFields');
const officialFields = document.getElementById('officialFields');

// Login form elements
const loginForm = document.getElementById('loginForm');

// Dashboard elements
const citizenName = document.getElementById('citizenName');
const citizenEmail = document.getElementById('citizenEmail');
const citizenPhone = document.getElementById('citizenPhone');
const citizenAadhar = document.getElementById('citizenAadhar');
const citizenUsername = document.getElementById('citizenUsername');

const officialName = document.getElementById('officialName');
const officialEmail = document.getElementById('officialEmail');
const officialPhone = document.getElementById('officialPhone');
const officialDesignation = document.getElementById('officialDesignation');
const officialIdDisplay = document.getElementById('officialIdDisplay');
const officialUsername = document.getElementById('officialUsername');

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showDashboard(currentUser);
    }
    
    // Form submissions
    registrationForm.addEventListener('submit', handleRegistration);
    loginForm.addEventListener('submit', handleLogin);
    
    // Aadhar number validation
    const aadharInput = document.getElementById('aadharNumber');
    if (aadharInput) {
        aadharInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 12) value = value.slice(0, 12);
            e.target.value = value;
        });
    }
    
    // OTP validation
    const otpInput = document.getElementById('aadharOTP');
    if (otpInput) {
        otpInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 6) value = value.slice(0, 6);
            e.target.value = value;
        });
    }
    
    // Show login form by default
    loginFormCard.style.display = 'block';
    registrationFormCard.style.display = 'none';
});

// Navigation functions
function toggleToRegistration() {
    loginFormCard.style.display = 'none';
    registrationFormCard.style.display = 'block';
    resetRegistrationForm();
}

function toggleToLogin() {
    registrationFormCard.style.display = 'none';
    loginFormCard.style.display = 'block';
    resetLoginForm();
}

function hideAllSections() {
    mainLoginSection.style.display = 'none';
    citizenDashboard.style.display = 'none';
    officialDashboard.style.display = 'none';
}

// Form reset functions
function resetRegistrationForm() {
    registrationForm.reset();
    citizenFields.style.display = 'none';
    officialFields.style.display = 'none';
    userTypeSelect.value = '';
}

function resetLoginForm() {
    loginForm.reset();
}

// Toggle user type specific fields
function toggleUserTypeFields() {
    const userType = userTypeSelect.value;
    
    if (userType === 'citizen') {
        citizenFields.style.display = 'block';
        officialFields.style.display = 'none';
        
        // Make citizen fields required
        document.getElementById('aadharNumber').required = true;
        document.getElementById('aadharOTP').required = true;
        
        // Make official fields not required
        document.getElementById('designation').required = false;
        document.getElementById('officialId').required = false;
        
    } else if (userType === 'official') {
        citizenFields.style.display = 'none';
        officialFields.style.display = 'block';
        
        // Make official fields required
        document.getElementById('designation').required = true;
        document.getElementById('officialId').required = true;
        
        // Make citizen fields not required
        document.getElementById('aadharNumber').required = false;
        document.getElementById('aadharOTP').required = false;
        
    } else {
        citizenFields.style.display = 'none';
        officialFields.style.display = 'none';
        
        // Reset all required fields when no user type is selected
        if (document.getElementById('aadharNumber')) {
            document.getElementById('aadharNumber').required = false;
        }
        if (document.getElementById('aadharOTP')) {
            document.getElementById('aadharOTP').required = false;
        }
        if (document.getElementById('designation')) {
            document.getElementById('designation').required = false;
        }
        if (document.getElementById('officialId')) {
            document.getElementById('officialId').required = false;
        }
    }
}

// Generate OTP (simulated)
function generateOTP() {
    const aadharNumber = document.getElementById('aadharNumber').value;
    
    if (!aadharNumber || aadharNumber.length !== 12) {
        alert('Please enter a valid 12-digit Aadhar number first');
        return;
    }
    
    // Simulate OTP generation (in real app, this would be sent via SMS)
    const otp = Math.floor(100000 + Math.random() * 900000);
    document.getElementById('aadharOTP').value = otp;
    
    alert(`OTP generated: ${otp}\n(In a real application, this would be sent via SMS to your registered mobile number)`);
}

// Handle registration
function handleRegistration(e) {
    e.preventDefault();
    
    const formData = new FormData(registrationForm);
    const userData = {
        fullName: document.getElementById('regFullName').value,
        email: document.getElementById('regEmail').value,
        phone: document.getElementById('regPhone').value,
        userType: userTypeSelect.value,
        username: document.getElementById('regUsername').value,
        password: document.getElementById('regPassword').value,
        confirmPassword: document.getElementById('regConfirmPassword').value
    };
    
    // Validation
    if (!validateRegistration(userData)) {
        return;
    }
    
    // Check if username already exists
    if (users.find(user => user.username === userData.username)) {
        alert('Username already exists. Please choose a different username.');
        return;
    }
    
    // Check if email already exists
    if (users.find(user => user.email === userData.email)) {
        alert('Email already registered. Please use a different email or login.');
        return;
    }
    
    // User type specific data is now handled in validateRegistration function
    
    // Remove sensitive data before storing
    const userToStore = {
        ...userData,
        id: Date.now(),
        createdAt: new Date().toISOString()
    };
    
    // Store user
    users.push(userToStore);
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('Registration successful! Please login with your credentials.');
    showLogin();
}

// Validate registration data
function validateRegistration(userData) {
    if (!userData.fullName || !userData.email || !userData.phone || !userData.userType || 
        !userData.username || !userData.password || !userData.confirmPassword) {
        alert('Please fill in all required fields.');
        return false;
    }
    
    if (userData.password !== userData.confirmPassword) {
        alert('Passwords do not match.');
        return false;
    }
    
    if (userData.password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return false;
    }
    
    if (userData.userType === 'citizen') {
        const aadharNumber = document.getElementById('aadharNumber').value;
        const aadharOTP = document.getElementById('aadharOTP').value;
        
        if (!aadharNumber || aadharNumber.length !== 12) {
            alert('Please enter a valid 12-digit Aadhar number.');
            return false;
        }
        if (!aadharOTP || aadharOTP.length !== 6) {
            alert('Please enter a valid 6-digit OTP.');
            return false;
        }
        
        // Update userData with the actual values
        userData.aadharNumber = aadharNumber;
        userData.aadharOTP = aadharOTP;
        
    } else if (userData.userType === 'official') {
        const designation = document.getElementById('designation').value;
        const officialId = document.getElementById('officialId').value;
        
        if (!designation) {
            alert('Please select your designation.');
            return false;
        }
        if (!officialId) {
            alert('Please enter your official ID number.');
            return false;
        }
        
        // Update userData with the actual values
        userData.designation = designation;
        userData.officialId = officialId;
    }
    
    return true;
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!username || !password) {
        alert('Please enter both username and password.');
        return;
    }
    
    // Find user
    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) {
        alert('Invalid username or password.');
        return;
    }
    
    // Login successful
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    showDashboard(user);
}

// Show appropriate dashboard
function showDashboard(user) {
    hideAllSections();
    
    if (user.userType === 'citizen') {
        displayCitizenDashboard(user);
        citizenDashboard.style.display = 'block';
    } else if (user.userType === 'official') {
        displayOfficialDashboard(user);
        officialDashboard.style.display = 'block';
    }
}

// Display citizen dashboard
function displayCitizenDashboard(user) {
    citizenName.textContent = user.fullName;
    citizenEmail.textContent = user.email;
    citizenPhone.textContent = user.phone;
    citizenAadhar.textContent = user.aadharNumber;
    citizenUsername.textContent = user.username;
}

// Display official dashboard
function displayOfficialDashboard(user) {
    officialName.textContent = user.fullName;
    officialEmail.textContent = user.email;
    officialPhone.textContent = user.phone;
    officialDesignation.textContent = getDesignationLabel(user.designation);
    officialIdDisplay.textContent = user.officialId;
    officialUsername.textContent = user.username;
}

// Get designation label
function getDesignationLabel(designation) {
    const designationMap = {
        'municipal_corporation': 'Municipal Corporation',
        'police_department': 'Police Department',
        'health_department': 'Health Department',
        'education_department': 'Education Department',
        'transport_department': 'Transport Department',
        'water_supply': 'Water Supply Department',
        'electricity_board': 'Electricity Board',
        'tax_department': 'Tax Department',
        'other': 'Other'
    };
    return designationMap[designation] || designation;
}

// Logout function
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showWelcome();
}

// Utility function to format phone numbers
function formatPhoneNumber(phone) {
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
}

// Utility function to format Aadhar number
function formatAadharNumber(aadhar) {
    return aadhar.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
}
