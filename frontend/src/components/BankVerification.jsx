import React, { useState } from 'react';
import axios from 'axios';
import { Upload, Clock } from 'lucide-react';

const BankVerification = ({ user }) => {
    const [formData, setFormData] = useState({
        bank_name: '',
        account_holder_name: '',
        utr_number: '',
        transaction_date: '',
        amount: '',
        payment_type: 'NEFT'
    });
    const [file, setFile] = useState(null);
    const [statusMessage, setStatusMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setStatusMessage('Please select a screenshot to upload.');
            return;
        }

        setLoading(true);
        setStatusMessage('');

        const uploadData = new FormData();
        uploadData.append('student_register_number', user.register_number);
        uploadData.append('bank_name', formData.bank_name);
        uploadData.append('account_holder_name', formData.account_holder_name);
        uploadData.append('utr_number', formData.utr_number);
        uploadData.append('transaction_date', formData.transaction_date);
        uploadData.append('amount', formData.amount);
        uploadData.append('payment_type', formData.payment_type);
        uploadData.append('screenshot', file);

        try {
            await axios.post('http://localhost:5000/api/student/bank-transaction', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setStatusMessage('Bank transaction submitted successfully. Pending verification.');
            setFormData({ bank_name: '', account_holder_name: '', utr_number: '', transaction_date: '', amount: '', payment_type: 'NEFT' });
            setFile(null);
            document.getElementById('screenshot').value = '';
        } catch (err) {
            setStatusMessage(err.response?.data?.message || 'Failed to submit transaction.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-college-blue">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Bank Transaction Verification</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-lg font-semibold mb-4 border-b pb-2">Submit Transaction Details</h3>
                    {statusMessage && (
                        <div className={`p-3 mb-4 rounded ${statusMessage.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {statusMessage}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                                <input type="text" name="bank_name" required value={formData.bank_name} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Account Holder Name</label>
                                <input type="text" name="account_holder_name" required value={formData.account_holder_name} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">UTR Number / Transaction ID</label>
                            <input type="text" name="utr_number" required value={formData.utr_number} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Payment Type</label>
                                <select name="payment_type" value={formData.payment_type} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                    <option>NEFT</option>
                                    <option>RTGS</option>
                                    <option>IMPS</option>
                                    <option>UPI</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Transaction Date</label>
                                <input type="date" name="transaction_date" required value={formData.transaction_date} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Transaction Amount (₹ INR)</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">₹</span>
                                </div>
                                <input type="number" name="amount" required value={formData.amount} onChange={handleInputChange} className="pl-7 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="0.00" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Upload Screenshot</label>
                            <input type="file" id="screenshot" accept=".jpg, .jpeg, .png" onChange={(e) => setFile(e.target.files[0])} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-college-blue hover:file:bg-blue-100" />
                        </div>
                        <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-college-blue hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-college-blue">
                            {loading ? 'Submitting...' : <><Upload className="mr-2" size={20} /> Submit Transaction</>}
                        </button>
                    </form>
                </div>

                <div>
                    <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-6">
                        <h3 className="font-semibold text-college-blue mb-2">Notice</h3>
                        <p className="text-sm text-gray-700">
                            Bank transactions require manual verification from the finance department against college bank statements. Uploading a screenshot does not automatically verify your payment.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BankVerification;
