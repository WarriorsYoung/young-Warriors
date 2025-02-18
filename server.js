const express = require('express');
const bodyParser = require('body-parser');
const paypal = require('@paypal/checkout-server-sdk');
require('dotenv').config();  // Make sure the environment variables are loaded
const path = require('path');

// Load PayPal credentials from .env file
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

// Setup the PayPal environment
const environment = new paypal.core.SandboxEnvironment(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET);
const client = new paypal.core.PayPalHttpClient(environment);

console.log('PayPal Client ID:', PAYPAL_CLIENT_ID);  // Ensure your client ID is loaded correctly

// Create an Express app
const app = express();

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Static file serving (optional for serving HTML, JS, CSS files)
app.use(express.static(path.join(__dirname, 'public')));

// Create a PayPal order (Updated to use @paypal/checkout-server-sdk)
app.post('/create-order', async (req, res) => {
  const { items } = req.body;
  const price = items[0].price; // Get price from the frontend request

  // Prepare order request body
  const request = new paypal.orders.OrdersCreateRequest();
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'USD',
        value: price, // Set the total price for the order
      },
      description: 'Your order description here',
    }],
    application_context: {
      brand_name: 'Your Brand',
      landing_page: 'BILLING',
      user_action: 'PAY_NOW',
      return_url: 'http://localhost:3000/payment-success',
      cancel_url: 'http://localhost:3000/payment-cancel',
    },
  });

  try {
    // Create PayPal order
    const order = await client.execute(request);
    res.json({ id: order.result.id }); // Send order ID back to the frontend
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating PayPal order');
  }
});

// Capture the PayPal order after payment (Updated to use @paypal/checkout-server-sdk)
app.post('/capture-order/:orderID', async (req, res) => {
  const orderID = req.params.orderID;

  // Prepare capture request body
  const request = new paypal.orders.OrdersCaptureRequest(orderID);
  try {
    // Capture PayPal order
    const capture = await client.execute(request);
    res.json(capture.result); // Send captured order details back to the frontend
  } catch (error) {
    console.error(error);
    res.status(500).send('Error capturing PayPal order');
  }
});

// Serve the main HTML file (optional, for frontend use)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
