import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MatchingRides = () => {
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRides = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/driver/acceptedrides', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setRides(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch rides');
                setLoading(false);
            }
        };

        fetchRides();
    }, []);

    if (loading) return <div className="text-center text-xl text-gray-600 py-6">Loading...</div>;
    if (error) return <div className="text-center text-red-500 py-6">{error}</div>;

    return (
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Your Accepted Rides</h2>
            
            {rides.length === 0 ? (
                <div className="text-center text-gray-500 py-6">No accepted rides at the moment.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
                        <thead className="bg-yellow-600 text-white">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Username</th>
                                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Pickup Location</th>
                                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Dropoff Location</th>
                                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Date & Time</th>
                                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Fare</th>
                                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rides.map((ride) => (
                                <tr key={ride._id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-800">{ride.userId?.username || 'N/A'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{ride.pickup?.address || 'Not provided'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{ride.dropoff?.address || 'Not provided'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(ride.scheduledDateTime).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800">${ride.fare ? ride.fare.toFixed(2) : 'N/A'}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${ride.status === 'accepted' ? 'bg-green-500 text-white' : 'bg-yellow-600 text-black'}`}>
                                            {ride.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MatchingRides;
