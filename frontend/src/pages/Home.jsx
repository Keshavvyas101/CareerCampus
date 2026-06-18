import React from "react";
import {Link} from "react-router-dom";
import {LuBriefcase, LuLightbulb} from "react-icons/lu";
import FeatureCard from "../components/FeatureCard";
import {IoDocumentTextOutline} from "react-icons/io5";
import {BiBullseye} from "react-icons/bi";
import Footer from "../components/Footer";
import {useAuth} from "../context/AuthContext";

const Home = () => {
  const {authenticated} = useAuth();
  return (
    <>
      <div className="min-h-screen bg-blue-50">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-blue-900 shadow-md">
          <h2 className="text-white text-2xl md:text-3xl font-bold">
            CareerCompass
          </h2>
          <div className="flex items-center gap-4">
            <Link to={authenticated ? "/dashboard" : "/login"}>
              <button className="text-white hover:underline">Login</button>
            </Link>

            <Link to={authenticated ? "/dashboard" : "/signup"}>
              <button className="bg-blue-400 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200">
                Sign Up
              </button>
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex flex-col items-center justify-center text-center px-4 py-16 md:py-24">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
            Navigate Your Career Path with Confidence
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl">
            CareerCompass helps you track job applications, analyze your resume,
            and align it perfectly with job descriptions using powerful AI
            tools.
          </p>
          <div className="mt-8 flex gap-4">
            <Link to="/signup">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg shadow-md transition">
                Get Started
              </button>
            </Link>
            <Link to="/dashboard">
              <button className="border border-blue-600 hover:bg-blue-100 text-blue-600 px-6 py-3 rounded-lg text-lg transition">
                Go To Dashboard
              </button>
            </Link>
          </div>
        </main>
        {/* Features Section */}
        <div className="flex flex-col items-center justify-center text-center px-4 py-16 md:py-24 bg-white">
          <h1 className="text-2xl md:text-4xl font-bold text-blue-900 mb-10">
            Why Choose CareerCompass?
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl w-full">
            <FeatureCard
              icon={<LuBriefcase className="w-10 h-10 text-blue-600" />}
              title="Application Tracking"
              description="Organize and monitor all your job applications in one place. Never miss a follow-up."
            />
            <FeatureCard
              icon={
                <IoDocumentTextOutline className="w-10 h-10 text-blue-600" />
              }
              title="AI Resume Review"
              description="Get AI-powered feedback on your resume to highlight strengths and identify areas for improvement."
            />
            <FeatureCard
              icon={<BiBullseye className="w-10 h-10 text-blue-600" />}
              title="JD Alignment"
              description="Analyze your resume against job descriptions for optimal keyword matching and fit."
            />
            <FeatureCard
              icon={<LuLightbulb className="w-10 h-10 text-blue-600" />}
              title="Skill Extraction"
              description="Discover and list your marketable skills with our intelligent resume analysis."
            />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Home;
