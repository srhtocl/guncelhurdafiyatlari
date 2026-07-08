import React, { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import Root from "@/pages/root";
import ErrorPage from "@/pages/error/index";
import PrivateRoute from "./PrivateRoute";

// Lazy Loading Imports with Aliases
const Login = React.lazy(() => import("@/pages/auth/login"));
const Home = React.lazy(() => import("@/pages/home"));
const About = React.lazy(() => import("@/pages/static/about"));
const Contact = React.lazy(() => import("@/pages/static/contact"));
const Services = React.lazy(() => import("@/pages/static/services"));
const Blog = React.lazy(() => import("@/pages/blog"));
const BlogDetail = React.lazy(() => import("@/pages/blog/detail"));

// Prices - Generic Detail Page
const PriceDetail = React.lazy(() => import("@/pages/prices/detail"));

// Admin
const Admin = React.lazy(() => import("@/pages/admin"));
const BlogList = React.lazy(() => import("@/pages/admin/blog"));
const BlogForm = React.lazy(() => import("@/pages/admin/blog/form"));
const AdminPriceList = React.lazy(() => import("@/pages/admin/prices"));
const AdminPriceForm = React.lazy(() => import("@/pages/admin/prices/form"));
const AdminMessages = React.lazy(() => import("@/pages/admin/messages"));



// Loading Component
const Loading = () => <div className="flex justify-center items-center h-screen">Yükleniyor...</div>;

// Helper to wrap components in Suspense
const withSuspense = (Component) => (
    <Suspense fallback={<Loading />}>
        <Component />
    </Suspense>
);



const browserRouter = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/login",
                element: withSuspense(Login),
            },

            {
                path: "/about",
                element: withSuspense(About),
            },
            {
                path: "/iletisim",
                element: withSuspense(Contact),
            },
            {
                path: "/hizmetlerimiz",
                element: withSuspense(Services),
            },
            {
                path: "/blog",
                element: withSuspense(Blog),
            },
            {
                path: "/blog/:slug",
                element: withSuspense(BlogDetail),
            },

            // Admin Routes
            {
                path: "/admin",
                element: <PrivateRoute>{withSuspense(Admin)}</PrivateRoute>,
            },
            {
                path: "/admin/blog",
                element: <PrivateRoute>{withSuspense(BlogList)}</PrivateRoute>,
            },
            {
                path: "/admin/blog/new",
                element: <PrivateRoute>{withSuspense(BlogForm)}</PrivateRoute>,
            },
            {
                path: "/admin/blog/edit/:id",
                element: <PrivateRoute>{withSuspense(BlogForm)}</PrivateRoute>,
            },
            {
                path: "/admin/prices",
                element: <PrivateRoute>{withSuspense(AdminPriceList)}</PrivateRoute>,
            },
            {
                path: "/admin/prices/new",
                element: <PrivateRoute>{withSuspense(AdminPriceForm)}</PrivateRoute>,
            },
            {
                path: "/admin/prices/edit/:id",
                element: <PrivateRoute>{withSuspense(AdminPriceForm)}</PrivateRoute>,
            },
            {
                path: "/admin/messages",
                element: <PrivateRoute>{withSuspense(AdminMessages)}</PrivateRoute>,
            },
            {
                index: true,
                element: withSuspense(Home),
            },

            // Dynamic Price Route - Must be last to avoid catching other paths
            {
                path: "/:slug",
                element: withSuspense(PriceDetail),
            },
        ],
    },
]);

export default browserRouter;
