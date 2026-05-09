import React from 'react'

const AdminDashboard = () => {
  return (
    
        <div className="admin-dashboard">

            <h1>Admin Dashboard</h1>

            <div className="admin-cards">

                <div className="admin-card">
                    <h2>Total Users</h2>
                    <p>120</p>
                </div>

                <div className="admin-card">
                    <h2>Total Products</h2>
                    <p>45</p>
                </div>

                <div className="admin-card">
                    <h2>Total Orders</h2>
                    <p>89</p>
                </div>

            </div>

        </div>
  ) 
}

export default AdminDashboard
