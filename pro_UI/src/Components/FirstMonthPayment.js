// Frontend: PaymentPage.jsx
import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const stripePromise = loadStripe('pk_test_51QECqmJiclWUf5gQtibzZGGqWVVTi6X1bNlBZCGkcrLWi7TSvOrXrBlVRVYTMMfBiVhzkBCGutdeUuDbWv7hdOkr004rnMpnFj');

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:5000/api/driver',
  headers: {
    'Content-Type': 'application/json',
  }
});

const FirstMonthPayment = ({ driverId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { token } = useParams();

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        if (!driverId) {
          throw new Error('Driver ID is required');
        }

        const response = await api.post('/create-payment-intent', {
          driverId,
          amount: 1000, // Amount in cents
          currency: 'usd'
        });

        if (!response.data?.clientSecret) {
          throw new Error('Invalid server response');
        }

        setClientSecret(response.data.clientSecret);
        setPaymentId(response.data.paymentId);
        setError('');
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to create payment intent';
        setError(errorMessage);
        console.error('Payment intent error:', err);
      }
    };

    fetchPaymentIntent();
  }, [driverId]);

  const handlePayment = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      setError('Stripe has not been initialized');
      return;
    }

    if (!clientSecret) {
      setError('Payment not initialized properly');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        }
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent.status === 'succeeded') {
        await api.post('/payment-success', {
          paymentId,
          transactionId: paymentIntent.id,
          driverId
        });
        
        setMessage('Payment successful!');
        setTimeout(() => {
          navigate(`/driver-dashboard/${driverId}`); // Navigate to driver dashboard
        }, 2000);
      } else {
        throw new Error('Payment not completed');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Payment failed';
      setError(errorMessage);
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!driverId) {
    return <div className="p-4 text-red-600">Driver ID is required</div>;
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <form onSubmit={handlePayment} className="space-y-4">
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {message && <div className="text-green-600 text-sm">{message}</div>}
        
        <div className="border p-3 rounded">
          <CardElement options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}/>
        </div>

        <button
          type="submit"
          disabled={!stripe || loading || !driverId || !clientSecret}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded disabled:bg-gray-400"
        >
          {loading ? 'Processing...' : 'Pay First Month Fee'}
        </button>
      </form>
    </div>
  );
};

const PaymentPage = ({ driverId }) => {
  if (!driverId) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <div className="text-red-600">
          Error: Driver ID is required. Please ensure you're passing the driver ID correctly.
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <FirstMonthPayment driverId={driverId} />
    </Elements>
  );
};

export default PaymentPage;