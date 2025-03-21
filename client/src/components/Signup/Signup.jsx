import React from 'react'
import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './Signup.css'
import { toast } from 'react-toastify';
import { useAuth } from '../../Store/Auth';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../../../config.js';
import Google from '../Google/Google.jsx'


function Signup() {
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });


  const { setTokenInCookies, refreshUser, isLoggedInuser, darkMode } = useAuth();
  const navigate = useNavigate()

  if (isLoggedInuser) {
    return <Navigate to="/" />
  }

  const handleInputData = (e) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value
    })
  }

  const handleSignupForm = async (e) => {
    e.preventDefault();
    // console.log(signupData)
    try {
      const response = await fetch(`${BASE_URL}/api/techify/user/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(signupData)
      })

      const data = await response.json();
      // console.log(data);

      if (response.ok) {
        toast.success("Signup Successful");
        setTokenInCookies(data.token);
        refreshUser();
        setSignupData({ email: "", phone: "", password: "" });
        navigate("/");
      } else {
        toast.error(data.extraDetails ? data.extraDetails : data.message)
      }
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <>

      <div className="signup-page" style={{ backgroundColor: darkMode ? '#343434' : '' }}>
        <h1 className='text-primary mb-4'>Sign-Up Form</h1>
        <Form onSubmit={handleSignupForm}>
        <Form.Group className="mb-3" controlId="name">
            <Form.Label className={`${darkMode ? 'text-white' : 'text-black'}`}>Name: </Form.Label>
            <Form.Control type="text" name='name' placeholder="Enter Your Name" required value={signupData.name} onChange={handleInputData} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label className={`${darkMode ? 'text-white' : 'text-black'}`}>Email address</Form.Label>
            <Form.Control type="email" name='email' placeholder="Enter email" required value={signupData.email} onChange={handleInputData} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="phone">
            <Form.Label className={`${darkMode ? 'text-white' : 'text-black'}`}>Mobile No.:</Form.Label>
            <Form.Control type="number" name='phone' placeholder="Enter Mobile No." required value={signupData.phone} onChange={handleInputData} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label className={`${darkMode ? 'text-white' : 'text-black'}`}>Password</Form.Label>
            <Form.Control type="password" name='password' placeholder="Password" required value={signupData.password} onChange={handleInputData} />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
        <hr className={`${darkMode ? 'text-white' : 'text-black'}`} />
        <div className="d-flex flex-column justify-content-center align-items-center">
        <Google />
        
        <Link style={{ textDecoration: "none", margin: "1rem" }} className='fs-5' to="/signin">I have An Account! Sign in</Link>
        </div>
      </div>
      
    </>
  )
}

export default Signup
