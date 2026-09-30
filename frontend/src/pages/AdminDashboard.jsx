import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, LayoutDashboard, Users, FileCheck, Building, Bus, FileText } from 'lucide-react';
import AdminTables from '../components/AdminTables';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({
        total_students: 0,
        pending_fees: 0,
        pending_bank_transactions: 0,
        total_verified_fees: 0
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (!storedUser || !token) {
            navigate('/login/admin');
            return;
        }

        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.role !== 'ADMIN' && parsedUser.role !== 'SUPERADMIN') {
            navigate('/login/admin');
            return;
        }

        setUser(parsedUser);

        axios.interceptors.request.use(config => {
            config.headers.Authorization = `Bearer ${token}`;
            return config;
        });

        fetchStats();
    }, [navigate]);

    const fetchStats = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/stats');
            setStats(res.data);
        } catch (err) {
            console.error("Failed to fetch admin stats", err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const formatINR = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    const renderContent = () => {
        if (activeTab === 'dashboard') {
            return (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800">Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
                            <p className="text-sm text-gray-500 font-medium uppercase">Total Students</p>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{stats.total_students}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
                            <p className="text-sm text-gray-500 font-medium uppercase">Pending Fee Receipts</p>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{stats.pending_fees}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-orange-500">
                            <p className="text-sm text-gray-500 font-medium uppercase">Pending Bank Verification</p>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{stats.pending_bank_transactions}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
                            <p className="text-sm text-gray-500 font-medium uppercase">Total Verified Fees</p>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{formatINR(stats.total_verified_fees)}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <button onClick={() => setActiveTab('fees')} className="p-4 bg-gray-50 border hover:bg-gray-100 rounded text-center transition-colors">
                                <FileText className="mx-auto mb-2 text-college-blue" />
                                <span className="font-medium text-sm">Verify Fees</span>
                            </button>
                            <button onClick={() => setActiveTab('bank')} className="p-4 bg-gray-50 border hover:bg-gray-100 rounded text-center transition-colors">
                                <FileCheck className="mx-auto mb-2 text-college-blue" />
                                <span className="font-medium text-sm">Verify Bank</span>
                            </button>
                            <button onClick={() => setActiveTab('hostel')} className="p-4 bg-gray-50 border hover:bg-gray-100 rounded text-center transition-colors">
                                <Building className="mx-auto mb-2 text-college-blue" />
                                <span className="font-medium text-sm">Hostel Requests</span>
                            </button>
                            <button onClick={() => setActiveTab('bus')} className="p-4 bg-gray-50 border hover:bg-gray-100 rounded text-center transition-colors">
                                <Bus className="mx-auto mb-2 text-college-blue" />
                                <span className="font-medium text-sm">Bus Requests</span>
                            </button>
                        </div>
                    </div>
                </div>
            );
        } else {
            return <AdminTables activeTab={activeTab} />;
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-college-dark text-white hidden md:flex flex-col">
                <div className="p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold truncate">BITM Admin</h2>
                    <p className="text-xs text-gray-400 mt-1">{user.department_role} Dept</p>
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
                    <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center p-3 rounded hover:bg-gray-800 ${activeTab === 'dashboard' ? 'bg-college-blue' : ''}`}>
                        <LayoutDashboard size={18} className="mr-3" /> Dashboard
                    </button>

                    <div className="pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Verification</div>
                    <button onClick={() => setActiveTab('fees')} className={`w-full flex items-center p-3 rounded hover:bg-gray-800 ${activeTab === 'fees' ? 'bg-college-blue' : ''}`}>
                        <FileText size={18} className="mr-3" /> Fee Receipts
                    </button>
                    <button onClick={() => setActiveTab('bank')} className={`w-full flex items-center p-3 rounded hover:bg-gray-800 ${activeTab === 'bank' ? 'bg-college-blue' : ''}`}>
                        <FileCheck size={18} className="mr-3" /> Bank Transactions
                    </button>
                    <button onClick={() => setActiveTab('registrations')} className={`w-full flex items-center p-3 rounded hover:bg-gray-800 ${activeTab === 'registrations' ? 'bg-college-blue' : ''}`}>
                        <Users size={18} className="mr-3" /> Semester Reg.
                    </button>

                    <div className="pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Services</div>
                    <button onClick={() => setActiveTab('hostel')} className={`w-full flex items-center p-3 rounded hover:bg-gray-800 ${activeTab === 'hostel' ? 'bg-college-blue' : ''}`}>
                        <Building size={18} className="mr-3" /> Hostel Management
                    </button>
                    <button onClick={() => setActiveTab('bus')} className={`w-full flex items-center p-3 rounded hover:bg-gray-800 ${activeTab === 'bus' ? 'bg-college-blue' : ''}`}>
                        <Bus size={18} className="mr-3" /> Transport Management
                    </button>
                </nav>
                <div className="p-4 border-t border-gray-700">
                    <button onClick={handleLogout} className="w-full flex items-center p-3 rounded hover:bg-red-600 text-red-400 hover:text-white transition-colors">
                        <LogOut size={20} className="mr-3" /> Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm p-4 flex justify-between items-center z-10">
                    <div className="md:hidden font-bold text-college-blue">BITM Admin</div>
                    <div className="flex-1"></div>
                    <div className="flex items-center space-x-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-gray-800">{user.name}</p>
                            <p className="text-xs text-gray-500">Administrator</p>
                        </div>
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold border-2 border-college-blue">
                            {user.name ? user.name.charAt(0) : 'A'}
                        </div>
                    </div>
                </header>

                {/* Dashboard Content Area */}
                <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
