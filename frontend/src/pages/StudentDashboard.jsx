import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { LogOut, Home, FileText, CreditCard, Book, Bell, User, Building } from 'lucide-react';
import FeeVerification from '../components/FeeVerification';
import BankVerification from '../components/BankVerification';
import SemesterRegistration from '../components/SemesterRegistration';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (!storedUser || !token) {
            navigate('/login/student');
            return;
        }

        setUser(JSON.parse(storedUser));

        // Setup axios interceptor for token
        axios.interceptors.request.use(config => {
            config.headers.Authorization = `Bearer ${token}`;
            return config;
        });

    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    const renderContent = () => {
        switch (activeTab) {
            case 'fee':
                return <FeeVerification user={user} />;
            case 'bank':
                return <BankVerification user={user} />;
            case 'registration':
                return <SemesterRegistration user={user} />;
            default:
                return (
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-college-blue">
                            <h2 className="text-xl font-bold mb-4 flex items-center"><User className="mr-2" /> Profile Overview</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><p className="text-sm text-gray-500">Name</p><p className="font-semibold">{user.name}</p></div>
                                <div><p className="text-sm text-gray-500">Register Number</p><p className="font-semibold">{user.register_number}</p></div>
                                <div><p className="text-sm text-gray-500">Department</p><p className="font-semibold">{user.department}</p></div>
                                <div><p className="text-sm text-gray-500">Current Semester</p><p className="font-semibold">{user.current_semester}</p></div>
                                <div><p className="text-sm text-gray-500">Academic Year</p><p className="font-semibold">{user.academic_year}</p></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <button onClick={() => setActiveTab('fee')} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-100 flex flex-col items-center justify-center text-center">
                                <FileText size={32} className="text-college-blue mb-3" />
                                <h3 className="font-semibold">Fee Verification</h3>
                            </button>
                            <button onClick={() => setActiveTab('bank')} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-100 flex flex-col items-center justify-center text-center">
                                <CreditCard size={32} className="text-college-blue mb-3" />
                                <h3 className="font-semibold">Bank Transactions</h3>
                            </button>
                            <button onClick={() => setActiveTab('registration')} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-100 flex flex-col items-center justify-center text-center">
                                <Book size={32} className="text-college-blue mb-3" />
                                <h3 className="font-semibold">Semester Registration</h3>
                            </button>
                            <Link to="/student/services" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-100 flex flex-col items-center justify-center text-center">
                                <Building size={32} className="text-college-blue mb-3" />
                                <h3 className="font-semibold">Student Services</h3>
                                <p className="text-xs text-gray-500 mt-1">Hostel, Bus, Certificates</p>
                            </Link>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen flex bg-college-light">
            {/* Sidebar */}
            <div className="w-64 bg-college-dark text-white hidden md:flex flex-col">
                <div className="p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold truncate">BITM Portal</h2>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center p-3 rounded hover:bg-gray-800 ${activeTab === 'overview' ? 'bg-college-blue' : ''}`}>
                        <Home size={20} className="mr-3" /> Overview
                    </button>
                    <button onClick={() => setActiveTab('fee')} className={`w-full flex items-center p-3 rounded hover:bg-gray-800 ${activeTab === 'fee' ? 'bg-college-blue' : ''}`}>
                        <FileText size={20} className="mr-3" /> Fee Receipt
                    </button>
                    <button onClick={() => setActiveTab('bank')} className={`w-full flex items-center p-3 rounded hover:bg-gray-800 ${activeTab === 'bank' ? 'bg-college-blue' : ''}`}>
                        <CreditCard size={20} className="mr-3" /> Bank Transaction
                    </button>
                    <button onClick={() => setActiveTab('registration')} className={`w-full flex items-center p-3 rounded hover:bg-gray-800 ${activeTab === 'registration' ? 'bg-college-blue' : ''}`}>
                        <Book size={20} className="mr-3" /> Semester Reg.
                    </button>
                    <Link to="/student/services" className="w-full flex items-center p-3 rounded hover:bg-gray-800">
                        <Building size={20} className="mr-3" /> Student Services
                    </Link>
                </nav>
                <div className="p-4 border-t border-gray-700">
                    <button onClick={handleLogout} className="w-full flex items-center p-3 rounded hover:bg-red-600 text-red-400 hover:text-white transition-colors">
                        <LogOut size={20} className="mr-3" /> Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Header */}
                <header className="bg-white shadow-sm p-4 flex justify-between items-center">
                    <div className="md:hidden font-bold text-college-blue">BITM</div>
                    <div className="flex-1"></div>
                    <div className="flex items-center space-x-4">
                        <button className="text-gray-500 hover:text-college-blue relative">
                            <Bell size={24} />
                            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="flex items-center space-x-2 border-l pl-4 border-gray-200">
                            <div className="w-8 h-8 bg-college-blue rounded-full flex items-center justify-center text-white font-bold">
                                {user.name ? user.name.charAt(0) : 'U'}
                            </div>
                            <span className="font-medium text-sm hidden sm:block">{user.name}</span>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 p-6 overflow-y-auto">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default StudentDashboard;
