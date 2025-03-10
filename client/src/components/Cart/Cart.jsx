import React, { useState, useEffect, useMemo } from 'react'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './Cart.css'
import { useAuth } from '../../Store/Auth';
import { toast } from 'react-toastify';
import { Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../../../config.js';
import Form from 'react-bootstrap/Form';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [selectItems, setSelectItems] = useState(new Set());
  const { user, authorization, darkMode, isLoggedInuser } = useAuth();

  if (!isLoggedInuser) {
    return <Navigate to="/signin" />
  }

  const getCartItems = async() => {
    try {
      const response = await fetch(`${BASE_URL}/api/techify/products/cart/get-products/${user._id}`, {
        method: "GET",
        headers: {
          Authorization: authorization
        }
      })

      const data = await response.json();
      // console.log(data);

      if(response.ok){
        const items = data.cart.reverse();
        setCartItems(items);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getCartItems();
  })

  useEffect(() => {
    if (cartItems.length > 0 && selectItems.size === 0) {
      setSelectItems(new Set(cartItems.map(item => item._id)));
    }
  }, [cartItems, selectItems]);


  const handleSelectItem = (event, productId) => {
    event.stopPropagation();
    event.preventDefault();
    setSelectItems((prevItems) => {
      const updatedItems = new Set(prevItems);
      if (updatedItems.has(productId)) {
        updatedItems.delete(productId);
      } else {
        updatedItems.add(productId);
      }
      return updatedItems;
    });
  };


  const handleRemove = async (event, itemId) => {
    event.stopPropagation();
    event.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/api/techify/products/cart/remove/${itemId}`, {
        method: "PATCH",
        headers: {
          Authorization: authorization
        }
      })

      const data = await response.json();
      // console.log(data);

      if (response.ok) {
        toast.success("Item Removed")
        setCartItems(prevItems => prevItems.filter(item => item._id !== itemId));
      } else {
        toast.error(data.extraDetails ? data.extraDetails : data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }


  const selectedItems = useMemo(() => {
    return cartItems.filter((item) => selectItems.has(item._id))
  }, [selectItems, cartItems]);

  const totalAmount = useMemo(() => {
    return selectedItems.reduce((acc, item) => acc + item.price, 0)
  }, [selectItems]);


  return (
    <>
      <section id="cart-page">
        <h1 className='text-primary text-decoration-underline'>My Cart</h1>
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item._id} className="cart-card text-decoration-none" style={{ backgroundColor: darkMode ? '#343434' : '#fff' }}>
              <Link to={`/product/${item._id}`}><img src={item.images[0]} alt="Product Image" width={200} /></Link>
              <Card style={{ backgroundColor: darkMode ? '#a3a3a3' : '' }}>
                <Card.Header className='d-flex justify-content-between align-items-center' style={{ backgroundColor: darkMode ? '#999999' : '' }}>
                  <h4>{item.title}</h4>
                  <Form.Check aria-label={item._id} checked={selectItems.has(item._id)} onChange={(e) => handleSelectItem(e, item._id)} />
                </Card.Header>
                <Link to={`/product/${item._id}`} className='text-decoration-none text-black'>
                <Card.Body>
                  <Card.Title>₹{item.price}</Card.Title>
                  <Card.Text>{item.description}</Card.Text>
                  {/* <div className="cart-btns"> */}
                  <Button variant="outline-danger" onClick={(e) => handleRemove(e, item._id)} className='remove-btn me-4'>
                    <span><i className="fa-solid fa-trash"></i></span>Remove</Button>

                  {/* </div> */}
                </Card.Body>
                </Link>
              </Card>
            </div>
          ))
        ) : (
          <p className='text-primary fs-4 align-self-center'>Your cart is empty.</p>
        )}

        {
          cartItems.length > 0 ? (
            <Card className='p-0'>
              <Card.Body className='d-flex justify-content-between align-items-center p-1 px-3'>
                <h3>Total: <span className='text-success'>₹{totalAmount}</span></h3>
                <Link to={selectItems.size > 0 ? `/order/buy-now` : '#'} state={{ productIds: Array.from(selectItems) }} className='btn btn-warning fs-3 fw-semibold'
                  style={{ pointerEvents: selectItems.size === 0 ? 'none' : 'auto' }}>Place Order</Link>
              </Card.Body>
            </Card>
          ) : ""
        }

      </section>
    </>
  )
}

export default Cart
