import React from 'react'
import {Table, Button, Dropdown, DropdownButton} from 'react-bootstrap';
import { useAuth } from '../../Store/Auth';

function OrderTable({orders, setOrders, handleAllOrder}) {
    const {user, authorization} = useAuth();

    const handleOrderStatus = async (orderId, productId, newStatus) => {
        if (confirm(`Are You Sure You Want Change Order Status To ${newStatus}`)) {
            try {
                const response = await fetch(`${BASE_URL}/api/techify/admin/order/status/${productId}/${orderId}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: authorization
                    },
                    body: JSON.stringify({ newStatus })
                })

                const data = await response.json();
                console.log(data);

                if (response.ok) {
                    toast.success(`Order Status Update To ${newStatus}`)
                    setOrders((prevOrders) =>
                        prevOrders.map((prevOrder) =>
                            prevOrder._id === orderId ? { ...prevOrder, orderStatus: newStatus } : prevOrder
                        )
                    )
                    handleAllOrder();
                } else {
                    toast.error(data.message || "Failed to update order status");
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    const validAction = {
        Pending: ['Confirmed', 'Canceled'],
        Confirmed: ['Completed', 'Canceled'],
        Completed: [],
        Cancel: [],
    }

    const showDropDownOptions = (currentStatus) => {
        return validAction[currentStatus]?.map((action) => (
            <Dropdown.Item key={action} eventKey={action}>
                {action}
            </Dropdown.Item>
        ));
    };

    const handleOrderDelete = async (orderId) => {
        if (confirm("Are Sure You Want To Delete The Order")) {
            // console.log(orderId);
            try {
                const response = await fetch(`${BASE_URL}/api/techify/admin/order/${orderId}/delete`, {
                    method: "DELETE",
                    headers: {
                        Authorization: authorization,
                    }
                })

                const data = await response.json();
                // console.log(data);

                if (response.ok) {
                    toast.error("Order Deleted");
                    handleAllOrder();
                }
            } catch (error) {
                console.log(error.message);
            }
        }
    }
    return (
        <div className="order-table">
            <Table responsive="sm" bordered striped hover>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Name</th>
                        <th>Contact</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Amount</th>
                        {user.role === 'Admin' ? <th>Address</th> : ""}
                        <th>Order Status</th>
                        <th>Payment Status</th>
                        <th>Date</th>
                        {user.role === 'Admin' && <th>Delete</th>}
                    </tr>
                </thead>
                <tbody>
                    {
                        orders && orders.length > 0 ? (
                            orders.flatMap(order =>
                                order.orderedItem.map((item, index) => ({
                                    ...item,
                                    order,
                                    key: `${order._id}-${index}`,  // Unique key for each row
                                }))
                            ).map(({ order, product, amount, quantity, status, payStatus, key }) => (
                                <tr key={key}>
                                    <td>{`${order._id.slice(0, 2)}...${order._id.slice(-4)}`}</td>
                                    <td>{order.name}</td>
                                    <td>{user.role === 'Admin' ? order.contact : 'xxxxxxxxxx'}</td>
                                    <td>{product.title}</td>
                                    <td>{quantity}</td>
                                    <td>{amount}</td>
                                    {user.role === 'Admin' && (
                                        <td>{`${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.zipcode}`}</td>
                                    )}
                                    <td>
                                        {user?.role === 'Admin' ? (
                                            ['Completed', 'Canceled'].includes(status) ? (
                                                <span className={`btn ${status === 'Completed' ? 'btn-success' :
                                                    status === 'Confirmed' ? 'btn-primary' :
                                                        'btn-danger'}`} style={{ fontSize: "1rem" }}>
                                                    {status}
                                                </span>
                                            ) : (
                                                <DropdownButton
                                                    id={`dropdown-item-${order._id}`}
                                                    title={status}
                                                    onSelect={(newStatus) => handleOrderStatus(order._id, product._id, newStatus)}
                                                    disabled={['Completed', 'Canceled'].includes(status)}
                                                >
                                                    {showDropDownOptions(status)}
                                                </DropdownButton>
                                            )
                                        ) : (
                                            <span className={
                                                status === 'Completed' ? 'text-success' :
                                                    status === 'Confirmed' ? 'text-primary' :
                                                        'text-danger'
                                            } style={{ fontWeight: "600", fontSize: "1.25rem" }}>
                                                {status}
                                            </span>
                                        )}
                                    </td>
                                    <td className={payStatus === 'Paid' ? 'text-success' : 'text-danger'} style={{ fontWeight: "600" }}>
                                        {payStatus}
                                    </td>
                                    <td style={{ width: "120px" }}>{order.createdAt.split('T')[0]}</td>
                                    {user.role === 'Admin' && (
                                        <td style={{ width: "120px" }}>
                                            <Button variant='danger' onClick={() => handleOrderDelete(order._id)}>
                                                <i className="fa-solid fa-trash"></i>
                                            </Button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : <tr>
                            <td colSpan={11} className="text-center fs-3">
                                Orders Not Found
                            </td>
                        </tr>
                    }

                </tbody>
            </Table>
        </div>
    )
}

export default OrderTable
