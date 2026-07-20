import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';
import { MapPin, CreditCard, Wallet, ArrowLeft, CheckCircle } from 'lucide-react';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  
  const [deliveryAddress, setDeliveryAddress] = useState({
    name: '',
    mobile: '',
    address: '',
    landmark: '',
    pincode: ''
  });
  
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

  const subtotal = getCartTotal();
  const deliveryCharge = 40;
  const totalAmount = subtotal + deliveryCharge;

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleInputChange = (e) => {
    setDeliveryAddress({
      ...deliveryAddress,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!deliveryAddress.name.trim()) {
      toast.error('Please enter your name');
      return false;
    }
    if (!deliveryAddress.mobile.trim() || deliveryAddress.mobile.length < 10) {
      toast.error('Please enter a valid mobile number');
      return false;
    }
    if (!deliveryAddress.address.trim()) {
      toast.error('Please enter delivery address');
      return false;
    }
    if (!deliveryAddress.pincode.trim() || deliveryAddress.pincode.length !== 6) {
      toast.error('Please enter a valid pincode');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    if (paymentMethod === 'Online Payment' && !showQRCode) {
      setShowQRCode(true);
      toast.info('Please scan the QR code and complete the payment');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: cartItems.map(item => ({
          food: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.price * item.quantity
        })),
        deliveryAddress,
        specialInstructions,
        paymentMethod,
        subtotal,
        deliveryCharge,
        totalAmount
      };

      const response = await axios.post('/api/orders', orderData);
      const order = response.data.order;

      clearCart();
      toast.success('Order Confirmed Successfully!');
      navigate(`/order/${order._id}`);
    } catch (error) {
      console.error('Order error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      
      <div className="checkout-container">
        <div className="checkout-header">
          <button onClick={() => navigate('/cart')} className="back-button">
            <ArrowLeft size={20} />
            Back to Cart
          </button>
          <h1>Checkout</h1>
        </div>

        <div className="checkout-content">
          <div className="checkout-form">
            {/* Delivery Address Section */}
            <div className="checkout-section">
              <div className="section-header">
                <MapPin size={24} color="#8B4513" />
                <h2>Delivery Address</h2>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={deliveryAddress.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Mobile Number *</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={deliveryAddress.mobile}
                    onChange={handleInputChange}
                    placeholder="Enter 10-digit mobile number"
                    maxLength={10}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>Complete Address *</label>
                  <textarea
                    name="address"
                    value={deliveryAddress.address}
                    onChange={handleInputChange}
                    placeholder="House no., Building name, Street, Area"
                    rows={3}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Landmark (Optional)</label>
                  <input
                    type="text"
                    name="landmark"
                    value={deliveryAddress.landmark}
                    onChange={handleInputChange}
                    placeholder="E.g., Near hospital, Opposite mall"
                  />
                </div>

                <div className="form-group">
                  <label>Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={deliveryAddress.pincode}
                    onChange={handleInputChange}
                    placeholder="Enter 6-digit pincode"
                    maxLength={6}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>Special Instructions (Optional)</label>
                  <textarea
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Any special instructions for delivery or food preparation"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="checkout-section">
              <div className="section-header">
                <CreditCard size={24} color="#8B4513" />
                <h2>Payment Method</h2>
              </div>

              <div className="payment-methods">
                <label className={`payment-option ${paymentMethod === 'Cash on Delivery' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value);
                      setShowQRCode(false);
                    }}
                  />
                  <div className="payment-content">
                    <Wallet size={28} />
                    <div>
                      <strong>Cash on Delivery</strong>
                      <p>Pay when you receive your order</p>
                    </div>
                  </div>
                </label>

                <label className={`payment-option ${paymentMethod === 'Online Payment' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Online Payment"
                    checked={paymentMethod === 'Online Payment'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="payment-content">
                    <CreditCard size={28} />
                    <div>
                      <strong>Online Payment</strong>
                      <p>Pay via UPI using QR code</p>
                    </div>
                  </div>
                </label>
              </div>

              {/* QR Code Display */}
              {showQRCode && paymentMethod === 'Online Payment' && (
                <div className="qr-code-section">
                  <div className="qr-code-container">
                    <h3>Scan QR Code to Pay</h3>
                    <div className="qr-code-placeholder">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=cafe@upi&pn=PremiumCafe&am=${totalAmount}&cu=INR`}
                        alt="Payment QR Code"
                        className="qr-code"
                      />
                    </div>
                    <p className="qr-amount">Amount: ₹{totalAmount}</p>
                    <div className="payment-confirmation">
                      <CheckCircle size={20} color="#10b981" />
                      <span>After payment, click "I Have Paid" below</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h2>Order Summary</h2>
            
            <div className="summary-items">
              {cartItems.map(item => (
                <div key={item._id} className="summary-item">
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <span className="item-qty">x{item.quantity}</span>
                  </div>
                  <span className="item-price">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Delivery Charge</span>
              <span>₹{deliveryCharge.toFixed(2)}</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row summary-total">
              <span>Total Amount</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>

            <button 
              onClick={handlePlaceOrder}
              disabled={loading}
              className="place-order-btn"
            >
              {loading ? 'Processing...' : 
               showQRCode && paymentMethod === 'Online Payment' ? 'I Have Paid' : 
               'Place Order'}
            </button>

            <p className="delivery-info">
              🕒 Estimated delivery: 15 minutes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
