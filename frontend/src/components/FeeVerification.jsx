import React, { useState } from 'react';
import axios from 'axios';
import { Upload, CheckCircle, Clock, XCircle } from 'lucide-react';

const FeeVerification = ({ user }) => {
    const [formData, setFormData] = useState({
        receipt_number: '',
        fee_category: 'Tuition Fee',
        amount: '',
        payment_date: ''
    });
    const [file, setFile] = useState(null);
    const [statusMessage, setStatusMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Formatter for Indian Rupees
    const formatINR = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setStatusMessage('Please select a file to upload.');
            return;
        }

        setLoading(true);
        setStatusMessage('');

        const uploadData = new FormData();
        uploadData.append('student_register_number', user.register_number);
        uploadData.append('receipt_number', formData.receipt_number);
        uploadData.append('fee_category', formData.fee_category);
        uploadData.append('amount', formData.amount);
        uploadData.append('payment_date', formData.payment_date);
        uploadData.append('receipt_document', file);

        try {
            await axios.post('http://localhost:5000/api/student/fee-receipt', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setStatusMessage('Fee receipt uploaded successfully. Pending verification.');
            setFormData({ receipt_number: '', fee_category: 'Tuition Fee', amount: '', payment_date: '' });
            setFile(null);
            // Reset file input manually
            document.getElementById('receipt_document').value = '';
        } catch (err) {
            setStatusMessage(err.response?.data?.message || 'Failed to upload receipt.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-college-blue">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Fee Receipt Verification</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upload Form */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 border-b pb-2">Upload New Receipt</h3>
                    {statusMessage && (
                        <div className={`p-3 mb-4 rounded ${statusMessage.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {statusMessage}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Receipt Number</label>
                            <input type="text" name="receipt_number" required value={formData.receipt_number} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Fee Category</label>
                            <select name="fee_category" value={formData.fee_category} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                <option>Tuition Fee</option>
                                <option>Admission Fee</option>
                                <option>Examination Fee</option>
                                <option>Hostel Fee</option>
                                <option>Transport Fee</option>
                                <option>Library Fee</option>
                                <option>Other Fees</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Payment Amount (₹ INR)</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">₹</span>
                                </div>
                                <input type="number" name="amount" required value={formData.amount} onChange={handleInputChange} className="pl-7 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="0.00" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Payment Date</label>
                            <input type="date" name="payment_date" required value={formData.payment_date} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Upload Receipt (PDF/JPG/PNG)</label>
                            <input type="file" id="receipt_document" accept=".pdf, .jpg, .jpeg, .png" onChange={(e) => setFile(e.target.files[0])} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-college-blue hover:file:bg-blue-100" />
                        </div>
                        <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-college-blue hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-college-blue">
                            {loading ? 'Uploading...' : <><Upload className="mr-2" size={20} /> Submit Receipt</>}
                        </button>
                    </form>
                </div>

                {/* Status/Guidelines */}
                <div>
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-6">
                        <h3 className="font-semibold text-gray-700 mb-2">Instructions</h3>
                        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                            <li>Ensure the receipt number matches exactly.</li>
                            <li>Uploaded file must be clear and readable.</li>
                            <li>Verification may take up to 48 working hours.</li>
                            <li>Use Indian date format (DD-MM-YYYY) in mind.</li>
                        </ul>
                    </div>

                    <h3 className="text-lg font-semibold mb-4 border-b pb-2">Recent Uploads Status</h3>
                    <div className="space-y-3 text-sm">
                        {/* Placeholder for recent uploads - in a full implementation, fetch these from API */}
                        <div className="flex items-center justify-between p-3 border rounded bg-white">
                            <div>
                                <p className="font-semibold">RCPT-2023-8901</p>
                                <p className="text-gray-500">{formatINR(45000)} - Tuition Fee</p>
                            </div>
                            <span className="flex items-center text-yellow-600 bg-yellow-50 px-2 py-1 rounded"><Clock size={16} className="mr-1"/> Pending</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeeVerification;
