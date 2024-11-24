// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const MatchingRides = () => {
//     const [rides, setRides] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchRides = async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 const response = await axios.get('http://localhost:5000/api/driver/scheduledrides', {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });

//                 console.log('Fetched rides:', response.data);

//                 setRides(response.data);
//                 setLoading(false);
//             } catch (err) {
//                 console.error('Error details:', err);
//                 setError('Failed to fetch rides');
//                 setLoading(false);
//             }
//         };

//         fetchRides();
//     }, []);

//     if (loading) return <div className="flex justify-center p-4 text-yellow-600">Loading...</div>;
//     if (error) return <div className="text-red-500 p-4">{error}</div>;

//     const handleAcceptRide = async (rideId) => {
//         try {
//             const token = localStorage.getItem('token');
//             const response = await axios.patch(
//                 `http://localhost:5000/api/driver/accept-ride/${rideId}`,
//                 {},
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );

//             alert('Ride accepted successfully!');
//             setRides((prevRides) =>
//                 prevRides.map((ride) =>
//                     ride._id === rideId ? { ...ride, status: 'accepted' } : ride
//                 )
//             );
//         } catch (err) {
//             console.error('Error accepting ride:', err);
//             alert('Failed to accept ride');
//         }
//     };

//     return (
//         <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
//             <div className="p-8">
//                 <h2 className="text-3xl font-extrabold text-black mb-6"> Rides</h2>
//                 {rides.length > 0 ? (
//                     <div className="overflow-x-auto">
//                         <table className="min-w-full border-collapse">
//                             <thead className="bg-yellow-600 text-white">
//                                 <tr>
//                                     <th className="px-6 py-4 text-left text-sm font-medium">Username</th>
//                                     <th className="px-6 py-4 text-left text-sm font-medium">Pickup Location</th>
//                                     <th className="px-6 py-4 text-left text-sm font-medium">Dropoff Location</th>
//                                     <th className="px-6 py-4 text-left text-sm font-medium">Passengers</th>
//                                     <th className="px-6 py-4 text-left text-sm font-medium">Date & Time</th>
//                                     <th className="px-6 py-4 text-left text-sm font-medium">Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                                 {rides.map((ride) => (
//                                     <tr key={ride._id} className="hover:bg-gray-100">
//                                         <td className="px-6 py-4 text-black">{ride.userId?.username || ride.userId?.name || 'N/A'}</td>
//                                         <td className="px-6 py-4 text-black">{ride.pickup?.address || 'Not provided'}</td>
//                                         <td className="px-6 py-4 text-black">{ride.dropoff?.address || 'Not provided'}</td>
//                                         <td className="px-6 py-4 text-black">{ride.numPassengers}</td>
//                                         <td className="px-6 py-4 text-black">{new Date(ride.scheduledDateTime).toLocaleString()}</td>
//                                         <td className="px-6 py-4">
//                                             {ride.status === 'pending' && (
//                                                 <button
//                                                     className="bg-yellow-600 text-black hover:bg-yellow-600 px-6 py-2 rounded-md transition-colors duration-200 font-semibold"
//                                                     onClick={() => handleAcceptRide(ride._id)}
//                                                 >
//                                                     Accept Ride
//                                                 </button>
//                                             )}
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 ) : (
//                     <p className="text-center text-gray-500 mt-8">No matching rides found</p>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default MatchingRides;


import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MatchingRides = ({ onRideCountChange }) => {
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRides = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/driver/scheduledrides', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                console.log('Fetched rides:', response.data);

                setRides(response.data);
                onRideCountChange(response.data.length);
                setLoading(false);
            } catch (err) {
                console.error('Error details:', err);
                setError('Failed to fetch rides');
                setLoading(false);
                onRideCountChange(0);
            }
        };

        fetchRides();
    }, [onRideCountChange]);

    if (loading) return <div className="flex justify-center p-4 text-yellow-600">Loading...</div>;
    if (error) return <div className="text-red-500 p-4">{error}</div>;

    const handleAcceptRide = async (rideId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.patch(
                `http://localhost:5000/api/driver/accept-ride/${rideId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert('Ride accepted successfully!');
            setRides((prevRides) => {
                const updatedRides = prevRides.map((ride) =>
                    ride._id === rideId ? { ...ride, status: 'accepted' } : ride
                );
                onRideCountChange(updatedRides.length);
                return updatedRides;
            });
        } catch (err) {
            console.error('Error accepting ride:', err);
            alert('Failed to accept ride');
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
                <h2 className="text-3xl font-extrabold text-black mb-6">Rides</h2>
                {rides.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse">
                            <thead className="bg-yellow-600 text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-medium">Username</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium">Pickup Location</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium">Dropoff Location</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium">Passengers</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium">Date & Time</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {rides.map((ride) => (
                                    <tr key={ride._id} className="hover:bg-gray-100">
                                        <td className="px-6 py-4 text-black">{ride.userId?.username || ride.userId?.name || 'N/A'}</td>
                                        <td className="px-6 py-4 text-black">{ride.pickup?.address || 'Not provided'}</td>
                                        <td className="px-6 py-4 text-black">{ride.dropoff?.address || 'Not provided'}</td>
                                        <td className="px-6 py-4 text-black">{ride.numPassengers}</td>
                                        <td className="px-6 py-4 text-black">{new Date(ride.scheduledDateTime).toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            {ride.status === 'pending' && (
                                                <button
                                                    className="bg-yellow-600 text-black hover:bg-yellow-600 px-6 py-2 rounded-md transition-colors duration-200 font-semibold"
                                                    onClick={() => handleAcceptRide(ride._id)}
                                                >
                                                    Accept Ride
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-gray-500 mt-8">No matching rides found</p>
                )}
            </div>
        </div>
    );
};

export default MatchingRides;
