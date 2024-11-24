import React, { useState, useEffect } from 'react';
import { 
  Car, 
  User, 
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  FileText,
  Phone,
  Mail
} from 'lucide-react';

function ManageDrivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found, please log in.');
      }

      const response = await fetch('http://localhost:5000/api/admin/driver', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setDrivers(data);
    } catch (err) {
      console.error('Error fetching drivers:', err);
      setError(err.response?.data?.msg || err.message || 'Error fetching drivers');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action, driverId) => {
    try {
      setError(null);
      setSuccessMessage('');
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found, please log in.');
      }

      const url = action === 'delete'
        ? `http://localhost:5000/api/admin/driver/${driverId}`
        : `http://localhost:5000/api/admin/driver/${driverId}/${action}`;

      const response = await fetch(url, {
        method: action === 'delete' ? 'DELETE' : 'PATCH',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      setSuccessMessage(data.msg);
      fetchDrivers();
    } catch (err) {
      console.error(`Error performing ${action}:`, err);
      setError(err.response?.data?.msg || err.message || `Error performing ${action}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Loader2 className="animate-spin text-yellow-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black/70 p-6">
      <div className="max-w-7xl mx-auto bg-black border border-yellow-600 rounded-lg shadow-lg overflow-hidden">
        <div className="border-b border-yellow-600 p-6">
          <h1 className="text-white text-2xl font-bold flex items-center gap-2">
            <Car size={24} /> Manage Drivers
          </h1>
        </div>

        <div className="p-6">
          {error && (
            <div className="border border-yellow-600 text-white p-4 mb-4 rounded">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="border border-yellow-600 text-white p-4 mb-4 rounded">
              {successMessage}
            </div>
          )}

          <div className="overflow-x-auto">
            <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-yellow-600 scrollbar-track-black">
              <table className="min-w-full">
                <thead className="border-b border-yellow-600 sticky top-0 bg-black z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-bold text-white">Driver Info</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-white">Vehicle Details</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-white">Documents</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-white">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-white">Registration Date</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-white">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-yellow-600/30">
                  {drivers.length > 0 ? (
                    drivers.map((driver) => (
                      <tr 
                        key={driver._id} 
                        className="hover:bg-yellow-600/5 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="space-y-2 text-white">
                            <div className="flex items-center gap-2">
                              <User size={16} />
                              {driver.username}
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail size={16} />
                              {driver.email}
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone size={16} />
                              {driver.phoneNumber}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-white">
                            <Car size={16} />
                            <div>
                              <div>Type: {driver.vehicleType}</div>
                              <div>Number: {driver.vehicleNumber}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-white cursor-pointer hover:text-yellow-600">
                              <FileText size={16} />
                              License
                            </div>
                            <div className="flex items-center gap-2 text-white cursor-pointer hover:text-yellow-600">
                              <FileText size={16} />
                              Registration
                            </div>
                            <div className="flex items-center gap-2 text-white cursor-pointer hover:text-yellow-600">
                              <FileText size={16} />
                              Insurance
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              {driver.isApproved ? 
                                <CheckCircle className="text-yellow-600" size={16} /> : 
                                <AlertCircle className="text-yellow-600" size={16} />
                              }
                              <span className="text-white">
                                {driver.isApproved ? 'Approved' : 'Pending'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {driver.hasPaid ? 
                                <CheckCircle className="text-yellow-600" size={16} /> : 
                                <XCircle className="text-yellow-600" size={16} />
                              }
                              <span className="text-white">
                                {driver.hasPaid ? 'Paid' : 'Unpaid'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-white">
                            <Calendar size={16} />
                            {new Date(driver.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-2">
                            <button
                              className="px-4 py-2 border border-yellow-600 text-white rounded hover:bg-yellow-600 hover:text-black transition-colors"
                              onClick={() => handleAction(driver.isApproved ? 'reject' : 'approve', driver._id)}
                            >
                              {driver.isApproved ? 'Reject' : 'Approve'}
                            </button>
                            <button
                              className="px-4 py-2 border border-yellow-600 text-white rounded hover:bg-yellow-600 hover:text-black transition-colors"
                              onClick={() => handleAction('delete', driver._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-yellow-600">
                        No drivers found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageDrivers;