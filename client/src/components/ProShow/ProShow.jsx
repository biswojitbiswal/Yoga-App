import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import './ProShow.css'
import { useStore } from '../../Store/ProductStore';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../Store/Auth';
import { toast } from 'react-toastify';
import Spinner from 'react-bootstrap/Spinner';

function ProShow() {
  const [imageClick, setImageClick] = useState(0);


  const { productId } = useParams()
  const { products } = useStore();
  const { authorization, setUser, isLoggedInuser } = useAuth();
  const navigate = useNavigate();

  const product = products.find((prod) => prod._id === productId)

  if (!product) {
    return <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  }

  const handleAddToCart = async () => {
    if (!isLoggedInuser) {
      navigate("/signin");
      return;
    } else {
      try {
        const response = await fetch(`https://yoga-api-five.vercel.app/api/yoga/products/cart/add/${productId}`, {
          method: "POST",
          headers: {
            Authorization: authorization,
          }
        });

        const data = await response.json();
        // console.log(data);

        if (response.ok) {
          toast.success("Item Added To Your Cart");
          setUser(data)
        } else {
          toast.error(data.extradetails ? data.extradetails : data.message);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  const handleBooking = async () => {
    toast.success("This Feature Will Be Available In Future.")
  }

 const handleHoverImage = (id) => {
  setImageClick(id);
 }

  return (
    <>
      <section id="prod-details">
        <div className="prod-card">
          <div className="prod-look">
            <div className="prod-img">
              <img src={product.images[imageClick]} alt="Main Image" id="mainimg" />
            </div>
            <div className="product-images">
              {
                product.images.map((image, index) => {
                  return <div className={`small-img-box ${imageClick === index ? 'imageSelected' : ''}`} key={index}>
                    <img
                      src={image}
                      alt={`Product Image ${index + 1}`}
                      className={`small-img`}
                      onClick={() => handleHoverImage(index)}
                    />
                  </div>
                })
              }
            </div>

          </div>

          <div className="details">
            <p className="fs-4">Smart Yoga</p>
            <h4 className="fs-3 text-primary">{product.title}</h4>
            <h2 className="fs-2">₹{product.price}</h2>
            <p className="ratings text-primary">4.5<span><i className="fa-solid fa-star"></i></span></p>
            <div>
              <p className='fs-4'>Product Details:</p>
              <p className='fs-5'>{product.description}</p>
            </div>
            
            <div className="order">
              <Button variant="primary" onClick={handleAddToCart} className="fs-4 add-cart-btn"><span className='me-2'><i className="fa-solid fa-cart-shopping"></i></span>Add To Cart</Button>
              <Button variant="warning" onClick={handleBooking} className="fs-4"><span className='me-2'><i className="fa-solid fa-fire-flame-curved"></i></span>Buy Now</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default ProShow
