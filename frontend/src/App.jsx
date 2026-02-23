import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ListingsPage from "./pages/ListingsPage";
import ShowListingPage from "./pages/ShowListingPage";
import NewListingPage from "./pages/NewListingPage";
import EditListingPage from "./pages/EditListingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MyBookingsPage from "./pages/MyBookingsPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <main className="wh-page-content">
          <Routes>
            <Route path="/" element={<ListingsPage />} />
            <Route path="/listings/:id" element={<ShowListingPage />} />
            <Route path="/listings/new" element={<NewListingPage />} />
            <Route path="/listings/:id/edit" element={<EditListingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/my-trips" element={<MyBookingsPage />} />
          </Routes>
        </main>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
