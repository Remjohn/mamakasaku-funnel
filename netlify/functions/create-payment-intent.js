exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    // Check for Secret Key
    // The client will add this to Netlify Site Settings -> Environment Variables
    // FALLBACK: User provided key directly (added for immediate fix)
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Stripe Secret Key not configured in Netlify' }),
        };
    }

    const stripe = require('stripe')(stripeSecretKey);

    try {
        const data = JSON.parse(event.body);
        const { amount, currency = 'eur', description, receipt_email } = data;

        // Create a PaymentIntent with the specific amount
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 4999, // Hardcoded for safety: €49.99 (in cents)
            currency: currency,
            description: description || 'Appel découverte (60 min)',
            receipt_email: receipt_email,
            automatic_payment_methods: {
                enabled: true,
            },
        });

        return {
            statusCode: 200,
            body: JSON.stringify({
                clientSecret: paymentIntent.client_secret,
                id: paymentIntent.id
            }),
        };
    } catch (error) {
        console.error('Stripe error:', error);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
