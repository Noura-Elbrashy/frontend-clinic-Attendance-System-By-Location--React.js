

// import React from 'react';

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

// // New: Custom green icon for check-in
// const checkInIcon = new L.Icon({
//   iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
//   iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41],
// });

// // New: Custom blue icon for check-out
// const checkOutIcon = new L.Icon({
//   iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
//   iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41],
// });

// function AdminBranches() {
//   const [branches, setBranches] = useState([]);
//   const [formData, setFormData] = useState({ name: '', lat: '', lng: '', radius: '', allowedIPs: [] });
//   const [editingId, setEditingId] = useState(null);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [attendanceData, setAttendanceData] = useState({});
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
//       allowedIPs: 'Allowed IPs (comma-separated)',
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
//       toggleEmergency: 'Toggle Emergency Mode',
//       emergencyOn: 'Emergency On',
//       emergencyOff: 'Emergency Off',
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
//       allowedIPs: 'عناوين IP المسموحة (مفصولة بفاصلة)',
//       actions: 'الإجراءات',
//       update: 'تحديث',
//       cancel: 'إلغاء',
//       branch: 'الفرع',
//       user: 'المستخدم',
//       checkIn: 'تسجيل الدخول',
//       checkOut: 'تسجيل الخروج',
//       noLocation: 'لا توجد بيانات موقع صالحة لهذا الفرع',
//       noData: 'لا توجد بيانات حضور صالحة',
//       loading: 'جاري التحميل...',
//       branchLocation: 'موقع الفرع',
//       error: 'حدث خطأ',
//       toggleEmergency: 'تبديل وضع الطوارئ',
//       emergencyOn: 'طوارئ مفعل',
//       emergencyOff: 'طوارئ معطل',
//     },
//   };

//   useEffect(() => {
//     const fetchBranches = async () => {
//       try {
//         const res = await apiGet('/branches');
//         setBranches(res.data);
//       } catch (err) {
//         setError(translations[lang].error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBranches();
//   }, [lang]);

//   useEffect(() => {
//     const fetchAttendanceForAllBranches = async () => {
//       const newAttendanceData = {};
//       for (const branch of branches) {
//         try {
//           const res = await apiGet(`/admin/attendance?branch=${branch._id}`);
//           newAttendanceData[branch._id] = res.data[0]?.attendance || [];
//         } catch (err) {
//           console.error(`Error fetching attendance for branch ${branch._id}:`, err);
//         }
//       }
//       setAttendanceData(newAttendanceData);
//     };
//     if (branches.length > 0) {
//       fetchAttendanceForAllBranches();
//     }
//   }, [branches]);

//  const handleSubmit = async (e) => {
//   e.preventDefault();
//   setError('');
//   setSuccess('');

//   // ضمان أن allowedIPs دايمًا String قبل التحويل
//   const allowedIPsString = String(formData.allowedIPs || '');
//   const allowedIPsArray = allowedIPsString
//     .split(',')
//     .map(ip => ip.trim())
//     .filter(ip => ip.length > 0);

//   const dataToSend = {
//     ...formData,
//     location: {
//       lat: parseFloat(formData.lat) || 0,
//       lng: parseFloat(formData.lng) || 0
//     },
//     radius: parseFloat(formData.radius) || 0,
//     allowedIPs: allowedIPsArray,
//   };

//   try {
//     if (editingId) {
//       const res = await apiPut(`/branches/${editingId}`, dataToSend);
//       setBranches(branches.map((b) => (b._id === editingId ? res.data : b)));
//       setSuccess('تم تحديث الفرع');
//     } else {
//       const res = await apiPost('/branches', dataToSend);
//       setBranches([...branches, res.data]);
//       setSuccess('تم إنشاء الفرع');
//     }

//     // إعادة تعيين الحقول
//     setFormData({
//       name: '',
//       lat: '',
//       lng: '',
//       radius: '',
//       allowedIPs: ''
//     });
//     setEditingId(null);

//   } catch (err) {
//     setError(err.response?.data?.message || translations[lang].error);
//   }
// };


//   const handleEdit = (branch) => {
//     setFormData({
//       name: branch.name,
//       lat: branch.location.lat,
//       lng: branch.location.lng,
//       radius: branch.radius,
//       allowedIPs: branch.allowedIPs?.join(',') || '',
//     });
//     setEditingId(branch._id);
//   };

//   const handleDelete = async (id) => {
//     try {
//       await apiDelete(`/branches/${id}`);
//       setBranches(branches.filter((b) => b._id !== id));
//       setSuccess('تم حذف الفرع');
//     } catch (err) {
//       setError(err.response?.data?.message || translations[lang].error);
//     }
//   };

//   const handleToggleEmergency = async (branchId, allowRemote) => {
//     try {
//       await apiPost('/attendance/toggle-emergency', { branchId, allowRemote });
//       setBranches(branches.map(b => b._id === branchId ? { ...b, allowRemoteCheckin: allowRemote } : b));
//       setSuccess(`تم ${allowRemote ? 'تفعيل' : 'تعطيل'} وضع الطوارئ`);
//     } catch (err) {
//       setError(err.response?.data?.message || translations[lang].error);
//     }
//   };

//   const LocationMarker = ({ onLocationSelect }) => {
//     useMapEvents({
//       click(e) {
//         onLocationSelect(e.latlng);
//       },
//     });
//     return null;
//   };

//   const handleMapClick = (latlng) => {
//     setFormData({ ...formData, lat: latlng.lat.toFixed(6), lng: latlng.lng.toFixed(6) });
//   };

//   if (loading) {
//     return <div>{translations[lang].loading}</div>;
//   }

//   return (
//     <div className="container mt-4">
//       <h2>{translations[lang].manageBranches}</h2>
//       {error && <div className="alert alert-danger">{error}</div>}
//       {success && <div className="alert alert-success">{success}</div>}

//       <form onSubmit={handleSubmit} className="mb-4">
//         <div className="mb-3">
//           <label className="form-label">{translations[lang].branchName}</label>
//           <input
//             type="text"
//             className="form-control"
//             value={formData.name}
//             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//             required
//           />
//         </div>
//         <div className="mb-3">
//           <label className="form-label">{translations[lang].latitude}</label>
//           <input
//             type="number"
//             className="form-control"
//             value={formData.lat}
//             onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
//             required
//             step="any"
//           />
//         </div>
//         <div className="mb-3">
//           <label className="form-label">{translations[lang].longitude}</label>
//           <input
//             type="number"
//             className="form-control"
//             value={formData.lng}
//             onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
//             required
//             step="any"
//           />
//         </div>
//         <div className="mb-3">
//           <label className="form-label">{translations[lang].radius}</label>
//           <input
//             type="number"
//             className="form-control"
//             value={formData.radius}
//             onChange={(e) => setFormData({ ...formData, radius: e.target.value })}
//             required
//           />
//         </div>
//         <div className="mb-3">
//           <label className="form-label">{translations[lang].allowedIPs}</label>
//           <input
//             type="text"
//             className="form-control"
//             value={formData.allowedIPs}
//             onChange={(e) => setFormData({ ...formData, allowedIPs: e.target.value })}
//             placeholder="192.168.1.1, 192.168.1.2"
//           />
//         </div>
//         <div className="mb-3">
//           <MapContainer center={[24.7136, 46.6753]} zoom={10} style={{ height: '300px', width: '100%' }}>
//             <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//             <LocationMarker onLocationSelect={handleMapClick} />
//             {formData.lat && formData.lng && (
//               <Marker position={[formData.lat, formData.lng]} icon={branchIcon}>
//                 <Popup>Selected Location</Popup>
//               </Marker>
//             )}
//           </MapContainer>
//         </div>
//         <button type="submit" className="btn btn-primary">
//           {editingId ? translations[lang].update : translations[lang].addBranch}
//         </button>
//         {editingId && (
//           <button type="button" className="btn btn-secondary ms-2" onClick={() => setEditingId(null)}>
//             {translations[lang].cancel}
//           </button>
//         )}
//       </form>

//       <table className="table table-striped mb-4">
//         <thead>
//           <tr>
//             <th>{translations[lang].branchName}</th>
//             <th>{translations[lang].latitude}</th>
//             <th>{translations[lang].longitude}</th>
//             <th>{translations[lang].radius}</th>
//             <th>{translations[lang].allowedIPs}</th>
//             <th>{translations[lang].actions}</th>
//           </tr>
//         </thead>
//         <tbody>
//           {branches.map((branch) => (
//             <tr key={branch._id}>
//               <td>{branch.name}</td>
//               <td>{branch.location.lat}</td>
//               <td>{branch.location.lng}</td>
//               <td>{branch.radius}</td>
//               <td>{branch.allowedIPs?.join(', ') || 'None'}</td>
//               <td>
//                 <button className="btn btn-sm btn-info me-1" onClick={() => handleEdit(branch)}>
//                   {translations[lang].editBranch}
//                 </button>
//                 <button className="btn btn-sm btn-danger me-1" onClick={() => handleDelete(branch._id)}>
//                   Delete
//                 </button>
//                 <button
//                   className={`btn btn-sm ${branch.allowRemoteCheckin ? 'btn-warning' : 'btn-success'}`}
//                   onClick={() => handleToggleEmergency(branch._id, !branch.allowRemoteCheckin)}
//                 >
//                   {branch.allowRemoteCheckin ? translations[lang].emergencyOn : translations[lang].emergencyOff}
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//     <h2>{translations[lang].attendanceMap}</h2>
// {branches.map((branch, index) => {
//   const attendance = attendanceData[branch._id] || [];
//   const defaultCenter = [24.7136, 46.6753]; // Riyadh coordinates as fallback

//   return (
//     <div key={branch._id} className="mb-5">
//       <div className="card">
//         <div className="card-body">
//           <h3 className="card-title">{branch.name} - {translations[lang].attendanceMap}</h3>
//         </div>
//         {branch.location && typeof branch.location.lat === 'number' && typeof branch.location.lng === 'number' ? (
//           <MapContainer
//             key={`map-${branch._id}-${index}`}
//             center={[branch.location.lat, branch.location.lng]}
//             zoom={13}
//             style={{ height: '400px', width: '100%', zIndex: 1 }}
//             id={`map-${branch._id}`}
//           >
//             <TileLayer
//               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//               attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//             />
//             {/* Branch location marker */}
//             <Marker
//               position={[branch.location.lat, branch.location.lng]}
//               icon={branchIcon}
//             >
//               <Popup>
//                 {translations[lang].branchLocation}: {branch.name}
//               </Popup>
//             </Marker>

//             {attendance.length === 0 ? (
//               <div className="alert alert-warning">{translations[lang].noData}</div>
//             ) : (
//               attendance.map(record => (
//                 <React.Fragment key={record._id}>
//                   {/* Check-In marker */}
//                   {record.locationIn && (
//                     <Marker
//                       position={[record.locationIn.lat, record.locationIn.lng]}
//                       icon={checkInIcon}
//                     >
//                       <Popup>
//                         {translations[lang].user}: {record.user?.name || 'Unknown'}<br />
//                         {translations[lang].checkIn}: {record.checkInTime ? new Date(record.checkInTime).toLocaleString() : 'N/A'}<br />
//                         {record.lateMinutes > 0 && `Late: ${record.lateMinutes} minutes`}
//                       </Popup>
//                     </Marker>
//                   )}

//                   {/* Check-Out marker */}
//                   {record.locationOut && (
//                     <Marker
//                       position={[record.locationOut.lat, record.locationOut.lng]}
//                       icon={checkOutIcon}
//                     >
//                       <Popup>
//                         {translations[lang].user}: {record.user?.name || 'Unknown'}<br />
//                         {translations[lang].checkOut}: {record.checkOutTime ? new Date(record.checkOutTime).toLocaleString() : 'N/A'}<br />
//                         {record.earlyLeaveMinutes > 0 && `Early Leave: ${record.earlyLeaveMinutes} minutes`}
//                       </Popup>
//                     </Marker>
//                   )}
//                 </React.Fragment>
//               ))
//             )}
//           </MapContainer>
//         ) : (
//           <MapContainer
//             key={`map-fallback-${branch._id}-${index}`}
//             center={defaultCenter}
//             zoom={13}
//             style={{ height: '400px', width: '100%', zIndex: 1 }}
//             id={`map-fallback-${branch._id}`}
//           >
//             <TileLayer
//               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//               attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//             />
//             <div className="alert alert-warning">{translations[lang].noLocation}</div>
//           </MapContainer>
//         )}
//       </div>
//     </div>
//   );
// })}

//     </div>
//   );
// }

// export default AdminBranches;
import React, { useState, useEffect } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '../helpers/api';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useTranslation } from 'react-i18next';
import '../style/adminbranshes.css';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

// Custom icons
const branchIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const checkInIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

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
  const { t } = useTranslation();
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    lat: '',
    lng: '',
    radius: '',
    allowedIPs: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await apiGet('/branches');
        setBranches(res.data);
      } catch (err) {
        setError(t('adminBranches.error'));
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
  }, [t]);

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
        setSuccess(t('adminBranches.branchUpdated'));
      } else {
        const res = await apiPost('/branches', dataToSend);
        setBranches([...branches, res.data]);
        setSuccess(t('adminBranches.branchCreated'));
      }

      setFormData({
        name: '',
        lat: '',
        lng: '',
        radius: '',
        allowedIPs: ''
      });
      setEditingId(null);

    } catch (err) {
      setError(err.response?.data?.message || t('adminBranches.error'));
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

  const handleDeleteClick = (branch) => {
    setBranchToDelete(branch);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!branchToDelete) return;
    try {
      await apiDelete(`/branches/${branchToDelete._id}`);
      setBranches(branches.filter((b) => b._id !== branchToDelete._id));
      setSuccess(t('adminBranches.branchDeleted'));
      setShowDeleteModal(false);
      setBranchToDelete(null);
    } catch (err) {
      setError(err.response?.data?.message || t('adminBranches.error'));
      setShowDeleteModal(false);
      setBranchToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setBranchToDelete(null);
  };

  const handleToggleEmergency = async (branchId, allowRemote) => {
    try {
      await apiPost('/attendance/toggle-emergency', { branchId, allowRemote });
      setBranches(branches.map(b => b._id === branchId ? { ...b, allowRemoteCheckin: allowRemote } : b));
      setSuccess(allowRemote ? t('adminBranches.emergencyActivated') : t('adminBranches.emergencyDeactivated'));
    } catch (err) {
      setError(err.response?.data?.message || t('adminBranches.error'));
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
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">{t('adminBranches.loading')}</span>
        </div>
        <span className="ms-2">{t('adminBranches.loading')}</span>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4"><i className="fas fa-building me-2"></i>{t('adminBranches.manageBranches')}</h2>

      {/* Toast Container */}
      <div className="toast-container position-fixed top-0 end-0 p-3">
        {success && (
          <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header bg-success text-white">
              <i className="fas fa-check-circle me-2"></i>
              <strong className="me-auto">{t('adminBranches.success')}</strong>
              <button type="button" className="btn-close btn-close-white" onClick={() => setSuccess('')}></button>
            </div>
            <div className="toast-body">{success}</div>
          </div>
        )}
        {error && (
          <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header bg-danger text-white">
              <i className="fas fa-exclamation-triangle me-2"></i>
              <strong className="me-auto">{t('adminBranches.error')}</strong>
              <button type="button" className="btn-close btn-close-white" onClick={() => setError('')}></button>
            </div>
            <div className="toast-body">{error}</div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && branchToDelete && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-labelledby="deleteModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="deleteModalLabel">
                  <i className="fas fa-trash-alt me-2"></i>{t('adminBranches.delete')}
                </h5>
                <button type="button" className="btn-close" onClick={handleCancelDelete} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                {t('adminBranches.delete')} {t('adminBranches.branchName')}: <strong>{branchToDelete.name}</strong>?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCancelDelete}>
                  <i className="fas fa-times me-2"></i>{t('adminBranches.cancel')}
                </button>
                <button type="button" className="btn btn-delete" onClick={handleDelete}>
                  <i className="fas fa-trash-alt me-2"></i>{t('adminBranches.delete')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showDeleteModal && <div className="modal-backdrop fade show"></div>}

      <div className="card shadow mb-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0"><i className="fas fa-plus-circle me-2"></i>{editingId ? t('adminBranches.editBranch') : t('adminBranches.addBranch')}</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label"><i className="fas fa-tag me-2"></i>{t('adminBranches.branchName')}</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label"><i className="fas fa-map-marker-alt me-2"></i>{t('adminBranches.latitude')}</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.lat}
                  onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                  required
                  step="any"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label"><i className="fas fa-map-marker-alt me-2"></i>{t('adminBranches.longitude')}</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.lng}
                  onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                  required
                  step="any"
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label"><i className="fas fa-ruler-combined me-2"></i>{t('adminBranches.radius')}</label>
              <input
                type="number"
                className="form-control"
                value={formData.radius}
                onChange={(e) => setFormData({ ...formData, radius: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label"><i className="fas fa-network-wired me-2"></i>{t('adminBranches.allowedIPs')}</label>
              <input
                type="text"
                className="form-control"
                value={formData.allowedIPs}
                onChange={(e) => setFormData({ ...formData, allowedIPs: e.target.value })}
                placeholder="192.168.1.1, 192.168.1.2"
              />
            </div>
            <div className="mb-3">
              <label className="form-label"><i className="fas fa-map me-2"></i>{t('adminBranches.selectLocationOnMap')}</label>
              <MapContainer center={[24.7136, 46.6753]} zoom={10} style={{ height: '300px', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationMarker onLocationSelect={handleMapClick} />
                {formData.lat && formData.lng && (
                  <Marker position={[formData.lat, formData.lng]} icon={branchIcon}>
                    <Popup>{t('adminBranches.selectedLocation')}</Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
            <div className="d-flex">
              <button type="submit" className="btn btn-primary me-2">
                <i className="fas fa-save me-2"></i>{editingId ? t('adminBranches.update') : t('adminBranches.addBranch')}
              </button>
              {editingId && (
                <button type="button" className="btn btn-secondary" onClick={() => setEditingId(null)}>
                  <i className="fas fa-times me-2"></i>{t('adminBranches.cancel')}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="card shadow mb-4">
        <div className="card-header bg-info text-white">
          <h5 className="mb-0"><i className="fas fa-list-ul me-2"></i>{t('adminBranches.branchList')}</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>{t('adminBranches.branchName')}</th>
                  <th>{t('adminBranches.latitude')}</th>
                  <th>{t('adminBranches.longitude')}</th>
                  <th>{t('adminBranches.radius')}</th>
                  <th>{t('adminBranches.allowedIPs')}</th>
                  <th>{t('adminBranches.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {branches.map((branch) => (
                  <tr key={branch._id}>
                    <td>{branch.name}</td>
                    <td>{branch.location.lat}</td>
                    <td>{branch.location.lng}</td>
                    <td>{branch.radius}</td>
                    <td>{branch.allowedIPs?.join(', ') || t('adminBranches.none')}</td>
                    <td>
                      <button className="btn btn-sm btn-info me-1" onClick={() => handleEdit(branch)}>
                        <i className="fas fa-edit"></i> {t('adminBranches.editBranch')}
                      </button>
                      <button className="btn btn-sm btn-danger me-1" onClick={() => handleDeleteClick(branch)}>
                        <i className="fas fa-trash-alt"></i> {t('adminBranches.delete')}
                      </button>
                      <button
                        className={`btn btn-sm ${branch.allowRemoteCheckin ? 'btn-warning' : 'btn-success'}`}
                        onClick={() => handleToggleEmergency(branch._id, !branch.allowRemoteCheckin)}
                      >
                        <i className={`fas ${branch.allowRemoteCheckin ? 'fa-exclamation-triangle' : 'fa-shield-alt'}`}></i> {branch.allowRemoteCheckin ? t('adminBranches.emergencyOn') : t('adminBranches.emergencyOff')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <h2 className="mb-4"><i className="fas fa-map-marked-alt me-2"></i>{t('adminBranches.attendanceMap')}</h2>
      {branches.map((branch, index) => {
        const attendance = attendanceData[branch._id] || [];
        const defaultCenter = [24.7136, 46.6753]; // Riyadh coordinates as fallback

        return (
          <div key={branch._id} className="mb-5">
            <div className="card shadow">
              <div className="card-header bg-secondary text-white">
                <h5 className="mb-0"><i className="fas fa-map me-2"></i>{branch.name} - {t('adminBranches.attendanceMap')}</h5>
              </div>
              <div className="card-body p-0">
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
                    <Marker
                      position={[branch.location.lat, branch.location.lng]}
                      icon={branchIcon}
                    >
                      <Popup>
                        {t('adminBranches.branchLocation')}: {branch.name}
                      </Popup>
                    </Marker>
                    {attendance.length === 0 ? (
                      <div className="alert alert-warning m-3">{t('adminBranches.noData')}</div>
                    ) : (
                      attendance.map(record => (
                        <React.Fragment key={record._id}>
                          {record.locationIn && (
                            <Marker
                              position={[record.locationIn.lat, record.locationIn.lng]}
                              icon={checkInIcon}
                            >
                              <Popup>
                                {t('adminBranches.user')}: {record.user?.name || t('adminBranches.unknown')}<br />
                                {t('adminBranches.checkIn')}: {record.checkInTime ? new Date(record.checkInTime).toLocaleString() : 'N/A'}<br />
                                {record.lateMinutes > 0 && `${t('adminBranches.late')}: ${record.lateMinutes} ${t('adminBranches.minutes')}`}
                              </Popup>
                            </Marker>
                          )}
                          {record.locationOut && (
                            <Marker
                              position={[record.locationOut.lat, record.locationOut.lng]}
                              icon={checkOutIcon}
                            >
                              <Popup>
                                {t('adminBranches.user')}: {record.user?.name || t('adminBranches.unknown')}<br />
                                {t('adminBranches.checkOut')}: {record.checkOutTime ? new Date(record.checkOutTime).toLocaleString() : 'N/A'}<br />
                                {record.earlyLeaveMinutes > 0 && `${t('adminBranches.earlyLeave')}: ${record.earlyLeaveMinutes} ${t('adminBranches.minutes')}`}
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
                    <div className="alert alert-warning m-3">{t('adminBranches.noLocation')}</div>
                  </MapContainer>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default AdminBranches;