import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Header from './Header';

function Layout() {
    const location = useLocation();
    const hideHeaderOnPaths = ['/', '/signup'];

    return (
        <>
            {!hideHeaderOnPaths.includes(location.pathname) && <Header />}
            <div>
                <Outlet /> {/* This is where nested routes will be rendered */}
            </div>
        </>
    );
}

export default Layout;