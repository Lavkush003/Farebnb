// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )



import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext"; // 👈 ADD THIS

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>   {/* 👈 WRAP APP */}
      <App />
    </AuthProvider>
  </StrictMode>
);
