/* =============================================================================
   ADELE COACHING FUNNEL - MAIN JAVASCRIPT
   ============================================================================= */

document.addEventListener('DOMContentLoaded', function () {

    // -------------------------------------------------------------------------
    // FADE UP ANIMATION ON SCROLL
    // -------------------------------------------------------------------------
    const fadeElements = document.querySelectorAll('.fade-up');

    function fadeUpOnScroll() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementTop < windowHeight * 0.85) {
                element.classList.add('visible');
            }
        });
    }

    // Run on load and scroll
    fadeUpOnScroll();
    window.addEventListener('scroll', fadeUpOnScroll);

    // -------------------------------------------------------------------------
    // FAQ ACCORDION
    // -------------------------------------------------------------------------
    const faqItems = document.querySelectorAll('.faq__item');

    faqItems.forEach(item => {
        const header = item.querySelector('.faq__header');

        header.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // -------------------------------------------------------------------------
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // -------------------------------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // -------------------------------------------------------------------------
    // STRIPE PAYMENT INTEGRATION
    // -------------------------------------------------------------------------
    const stripeForm = document.getElementById('payment-form');

    if (stripeForm) {
        // Initialize Stripe
        // NOTE: Replace with your actual publishable key
        const stripe = Stripe('pk_test_REPLACE_WITH_YOUR_PUBLISHABLE_KEY');
        const elements = stripe.elements({
            locale: 'fr'
        });

        // Create card elements
        const cardNumberElement = elements.create('cardNumber', {
            style: {
                base: {
                    fontSize: '16px',
                    fontFamily: 'Montserrat, sans-serif',
                    color: '#222222',
                    '::placeholder': {
                        color: '#999999'
                    }
                },
                invalid: {
                    color: '#e74c3c'
                }
            }
        });

        const cardExpiryElement = elements.create('cardExpiry', {
            style: {
                base: {
                    fontSize: '16px',
                    fontFamily: 'Montserrat, sans-serif',
                    color: '#222222',
                    '::placeholder': {
                        color: '#999999'
                    }
                },
                invalid: {
                    color: '#e74c3c'
                }
            }
        });

        const cardCvcElement = elements.create('cardCvc', {
            style: {
                base: {
                    fontSize: '16px',
                    fontFamily: 'Montserrat, sans-serif',
                    color: '#222222',
                    '::placeholder': {
                        color: '#999999'
                    }
                },
                invalid: {
                    color: '#e74c3c'
                }
            }
        });

        // Mount elements
        const cardNumberContainer = document.getElementById('card-number');
        const cardExpiryContainer = document.getElementById('card-expiry');
        const cardCvcContainer = document.getElementById('card-cvc');

        if (cardNumberContainer) cardNumberElement.mount('#card-number');
        if (cardExpiryContainer) cardExpiryElement.mount('#card-expiry');
        if (cardCvcContainer) cardCvcElement.mount('#card-cvc');

        // Handle form submission
        stripeForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const submitButton = stripeForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;

            // Validate consent checkbox
            const consentCheckbox = document.getElementById('consent');
            if (consentCheckbox && !consentCheckbox.checked) {
                alert('Veuillez accepter les conditions générales.');
                return;
            }

            // Disable button and show loading
            submitButton.disabled = true;
            submitButton.innerHTML = '<span>Traitement en cours...</span>';

            try {
                // Create payment method
                const { paymentMethod, error } = await stripe.createPaymentMethod({
                    type: 'card',
                    card: cardNumberElement,
                    billing_details: {
                        name: document.getElementById('name')?.value || '',
                        email: document.getElementById('email')?.value || '',
                    }
                });

                if (error) {
                    alert(error.message);
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalText;
                    return;
                }

                // Here you would typically send the paymentMethod.id to your server
                // and process the payment. For now, we'll redirect to success page.
                console.log('Payment Method created:', paymentMethod.id);

                // Simulate successful payment - redirect to success page
                window.location.href = 'success.html';

            } catch (err) {
                console.error('Payment error:', err);
                alert('Une erreur est survenue. Veuillez réessayer.');
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
            }
        });
    }

    // -------------------------------------------------------------------------
    // FORM VALIDATION
    // -------------------------------------------------------------------------
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required]');

        inputs.forEach(input => {
            input.addEventListener('blur', function () {
                validateInput(this);
            });

            input.addEventListener('input', function () {
                if (this.classList.contains('error')) {
                    validateInput(this);
                }
            });
        });
    });

    function validateInput(input) {
        const value = input.value.trim();
        let isValid = true;

        if (input.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(value);
        } else if (input.type === 'tel') {
            isValid = value.length >= 8;
        } else {
            isValid = value.length > 0;
        }

        if (!isValid) {
            input.classList.add('error');
            input.style.borderColor = '#e74c3c';
        } else {
            input.classList.remove('error');
            input.style.borderColor = '#ddd';
        }

        return isValid;
    }

    // -------------------------------------------------------------------------
    // PHONE NUMBER FORMATTING
    // -------------------------------------------------------------------------
    const phoneInput = document.getElementById('phone');

    if (phoneInput) {
        phoneInput.addEventListener('input', function (e) {
            // Remove non-digit characters except +
            let value = e.target.value.replace(/[^\d+]/g, '');
            e.target.value = value;
        });
    }

    // -------------------------------------------------------------------------
    // DISABLE RIGHT-CLICK (as in original)
    // -------------------------------------------------------------------------
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    });

});
