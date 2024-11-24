import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useParams } from 'react-router-dom';
import FirstMonthPayment from './FirstMonthPayment'; // Assuming this is your payment component

// Load your Stripe publishable key
const stripePromise = loadStripe('pk_test_51QECqmJiclWUf5gQtibzZGGqWVVTi6X1bNlBZCGkcrLWi7TSvOrXrBlVRVYTMMfBiVhzkBCGutdeUuDbWv7hdOkr004rnMpnFj');

const PaymentPage = () => {
  // Extract driverId and token from the URL
  const { driverId, token } = useParams();

  // Debugging: Check if driverId and token are being captured correctly
  console.log('Driver ID:', driverId);
  console.log('Token:', token);

  // Ensure driverId and token are present
  if (!driverId || !token) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <div className="text-red-600">Error: Missing Driver ID or Token. Please use the correct URL.</div>
      </div>
    );
  }

  // Render the Stripe payment form
  return (
    <Elements stripe={stripePromise}>
      <FirstMonthPayment driverId={driverId} token={token} />
    </Elements>
  );
};

export default PaymentPage;
