import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Tutors from './pages/Tutors';
import TutorProfile from './pages/TutorProfile';
import BecomeTutor from './pages/BecomeTutor';
import PostRequirement from './pages/PostRequirement';
import Requirements from './pages/Requirements';
import RequirementDetails from './pages/RequirementDetails';
import AdminDashboard from './pages/AdminDashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import TutorDashboard from './pages/TutorDashboard';

import Footer from './components/Footer';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main style={{ minHeight: 'calc(100vh - 300px)' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/requirements" element={<Requirements />} />
            <Route path="/requirements/:id" element={<RequirementDetails />} />
            <Route path="/tutors" element={<Tutors />} />
            <Route path="/tutors/:id" element={<TutorProfile />} />
            <Route path="/become-tutor" element={<BecomeTutor />} />
            <Route path="/tutor-dashboard" element={<TutorDashboard />} />
            <Route path="/post-requirement" element={<PostRequirement />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}
