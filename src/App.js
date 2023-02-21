// Toast
import store from "app/store";
import AppToast from "general/components/AppToast";
import { Suspense, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
// router
import AppDialog from "general/components/AppDialog";
import AppNotFound from "general/components/AppNotFound";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignInScreen from "features/Auth/SignInScreen";
import SignUpScreen from "features/Auth/SignUpScreen";
import LandingPage from "features/LandingPage";
import GuestRoute from "general/components/AppRoutes/GuestRoute";
import PrivateRoute from "general/components/AppRoutes/PrivateRoute";
import UserListScreen from "features/UserListScreen";
import RequestToResetPass from "features/Auth/RequestToResetPass";
import AccountListener from "features/Account/AccountListener";
import Question from "features/Question";
import Tag from "features/TagScreen";
import Account from "features/Account";
import { injectStore } from "general/helpers/WebSocketClientHelper";
// import Admin from "Admin";

// Load BS

require("bootstrap/dist/js/bootstrap.min");
// Load KT plugins
// require("assets/plugins/ktutil");
// require("assets/plugins/ktmenu");
// require("assets/plugins/ktoffcanvas");
// require("assets/plugins/ktcookie");
// require("assets/plugins/kttoggle");
// // aside
// require("assets/plugins/aside/aside");
// require("assets/plugins/aside/aside-menu");
// require("assets/plugins/aside/aside-toggle");
// // header
// require("assets/plugins/header/ktheader-mobile");
// require("assets/plugins/header/ktheader-topbar");

// Lazy load - Code splitting

const sTag = "[App]";

function App() {
    // MARK: --- Hooks ---
    useEffect(() => {
        console.log(`${sTag} did load`);
        injectStore(store);

        return () => {
            console.log(`${sTag} will dismiss`);
        };
    }, []);

    return (
        <>
            {/* Router */}
            {/* <BrowserRouter> */}
            <BrowserRouter>
                {/* Suspense */}
                <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                        {/* Landing Page */}
                        <Route path='' element={<LandingPage />} />

                        <Route path='users/*' element={<UserListScreen />} />

                        {/* Account */}
                        <Route
                            path='account/:accountId/*'
                            element={
                                <PrivateRoute>
                                    <Account />
                                </PrivateRoute>
                            }
                        />
                        {/* Sign in */}
                        <Route
                            path='/sign-in'
                            element={
                                <GuestRoute>
                                    <SignInScreen />
                                </GuestRoute>
                            }
                        />
                        {/* Sign up */}
                        <Route
                            path='/sign-up'
                            element={
                                <GuestRoute>
                                    <SignUpScreen />
                                </GuestRoute>
                            }
                        />
                        {/* Request to reset pass */}
                        <Route
                            path='/request-to-reset-pass'
                            element={
                                <GuestRoute>
                                    <RequestToResetPass />
                                </GuestRoute>
                            }
                        />

                        {/* Question */}
                        <Route path='question/*' element={<Question />} />

                        {/* tag */}
                        <Route path='tag/*' element={<Tag />} />
                        {/* Not Found */}
                        <Route path='*' element={<AppNotFound />} />
                    </Routes>
                </Suspense>
            </BrowserRouter>
            {/* </BrowserRouter> */}

            {/* App Dialog */}
            <AppDialog />
            {/* Toast */}
            <AppToast />
            {/* Listener */}
            {/* Account Listener */}
            <AccountListener />
        </>
    );
}

export default App;
