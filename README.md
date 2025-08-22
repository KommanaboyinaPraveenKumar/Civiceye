# Citizens Portal - Dual Login System

A modern web application with a dual login system for citizens and government officials, designed to address societal problems through better communication between citizens and government authorities.

## Features

### 🏠 Welcome Page
- Clean, modern interface with gradient background
- Two main options: Register or Login
- Responsive design for all devices

### 👤 Registration System
- **Common Fields for All Users:**
  - Full Name
  - Email Address
  - Phone Number
  - Username
  - Password & Confirm Password

- **User Type Selection:**
  - Citizen
  - Government Official

- **Citizen-Specific Fields:**
  - 12-digit Aadhar Number
  - 6-digit OTP verification (simulated)
  - OTP generation button for testing

- **Government Official-Specific Fields:**
  - Designation selection from predefined options:
    - Municipal Corporation
    - Police Department
    - Health Department
    - Education Department
    - Transport Department
    - Water Supply Department
    - Electricity Board
    - Tax Department
    - Other
  - Official ID/Employee Number

### 🔐 Login System
- Username and password authentication
- Automatic redirection to appropriate dashboard based on user type
- Session persistence using localStorage

### 📊 Dashboards

#### Citizen Dashboard
- Personal information display
- Aadhar number verification
- Welcome message with citizen-specific content
- Logout functionality

#### Government Official Dashboard
- Official information display
- Designation and department details
- Welcome message with official-specific content
- Logout functionality

## Technical Features

- **Frontend Only:** Pure HTML, CSS, and JavaScript
- **Responsive Design:** Works on desktop, tablet, and mobile devices
- **Local Storage:** User data persistence across browser sessions
- **Form Validation:** Comprehensive input validation and error handling
- **Modern UI/UX:** Clean, professional interface with smooth animations
- **Security Features:** Password confirmation, duplicate username/email prevention

## How to Use

### 1. Getting Started
1. Open `index.html` in a modern web browser
2. The application will load with the welcome page

### 2. Registration Process
1. Click "Register" button
2. Fill in all required fields
3. Select user type (Citizen or Government Official)
4. Fill in type-specific fields:
   - **For Citizens:** Enter Aadhar number and generate OTP
   - **For Officials:** Select designation and enter official ID
5. Set username and password
6. Submit the form

### 3. Login Process
1. Click "Login" button
2. Enter your username and password
3. Click "Login" to access your dashboard

### 4. Dashboard Access
- **Citizens** will see their personal dashboard with citizen-specific information
- **Government Officials** will see their official dashboard with designation details
- Both dashboards show relevant user information and welcome messages

### 5. Logout
- Click the "Logout" button in the dashboard header
- You'll be redirected to the welcome page

## File Structure

```
Citizens/
├── index.html          # Main HTML file with all UI components
├── styles.css          # CSS styling and responsive design
├── script.js           # JavaScript functionality and logic
└── README.md           # This documentation file
```

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Modern mobile browsers

## Development Notes

- **OTP Generation:** Currently simulated for demonstration purposes
- **Data Storage:** Uses browser localStorage (data persists until browser data is cleared)
- **Validation:** Client-side validation with user-friendly error messages
- **Responsive:** Mobile-first design approach

## Future Enhancements

- Backend integration with real database
- SMS/Email OTP verification
- File upload capabilities for documents
- Complaint/Request submission system
- Real-time notifications
- Admin panel for user management
- API integration with government systems

## Security Considerations

- Passwords are stored in plain text (for demo purposes only)
- In production, implement proper password hashing
- Add server-side validation
- Implement proper session management
- Use HTTPS for all communications

## License

This project is created for educational and demonstration purposes.

---

**Note:** This is a frontend demonstration application. For production use, implement proper backend services, database security, and real authentication systems.
