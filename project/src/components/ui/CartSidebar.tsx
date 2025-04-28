import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import Button from './Button';
import { Link } from 'react-router-dom';

const CartSidebar: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, isCartOpen, toggleCart, cartTotal } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={toggleCart}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-lg z-50 overflow-auto"
          >
            <div className="p-6 h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-light">Shopping Cart</h2>
                <button
                  onClick={toggleCart}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close cart"
                >
                  <X size={20} />
                </button>
              </div>

              {cartItems.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <ShoppingBag size={48} className="text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-2">Your cart is empty</p>
                  <p className="text-sm text-gray-400 mb-6">Add some products to your cart</p>
                  <Button onClick={toggleCart} variant="outline">
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-auto mb-6">
                    {cartItems.map((item) => (
                      <div key={item.product.id} className="flex py-4 border-b border-gray-100">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover mr-4"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-light text-sm">{item.product.name}</h3>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-gray-400 hover:text-gray-600"
                              aria-label="Remove item"
                            >
                              <X size={16} />
                            </button>
                          </div>
                          <p className="text-gray-500 text-sm my-1">${item.product.price}</p>
                          <div className="flex items-center mt-2">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 border border-gray-200 rounded-full"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="mx-2 text-sm min-w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 border border-gray-200 rounded-full"
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between mb-4">
                      <span className="font-light">Subtotal</span>
                      <span className="font-light">${cartTotal}</span>
                    </div>
                    <Link to="/checkout">
                      <Button onClick={toggleCart} fullWidth>
                        Checkout
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;