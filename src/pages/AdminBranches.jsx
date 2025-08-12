// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { apiGet, apiPost, apiPut, apiDelete } from '../helpers/api';
// import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';

// // Fix Leaflet default icon issue
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
//   iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
// });

// // Custom red icon for branch marker
// const branchIcon = new L.Icon({
//   iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
//   iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41],
// });

// function AdminBranches() {
//   const [branches, setBranches] = useState([]);
//   const [formData, setFormData] = useState({ name: '', lat: '', lng: '', radius: '' });
//   const [editingId, setEditingId] = useState(null);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const lang = document.documentElement.getAttribute('lang') || 'ar';

//   const translations = {
//     en: {
//       manageBranches: 'Manage Branches',
//       attendanceMap: 'Attendance Map',
//       addBranch: 'Add Branch',
//       editBranch: 'Edit Branch',
//       branchName: 'Branch Name',
//       latitude: 'Latitude',
//       longitude: 'Longitude',
//       radius: 'Radius (m)',
//       actions: 'Actions',
//       update: 'Update',
//       cancel: 'Cancel',
//       branch: 'Branch',
//       user: 'User',
//       checkIn: 'Check-In',
//       checkOut: 'Check-Out',
//       noLocation: 'No valid location data for this branch',
//       noData: 'No valid attendance data available',
//       loading: 'Loading...',
//       branchLocation: 'Branch Location',
//       error: 'An error occurred',
//     },
//     ar: {
//       manageBranches: 'إدارة الفروع',
//       attendanceMap: 'خريطة الحضور',
//       addBranch: 'إضافة فرع',
//       editBranch: 'تعديل فرع',
//       branchName: 'اسم الفرع',
//       latitude: 'خط العرض',
//       longitude: 'خط الطول',
//       radius: 'النطاق (متر)',
//       actions: 'الإجراءات',
//       update: 'تحديث',
//       cancel: 'إلغاء',
//       branch: 'الفرع',
//       user: 'المستخدم',
//       checkIn: 'تسجيل الدخول',
//       checkOut: 'تسجيل الخروج',
//       noLocation: 'لا توجد بيانات موقع صالحة لهذا الفرع',
//       noData: 'لا توجد بيانات حضور صالحة متاحة',
//       loading: 'جارٍ التحميل...',
//       branchLocation: 'موقع الفرع',
//       error: 'حدث خطأ',
//     },
//   };

//   useEffect(() => {
//     const checkAdmin = async () => {
//       try {
//         const res = await apiGet('/auth/profile');
//         if (res.data.role !== 'admin') {
//           navigate('/dashboard');
//         } else {
//           fetchBranches();
//         }
//       } catch (err) { // eslint-disable-line no-unused-vars
//         navigate('/');
//       }
//     };
//     checkAdmin();
//   }, [navigate]);

//   const fetchBranches = async () => {
//     setLoading(true);
//     try {
//       const res = await apiGet('/admin/attendance');
//       console.log('Raw attendance data:', res.data); // Debug raw response
//       const filteredBranches = res.data
//         .filter(({ branch }) => {
//           const isValidBranch =
//             branch &&
//             branch.location &&
//             typeof branch.location.lat === 'number' &&
//             typeof branch.location.lng === 'number' &&
//             !isNaN(branch.location.lat) &&
//             !isNaN(branch.location.lng);
//           if (!isValidBranch) {
//             console.warn(`Branch ${branch?.name || 'unknown'} skipped due to invalid location:`, branch?.location);
//           }
//           return isValidBranch;
//         })
//         .map(({ branch, attendance, pagination }) => {
//           const validAttendance = Array.isArray(attendance)
//             ? attendance.filter(record => {
//                 const isValidRecord =
//                   record.user &&
//                   record.branch &&
//                   record.user.name &&
//                   record.branch.name &&
//                   record.locationIn &&
//                   typeof record.locationIn.lat === 'number' &&
//                   typeof record.locationIn.lng === 'number' &&
//                   !isNaN(record.locationIn.lat) &&
//                   !isNaN(record.locationIn.lng);
//                 if (!isValidRecord) {
//                   console.warn(`Invalid attendance record for branch ${branch.name}:`, record);
//                 }
//                 return isValidRecord;
//               })
//             : [];
//           return { branch, attendance: validAttendance, pagination };
//         });
//       console.log('Filtered branches:', filteredBranches); // Debug filtered data
//       setBranches(filteredBranches);
//       setLoading(false);
//     } catch (err) {
//       console.error('Error fetching branches:', err);
//       setError(err.response?.data?.message || translations[lang].error);
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleMapClick = (lat, lng) => {
//     setFormData({ ...formData, lat, lng });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const data = {
//         name: formData.name,
//         location: { lat: parseFloat(formData.lat), lng: parseFloat(formData.lng) },
//         radius: parseFloat(formData.radius),
//       };
//       if (editingId) {
//         await apiPut(`/branches/${editingId}`, data);
//         setSuccess(translations[lang].editBranch || 'Branch updated successfully');
//       } else {
//         await apiPost('/branches', data);
//         setSuccess(translations[lang].addBranch || 'Branch created successfully');
//       }
//       setFormData({ name: '', lat: '', lng: '', radius: '' });
//       setEditingId(null);
//       fetchBranches();
//       setError('');
//     } catch (err) { // eslint-disable-line no-unused-vars
//       setError(err.response?.data?.message || translations[lang].error);
//       setSuccess('');
//     }
//   };

//   const handleEdit = (branch) => {
//     setFormData({
//       name: branch.name,
//       lat: branch.location.lat,
//       lng: branch.location.lng,
//       radius: branch.radius,
//     });
//     setEditingId(branch._id);
//   };

//   const handleDelete = async (id) => {
//     try {
//       await apiDelete(`/branches/${id}`);
//       setSuccess(translations[lang].deleteBranch || 'Branch deleted successfully');
//       fetchBranches();
//       setError('');
//     } catch (err) { // eslint-disable-line no-unused-vars
//       setError(err.response?.data?.message || translations[lang].error);
//       setSuccess('');
//     }
//   };

//   const MapClickHandler = () => {
//     useMapEvents({
//       click(e) {
//         handleMapClick(e.latlng.lat, e.latlng.lng);
//       },
//     });
//     return formData.lat && formData.lng ? (
//       <Marker position={[formData.lat, formData.lng]} />
//     ) : null;
//   };

//   const defaultCenter = [30.0444, 31.2357]; // Fallback center (e.g., Cairo)

//   if (loading) return <div className="container mt-4">{translations[lang].loading}</div>;

//   return (
//     <div className="container mt-4">
//       <h2 className="mb-4">{translations[lang].manageBranches}</h2>
//       {error && <div className="alert alert-danger">{error}</div>}
//       {success && <div className="alert alert-success">{success}</div>}

//       <div className="card mb-4">
//         <div className="card-body">
//           <h3 className="card-title">{editingId ? translations[lang].editBranch : translations[lang].addBranch}</h3>
//           <form onSubmit={handleSubmit}>
//             <div className="mb-3">
//               <label className="form-label">{translations[lang].branchName}</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 className="form-control"
//                 required
//               />
//             </div>
//             <div className="mb-3">
//               <label className="form-label">{translations[lang].latitude}</label>
//               <input
//                 type="number"
//                 name="lat"
//                 value={formData.lat}
//                 onChange={handleInputChange}
//                 className="form-control"
//                 step="any"
//                 required
//               />
//             </div>
//             <div className="mb-3">
//               <label className="form-label">{translations[lang].longitude}</label>
//               <input
//                 type="number"
//                 name="lng"
//                 value={formData.lng}
//                 onChange={handleInputChange}
//                 className="form-control"
//                 step="any"
//                 required
//               />
//             </div>
//             <div className="mb-3">
//               <label className="form-label">{translations[lang].radius}</label>
//               <input
//                 type="number"
//                 name="radius"
//                 value={formData.radius}
//                 onChange={handleInputChange}
//                 className="form-control"
//                 required
//               />
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Select Location on Map</label>
//               <MapContainer center={[30.0444, 31.2357]} zoom={13} style={{ height: '400px', width: '100%' }}>
//                 <TileLayer
//                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                   attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                 />
//                 <MapClickHandler />
//               </MapContainer>
//             </div>
//             <button type="submit" className="btn btn-primary">
//               {editingId ? translations[lang].update : translations[lang].addBranch}
//             </button>
//             {editingId && (
//               <button
//                 type="button"
//                 className="btn btn-secondary ms-2"
//                 onClick={() => {
//                   setFormData({ name: '', lat: '', lng: '', radius: '' });
//                   setEditingId(null);
//                 }}
//               >
//                 {translations[lang].cancel}
//               </button>
//             )}
//           </form>
//         </div>
//       </div>

//       <h2 className="mb-4">{translations[lang].attendanceMap}</h2>
//       {branches.length === 0 && !error && (
//         <div className="alert alert-warning">{translations[lang].noData}</div>
//       )}
//       {branches.map(({ branch, attendance }, index) => (
//         <div key={branch._id} className="card mb-4">
//           <div className="card-body">
//             <h3 className="card-title">{translations[lang].branch}: {branch.name}</h3>
//             <div className="mb-3">
//               <button
//                 className="btn btn-warning btn-sm me-2"
//                 onClick={() => handleEdit(branch)}
//               >
//                 Edit
//               </button>
//               <button
//                 className="btn btn-danger btn-sm"
//                 onClick={() => handleDelete(branch._id)}
//               >
//                 Delete
//               </button>
//             </div>
//             {branch.location && typeof branch.location.lat === 'number' && typeof branch.location.lng === 'number' ? (
//               <MapContainer
//                 key={`map-${branch._id}-${index}`}
//                 center={[branch.location.lat, branch.location.lng]}
//                 zoom={13}
//                 style={{ height: '400px', width: '100%', zIndex: 1 }}
//                 id={`map-${branch._id}`}
//               >
//                 <TileLayer
//                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                   attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                 />
//                 {/* Branch location marker */}
//                 <Marker
//                   position={[branch.location.lat, branch.location.lng]}
//                   icon={branchIcon}
//                 >
//                   <Popup>
//                     {translations[lang].branchLocation}: {branch.name}
//                   </Popup>
//                 </Marker>
//                 {attendance.length === 0 ? (
//                   <div className="alert alert-warning">{translations[lang].noData}</div>
//                 ) : (
//                   attendance.map(record => (
//                     <Marker
//                       key={record._id}
//                       position={[record.locationIn.lat, record.locationIn.lng]}
//                     >
//                       <Popup>
//                         {translations[lang].user}: {record.user.name}<br />
//                         {translations[lang].checkIn}: {new Date(record.checkInTime).toLocaleString()}<br />
//                         {record.checkOutTime && (
//                           <>
//                             {translations[lang].checkOut}: {new Date(record.checkOutTime).toLocaleString()}
//                           </>
//                         )}
//                       </Popup>
//                     </Marker>
//                   ))
//                 )}
//               </MapContainer>
//             ) : (
//               <MapContainer
//                 key={`map-fallback-${branch._id}-${index}`}
//                 center={defaultCenter}
//                 zoom={13}
//                 style={{ height: '400px', width: '100%', zIndex: 1 }}
//                 id={`map-fallback-${branch._id}`}
//               >
//                 <TileLayer
//                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                   attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                 />
//                 <div className="alert alert-warning">{translations[lang].noLocation}</div>
//               </MapContainer>
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default AdminBranches;
import React from 'react';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet, apiPost, apiPut, apiDelete } from '../helpers/api';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

// Custom red icon for branch marker
const branchIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// New: Custom green icon for check-in
const checkInIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// New: Custom blue icon for check-out
const checkOutIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function AdminBranches() {
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({ name: '', lat: '', lng: '', radius: '', allowedIPs: [] });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState({});
  const navigate = useNavigate();
  const lang = document.documentElement.getAttribute('lang') || 'ar';

  const translations = {
    en: {
      manageBranches: 'Manage Branches',
      attendanceMap: 'Attendance Map',
      addBranch: 'Add Branch',
      editBranch: 'Edit Branch',
      branchName: 'Branch Name',
      latitude: 'Latitude',
      longitude: 'Longitude',
      radius: 'Radius (m)',
      allowedIPs: 'Allowed IPs (comma-separated)',
      actions: 'Actions',
      update: 'Update',
      cancel: 'Cancel',
      branch: 'Branch',
      user: 'User',
      checkIn: 'Check-In',
      checkOut: 'Check-Out',
      noLocation: 'No valid location data for this branch',
      noData: 'No valid attendance data available',
      loading: 'Loading...',
      branchLocation: 'Branch Location',
      error: 'An error occurred',
      toggleEmergency: 'Toggle Emergency Mode',
      emergencyOn: 'Emergency On',
      emergencyOff: 'Emergency Off',
    },
    ar: {
      manageBranches: 'إدارة الفروع',
      attendanceMap: 'خريطة الحضور',
      addBranch: 'إضافة فرع',
      editBranch: 'تعديل فرع',
      branchName: 'اسم الفرع',
      latitude: 'خط العرض',
      longitude: 'خط الطول',
      radius: 'النطاق (متر)',
      allowedIPs: 'عناوين IP المسموحة (مفصولة بفاصلة)',
      actions: 'الإجراءات',
      update: 'تحديث',
      cancel: 'إلغاء',
      branch: 'الفرع',
      user: 'المستخدم',
      checkIn: 'تسجيل الدخول',
      checkOut: 'تسجيل الخروج',
      noLocation: 'لا توجد بيانات موقع صالحة لهذا الفرع',
      noData: 'لا توجد بيانات حضور صالحة',
      loading: 'جاري التحميل...',
      branchLocation: 'موقع الفرع',
      error: 'حدث خطأ',
      toggleEmergency: 'تبديل وضع الطوارئ',
      emergencyOn: 'طوارئ مفعل',
      emergencyOff: 'طوارئ معطل',
    },
  };

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await apiGet('/branches');
        setBranches(res.data);
      } catch (err) {
        setError(translations[lang].error);
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
  }, [lang]);

  useEffect(() => {
    const fetchAttendanceForAllBranches = async () => {
      const newAttendanceData = {};
      for (const branch of branches) {
        try {
          const res = await apiGet(`/admin/attendance?branch=${branch._id}`);
          newAttendanceData[branch._id] = res.data[0]?.attendance || [];
        } catch (err) {
          console.error(`Error fetching attendance for branch ${branch._id}:`, err);
        }
      }
      setAttendanceData(newAttendanceData);
    };
    if (branches.length > 0) {
      fetchAttendanceForAllBranches();
    }
  }, [branches]);

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');

  // ضمان أن allowedIPs دايمًا String قبل التحويل
  const allowedIPsString = String(formData.allowedIPs || '');
  const allowedIPsArray = allowedIPsString
    .split(',')
    .map(ip => ip.trim())
    .filter(ip => ip.length > 0);

  const dataToSend = {
    ...formData,
    location: {
      lat: parseFloat(formData.lat) || 0,
      lng: parseFloat(formData.lng) || 0
    },
    radius: parseFloat(formData.radius) || 0,
    allowedIPs: allowedIPsArray,
  };

  try {
    if (editingId) {
      const res = await apiPut(`/branches/${editingId}`, dataToSend);
      setBranches(branches.map((b) => (b._id === editingId ? res.data : b)));
      setSuccess('تم تحديث الفرع');
    } else {
      const res = await apiPost('/branches', dataToSend);
      setBranches([...branches, res.data]);
      setSuccess('تم إنشاء الفرع');
    }

    // إعادة تعيين الحقول
    setFormData({
      name: '',
      lat: '',
      lng: '',
      radius: '',
      allowedIPs: ''
    });
    setEditingId(null);

  } catch (err) {
    setError(err.response?.data?.message || translations[lang].error);
  }
};


  const handleEdit = (branch) => {
    setFormData({
      name: branch.name,
      lat: branch.location.lat,
      lng: branch.location.lng,
      radius: branch.radius,
      allowedIPs: branch.allowedIPs?.join(',') || '',
    });
    setEditingId(branch._id);
  };

  const handleDelete = async (id) => {
    try {
      await apiDelete(`/branches/${id}`);
      setBranches(branches.filter((b) => b._id !== id));
      setSuccess('تم حذف الفرع');
    } catch (err) {
      setError(err.response?.data?.message || translations[lang].error);
    }
  };

  const handleToggleEmergency = async (branchId, allowRemote) => {
    try {
      await apiPost('/attendance/toggle-emergency', { branchId, allowRemote });
      setBranches(branches.map(b => b._id === branchId ? { ...b, allowRemoteCheckin: allowRemote } : b));
      setSuccess(`تم ${allowRemote ? 'تفعيل' : 'تعطيل'} وضع الطوارئ`);
    } catch (err) {
      setError(err.response?.data?.message || translations[lang].error);
    }
  };

  const LocationMarker = ({ onLocationSelect }) => {
    useMapEvents({
      click(e) {
        onLocationSelect(e.latlng);
      },
    });
    return null;
  };

  const handleMapClick = (latlng) => {
    setFormData({ ...formData, lat: latlng.lat.toFixed(6), lng: latlng.lng.toFixed(6) });
  };

  if (loading) {
    return <div>{translations[lang].loading}</div>;
  }

  return (
    <div className="container mt-4">
      <h2>{translations[lang].manageBranches}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label className="form-label">{translations[lang].branchName}</label>
          <input
            type="text"
            className="form-control"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">{translations[lang].latitude}</label>
          <input
            type="number"
            className="form-control"
            value={formData.lat}
            onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
            required
            step="any"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">{translations[lang].longitude}</label>
          <input
            type="number"
            className="form-control"
            value={formData.lng}
            onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
            required
            step="any"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">{translations[lang].radius}</label>
          <input
            type="number"
            className="form-control"
            value={formData.radius}
            onChange={(e) => setFormData({ ...formData, radius: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">{translations[lang].allowedIPs}</label>
          <input
            type="text"
            className="form-control"
            value={formData.allowedIPs}
            onChange={(e) => setFormData({ ...formData, allowedIPs: e.target.value })}
            placeholder="192.168.1.1, 192.168.1.2"
          />
        </div>
        <div className="mb-3">
          <MapContainer center={[24.7136, 46.6753]} zoom={10} style={{ height: '300px', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationMarker onLocationSelect={handleMapClick} />
            {formData.lat && formData.lng && (
              <Marker position={[formData.lat, formData.lng]} icon={branchIcon}>
                <Popup>Selected Location</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
        <button type="submit" className="btn btn-primary">
          {editingId ? translations[lang].update : translations[lang].addBranch}
        </button>
        {editingId && (
          <button type="button" className="btn btn-secondary ms-2" onClick={() => setEditingId(null)}>
            {translations[lang].cancel}
          </button>
        )}
      </form>

      <table className="table table-striped mb-4">
        <thead>
          <tr>
            <th>{translations[lang].branchName}</th>
            <th>{translations[lang].latitude}</th>
            <th>{translations[lang].longitude}</th>
            <th>{translations[lang].radius}</th>
            <th>{translations[lang].allowedIPs}</th>
            <th>{translations[lang].actions}</th>
          </tr>
        </thead>
        <tbody>
          {branches.map((branch) => (
            <tr key={branch._id}>
              <td>{branch.name}</td>
              <td>{branch.location.lat}</td>
              <td>{branch.location.lng}</td>
              <td>{branch.radius}</td>
              <td>{branch.allowedIPs?.join(', ') || 'None'}</td>
              <td>
                <button className="btn btn-sm btn-info me-1" onClick={() => handleEdit(branch)}>
                  {translations[lang].editBranch}
                </button>
                <button className="btn btn-sm btn-danger me-1" onClick={() => handleDelete(branch._id)}>
                  Delete
                </button>
                <button
                  className={`btn btn-sm ${branch.allowRemoteCheckin ? 'btn-warning' : 'btn-success'}`}
                  onClick={() => handleToggleEmergency(branch._id, !branch.allowRemoteCheckin)}
                >
                  {branch.allowRemoteCheckin ? translations[lang].emergencyOn : translations[lang].emergencyOff}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    <h2>{translations[lang].attendanceMap}</h2>
{branches.map((branch, index) => {
  const attendance = attendanceData[branch._id] || [];
  const defaultCenter = [24.7136, 46.6753]; // Riyadh coordinates as fallback

  return (
    <div key={branch._id} className="mb-5">
      <div className="card">
        <div className="card-body">
          <h3 className="card-title">{branch.name} - {translations[lang].attendanceMap}</h3>
        </div>
        {branch.location && typeof branch.location.lat === 'number' && typeof branch.location.lng === 'number' ? (
          <MapContainer
            key={`map-${branch._id}-${index}`}
            center={[branch.location.lat, branch.location.lng]}
            zoom={13}
            style={{ height: '400px', width: '100%', zIndex: 1 }}
            id={`map-${branch._id}`}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* Branch location marker */}
            <Marker
              position={[branch.location.lat, branch.location.lng]}
              icon={branchIcon}
            >
              <Popup>
                {translations[lang].branchLocation}: {branch.name}
              </Popup>
            </Marker>

            {attendance.length === 0 ? (
              <div className="alert alert-warning">{translations[lang].noData}</div>
            ) : (
              attendance.map(record => (
                <React.Fragment key={record._id}>
                  {/* Check-In marker */}
                  {record.locationIn && (
                    <Marker
                      position={[record.locationIn.lat, record.locationIn.lng]}
                      icon={checkInIcon}
                    >
                      <Popup>
                        {translations[lang].user}: {record.user?.name || 'Unknown'}<br />
                        {translations[lang].checkIn}: {record.checkInTime ? new Date(record.checkInTime).toLocaleString() : 'N/A'}<br />
                        {record.lateMinutes > 0 && `Late: ${record.lateMinutes} minutes`}
                      </Popup>
                    </Marker>
                  )}

                  {/* Check-Out marker */}
                  {record.locationOut && (
                    <Marker
                      position={[record.locationOut.lat, record.locationOut.lng]}
                      icon={checkOutIcon}
                    >
                      <Popup>
                        {translations[lang].user}: {record.user?.name || 'Unknown'}<br />
                        {translations[lang].checkOut}: {record.checkOutTime ? new Date(record.checkOutTime).toLocaleString() : 'N/A'}<br />
                        {record.earlyLeaveMinutes > 0 && `Early Leave: ${record.earlyLeaveMinutes} minutes`}
                      </Popup>
                    </Marker>
                  )}
                </React.Fragment>
              ))
            )}
          </MapContainer>
        ) : (
          <MapContainer
            key={`map-fallback-${branch._id}-${index}`}
            center={defaultCenter}
            zoom={13}
            style={{ height: '400px', width: '100%', zIndex: 1 }}
            id={`map-fallback-${branch._id}`}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <div className="alert alert-warning">{translations[lang].noLocation}</div>
          </MapContainer>
        )}
      </div>
    </div>
  );
})}

    </div>
  );
}

export default AdminBranches;