# Demo Data for Testing

## Sample Citizen Account
- **Full Name:** John Doe
- **Email:** john.doe@email.com
- **Phone:** 9876543210
- **User Type:** Citizen
- **Aadhar Number:** 123456789012
- **Username:** johndoe
- **Password:** 123456

## Sample Government Official Account
- **Full Name:** Jane Smith
- **Email:** jane.smith@gov.in
- **Phone:** 9876543211
- **User Type:** Government Official
- **Designation:** Municipal Corporation
- **Official ID:** MC001
- **Username:** janesmith
- **Password:** 123456

## Testing Steps

### 1. Test Citizen Registration
1. Click "Register"
2. Fill in the form with citizen details
3. Select "Citizen" as user type
4. Enter Aadhar number (12 digits)
5. Click "Generate OTP" to get a 6-digit OTP
6. Complete registration

### 2. Test Official Registration
1. Click "Register"
2. Fill in the form with official details
3. Select "Government Official" as user type
4. Choose designation from dropdown
5. Enter official ID
6. Complete registration

### 3. Test Login
1. Use the created credentials to login
2. Verify you're redirected to the correct dashboard
3. Check that all user information is displayed correctly

### 4. Test Logout
1. Click logout button
2. Verify you're returned to welcome page
3. Try to access dashboard without logging in again

## Notes
- OTP generation is simulated for demo purposes
- All data is stored in browser localStorage
- Clear browser data to reset all user accounts
- Passwords are stored in plain text (demo only)
