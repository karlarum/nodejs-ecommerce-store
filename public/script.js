document.addEventListener('DOMContentLoaded', function() {
    initializeCartFunctionality();
    initializeFormValidation();
    initializeImageHandling();
});

// Cart Functionality
function initializeCartFunctionality() {
    // Add to cart with AJAX
    const addToCartForms = document.querySelectorAll('.add-to-cart-form');
    
    addToCartForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const button = form.querySelector('button[type="submit"]');
            const originalText = button.textContent;
            
            // Show loading state
            button.textContent = 'Adding...';
            button.disabled = true;
            
            fetch('/add-to-cart', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(formData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Update cart count
                    updateCartCount(data.cartCount);
                    
                    // Show success message
                    showNotification(data.message, 'success');
                    
                    // Reset button
                    button.textContent = 'Added!';
                    button.style.backgroundColor = '#28a745';
                    
                    setTimeout(() => {
                        button.textContent = originalText;
                        button.style.backgroundColor = '';
                        button.disabled = false;
                    }, 2000);
                } else {
                    throw new Error(data.error || 'Failed to add to cart');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Failed to add item to cart', 'error');
                
                // Reset button
                button.textContent = originalText;
                button.disabled = false;
            });
        });
    });
    
    // Quantity updates
    const quantitySelects = document.querySelectorAll('.quantity-form select');
    quantitySelects.forEach(select => {
        select.addEventListener('change', function() {
            this.form.submit();
        });
    });
}

// Update cart count in header
function updateCartCount(count) {
    const cartCountElements = document.querySelectorAll('#cart-count');
    cartCountElements.forEach(element => {
        element.textContent = count;
        
        // Animation
        element.style.transform = 'scale(1.2)';
        element.style.color = '#28a745';
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
            element.style.color = '';
        }, 300);
    });
}

// Image Handling
function initializeImageHandling() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Handle image load errors
        img.addEventListener('error', function() {
            this.src = '/images/errorimage.jpg';
            this.alt = 'Image not available';
        });
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    // Background color
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#28a745';
            break;
        case 'error':
            notification.style.backgroundColor = '#dc3545';
            break;
        case 'warning':
            notification.style.backgroundColor = '#ffc107';
            notification.style.color = '#333';
            break;
        default:
            notification.style.backgroundColor = '#17a2b8';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
    
    // Click to dismiss
    notification.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
}