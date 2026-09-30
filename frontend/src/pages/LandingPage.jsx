import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Users, BookOpen } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Header */}
            <header className="bg-college-blue text-white py-6 shadow-md">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-wider">
                        Ballari Institution Technology and Management
                    </h1>
                    <p className="mt-2 text-xl font-light text-blue-100">
                        Student Management & Services Portal
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex flex-col items-center justify-center py-12 px-4">
                <div className="text-center mb-12 max-w-3xl">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        One Platform for Academic, Financial and Student Services
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Welcome to the official BITM portal. Please select your login type below to access your dashboard and services.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
                    {/* Student Login Card */}
                    <Link to="/login/student" className="group">
                        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 h-full flex flex-col items-center text-center transform hover:-translate-y-1">
                            <div className="bg-blue-50 p-4 rounded-full mb-6 group-hover:bg-college-blue group-hover:text-white transition-colors">
                                <GraduationCap size={48} className="text-college-blue group-hover:text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">Student Login</h3>
                            <p className="text-gray-600">Access academic records, pay fees, and register for semesters.</p>
                        </div>
                    </Link>

                    {/* Student Services Card */}
                    <Link to="/login/student" className="group">
                        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 h-full flex flex-col items-center text-center transform hover:-translate-y-1">
                            <div className="bg-blue-50 p-4 rounded-full mb-6 group-hover:bg-college-blue group-hover:text-white transition-colors">
                                <BookOpen size={48} className="text-college-blue group-hover:text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">Student Services</h3>
                            <p className="text-gray-600">Apply for hostel, transport, certificates and more.</p>
                        </div>
                    </Link>

                    {/* Admin Login Card */}
                    <Link to="/login/admin" className="group">
                        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 h-full flex flex-col items-center text-center transform hover:-translate-y-1">
                            <div className="bg-blue-50 p-4 rounded-full mb-6 group-hover:bg-college-blue group-hover:text-white transition-colors">
                                <Users size={48} className="text-college-blue group-hover:text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">Admin Login</h3>
                            <p className="text-gray-600">Manage student records, verify fees, and handle service requests.</p>
                        </div>
                    </Link>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-college-dark text-gray-400 py-6 text-center">
                <p>&copy; {new Date().getFullYear()} Ballari Institution Technology and Management. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
