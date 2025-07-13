// Password validation
export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*)');
  }
  
  return errors;
};

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

// Username validation
export const validateUsername = (username) => {
  const errors = [];
  
  if (username.length < 3) {
    errors.push('Username must be at least 3 characters long');
  }
  
  if (username.length > 20) {
    errors.push('Username must be less than 20 characters');
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push('Username can only contain letters, numbers, and underscores');
  }
  
  return errors;
};

// Confirm password validation
export const validateConfirmPassword = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return null;
};

// Form validation
export const validateSignupForm = (formData) => {
  const errors = {};
  
  // Username validation
  const usernameErrors = validateUsername(formData.username);
  if (usernameErrors.length > 0) {
    errors.username = usernameErrors;
  }
  
  // Email validation
  const emailError = validateEmail(formData.email);
  if (emailError) {
    errors.email = [emailError];
  }
  
  // Password validation
  const passwordErrors = validatePassword(formData.password);
  if (passwordErrors.length > 0) {
    errors.password = passwordErrors;
  }
  
  // Confirm password validation
  const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);
  if (confirmPasswordError) {
    errors.confirmPassword = [confirmPasswordError];
  }
  
  return errors;
};

// Login form validation
export const validateLoginForm = (formData) => {
  const errors = {};
  
  // Email validation
  if (!formData.email) {
    errors.email = ['Email is required'];
  } else {
    const emailError = validateEmail(formData.email);
    if (emailError) {
      errors.email = [emailError];
    }
  }
  
  // Password validation
  if (!formData.password) {
    errors.password = ['Password is required'];
  }
  
  return errors;
};
