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
import AdminTutorReview from './pages/admin/AdminTutorReview';
import AdminLogin from './pages/AdminLogin';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import TutorDashboard from './pages/TutorDashboard';
import WalletDashboard from './pages/WalletDashboard';
import EditProfile from './pages/EditProfile';
import HelpCenter from './pages/HelpCenter';
import HowItWorks from './pages/HowItWorks';
import ContactUs from './pages/ContactUs';
import SafetyGuidelines from './pages/SafetyGuidelines';
import Terms from './pages/Terms';

import Footer from './components/Footer';

import { useLocation } from 'react-router-dom';

function Layout({ children }) {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin') || location.pathname.startsWith('/admin-login');

  if (isAdminPath) {
    return <main>{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 300px)' }}>
        {children}
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
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
            <Route path="/tutor-dashboard/profile/edit" element={<EditProfile />} />
            <Route path="/wallet" element={<WalletDashboard />} />
            <Route path="/post-requirement" element={<PostRequirement />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/tutors/:id/review" element={<AdminTutorReview />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/safety" element={<SafetyGuidelines />} />
            <Route path="/terms" element={<Terms />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}
