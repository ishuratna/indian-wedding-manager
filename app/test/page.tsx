'use client';

import { useEffect, useState } from 'react';
import { db } from '../../lib/firebase/config';
import { collection, getDocs } from 'firebase/firestore';

export default function TestPage() {
  const [firebaseStatus, setFirebaseStatus] = useState('Testing...');

  useEffect(() => {
    const testFirebase = async () => {
      try {
        const testCollection = collection(db, 'test');
        await getDocs(testCollection);
        setFirebaseStatus('✅ Firebase Connected!');
      } catch (error: any) {
        setFirebaseStatus('❌ Firebase Error: ' + error.message);
      }
    };

    testFirebase();
  }, []);

  return (
    <div style={{ padding: 32 }}>
      <h1>Setup Test Page</h1>
      <p>{firebaseStatus}</p>
    </div>
  );
}
