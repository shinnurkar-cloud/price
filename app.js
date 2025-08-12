// Kalaburagi Gold Price Application
// Critical fix: Ensures main public price display updates immediately when admin changes price

// Global application state
let currentPrice = 65000; // This is the main price that everyone sees
let isLoggedIn = false;
const adminUsername = 'admin';
let currentPassword = 'admin123';
const masterPassword = 'gold123';
const minPasswordLength = 6;

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Kalaburagi Gold Price App initialized');
    console.log('📊 Initial price:', '₹' + currentPrice.toLocaleString('en-IN'));
    console.log('🔐 Admin credentials: username = "admin", password = "admin123"');
    console.log('🔑 Master password: "gold123"');
    
    // Update the main public price display immediately
    updatePriceDisplay();
    updateUIState();
    setupEventListeners();
});

function setupEventListeners() {
    // Enter key support for login fields
    const usernameField = document.getElementById('username');
    const passwordField = document.getElementById('password');
    
    if (usernameField && passwordField) {
        [usernameField, passwordField].forEach(field => {
            field.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    handleLogin();
                }
            });
        });
    }
    
    console.log('🎛️ Event listeners set up');
}

// CRITICAL FUNCTION: Updates the main public price display that everyone sees
function updatePriceDisplay() {
    console.log('🎯 UPDATING MAIN PUBLIC PRICE DISPLAY');
    
    const mainPriceElement = document.getElementById('mainPublicPrice');
    if (!mainPriceElement) {
        console.error('❌ CRITICAL ERROR: Main price element #mainPublicPrice not found!');
        return;
    }
    
    // Format price with Indian currency formatting
    const formattedPrice = '₹' + currentPrice.toLocaleString('en-IN');
    mainPriceElement.textContent = formattedPrice;
    
    // Update timestamp
    const now = new Date();
    const timestamp = now.toLocaleString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    const lastUpdatedElement = document.getElementById('lastUpdated');
    if (lastUpdatedElement) {
        lastUpdatedElement.textContent = `Last updated: ${timestamp}`;
    }
    
    console.log('✅ Main price display updated to:', formattedPrice);
    console.log('⏰ Timestamp updated to:', timestamp);
}

function updateUIState() {
    const loginSection = document.getElementById('loginSection');
    const changePasswordSection = document.getElementById('changePasswordSection');
    const adminPanel = document.getElementById('adminPanel');
    
    if (isLoggedIn) {
        // Hide login and change password sections
        if (loginSection) loginSection.classList.add('hidden');
        if (changePasswordSection) changePasswordSection.classList.add('hidden');
        // Show admin panel
        if (adminPanel) adminPanel.classList.remove('hidden');
        console.log('🔓 UI State: Admin logged in - showing admin panel');
    } else {
        // Show login and change password sections
        if (loginSection) loginSection.classList.remove('hidden');
        if (changePasswordSection) changePasswordSection.classList.remove('hidden');
        // Hide admin panel
        if (adminPanel) adminPanel.classList.add('hidden');
        console.log('🔒 UI State: Public view - showing login sections');
    }
}

function handleLogin() {
    console.log('🔐 Login attempt started');
    
    const usernameField = document.getElementById('username');
    const passwordField = document.getElementById('password');
    const loginError = document.getElementById('loginError');
    
    if (!usernameField || !passwordField) {
        console.error('❌ Login fields not found');
        return;
    }
    
    const username = usernameField.value.trim();
    const password = passwordField.value;
    
    console.log('👤 Entered username: "' + username + '"');
    console.log('🔑 Expected username: "' + adminUsername + '"');
    console.log('🔒 Password provided:', password ? 'Yes' : 'No');
    console.log('🔍 Username match:', username === adminUsername);
    console.log('🔍 Password match:', password === currentPassword);
    
    // Hide previous error
    if (loginError) loginError.classList.add('hidden');
    
    if (username === adminUsername && password === currentPassword) {
        isLoggedIn = true;
        
        // Clear login fields
        usernameField.value = '';
        passwordField.value = '';
        
        updateUIState();
        console.log('✅ Login successful for admin');
    } else {
        // Show error message
        if (loginError) {
            loginError.textContent = 'Invalid username or password';
            loginError.classList.remove('hidden');
        }
        console.log('❌ Login failed - invalid credentials');
    }
}

function handleLogout() {
    console.log('🚪 Logout initiated');
    isLoggedIn = false;
    
    // Clear all form fields
    const fieldsToText = ['username', 'password', 'newPrice', 'oldPassword', 'newPassword'];
    fieldsToText.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) field.value = '';
    });
    
    // Hide all messages
    hideAllMessages();
    updateUIState();
    
    console.log('✅ User logged out successfully');
}

function handleChangePassword() {
    console.log('🔧 Password change attempt');
    
    const oldPasswordField = document.getElementById('oldPassword');
    const newPasswordField = document.getElementById('newPassword');
    const changePasswordError = document.getElementById('changePasswordError');
    const changePasswordSuccess = document.getElementById('changePasswordSuccess');
    
    if (!oldPasswordField || !newPasswordField) {
        console.error('❌ Password change fields not found');
        return;
    }
    
    const oldPassword = oldPasswordField.value;
    const newPassword = newPasswordField.value;
    
    console.log('🔍 Old password provided:', oldPassword ? 'Yes' : 'No');
    console.log('🔍 New password length:', newPassword.length);
    
    // Hide previous messages
    if (changePasswordError) changePasswordError.classList.add('hidden');
    if (changePasswordSuccess) changePasswordSuccess.classList.add('hidden');
    
    // Check if old password matches current or master password
    if (oldPassword !== currentPassword && oldPassword !== masterPassword) {
        if (changePasswordError) {
            changePasswordError.textContent = 'Invalid current password';
            changePasswordError.classList.remove('hidden');
        }
        console.log('❌ Password change failed: Invalid current password');
        return;
    }
    
    // Validate new password length
    if (newPassword.length < minPasswordLength) {
        if (changePasswordError) {
            changePasswordError.textContent = `New password must be at least ${minPasswordLength} characters long`;
            changePasswordError.classList.remove('hidden');
        }
        console.log('❌ Password change failed: Password too short');
        return;
    }
    
    // Update password
    const oldPasswordForLog = currentPassword;
    currentPassword = newPassword;
    
    if (changePasswordSuccess) {
        changePasswordSuccess.textContent = 'Password changed successfully';
        changePasswordSuccess.classList.remove('hidden');
    }
    
    // Clear form fields
    oldPasswordField.value = '';
    newPasswordField.value = '';
    
    console.log('✅ Password changed successfully from "' + oldPasswordForLog + '" to new password');
}

// CRITICAL FUNCTION: This is called when admin updates the price
function updatePrice() {
    console.log('💰 PRICE UPDATE INITIATED BY ADMIN');
    
    const newPriceInput = document.getElementById('newPrice');
    const priceUpdateError = document.getElementById('priceUpdateError');
    const priceUpdateSuccess = document.getElementById('priceUpdateSuccess');
    
    if (!newPriceInput) {
        console.error('❌ New price input field not found');
        return;
    }
    
    const newPriceValue = parseFloat(newPriceInput.value);
    
    console.log('📝 Admin entered new price:', newPriceInput.value);
    console.log('📊 Parsed price value:', newPriceValue);
    
    // Hide previous messages
    if (priceUpdateError) priceUpdateError.classList.add('hidden');
    if (priceUpdateSuccess) priceUpdateSuccess.classList.add('hidden');
    
    // Validate new price
    if (isNaN(newPriceValue) || newPriceValue <= 0) {
        if (priceUpdateError) {
            priceUpdateError.textContent = 'Please enter a valid price greater than 0';
            priceUpdateError.classList.remove('hidden');
        }
        console.log('❌ Price update failed: Invalid price value');
        return;
    }
    
    // Store old price for logging
    const oldPrice = currentPrice;
    
    // STEP 1: Update the global price variable
    currentPrice = newPriceValue;
    console.log('📊 Global currentPrice updated from ₹' + oldPrice.toLocaleString('en-IN') + ' to ₹' + currentPrice.toLocaleString('en-IN'));
    
    // STEP 2: Update the main public price display immediately
    console.log('🎯 Calling updatePriceDisplay() to update main public display...');
    updatePriceDisplay();
    
    // STEP 3: Show success message
    if (priceUpdateSuccess) {
        priceUpdateSuccess.textContent = 'Price updated successfully! Main display updated for all users.';
        priceUpdateSuccess.classList.remove('hidden');
    }
    
    // STEP 4: Clear the admin input form
    newPriceInput.value = '';
    
    console.log('🎉 PRICE UPDATE COMPLETE!');
    console.log('✅ Main public price display now shows: ₹' + currentPrice.toLocaleString('en-IN'));
    console.log('✅ All users (including non-admin) will see the updated price');
}

function hideAllMessages() {
    const messageIds = ['loginError', 'changePasswordError', 'changePasswordSuccess', 'priceUpdateError', 'priceUpdateSuccess'];
    messageIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.classList.add('hidden');
    });
    console.log('🧹 All messages hidden');
}