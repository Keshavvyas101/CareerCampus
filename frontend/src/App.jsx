import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import MainLayout from "./components/MainLayout";
import {Toaster} from "react-hot-toast";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ResumeReview from "./pages/ResumeReview";
import JDGuidance from "./pages/JDGuidance";
import Profile from "./pages/Profile";
import InterviewSimulator from "./pages/InterviewSimulator";
import InterviewHistory from "./pages/InterviewHistory";

const App = () => {
  return (
    <>
      <Router>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              fontSize: "1.25rem", // equivalent to text-xl (20px)
            },
          }}
        />

        <Routes>
          {/* No layout for Home */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/resume-review"
            element={
              <PrivateRoute>
                <MainLayout>
                  <ResumeReview />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/jd-guidance"
            element={
              <PrivateRoute>
                <MainLayout>
                  <JDGuidance />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/interview"
            element={
              <PrivateRoute>
                <MainLayout>
                  <InterviewSimulator />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/interview-history"
            element={
              <PrivateRoute>
                <MainLayout>
                  <InterviewHistory />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Profile />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
