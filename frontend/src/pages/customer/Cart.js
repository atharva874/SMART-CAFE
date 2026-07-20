import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { useCart } from '../../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import './Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (foodId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) {
      removeFromCart(foodId);
    } else {
      updateQuantity(foodId, newQuantity);
    }
  };

  const subtotal = getCartTotal();
  const deliveryCharge = subtotal > 0 ? 40 : 0;
  const total = subtotal + deliveryCharge;

  if (cartItems.length === 0) {
    return (
      <div>
        <Navbar />
        <div className="empty-cart">
          <ShoppingBag size={80} color="#ccc" />
          <h2>Your cart is empty</h2>
          <p>Add some delicious items to get started</p>
          <button onClick={() => navigate('/menu')} className="btn-primary">
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      
      <div className="cart-container">
        <div className="cart-header">
          <button onClick={() => navigate(-1)} className="back-button">
            <ArrowLeft size={20} />
            Back
          </button>
          <h1>Shopping Cart</h1>
          <button onClick={clearCart} className="clear-cart-btn">
            Clear Cart
          </button>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item._id} className="cart-item">
                <img 
                  src={item.image || 'https://via.placeholder.com/100'} 
                  alt={item.name}
                  className="cart-item-image"
                />
                
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p className="cart-item-category">{item.category?.name}</p>
                  <div className="cart-item-badge">{item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}</div>
                </div>

                <div className="cart-item-price">
                  <span>₹{item.price}</span>
                </div>

                <div className="cart-item-quantity">
                  <button 
                    onClick={() => handleQuantityChange(item._id, item.quantity, -1)}
                    className="quantity-btn"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="quantity-value">{item.quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(item._id, item.quantity, 1)}
                    className="quantity-btn"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="cart-item-subtotal">
                  <span>₹{item.price * item.quantity}</span>
                </div>

                <button 
                  onClick={() => removeFromCart(item._id)}
                  className="remove-btn"
                  title="Remove item"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            
            <div className="summary-row">
              <span>Subtotal ({cartItems.length} items)</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Delivery Charge</span>
              <span>₹{deliveryCharge.toFixed(2)}</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row summary-total">
              <span>Total Amount</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            <button 
              onClick={() => navigate('/checkout')}
              className="checkout-btn"
            >
              Proceed to Checkout
            </button>

            <button 
              onClick={() => navigate('/menu')}
              className="continue-shopping-btn"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
