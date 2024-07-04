# Subscription and Payment System with Stripe, Express, MongoDB, and Angular

This project implements a subscription and payment system using Stripe for payment processing, Express.js for the backend server, MongoDB for database management, and Angular for the frontend.

## Features

- **Subscription Management**: Create and cancel subscriptions with Stripe.
- **Payment Processing**: Handle one-time payments.
- **Webhook Handling**: Listen to Stripe webhooks for updates on payment and subscription statuses.

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: Angular
- **Database**: MongoDB
- **Payment Processor**: Stripe

## Prerequisites

- Node.js
- npm
- MongoDB
- Stripe account

## Installation

1. **Clone the Repository**
   ```bash
   git clone [https://github.com/stripe_payment_flow.git](https://github.com/kulandaiyesum/stripe_payment_flow.git)
   cd your-repo
 
2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install

3. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install

4. **Configure Environment Variables**
   Create a `.env` file in the `backend` directory with the following content:
   ```plaintext
      PORT=3000
      STRIPE_SECRET_KEY=your_stripe_secret_key
      STRIPE_WEBHOOK_KEY=your_stripe_webhook_key
      DATABASE_URI=your_mongodb_connection_string

5. **Frontend Environment Configuration**
  In the `src/environments/environment.ts` file, add the following environment variables:
    ```typescript
    export const environment = {
      STRIPE_PUBLISHABLE_KEY: 'your_stripe_publishable_key',
      API_END_POINT: 'your_end_point',  // 'http://localhost:3000'
    } 

## Running the Application

### Start the Backend Server
    cd backend
    npm start

### Start the Angular Frontend
    cd backend
    npm start

## API Endpoints

### Create Checkout Session
- **URL**: `/checkout`
- **Method**: `POST`
- **Body Parameters**:
  - `product`: An object containing product details.
  - `isPremium`: A boolean indicating if the user is a premium user.
- **Response**: Stripe checkout session details.

### Create Subscription
- **URL**: /create-subscription
- **Method**: POST
- **Body Parameters**:
  - `userId`: The user's ID.
- **Response**: Stripe subscription session details.

### Cancel Subscription
- **URL**: /cancel-subscription
- **Method**: POST
- **Body Parameters**:
  - `userId`: The user's ID (optional).
  - `cancelAtPeriodEnd`: A boolean indicating if the subscription should be canceled at the end of the period.
- **Response**: Cancellation confirmation.

### Webhook
- **URL**: `/webhook`
- **Method**: `POST`
- **Body**: Stripe webhook event payload.
- **Response**: Confirmation of event receipt.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


  ```javascript
  Make sure to replace placeholders like `your_stripe_publishable_key`, `your_end_point`,`your_repo_url`, `your_stripe_secret_key`, `your_stripe_webhook_key`, and `your_mongodb_connection_string` with actual values relevant to your project.

