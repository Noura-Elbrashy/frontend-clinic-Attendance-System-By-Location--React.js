
// import { useState } from 'react';
// import { apiPost } from '../helpers/api';

// function Attendance() {
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const lang = document.documentElement.getAttribute('lang') || 'ar';

//   const translations = {
//     en: {
//       attendance: 'Attendance',
//       checkIn: 'Check In',
//       checkOut: 'Check Out',
//       checkInSuccess: 'Check-in successful',
//       checkOutSuccess: 'Check-out successful',
//       error: 'An error occurred',
//     },
//     ar: {
//       attendance: 'الحضور',
//       checkIn: 'تسجيل الدخول',
//       checkOut: 'تسجيل الخروج',
//       checkInSuccess: 'تسجيل الدخول ناجح',
//       checkOutSuccess: 'تسجيل الخروج ناجح',
//       error: 'حدث خطأ',
//     },
//   };

//   const getLocation = () => {
//     return new Promise((resolve, reject) => {
//       if (!navigator.geolocation) {
//         reject(new Error('Geolocation is not supported by your browser'));
//       }
//       navigator.geolocation.getCurrentPosition(
//         (position) => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
//         (err) => reject(err),
//         { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
//       );
//     });
//   };

//   const handleCheckIn = async () => {
//     try {
//       const { lat, lng } = await getLocation();
//       await apiPost('/attendance/checkin', { lat, lng }); 
//       setSuccess(translations[lang].checkInSuccess);
//       setError('');
//     } catch (err) { 
//       setError(err.response?.data?.message || translations[lang].error);
//       setSuccess('');
//     }
//   };

//   const handleCheckOut = async () => {
//     try {
//       const { lat, lng } = await getLocation();
//       await apiPost('/attendance/checkout', { lat, lng }); 
//       setSuccess(translations[lang].checkOutSuccess);
//       setError('');
//       } catch (err) { 
//       setError(err.response?.data?.message || translations[lang].error);
//       setSuccess('');
//     }
//   };

//   return (
//     <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
//       <div className="card shadow p-4" style={{ maxWidth: '400px', width: '100%' }}>
//         <h2 className="card-title text-center mb-4">{translations[lang].attendance}</h2>
//         {error && <div className="alert alert-danger">{error}</div>}
//         {success && <div className="alert alert-success">{success}</div>}
//         <button
//           onClick={handleCheckIn}
//           className="btn btn-success w-100 mb-3"
//         >
//           {translations[lang].checkIn}
//         </button>
//         <button
//           onClick={handleCheckOut}
//           className="btn btn-danger w-100"
//         >
//           {translations[lang].checkOut}
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Attendance;

import { useState, useEffect } from 'react';
import { apiPost, apiGet } from '../helpers/api';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import logo from '../assets/logo.png'; // افترضي المسار الصحيح للصورة

function Attendance() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [deviceFingerprint, setDeviceFingerprint] = useState('');
  const [supportsBiometrics, setSupportsBiometrics] = useState(false);
  const lang = document.documentElement.getAttribute('lang') || 'ar';

  const translations = {
    en: {
      attendance: 'Attendance',
      checkIn: 'Check In',
      checkOut: 'Check Out',
      checkInSuccess: 'Check-in successful',
      checkOutSuccess: 'Check-out successful',
      selectBranch: 'Select Branch',
      biometricsPrompt: 'Biometric Authentication',
      error: 'An error occurred',
      recordAbsence: 'Record Absence',
      noData: 'No data available'
    },
    ar: {
      attendance: 'الحضور',
      checkIn: 'تسجيل الدخول',
      checkOut: 'تسجيل الخروج',
      checkInSuccess: 'تسجيل الدخول ناجح',
      checkOutSuccess: 'تسجيل الخروج ناجح',
      selectBranch: 'اختر الفرع',
      biometricsPrompt: 'التحقق البيومتري',
      error: 'حدث خطأ',
      recordAbsence: 'تسجيل الغياب عن بعد',
      noData: 'لا توجد بيانات'
    },
  };

  useEffect(() => {
    // جلب الفروع
    const fetchBranches = async () => {
      try {
        const res = await apiGet('/branches');
        setBranches(res.data);
      } catch (err) {
        setError(translations[lang].error);
      }
    };
    fetchBranches();

    // توليد deviceFingerprint
    const loadFingerprint = async () => {
      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        setDeviceFingerprint(result.visitorId);
      } catch (err) {
        setError(translations[lang].error);
      }
    };
    loadFingerprint();

    // التحقق من دعم البيوميتريكس
    setSupportsBiometrics('PublicKeyCredential' in window);
  }, [lang]);

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
      }
      navigator.geolocation.getCurrentPosition(
        (position) => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  };

  const handleCheckIn = async () => {
    if (!selectedBranch || !deviceFingerprint) {
      setError(translations[lang].error);
      return;
    }
    try {
      const { lat, lng } = await getLocation();
      await apiPost('/attendance/checkin', { lat, lng, branchId: selectedBranch, deviceFingerprint });
      setSuccess(translations[lang].checkInSuccess);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || translations[lang].error);
      setSuccess('');
    }
  };

  const handleCheckOut = async () => {
    if (!selectedBranch || !deviceFingerprint) {
      setError(translations[lang].error);
      return;
    }
    try {
      const { lat, lng } = await getLocation();
      await apiPost('/attendance/checkout', { lat, lng, branchId: selectedBranch, deviceFingerprint });
      setSuccess(translations[lang].checkOutSuccess);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || translations[lang].error);
      setSuccess('');
    }
  };

  const handleRecordAbsence = async () => {
    if (!selectedBranch || !deviceFingerprint) {
      setError(translations[lang].error);
      return;
    }
    try {
      const { lat, lng } = await getLocation();
      await apiPost('/attendance/recordAbsence', { lat, lng, branchId: selectedBranch, deviceFingerprint });
      setSuccess(translations[lang].recordAbsence + ' ناجح');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || translations[lang].error);
      setSuccess('');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card shadow p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <img src={logo} alt="RAN Clinic Logo" className="logo-img rounded-circle shadow-sm" style={{ width: '4rem' }} />
        <h2 className="card-title text-center mb-4">{translations[lang].attendance}</h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="mb-3">
          <label className="form-label">{translations[lang].selectBranch}</label>
          <select
            className="form-select"
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
          >
            <option value="">{translations[lang].selectBranch}</option>
            {branches.map(branch => (
              <option key={branch._id} value={branch._id}>{branch.name}</option>
            ))}
          </select>
        </div>

        {supportsBiometrics && (
          <div className="mb-3">
            <label className="form-label">{translations[lang].biometricsPrompt}</label>
            <input type="checkbox" disabled checked />
          </div>
        )}

        <button
          onClick={handleCheckIn}
          className="btn btn-success w-100 mb-3"
          disabled={!selectedBranch || !deviceFingerprint}
        >
          <i className="fas fa-sign-in-alt me-2"></i> {translations[lang].checkIn}
        </button>

        <button
          onClick={handleCheckOut}
          className="btn btn-danger w-100 mb-3"
          disabled={!selectedBranch || !deviceFingerprint}
        >
          <i className="fas fa-sign-out-alt me-2"></i> {translations[lang].checkOut}
        </button>

        <button
          onClick={handleRecordAbsence}
          className="btn btn-warning w-100"
          disabled={!selectedBranch || !deviceFingerprint}
        >
          <i className="fas fa-user-times me-2"></i> {translations[lang].recordAbsence}
        </button>
      </div>
    </div>
  );
}

export default Attendance;