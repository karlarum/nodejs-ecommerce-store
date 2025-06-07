function initializeFormValidation() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', validateInput);
            input.addEventListener('input', clearValidationError);
            input.addEventListener('input', restrictInput);
        });

        form.addEventListener('submit', function (e) {
            if (!validateForm(this)) {
                e.preventDefault();
                showNotification('Please fill in all required fields correctly', 'error');
            }
        });
    });

    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        initializeCheckoutValidation(checkoutForm);
    }
}

function restrictInput(e) {
    const input = e.target;
    const inputName = input.name;
    const inputValue = input.value;

    if (inputName === 'fullName') {
        // Only allow letters, spaces, hyphens, and apostrophes
        input.value = inputValue.replace(/[^a-zA-Z\s\-']/g, '');
    } else if (inputName === 'phone') {
        // Only allow numbers, spaces, hyphens, parentheses, and plus sign
        input.value = inputValue.replace(/[^0-9\s\-\(\)\+]/g, '');
    } else if (inputName === 'zipCode') {
        // Only allow numbers and hyphens
        input.value = inputValue.replace(/[^0-9\-]/g, '');
    } else if (inputName === 'cvv') {
        // Only allow numbers, max 4 digits
        input.value = inputValue.replace(/[^0-9]/g, '').substring(0, 4);
    } else if (inputName === 'city' || inputName === 'state') {
        // Only allow letters, spaces, hyphens, and apostrophes
        input.value = inputValue.replace(/[^a-zA-Z\s\-']/g, '');
    }
}

function validateInput(e) {
    const input = e.target;
    const value = input.value.trim();

    input.classList.remove('error');

    let isValid = true;
    let errorMessage = '';

    // Name validation
    if (input.name === 'fullName') {
        const nameRegex = /^[a-zA-Z\s\-']{2,}$/;
        if (!nameRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid name (letters only, minimum 2 characters)';
        }
    } 
    // Email validation
    else if (input.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    } 
    // Phone validation
    else if (input.name === 'phone') {
        if (value) {
            const phoneDigits = value.replace(/\D/g, '');
            if (phoneDigits.length < 10) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number (at least 10 digits)';
            }
        }
    } 
    // City/State validation
    else if (input.name === 'city' || input.name === 'state') {
        const locationRegex = /^[a-zA-Z\s\-']{2,}$/;
        if (!locationRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid ' + (input.name === 'city' ? 'city' : 'state') + ' name';
        }
    }
    // Address validation
    else if (input.name === 'address') {
        if (value.length < 5) {
            isValid = false;
            errorMessage = 'Please enter a complete address';
        }
    }
    // ZIP Code validation
    else if (input.name === 'zipCode') {
        const zipRegex = /^\d{5}(-\d{4})?$/;
        if (!zipRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid ZIP code (12345 or 12345-6789)';
        }
    } 
    // Card number validation
    else if (input.name === 'cardNumber') {
        const cardRegex = /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/;
        if (!cardRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid card number (1234 5678 9012 3456)';
        }
    } 
    // CVV validation
    else if (input.name === 'cvv') {
        const cvvRegex = /^\d{3,4}$/;
        if (!cvvRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid CVV (3 or 4 digits)';
        }
    } 
    // Expiration date validation
    else if (input.name === 'expiryDate') {
        const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (!expiryRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid expiry date (MM/YY)';
        } else {
            // Check current date
            const [month, year] = value.split('/');
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear() % 100;
            const currentMonth = currentDate.getMonth() + 1;
            
            const enteredYear = parseInt(year);
            const enteredMonth = parseInt(month);
            
            if (enteredYear < currentYear || (enteredYear === currentYear && enteredMonth < currentMonth)) {
                isValid = false;
                errorMessage = 'Expiry date cannot be in the past';
            }
        }
    }

    if (!isValid) {
        showInputError(input, errorMessage);
    }

    return isValid;
}

function clearValidationError(e) {
    const input = e.target;
    input.classList.remove('error');
    removeInputError(input);
}

function showInputError(input, message) {
    input.classList.add('error');
    removeInputError(input);

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#dc3545';
    errorDiv.style.fontSize = '0.8rem';
    errorDiv.style.marginTop = '0.25rem';

    input.parentNode.appendChild(errorDiv);
}

function removeInputError(input) {
    const errorMessage = input.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            showInputError(input, 'This field is required');
            isValid = false;
        } else if (!validateInput({ target: input })) {
            isValid = false;
        }
    });

    return isValid;
}

function initializeCheckoutValidation(form) {
    // Card number formatting
    const cardNumberInput = form.querySelector('#cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
            e.target.value = value.substring(0, 19);
        });
    }

    // Expiration date formatting
    const expiryInput = form.querySelector('#expiryDate');
    if (expiryInput) {
        expiryInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }

    // CVV formatting
    const cvvInput = form.querySelector('#cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function (e) {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
        });
    }

    // Phone number formatting
    const phoneInput = form.querySelector('#phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 6) {
                if (value.length <= 10) {
                    value = value.replace(/(\d{3})(\d{3})(\d{1,4})/, '($1) $2-$3');
                } else {
                    value = value.replace(/(\d{3})(\d{3})(\d{4}).*/, '($1) $2-$3');
                }
            } else if (value.length >= 3) {
                value = value.replace(/(\d{3})(\d{1,3})/, '($1) $2');
            }
            e.target.value = value;
        });
    }
}