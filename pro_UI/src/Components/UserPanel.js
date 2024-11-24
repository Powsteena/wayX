// import React, { useState } from 'react';
// import axios from 'axios';
// import { jwtDecode } from 'jwt-decode';
// import { Car, List, CheckCircle, Menu, X, LogOut } from 'lucide-react';
// import logo from '../Images/log.png';
// import CreatedRides from './MyRides';
// import AcceptedRides from './AcceptedRides';

// const UserPanel = () => {
//   const [activeTab, setActiveTab] = useState('create');
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [pickup, setPickup] = useState('');
//   const [dropoff, setDropoff] = useState('');
//   const [vehicleType, setVehicleType] = useState('car');
//   const [numPassengers, setNumPassengers] = useState(1);
//   const [scheduledDateTime, setScheduledDateTime] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   const handleScheduleRide = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setSuccessMessage('');

//     try {
//       const token = localStorage.getItem('token');
//       const decoded = jwtDecode(token);

//       if (!decoded.user?.id) {
//         throw new Error('Invalid token format. Please login again.');
//       }

//       await axios.post(
//         'http://localhost:5000/api/rides/schedule-ride',
//         {
//           pickup: { address: pickup },
//           dropoff: { address: dropoff },
//           vehicleType,
//           numPassengers: parseInt(numPassengers),
//           scheduledDateTime,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` }
//         }
//       );

//       setSuccessMessage('Ride scheduled successfully!');
//       clearForm();
//     } catch (err) {
//       setError(err.response?.data?.error || 'Failed to schedule ride');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const clearForm = () => {
//     setPickup('');
//     setDropoff('');
//     setVehicleType('car');
//     setNumPassengers(1);
//     setScheduledDateTime('');
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     window.location.href = '/login';
//   };

//   const navigationItems = [
//     { id: 'create', label: 'Create Ride', icon: Car },
//     { id: 'myRides', label: 'My Rides', icon: List },
//     { id: 'accepted', label: 'Accepted Rides', icon: CheckCircle },
//   ];
//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Mobile menu button */}
//       <div className="lg:hidden fixed top-4 left-4 z-50">
//         <button
//           onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//           className="p-2 rounded-md bg-yellow-600 text-white"
//         >
//           {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//         </button>
//       </div>

//       {/* Sidebar */}
//       <aside className={`
//         fixed top-0 left-0 z-40 h-screen w-64 
//         transform transition-transform duration-200 ease-in-out
//         bg-white shadow-lg
//         ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
//       `}>
//         <div className="h-full flex flex-col">
//           <div className="p-4">
//           <a href="/" className="flex items-center">
//                 <img src={logo} alt="Logo" className="h-12" />
//               </a>
//           </div>
          
//           <nav className="flex-1 p-4">
//             <ul className="space-y-2">
//               {navigationItems.map((item) => (
//                 <li key={item.id}>
//                   <button
//                     onClick={() => {
//                       setActiveTab(item.id);
//                       setIsMobileMenuOpen(false);
//                     }}
//                     className={`
//                       w-full flex items-center space-x-3 px-4 py-3 rounded-lg
//                       ${activeTab === item.id 
//                         ? 'bg-yellow-600 text-white' 
//                         : 'text-gray-600 hover:bg-yellow-50'}
//                     `}
//                   >
//                     <item.icon size={20} />
//                     <span>{item.label}</span>
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </nav>

//           <div className="p-4 border-t">
//             <button
//               onClick={handleLogout}
//               className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-red-50"
//             >
//               <LogOut size={20} />
//               <span>Logout</span>
//             </button>
//           </div>
//         </div>
//       </aside>

//       {/* Main content */}
//       <main className={`
//         lg:ml-64 min-h-screen
//         transition-all duration-200 ease-in-out
//       `}>
//         <div className="p-8">
//           {activeTab === 'create' && (
//             <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
//               <h2 className="text-2xl font-bold mb-6 text-yellow-600">Schedule a Ride</h2>
              
//               <form onSubmit={handleScheduleRide} className="space-y-4">
//                 <div>
//                   <label className="block font-medium text-gray-700 mb-2">Pickup Location</label>
//                   <input
//                     type="text"
//                     value={pickup}
//                     onChange={(e) => setPickup(e.target.value)}
//                     required
//                     className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-600"
//                   />
//                 </div>

//                 <div>
//                   <label className="block font-medium text-gray-700 mb-2">Dropoff Location</label>
//                   <input
//                     type="text"
//                     value={dropoff}
//                     onChange={(e) => setDropoff(e.target.value)}
//                     required
//                     className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-600"
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block font-medium text-gray-700 mb-2">Vehicle Type</label>
//                     <select
//                       value={vehicleType}
//                       onChange={(e) => setVehicleType(e.target.value)}
//                       className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-600"
//                     >
//                       <option value="car">Car</option>
//                       <option value="van">Van</option>
//                       <option value="bike">Bike</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block font-medium text-gray-700 mb-2">Passengers</label>
//                     <input
//                       type="number"
//                       value={numPassengers}
//                       onChange={(e) => setNumPassengers(e.target.value)}
//                       required
//                       className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-600"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block font-medium text-gray-700 mb-2">Schedule Date & Time</label>
//                   <input
//                     type="datetime-local"
//                     value={scheduledDateTime}
//                     onChange={(e) => setScheduledDateTime(e.target.value)}
//                     required
//                     className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-600"
//                   />
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full bg-yellow-600 hover:bg-yellow-600 text-white font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 transition-colors"
//                 >
//                   {loading ? 'Scheduling...' : 'Schedule Ride'}
//                 </button>
//               </form>

//               {successMessage && (
//                 <p className="mt-4 text-green-500 font-medium">{successMessage}</p>
//               )}
//               {error && (
//                 <p className="mt-4 text-red-500 font-medium">{error}</p>
//               )}
//             </div>
//           )}

//           {activeTab === 'myRides' && (
//             <div className="bg-white rounded-lg shadow-lg p-6">
//               <h2 className="text-2xl font-bold mb-6 text-yellow-600">My Rides</h2>
//               <CreatedRides />
//             </div>
//           )}

//           {activeTab === 'accepted' && (
//             <div className="bg-white rounded-lg shadow-lg p-6">
//               <h2 className="text-2xl font-bold mb-6 text-yellow-600">Accepted Rides</h2>
//               <AcceptedRides/>
//               <p className="text-gray-600">No accepted rides found.</p>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default UserPanel;
import React, { useState } from 'react';
import { Car, List, CheckCircle, Menu, X, LogOut, MapPin, Users, Calendar } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import CreatedRides from './MyRides';
import AcceptedRides from './AcceptedRides';
import Footer from './Footer';



const UserPanel = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [vehicleType, setVehicleType] = useState('car');
  const [numPassengers, setNumPassengers] = useState(1);
  const [scheduledDateTime, setScheduledDateTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleScheduleRide = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);

      if (!decoded.user?.id) {
        throw new Error('Invalid token format. Please login again.');
      }

      await axios.post(
        'http://localhost:5000/api/rides/schedule-ride',
        {
          pickup: { address: pickup },
          dropoff: { address: dropoff },
          vehicleType,
          numPassengers: parseInt(numPassengers),
          scheduledDateTime,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSuccessMessage('Ride scheduled successfully!');
      clearForm();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to schedule ride');
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setPickup('');
    setDropoff('');
    setVehicleType('car');
    setNumPassengers(1);
    setScheduledDateTime('');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-black shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <a href="/"><span className="text-yellow-600 font-bold text-2xl">wayX</span></a>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-white hover:text-yellow-600 transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </header>
      

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-black rounded-full p-1">
            {[
              { id: 'create', label: 'Schedule Ride', icon: Car },
              { id: 'myRides', label: 'My Rides', icon: List },
              { id: 'accepted', label: 'Accepted', icon: CheckCircle }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center space-x-2 px-6 py-2 rounded-full transition-colors
                  ${activeTab === tab.id 
                    ? 'bg-yellow-600 text-black' 
                    : 'text-white hover:text-yellow-600'}
                `}
              >
                <tab.icon size={18} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        {activeTab === 'create' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white shadow-xl rounded-3xl overflow-hidden">
              <div className="bg-black px-8 py-6">
                <h2 className="text-2xl font-bold text-yellow-600">Schedule Your Ride</h2>
                <p className="text-white/60">Fill in the details below to book your next journey</p>
              </div>
              
              <form onSubmit={handleScheduleRide} className="p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="block font-medium text-black">Pickup Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-3 text-yellow-600" size={20} />
                      <input
                        type="text"
                        value={pickup}
                        onChange={(e) => setPickup(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border-2 border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600"
                        placeholder="Enter pickup address"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block font-medium text-black">Dropoff Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-3 text-yellow-600" size={20} />
                      <input
                        type="text"
                        value={dropoff}
                        onChange={(e) => setDropoff(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border-2 border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600"
                        placeholder="Enter destination address"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <label className="block font-medium text-black">Vehicle Type</label>
                    <div className="relative">
                      <Car className="absolute left-4 top-3 text-yellow-600" size={20} />
                      <select
                        value={vehicleType}
                        onChange={(e) => setVehicleType(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border-2 border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600 appearance-none"
                      >
                        <option value="car">Car</option>
                        <option value="van">Van</option>
                        <option value="bike">Bike</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block font-medium text-black">Passengers</label>
                    <div className="relative">
                      <Users className="absolute left-4 top-3 text-yellow-600" size={20} />
                      <input
                        type="number"
                        value={numPassengers}
                        onChange={(e) => setNumPassengers(e.target.value)}
                        min="1"
                        className="w-full pl-12 pr-4 py-3 bg-white border-2 border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block font-medium text-black">Schedule Time</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-3 text-yellow-600" size={20} />
                      <input
                        type="datetime-local"
                        value={scheduledDateTime}
                        onChange={(e) => setScheduledDateTime(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border-2 border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600"
                        required
                      />
                    </div>
                  </div>
                </div>

                {(error || successMessage) && (
                  <div className={`p-4 rounded-xl ${error ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                    {error || successMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-yellow-600 hover:bg-black text-white hover:text-black font-medium py-4 px-6 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2"
                >
                  {loading ? 'Scheduling...' : 'Schedule Ride'}
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'myRides' && (
          <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-3xl overflow-hidden">
            <div className="bg-black px-8 py-6">
              <h2 className="text-2xl font-bold text-yellow-600">My Rides</h2>
              <p className="text-white/60">View and manage your scheduled rides</p>
            </div>
            <div className="p-8">
              <CreatedRides />
            </div>
          </div>
        )}

        {activeTab === 'accepted' && (
          <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-3xl overflow-hidden">
            <div className="bg-black px-8 py-6">
              <h2 className="text-2xl font-bold text-yellow-600">Accepted Rides</h2>
              <p className="text-white/60">View rides you've accepted to drive</p>
            </div>
            <div className="p-8">
              <AcceptedRides />
            </div>
          </div>
        )}
      </div>
      < Footer />
    </div>
  );
};

export default UserPanel;