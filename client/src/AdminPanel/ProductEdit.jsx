import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../Store/Auth';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../config.js';

function ProductEdit() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    images: [],
  });

  const { productId } = useParams();
  const { authorization, darkMode, user } = useAuth();
  const navigate = useNavigate();
  

  const getProductById = async() => {
    try {
      const response = await fetch(`${BASE_URL}/api/techify/admin/product/${productId}`, {
        method: "GET",
        headers: {
          Authorization: authorization
        }
      })
      
      const data = await response.json();
      // console.log(data);

      if(response.ok){
        setFormData({
          title: data.title || '',
          description: data.description || '',
          price: data.price || '',
          images: data.images || [],
        });
      }
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  }

  

  useEffect(() => {
    getProductById();
  }, [])


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.slice(0, 4);
    setFormData((prevState) => ({
      ...prevState,
      images: newImages,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append('title', formData.title);
    form.append('description', formData.description);
    form.append('price', formData.price);

    const existingImages = formData.images.filter((img) => typeof img === 'string');
    form.append('existingImages', JSON.stringify(existingImages));

    const newImages = formData.images.filter((img) => typeof img !== 'string');
    newImages.forEach((img) => form.append('images', img));

    try {
      const response = await fetch(`${BASE_URL}/api/techify/admin/edit/${productId}`, {
        method: 'PATCH',
        headers: {
          Authorization: authorization,
        },
        body: form,
      });

      const data = await response.json();

      if (response.ok) {
        setFormData(data.editData);
        toast.success('Product Updated');
        navigate(`/product/${productId}`);
      } else {
        toast.error(data.extraDetails ? data.extraDetails : data.message);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('An error occurred while updating the product.');
    }
  };

  return (
    <div className="admin-edit-form" style={{backgroundColor: darkMode ? '#343434' : ''}}>
      <h1 className="text-primary mb-4">Edit Product Details</h1>
      <Form onSubmit={handleFormSubmit}>
        <Form.Group className="mb-3" controlId="title">
          <Form.Label className={`${darkMode ? 'text-white' : 'text-black'}`}>Title:</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter Title"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="description">
          <Form.Label className={`${darkMode ? 'text-white' : 'text-black'}`}>Description:</Form.Label>
          <Form.Control
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter Description"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="price">
          <Form.Label className={`${darkMode ? 'text-white' : 'text-black'}`}>Price:</Form.Label>
          <Form.Control
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Enter Price"
            readOnly={user.role !== 'Admin'}
            required
          />
          {
            user.role !== 'Admin' ? <p className='text-danger'>You Can't Edit!</p> : ""
          }
        </Form.Group>

        <Form.Group controlId="formFileMultiple" className="mb-3">
          <Form.Label className={`${darkMode ? 'text-white' : 'text-black'}`}>Image:</Form.Label>
          <Form.Control
            type="file"
            onChange={handleImageChange}
            multiple
          />
        </Form.Group>

        {/* Image preview */}
        {formData.images.length > 0 && (
          <div className="image-preview m-1">
            {formData.images.slice(0, 4).map((img, index) => (
              <img
                key={index}
                src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                alt="Preview"
                style={{ width: '100px', height: '100px', marginRight: '10px' }}
                onLoad={() => {
                  if (typeof img !== 'string') {
                    // Release object URL after image is loaded
                    URL.revokeObjectURL(img);
                  }
                }}
              />
            ))}
          </div>
        )}

        <Button variant="primary" type="submit" className="fs-5 m-1">
          Update
        </Button>
      </Form>
    </div>
  );
}

export default ProductEdit;
