import { AuthProvider } from "./context/AuthContextProvider";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "./components/Header";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Products from "./pages/Products";
import Users from "./pages/Users";
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";

function App() {
  const location = useLocation();
  const hiddenRoutes = ["/login"];
  const hideLayout = hiddenRoutes.includes(location.pathname);

  return (
    <AuthProvider>
      <ToastContainer />
      {!hideLayout && <Header />}
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <Users />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/categories"
          element={
            <PrivateRoute>
              <Categories />
            </PrivateRoute>
          }
        />
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <Products />
            </PrivateRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
