import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';

const ScanUI = () => {
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleScan = (data) => {
    if (data) {
      setResult(data);
      compareResult(data);
      setError('');
      setShowResult(true);
    }
  };

  const handleError = (err) => {
    setError('Error accessing camera, give allow perms');
    console.error(err);
  };

  const handleScanNext = async (userId, ticketId) => {
    try {
      const response = await fetch(`https://api.ticketexpert.me/api/tickets/${ticketId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, status: 'scanned' })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Ticket status updated:', data);
      window.location.reload();
    } catch (error) {
      console.error('Error updating ticket status:', error);
      setError('Error updating ticket status: ' + error.message);
    }
  };

  const compareResult = async (result) => {
    try {
      console.log(result[0].rawValue);
      const ticketNumber = result[0].rawValue;
      const response = await fetch(`https://api.ticketexpert.me/api/tickets/${ticketNumber}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      setResult({
        ticketNumber: data.ticketId,
        eventId: data.eventId,
        locationDetails: data.locationDetails,
        userId: data.userId,
        status: data.ticketStatus
      });
    } catch (error) {
      console.error('Error fetching ticket data:', error);
      setError('Error fetching ticket data: ' + error.message);
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Ticket Scanner</h2>
        {!showResult ? (
          <div className="aspect-square">
            <Scanner
              onScan={handleScan}
              onError={handleError}
              constraints={{
                video: { facingMode: 'environment' }
              }}
              className="w-full h-full rounded-lg"
            />
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-4 p-4 bg-gray-100 rounded-lg">
              <h3 className="font-semibold mb-2">Scan Result:</h3>
              <p className="break-all">Ticket Number: {result.ticketNumber}</p>
              <p className="break-all">Event ID: {result.eventId}</p>
              <p className="break-all">Location Details: {JSON.stringify(result.locationDetails)}</p>
              <p className={`break-all ${result.status === 'scanned' ? 'text-red-500' : 'text-green-500'}`}>Status: {result.status}</p>
            </div>
            <button
              onClick={() => handleScanNext(result.userId, result.ticketNumber)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Scan Next
            </button>
          </div>
        )}
        {error && (
          <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanUI;