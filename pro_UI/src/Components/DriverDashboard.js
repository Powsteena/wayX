// import React, { useState } from 'react';
// import MatchingRides from './MatchingRides';
// import CompletedRides from './CompletedRides';
// import Footer from './Footer';
// import Navbar from './Navbar';
// import { Car, CheckCircle, MapPin, Star } from 'lucide-react';

// const DriverPanel = () => {
//     const [activeTab, setActiveTab] = useState('matching');

//     return (
//         <div className="min-h-screen flex flex-col bg-black">
//             {/* Decorative Elements */}
//             <div className="absolute inset-0 overflow-hidden pointer-events-none">
//                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-600 via-yellow-600 to-yellow-600"></div>
//                 <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-yellow-600 opacity-10 blur-xl"></div>
//                 <div className="absolute top-40 right-20 w-40 h-40 rounded-full bg-yellow-600 opacity-10 blur-xl"></div>
                
//                 {/* Animated grid background */}
//                 <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
//             </div>

//             {/* Navbar with adjusted margin */}
//             <div className="relative z-50">
//                 <Navbar />
//             </div>
            
//             {/* Main content with padding-top to avoid navbar overlap */}
//             <div className="relative z-10 pt-16">
//                 {/* Inspiring Quote Section */}
//                 <div className="text-center mt-8 px-4">
//                     <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 inline-block">
//                         Every Mile Driven is a Story Written
//                     </h2>
//                     <p className="text-gray-400 mt-2 text-lg">Making every journey count, many rides at a time</p>
//                 </div>
                
//                 {/* Main Content */}
//                 <div className="container mx-auto px-4 md:px-6 py-8">
//                     {/* Feature Cards */}
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//                         <div className="bg-black p-6 rounded-xl border border-yellow-900 hover:border-yellow-600 transition-all duration-300 group">
//                             <Star className="h-8 w-8 text-yellow-600 mb-3 group-hover:rotate-12 transition-transform" />
//                             <h3 className="text-white text-lg font-semibold mb-2">Top-Rated Driver</h3>
//                             <p className="text-gray-400">Keep up your excellent service!</p>
//                         </div>
//                         <div className="bg-black p-6 rounded-xl border border-yellow-900 hover:border-yellow-600 transition-all duration-300 group">
//                             <MapPin className="h-8 w-8 text-yellow-600 mb-3 group-hover:rotate-12 transition-transform" />
//                             <h3 className="text-white text-lg font-semibold mb-2">Prime Location</h3>
//                             <p className="text-gray-400">You're in a high-demand area</p>
//                         </div>
//                         <div className="bg-black p-6 rounded-xl border border-yellow-900 hover:border-yellow-600 transition-all duration-300 group">
//                             <Car className="h-8 w-8 text-yellow-600 mb-3 group-hover:rotate-12 transition-transform" />
//                             <h3 className="text-white text-lg font-semibold mb-2">Ready to Roll</h3>
//                             <p className="text-gray-400">New opportunities await!</p>
//                         </div>
//                     </div>

//                     {/* Modern Tab Design */}
//                     <div className="flex justify-center space-x-4 mb-6">
//                         <button 
//                             className={`group relative py-4 px-8 text-lg font-semibold rounded-xl transition-all duration-300 
//                                 ${activeTab === 'matching' 
//                                     ? 'bg-yellow-600 text-black shadow-lg shadow-yellow-600/20' 
//                                     : 'bg-black border border-yellow-900 text-gray-300 hover:border-yellow-600'
//                                 }`}
//                             onClick={() => setActiveTab('matching')}
//                         >
//                             <div className="flex items-center space-x-3">
//                                 <Car className="h-5 w-5" />
//                                 <span>Available Rides</span>
//                             </div>
//                         </button>
                        
//                         <button 
//                             className={`group relative py-4 px-8 text-lg font-semibold rounded-xl transition-all duration-300 
//                                 ${activeTab === 'completed' 
//                                     ? 'bg-yellow-600 text-black shadow-lg shadow-yellow-600/20' 
//                                     : 'bg-black border border-yellow-900 text-gray-300 hover:border-yellow-600'
//                                 }`}
//                             onClick={() => setActiveTab('completed')}
//                         >
//                             <div className="flex items-center space-x-3">
//                                 <CheckCircle className="h-5 w-5" />
//                                 <span>Completed Rides</span>
//                             </div>
//                         </button>
//                     </div>

//                     {/* Content Area */}
//                     <div className="bg-black p-6 rounded-xl border border-yellow-900 shadow-xl">
//                         <div className="bg-black/50 rounded-lg p-4">
//                             {activeTab === 'matching' ? <MatchingRides /> : <CompletedRides />}
//                         </div>
//                     </div>
//                 </div>
//             </div>
            
//             <Footer />
//         </div>
//     );
// }

// export default DriverPanel;

import React, { useState } from 'react';
import MatchingRides from './MatchingRides';
import CompletedRides from './CompletedRides';
import Footer from './Footer';
import Navbar from './Navbar';
import { Car, CheckCircle, MapPin, Star } from 'lucide-react';

const DriverPanel = () => {
    const [activeTab, setActiveTab] = useState('matching');
    const [rideCount, setRideCount] = useState(0);

    const handleRideCountUpdate = (count) => {
        setRideCount(count);
    };

    return (
        <div className="min-h-screen flex flex-col bg-black">
            {/* Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-600 via-yellow-600 to-yellow-600"></div>
                <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-yellow-600 opacity-10 blur-xl"></div>
                <div className="absolute top-40 right-20 w-40 h-40 rounded-full bg-yellow-600 opacity-10 blur-xl"></div>
                
                {/* Animated grid background */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            </div>

            {/* Navbar with adjusted margin */}
            <div className="relative z-50">
                <Navbar />
            </div>
            
            {/* Main content with padding-top to avoid navbar overlap */}
            <div className="relative z-10 pt-16">
                {/* Inspiring Quote Section */}
                <div className="text-center mt-8 px-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 inline-block">
                        Every Mile Driven is a Story Written
                    </h2>
                    <p className="text-gray-400 mt-2 text-lg">Making every journey count, many rides at a time</p>
                </div>
                
                {/* Main Content */}
                <div className="container mx-auto px-4 md:px-6 py-8">
                    {/* Feature Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-black p-6 rounded-xl border border-yellow-900 hover:border-yellow-600 transition-all duration-300 group">
                            <Star className="h-8 w-8 text-yellow-600 mb-3 group-hover:rotate-12 transition-transform" />
                            <h3 className="text-white text-lg font-semibold mb-2">Top-Rated Driver</h3>
                            <p className="text-gray-400">Keep up your excellent service!</p>
                        </div>
                        <div className="bg-black p-6 rounded-xl border border-yellow-900 hover:border-yellow-600 transition-all duration-300 group">
                            <MapPin className="h-8 w-8 text-yellow-600 mb-3 group-hover:rotate-12 transition-transform" />
                            <h3 className="text-white text-lg font-semibold mb-2">Prime Location</h3>
                            <p className="text-gray-400">You're in a high-demand area</p>
                        </div>
                        <div className="bg-black p-6 rounded-xl border border-yellow-900 hover:border-yellow-600 transition-all duration-300 group">
                            <Car className="h-8 w-8 text-yellow-600 mb-3 group-hover:rotate-12 transition-transform" />
                            <h3 className="text-white text-lg font-semibold mb-2">Ready to Roll</h3>
                            <p className="text-gray-400">New opportunities await!</p>
                        </div>
                    </div>

                    {/* Modern Tab Design */}
                    <div className="flex justify-center space-x-4 mb-6">
                        <button 
                            className={`group relative py-4 px-8 text-lg font-semibold rounded-xl transition-all duration-300 
                                ${activeTab === 'matching' 
                                    ? 'bg-yellow-600 text-black shadow-lg shadow-yellow-600/20' 
                                    : 'bg-black border border-yellow-900 text-gray-300 hover:border-yellow-600'
                                }`}
                            onClick={() => setActiveTab('matching')}
                        >
                            <div className="flex items-center space-x-3">
                                <Car className="h-5 w-5" />
                                <span>Available Rides</span>
                                {rideCount > 0 && (
                                    <span className="ml-2 px-2 py-1 text-sm bg-black text-yellow-600 border border-yellow-600 rounded-full min-w-[1.5rem] flex items-center justify-center">
                                        {rideCount}
                                    </span>
                                )}
                            </div>
                        </button>
                        
                        <button 
                            className={`group relative py-4 px-8 text-lg font-semibold rounded-xl transition-all duration-300 
                                ${activeTab === 'completed' 
                                    ? 'bg-yellow-600 text-black shadow-lg shadow-yellow-600/20' 
                                    : 'bg-black border border-yellow-900 text-gray-300 hover:border-yellow-600'
                                }`}
                            onClick={() => setActiveTab('completed')}
                        >
                            <div className="flex items-center space-x-3">
                                <CheckCircle className="h-5 w-5" />
                                <span>Completed Rides</span>
                            </div>
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="bg-black p-6 rounded-xl border border-yellow-900 shadow-xl">
                        <div className="bg-black/50 rounded-lg p-4">
                            {activeTab === 'matching' ? (
                                <MatchingRides onRideCountChange={handleRideCountUpdate} />
                            ) : (
                                <CompletedRides />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
}

export default DriverPanel;