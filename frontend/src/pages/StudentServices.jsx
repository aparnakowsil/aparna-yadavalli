import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Home, Bus, Award, BookOpen, AlertCircle, Calendar } from 'lucide-react';
import HostelService from '../components/HostelService';
import TransportService from '../components/TransportService';

const StudentServices = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeService, setActiveService] = useState('overview');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (!storedUser || !token) {
            navigate('/login/student');
            return;
        }

        setUser(JSON.parse(storedUser));
    }, [navigate]);

    if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    const renderContent = () => {
        switch (activeService) {
            case 'hostel':
                return <HostelService user={user} />;
            case 'transport':
                return <TransportService user={user} />;
            default:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <button onClick={() => setActiveService('hostel')} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-100 flex flex-col items-center justify-center text-center">
                            <Home size={40} className="text-college-blue mb-4" />
                            <h3 className="text-xl font-semibold">Hostel Service</h3>
                            <p className="text-sm text-gray-500 mt-2">Apply for hostel, check availability, view room allocation.</p>
                        </button>

                        <button onClick={() => setActiveService('transport')} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-100 flex flex-col items-center justify-center text-center">
                            <Bus size={40} className="text-college-blue mb-4" />
                            <h3 className="text-xl font-semibold">Bus Service</h3>
                            <p className="text-sm text-gray-500 mt-2">View routes, apply for bus pass, track application.</p>
                        </button>

                        {/* Placeholders for other services */}
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 flex flex-col items-center justify-center text-center opacity-70">
                            <Award size={40} className="text-gray-400 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700">Certificates</h3>
                            <p className="text-sm text-gray-500 mt-2">Request bonafide, study, or course certificates.</p>
                            <span className="mt-3 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">Coming Soon</span>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 flex flex-col items-center justify-center text-center opacity-70">
                            <BookOpen size={40} className="text-gray-400 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700">Library</h3>
                            <p className="text-sm text-gray-500 mt-2">View issued books, due dates, and fines.</p>
                            <span className="mt-3 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">Coming Soon</span>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 flex flex-col items-center justify-center text-center opacity-70">
                            <Calendar size={40} className="text-gray-400 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700">Leave Request</h3>
                            <p className="text-sm text-gray-500 mt-2">Apply for leave with supporting documents.</p>
                            <span className="mt-3 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">Coming Soon</span>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 flex flex-col items-center justify-center text-center opacity-70">
                            <AlertCircle size={40} className="text-gray-400 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700">Grievance</h3>
                            <p className="text-sm text-gray-500 mt-2">Submit and track complaints securely.</p>
                            <span className="mt-3 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">Coming Soon</span>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-college-light flex flex-col">
            <header className="bg-college-blue text-white shadow-md">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link to="/student/dashboard" className="hover:bg-blue-800 p-2 rounded transition-colors flex items-center">
                            <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
                        </Link>
                        <h1 className="text-xl font-bold hidden md:block">| Student Services Portal</h1>
                    </div>
                    <div className="font-medium text-sm border-l border-blue-400 pl-4">
                        {user.register_number}
                    </div>
                </div>
            </header>

            <main className="flex-grow container mx-auto px-4 py-8">
                {activeService !== 'overview' && (
                    <div className="mb-6">
                        <button onClick={() => setActiveService('overview')} className="text-college-blue hover:underline flex items-center">
                            <ArrowLeft size={16} className="mr-1" /> All Services
                        </button>
                    </div>
                )}
                {renderContent()}
            </main>
        </div>
    );
};

export default StudentServices;
