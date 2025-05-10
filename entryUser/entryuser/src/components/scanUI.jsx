import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';

const ScanUI = () => {
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [scannerKey, setScannerKey] = useState(0);

  const handleScan = (data) => {
    if (data) {
      setResult(data);
      compareResult(data);
      setError('');
      // Force scanner to re-render after 2 seconds
      setTimeout(() => {
        setResult('');
        setScannerKey(prev => prev + 1);
      }, 2000);
    }
  };

  const handleError = (err) => {
    setError('Error accessing camera, give allow perms');
    console.error(err);
  };

  const compareResult = (result) => {
      const ticketNumber = result[0].rawValue;
      fetch(`http://api.ticketexpert.me/api/events/${ticketNumber}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Invalid ticket');
          }
          return response.json();
        })
        .then(data => {
          alert('Ticket is valid: ' + ticketNumber);
        })
        .catch(error => {
          alert('Ticket is invalid: ' + ticketNumber);
        });
  };

  return (
    <div className="p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Ticket Scanner</h2>
        <div className="aspect-square">
          <Scanner
            key={scannerKey}
            onScan={handleScan}
            onError={handleError}
            constraints={{
              video: { facingMode: 'environment' }
            }}
            className="w-full h-full rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default ScanUI;
