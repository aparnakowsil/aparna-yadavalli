import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X, Eye, FileText, Download } from 'lucide-react';

const AdminTables = ({ activeTab }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
    };

    const formatINR = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            let endpoint = '';
            if (activeTab === 'fees') endpoint = '/api/admin/fee-receipts/pending';
            else if (activeTab === 'bank') endpoint = '/api/admin/bank-transactions/pending';
            else if (activeTab === 'registrations') endpoint = '/api/admin/registrations/pending';
            else if (activeTab === 'hostel') endpoint = '/api/services/admin/hostel/applications';
            else if (activeTab === 'bus') endpoint = '/api/services/admin/bus/applications';

            if (endpoint) {
                const res = await axios.get(`http://localhost:5000${endpoint}`);
                setData(res.data);
            }
        } catch (err) {
            console.error(`Failed to fetch data for ${activeTab}`, err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const handleAction = async (id, status, type) => {
        try {
            let endpoint = '';
            if (type === 'fee') endpoint = `/api/admin/fee-receipts/${id}/status`;
            else if (type === 'bank') endpoint = `/api/admin/bank-transactions/${id}/status`;
            else if (type === 'registration') endpoint = `/api/admin/registrations/${id}/status`;
            // Simple implementation for services (in real app needs specific endpoints)
            else return alert(`Update status ${status} for ${type} ID ${id}`);

            await axios.put(`http://localhost:5000${endpoint}`, { status });
            // Refresh data
            fetchData();
        } catch (err) {
            console.error('Failed to update status', err);
            alert('Error updating status.');
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading data...</div>;

    const renderTable = () => {
        switch (activeTab) {
            case 'fees':
                return (
                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date / Receipt No</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Details</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category & Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {data.length === 0 ? (
                                    <tr><td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">No pending fee receipts found.</td></tr>
                                ) : data.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{item.receipt_number}</div>
                                            <div className="text-sm text-gray-500">{formatDate(item.payment_date)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{item.student_name}</div>
                                            <div className="text-sm text-gray-500">{item.student_register_number}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{item.fee_category}</div>
                                            <div className="text-sm font-bold text-college-blue">{formatINR(item.amount)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <a href={`http://localhost:5000${item.document_url}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-900 flex items-center">
                                                <Eye size={16} className="mr-1" /> View
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => handleAction(item.id, 'Verified', 'fee')} className="text-green-600 hover:text-green-900 bg-green-50 p-2 rounded-full mr-2" title="Verify">
                                                <Check size={18} />
                                            </button>
                                            <button onClick={() => handleAction(item.id, 'Rejected', 'fee')} className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-full" title="Reject">
                                                <X size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );

            case 'bank':
                return (
                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date / UTR</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student & Account</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount & Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proof</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {data.length === 0 ? (
                                    <tr><td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">No pending bank transactions found.</td></tr>
                                ) : data.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{item.utr_number}</div>
                                            <div className="text-sm text-gray-500">{formatDate(item.transaction_date)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{item.student_name} ({item.student_register_number})</div>
                                            <div className="text-sm text-gray-500">{item.bank_name} - {item.account_holder_name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-college-blue">{formatINR(item.amount)}</div>
                                            <div className="text-sm text-gray-500">{item.payment_type}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <a href={`http://localhost:5000${item.screenshot_url}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-900 flex items-center">
                                                <Eye size={16} className="mr-1" /> View
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => handleAction(item.id, 'Verified', 'bank')} className="text-green-600 hover:text-green-900 bg-green-50 p-2 rounded-full mr-2" title="Verify">
                                                <Check size={18} />
                                            </button>
                                            <button onClick={() => handleAction(item.id, 'Failed', 'bank')} className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-full" title="Reject">
                                                <X size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            case 'registrations':
                return (
                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Details</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester Info</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {data.length === 0 ? (
                                    <tr><td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">No pending registrations found.</td></tr>
                                ) : data.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(item.registration_date)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{item.student_name}</div>
                                            <div className="text-sm text-gray-500">{item.student_register_number}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">Semester {item.semester_number}</div>
                                            <div className="text-sm text-gray-500">{item.academic_year}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => handleAction(item.id, 'Approved', 'registration')} className="text-green-600 hover:text-green-900 bg-green-50 p-2 rounded-full mr-2" title="Approve">
                                                <Check size={18} />
                                            </button>
                                            <button onClick={() => handleAction(item.id, 'Rejected', 'registration')} className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-full" title="Reject">
                                                <X size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            case 'hostel':
            case 'bus':
                return (
                    <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                        <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">Module Under Construction</h3>
                        <p className="mt-1">The detailed view for {activeTab} applications is not fully implemented in this demo.</p>
                        <p className="mt-4 text-sm bg-gray-50 p-2 rounded inline-block">Data count: {data.length} pending items</p>
                    </div>
                );
            default:
                return <div>Select a valid tab.</div>;
        }
    };

    const getTitle = () => {
        switch (activeTab) {
            case 'fees': return 'Pending Fee Receipt Verifications';
            case 'bank': return 'Pending Bank Transaction Verifications';
            case 'registrations': return 'Pending Semester Registrations';
            case 'hostel': return 'Hostel Applications';
            case 'bus': return 'Bus Pass Applications';
            default: return 'Data View';
        }
    };

    return (
        <div>
            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">{getTitle()}</h2>
                <button className="flex items-center text-sm bg-white border border-gray-300 px-3 py-2 rounded shadow-sm hover:bg-gray-50 transition-colors text-gray-700">
                    <Download size={16} className="mr-2" /> Export to CSV
                </button>
            </div>
            {renderTable()}
        </div>
    );
};

export default AdminTables;
