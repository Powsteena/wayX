// ConfirmationDialog.js
import React from 'react';

const DriverConfirm = ({ onConfirm, onCancel, request }) => (
  <div className="confirmation-dialog bg-white p-6 rounded-lg shadow-2xl fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1050] w-full max-w-md">
    <h3 className="text-xl font-semibold text-center mb-4">Confirm Ride Acceptance</h3>
    <div className="request-details space-y-2">
      <p className="text-gray-800">
        <strong>Pickup Location:</strong> {request.pickup.address}
      </p>
      <p className="text-gray-800">
        <strong>Dropoff Location:</strong> {request.dropoff.address}
      </p>
      <p className="text-gray-800">
        <strong>User Name:</strong> {request.userName}
      </p>
      <p className="text-gray-800">
        <strong>User Email:</strong> {request.userEmail}
      </p>
    </div>
    <div className="button-group flex justify-center space-x-4 mt-6">
      <button onClick={onConfirm} className="bg-green-600 text-white px-4 py-2 rounded shadow-md hover:bg-green-700 transition duration-150">
        Confirm
      </button>
      <button onClick={onCancel} className="bg-red-600 text-white px-4 py-2 rounded shadow-md hover:bg-red-700 transition duration-150">
        Cancel
      </button>
    </div>
  </div>
);

export default DriverConfirm;