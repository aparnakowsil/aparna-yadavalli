import React, { useState } from 'react';
import axios from 'axios';
import { Home, Send } from 'lucide-react';

const HostelService = ({ user }) => {
    const [preference, setPreference] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Hardcoded fees for demo
    const hostelFee = 60000;
    const formatINR = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatusMessage('');

        try {
            await axios.post('http://localhost:5000/api/services/hostel/apply', {
                student_register_number: user.register_number,
                preference
            });
            setStatusMessage('Hostel application submitted successfully!');
            setPreference('');
        } catch (err) {
            setStatusMessage(err.response?.data?.message || 'Failed to submit application.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-college-blue max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                <Home className="mr-3 text-college-blue" /> Hostel Accommodation
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Information Panel */}
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                    <h3 className="font-semibold text-lg mb-4 text-college-blue border-b border-blue-200 pb-2">Hostel Information</h3>
                    <div className="space-y-4 text-gray-700 text-sm">
                        <p><strong>Annual Fee:</strong> {formatINR(hostelFee)}</p>
                        <p><strong>Includes:</strong> Accommodation, Mess (3 meals), Wi-Fi, Laundry service (limited).</p>
                        <p className="text-red-600 mt-4 text-xs bg-red-50 p-2 rounded border border-red-100">
                            Note: Room allocation is subject to availability and distance from college. Application does not guarantee a room.
                        </p>
                    </div>
                </div>

                {/* Application Form */}
                <div>
                    {statusMessage && (
                        <div className={`p-3 mb-4 rounded ${statusMessage.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {statusMessage}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Room Preference</label>
                            <select
                                required
                                value={preference}
                                onChange={(e) => setPreference(e.target.value)}
                                className="block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-college-blue focus:border-college-blue"
                            >
                                <option value="" disabled>-- Select Preference --</option>
                                <option value="2 Sharing">2 Sharing Room</option>
                                <option value="3 Sharing">3 Sharing Room</option>
                                <option value="4 Sharing">4 Sharing Room</option>
                            </select>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-college-blue hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-college-blue"
                            >
                                {loading ? 'Submitting...' : <><Send className="mr-2" size={18} /> Apply for Hostel</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default HostelService;
