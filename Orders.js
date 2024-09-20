import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getOrders } from '../../actions/order';

const Orders = ({ getOrders, order: { orders, loading } }) => {
    useEffect(() => {
        getOrders();
    }, [getOrders]);

    return loading ? (
        <h1>Loading...</h1>
    ) : (
        <section className="container">
            <h1 className="large text-primary">My Orders</h1>
            <div className="orders">
                {orders.map(order => (
                    <div key={order._id} className="order">
                        <h3>Order ID: {order._id}</h3>
                        <p>Status: {order.status}</p>
                        <p>Total Price: ${order.totalPrice}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

const mapStateToProps = state => ({
    order: state.order,
});

export default connect(mapStateToProps, { getOrders })(Orders);
