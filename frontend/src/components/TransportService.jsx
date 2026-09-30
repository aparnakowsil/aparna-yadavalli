import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bus, MapPin, CheckCircle } from 'lucide-react';

const TransportService = ({ user }) => {
    const [routes, setRoutes] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState('');
    const [pickupPoint, setPickupPoint] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/services/bus/routes');
                setRoutes(res.data);
            } catch (err) {
                console.error("Error fetching routes", err);
            } finally {
                setFetching(false);
            }
        };
        fetchRoutes();
    }, []);

    const formatINR = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const handleRouteChange = (e) => {
        setSelectedRoute(e.target.value);
        setPickupPoint(''); // Reset pickup point when route changes
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedRoute || !pickupPoint) {
            setStatusMessage('Please select a route and pickup point.');
            return;
        }

        setLoading(true);
        setStatusMessage('');

        try {
            await axios.post('http://localhost:5000/api/services/bus/apply', {
                student_register_number: user.register_number,
                route_id: selectedRoute,
                pickup_point: pickupPoint
            });
            setStatusMessage('Bus pass application submitted successfully!');
            setSelectedRoute('');
            setPickupPoint('');
        } catch (err) {
            setStatusMessage(err.response?.data?.message || 'Failed to submit application.');
        } finally {
            setLoading(false);
        }
    };

    const currentRouteDetails = routes.find(r => r.id === parseInt(selectedRoute));
    const availablePickupPoints = currentRouteDetails ? currentRouteDetails.pickup_points.split(',') : [];

    if (fetching) return <div>Loading transport details...</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-college-blue max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                <Bus className="mr-3 text-college-blue" /> College Bus Transport
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Form */}
                <div>
                    {statusMessage && (
                        <div className={`p-3 mb-4 rounded ${statusMessage.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {statusMessage}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Route</label>
                            <select
                                required
                                value={selectedRoute}
                                onChange={handleRouteChange}
                                className="block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-college-blue focus:border-college-blue"
                            >
                                <option value="" disabled>-- Choose Bus Route --</option>
                                {routes.map(r => (
                                    <option key={r.id} value={r.id}>{r.route_name}</option>
                                ))}
                            </select>
                        </div>

                        {selectedRoute && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select Pickup Point</label>
                                <select
                                    required
                                    value={pickupPoint}
                                    onChange={(e) => setPickupPoint(e.target.value)}
                                    className="block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-college-blue focus:border-college-blue"
                                >
                                    <option value="" disabled>-- Choose Pickup Point --</option>
                                    {availablePickupPoints.map((point, idx) => (
                                        <option key={idx} value={point.trim()}>{point.trim()}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading || !selectedRoute || !pickupPoint}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-college-blue hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-college-blue disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Submitting...' : <><CheckCircle className="mr-2" size={18} /> Apply for Bus Pass</>}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Info Panel */}
                <div>
                    {currentRouteDetails ? (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                            <h3 className="font-semibold text-lg mb-4 text-gray-800 border-b pb-2">Route Details</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Route Name</p>
                                    <p className="font-medium">{currentRouteDetails.route_name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Transport Fee (Annual)</p>
                                    <p className="font-bold text-college-blue text-xl">{formatINR(currentRouteDetails.bus_fee)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-2 flex items-center"><MapPin size={16} className="mr-1"/> Covered Areas</p>
                                    <div className="flex flex-wrap gap-2">
                                        {availablePickupPoints.map((p, i) => (
                                            <span key={i} className="bg-white border border-gray-200 text-xs px-2 py-1 rounded text-gray-600">
                                                {p.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 flex flex-col items-center justify-center text-center h-full text-blue-800">
                            <MapPin size={48} className="text-blue-300 mb-4" />
                            <p>Select a route from the form to view fee and pickup point details.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TransportService;
