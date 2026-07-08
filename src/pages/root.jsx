import { Outlet, Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthProvider";
import { logout } from "@/services/user-methods";
import Header from "@/component/header";
import Footer from "@/component/footer";
import { Toaster } from 'react-hot-toast';

export default function Root() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Toaster position="top-right" reverseOrder={false} />
            <Header />
            <main className="flex-grow pb-16 md:pb-0">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
