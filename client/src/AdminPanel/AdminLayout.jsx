import React from 'react'
import Nav from 'react-bootstrap/Nav';
import { Link, useLocation } from 'react-router-dom'
import { Outlet } from 'react-router-dom';
import { useAuth } from '../Store/Auth';
import Spinner from 'react-bootstrap/Spinner';
import { Navigate } from 'react-router-dom';

function AdminLayout() {
    const location = useLocation();
    const activeKey = location.pathname;
    const {user, isLoading} = useAuth()

    if(isLoading){
        return <Spinner animation="border" />;
    }
    if (!user?.isAdmin) {
        return <Navigate to="/" />;
    }
    return (
        <>
            <Nav justify variant="tabs" activeKey={activeKey}>
                <Nav.Item>
                    <Nav.Link as={Link} to="/admin/add" eventKey="/admin/add">Add</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={Link} to="/admin/edit/:productId" eventKey="/admin/edit">Edit</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={Link} to="/admin/publish" eventKey="/admin/publish">Publish</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={Link} to="/admin/links" eventKey="/admin/links">Links</Nav.Link>
                </Nav.Item>
            </Nav>

            {/* The child components will be rendered here */}
            <Outlet />
        </>
    )
}

export default AdminLayout
