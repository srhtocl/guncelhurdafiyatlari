import './index.css'
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import browserRouter from "./routes";
import { AuthProvider } from "./context/AuthProvider";

// Global Error Handler for Dynamic Import Failures (Versioning inconsistencies)
window.addEventListener('error', (e) => {
    // Check for common messages related to missing chunks/scripts
    const messages = [
        'Failed to fetch dynamically imported module',
        'Importing a module script failed',
        'error loading dynamically imported module'
    ];

    if (e.message && messages.some(msg => e.message.toLowerCase().includes(msg.toLowerCase()))) {
        e.preventDefault();
        console.warn('Deploy version mismatch detected. Reloading...');

        // Prevent infinite reload loops (limit to once every 10 seconds)
        const storageKey = 'deploy_version_reload';
        const lastReload = sessionStorage.getItem(storageKey);
        const now = Date.now();

        if (!lastReload || now - parseInt(lastReload) > 10000) {
            sessionStorage.setItem(storageKey, now.toString());
            window.location.reload(true);
        }
    }
});

ReactDOM.createRoot(document.getElementById("root")).render(

    <AuthProvider>
        <RouterProvider router={browserRouter}></RouterProvider>
    </AuthProvider>

);
