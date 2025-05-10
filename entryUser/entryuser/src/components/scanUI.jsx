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

  const compareResult = async (result) => {
      const ticketNumber = result[0].rawValue;
      const response = await fetch(`https://api.ticketexpert.me/api/events/${ticketNumber}`);
      const data = await response.json();
      alert(data[0].title);
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
