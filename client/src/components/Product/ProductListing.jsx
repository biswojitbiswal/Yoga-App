import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Store/Auth';

function ProductListing({ products, handleDelete }) {

    const { user } = useAuth();
    const navigate = useNavigate();
    return (
        <div className="card-container mt-4 d-flex flex-wrap gap-5 justify-content-center">
            {
                products?.map((product) => {
                    return <div key={product._id} className="outer-card">
                        <div className="inner-card">
                            <h5 className='text-primary product-title'>{product.title}</h5>
                            <div className="product-image">
                                <img src={product?.images[0]} alt={product.title} loading='lazy' />
                            </div>
                            <p className='product-description'>{product.description}</p>
                            <h4 className='text-primary'>&#8377;{product.price}</h4>
                            <p className='m-1'>
                                {Array.from({ length: 5 }, (_, index) => (
                                    <span key={index}>
                                        <i className={`fa-solid fa-star ${index < product.averageRating ? 'text-warning' : 'text-secondary'}`}></i>
                                    </span>
                                ))}
                            </p>
                            {
                                user.role === 'Admin' && (
                                    <div className='edit-delete-buttons w-100 justify-content-between mb-4'>
                                        <Link to={`/admin/edit/${product._id}`} className='product-edit'><i className="fa-solid fa-pencil"></i>
                                        </Link>

                                        <button variant="danger" className='product-dlt-btn text-danger' onClick={(event) => {
                                            event.stopPropagation();
                                            handleDelete(product._id)
                                        }}><i className="fa-solid fa-trash ms-2"></i></button>
                                    </div>
                                )
                            }
                            {
                                user?.role === 'Moderator' && (
                                    <Link to={`/admin/edit/${product._id}`} className='product-edit edit-delete-buttons'><i className="fa-solid fa-pencil"></i>
                                    </Link>
                                )
                            }
                            <button onClick={() => navigate(`/product/${product?._id}`)} className='cart-btn bg-warning'>Add To Cart</button>
                        </div>
                    </div>
                })
            }
        </div>
    )
}

export default ProductListing
