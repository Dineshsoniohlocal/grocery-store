import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import { Toaster } from "react-hot-toast";

import Navbar from "components/Navbar/Navbar";
import MerchantRegister from "pages/Merchant/Register/Register";
import MerchantLoginPage from "pages/Merchant/LoginPage/LoginPage";
import CustomerRegister from "pages/Customer/Register/Register";
import CustomerLogin from "pages/Customer/LoginPage/LoginPage";
import PageNotFound from "pages/common/PageNotFound/PageNotFound";
import HomePage from "pages/Customer/HomePage/HomePage";
import MerchantDashboard from "pages/Merchant/MerchantDashboard/MerchantDashboard";
import PrivateRoute from "components/PrivateRoute/PrivateRoute";
import AllProducts from "pages/Customer/Product/AllProducts/AllProducts";
import PreLoader from "pages/common/PreLoader/PreLoader";
import Profile from "pages/Customer/Profile/Profile";

import { checkAuth } from "api/user/authenticate";
import { userTypes } from "utils/constants";
import * as actionTypes from "store/actionTypes";

import "styles/main.scss";

function App() {
  const dispatch = useDispatch();

  const token = localStorage.getItem("token");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMerchant, setIsMerchant] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(token ? false : true);

  const handleLogout = () => {
    dispatch({
      type: actionTypes.USER_LOGOUT,
    });

    setIsMerchant(false);
    setIsAuthenticated(false);
    localStorage.clear();
  };

  const authenticateUser = () => {
    checkAuth().then((res) => {
      if (!res) {
        handleLogout();
        setIsDataLoaded(true);
        return;
      }
      setIsAuthenticated(true);
      const userType = res?.data?.userType;
      if (userType === userTypes.merchant) {
        setIsMerchant(true);
      } else {
        setIsMerchant(false);
      }

      dispatch({
        type: actionTypes.IS_USER_LOGGED,
        auth: true,
        firstName: res?.data?.firstName,
        lastName: res?.data?.lastName,
        mobile: res?.data?.mobile,
        email: res?.data?.email,
        avatar: res?.data?.profileImage,
      });
      setIsDataLoaded(true);
    });
  };

  useEffect(() => {
    if (!isDataLoaded) authenticateUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <Toaster
        toastOptions={{
          duration: 4000,
          position: "bottom-right",
          style: { marginBottom: "30px", marginLeft: "30px" },
        }}
      />
      {!isDataLoaded ? (
        <PreLoader />
      ) : (
        <Router>
          <React.Fragment>
            <Navbar
              auth={isAuthenticated}
              isMerchant={isMerchant}
              handleLogout={handleLogout}
            />

            <Routes>
              {/* --> Customer Routes */}
              <Route
                path="/register"
                element={
                  isAuthenticated ? <Navigate to="/" /> : <CustomerRegister />
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute auth={isAuthenticated}>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route path="/product" element={<AllProducts />} />
              <Route
                path="/login"
                element={
                  isAuthenticated ? <Navigate to="/" /> : <CustomerLogin />
                }
              />
              <Route path="/" element={<HomePage />} />

              {/* --> Merchant Routes  */}
              <Route
                path="/merchant/register"
                element={
                  isAuthenticated ? <Navigate to="/" /> : <MerchantRegister />
                }
              />
              <Route
                path="/merchant/login"
                element={
                  isAuthenticated ? <Navigate to="/" /> : <MerchantLoginPage />
                }
              />

              <Route
                path="/merchant/*"
                element={
                  <PrivateRoute auth={isAuthenticated}>
                    <MerchantDashboard isAuthenticated={isAuthenticated} />
                  </PrivateRoute>
                }
              />

              <Route path="/*" element={<PageNotFound />} />
            </Routes>
          </React.Fragment>
        </Router>
      )}
    </div>
  );
}

export default App;
