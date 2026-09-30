import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import StudentLogin from './pages/StudentLogin';
import AdminLogin from './pages/AdminLogin';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import StudentServices from './pages/StudentServices';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-college-light text-college-dark font-sans">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login/student" element={<StudentLogin />} />
          <Route path="/login/admin" element={<AdminLogin />} />

          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/services" element={<StudentServices />} />

          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
