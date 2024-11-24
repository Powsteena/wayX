import React, { useEffect, useState } from 'react';
import { User, Shield, ShieldOff, UserPlus, UserMinus, Users } from 'lucide-react';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found, please log in.');
      
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action, userId) => {
    try {
      setError(null);
      setSuccessMessage('');
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found, please log in.');

      const response = await fetch(
        `http://localhost:5000/api/admin/user/${userId}/${action}`,
        {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const data = await response.json();
      setSuccessMessage(data.msg);
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const UserCard = ({ user }) => (
    <div className="bg-black border border-yellow-600/20 rounded-xl p-6 transition-all duration-300 hover:border-yellow-600">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-white mb-1">{user.username}</h3>
        <p className="text-gray-400 text-sm">{user.email}</p>
        <div className="flex gap-2 mt-3 flex-wrap">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            user.role === 'admin' 
              ? 'bg-yellow-600 text-black' 
              : 'bg-black text-yellow-600 border border-yellow-600'
          }`}>
            {user.role}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            user.isActive 
              ? 'bg-yellow-600 text-black' 
              : 'bg-black text-yellow-600 border border-yellow-600'
          }`}>
            {user.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => handleAction(user.isActive ? 'deactivate' : 'activate', user._id)}
          className={`flex items-center justify-center gap-2 flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            user.isActive 
              ? 'bg-black text-yellow-600 border border-yellow-600 hover:bg-yellow-600 hover:text-black' 
              : 'bg-yellow-600 text-black hover:bg-yellow-600'
          }`}
        >
          {user.isActive ? <UserMinus className="w-4 h-4" /> : <UserPlus className="w-2 h-4" />}
          {user.isActive ? 'Deactivate' : 'Activate'}
        </button>
        <button
          onClick={() => handleAction(user.role === 'admin' ? 'demote' : 'promote', user._id)}
          className={`flex items-center justify-center gap-2 flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            user.role === 'admin'
              ? 'bg-black text-yellow-600 border border-yellow-600 hover:bg-yellow-600 hover:text-black'
              : 'bg-black text-yellow-600 border border-yellow-500 hover:bg-yellow-600 hover:text-black'
          }`}
        >
          {user.role === 'admin' ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
          {user.role === 'admin' ? 'Demote' : 'Promote'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 bg-black border border-yellow-600/20 rounded-xl p-6">
        <Users className="w-8 h-8 text-yellow-600" />
        <h1 className="text-2xl font-bold text-white">Manage Users</h1>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-6 bg-black border border-yellow-600 rounded-lg p-4 text-yellow-600">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="mb-6 bg-black border border-yellow-600 rounded-lg p-4 text-yellow-600">
          {successMessage}
        </div>
      )}

      {/* Loading State */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-black border border-yellow-600/20 rounded-xl p-6 h-48" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <UserCard key={user._id} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
