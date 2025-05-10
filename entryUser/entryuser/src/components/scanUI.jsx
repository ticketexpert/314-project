import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';

const ScanUI = () => {
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleScan = (data) => {
    if (data) {
      setResult(data);
      compareResult(data);
      setError('');
      // Reset the result after 2 seconds to start scanning again
      setTimeout(() => {
        setResult('');
      }, 2000);
    }
  };

  const handleError = (err) => {
    setError('Error accessing camera, give allow perms');
    console.error(err);
  };

  const compareResult = (result) => {
    if (result[0].rawValue === '1201') {
      alert('Ticket is valid: ' + result[0].rawValue);
    } else {
      alert('Ticket is invalid: ' + result[0].rawValue);
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Ticket Scanner</h2>
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
      </div>
    </div>
  );
};

export default ScanUI;
