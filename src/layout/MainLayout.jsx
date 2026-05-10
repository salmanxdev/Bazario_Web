import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const MainLayout = () => {

    return (

        <div className="home-page">

            {/* NAVBAR */}

            <Navbar />

            {/* SIDEBAR */}

            <Sidebar />

            {/* PAGE CONTENT */}

            <div className="home-content">

                <Outlet />

            </div>

        </div>
    );
};

export default MainLayout;