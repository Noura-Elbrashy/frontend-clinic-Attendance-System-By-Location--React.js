// // import { useState, useEffect } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { apiGet } from '../helpers/api';
// // import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// // import 'leaflet/dist/leaflet.css';

// // function AdminAttendanceMap() {
// //   const [attendanceRecords, setAttendanceRecords] = useState([]);
// //   const [error, setError] = useState('');
// //   const navigate = useNavigate();
// //   const lang = document.documentElement.getAttribute('lang') || 'ar';

// //   const translations = {
// //     en: {
// //       attendanceMap: 'Attendance Map',
// //       user: 'User',
// //       checkIn: 'Check-In',
// //       checkOut: 'Check-Out',
// //       error: 'An error occurred',
// //     },
// //     ar: {
// //       attendanceMap: 'خريطة الحضور',
// //       user: 'المستخدم',
// //       checkIn: 'تسجيل الدخول',
// //       checkOut: 'تسجيل الخروج',
// //       error: 'حدث خطأ',
// //     },
// //   };

// //   useEffect(() => {
// //     const checkAdmin = async () => {
// //       try {
// //         const res = await apiGet('/auth/profile');
// //         if (res.data.role !== 'admin') {
// //           navigate('/dashboard');
// //         } else {
// //           fetchAttendance();
// //         }
// //       } catch (err) { // eslint-disable-line no-unused-vars
// //         navigate('/');
// //       }
// //     };
// //     checkAdmin();
// //   }, [navigate]);

// //   const fetchAttendance = async () => {
// //     try {
// //       const res = await apiGet('/admin/attendance');
// //       setAttendanceRecords(res.data);
// //     } catch (err) { // eslint-disable-line no-unused-vars
// //       setError(err.response?.data?.message || translations[lang].error);
// //     }
// //   };

// //   return (
// //     <div className="container mt-4">
// //       <h2 className="mb-4">{translations[lang].attendanceMap}</h2>
// //       {error && <div className="alert alert-danger">{error}</div>}
// //       <MapContainer center={[30.0444, 31.2357]} zoom={13} style={{ height: '600px', width: '100%' }}>
// //         <TileLayer
// //           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// //           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// //         />
// //         {attendanceRecords.map((record) => (
// //           <Marker
// //             key={record._id}
// //             position={[record.locationIn.lat, record.locationIn.lng]}
// //           >
// //             <Popup>
// //               {translations[lang].user}: {record.user.name}<br />
// //               {translations[lang].checkIn}: {new Date(record.checkInTime).toLocaleString()}<br />
// //               {record.checkOutTime && (
// //                 <>
// //                   {translations[lang].checkOut}: {new Date(record.checkOutTime).toLocaleString()}
// //                 </>
// //               )}
// //             </Popup>
// //           </Marker>
// //         ))}
// //       </MapContainer>
// //     </div>
// //   );
// // }

// // export default AdminAttendanceMap;
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { apiGet } from '../helpers/api';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';

// function AdminAttendanceMap() {
//   const [branches, setBranches] = useState([]);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();
//   const lang = document.documentElement.getAttribute('lang') || 'ar';

//   const translations = {
//     en: {
//       attendanceMap: 'Attendance Map',
//       branch: 'Branch',
//       user: 'User',
//       checkIn: 'Check-In',
//       checkOut: 'Check-Out',
//       error: 'An error occurred',
//     },
//     ar: {
//       attendanceMap: 'خريطة الحضور',
//       branch: 'الفرع',
//       user: 'المستخدم',
//       checkIn: 'تسجيل الدخول',
//       checkOut: 'تسجيل الخروج',
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
//           fetchAttendance();
//         }
//       } catch (err) { // eslint-disable-line no-unused-vars
//         navigate('/');
//       }
//     };
//     checkAdmin();
//   }, [navigate]);

//   const fetchAttendance = async () => {
//     try {
//       const res = await apiGet('/admin/attendance');
//       setBranches(res.data);
//     } catch (err) { // eslint-disable-line no-unused-vars
//       setError(err.response?.data?.message || translations[lang].error);
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <h2 className="mb-4">{translations[lang].attendanceMap}</h2>
//       {error && <div className="alert alert-danger">{error}</div>}
//       {branches.map(({ branch, attendance }) => (
//         <div key={branch._id} className="card mb-4">
//           <div className="card-body">
//             <h3 className="card-title">{translations[lang].branch}: {branch.name}</h3>
//             <MapContainer center={[branch.location.lat, branch.location.lng]} zoom={13} style={{ height: '400px', width: '100%' }}>
//               <TileLayer
//                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//               />
//               {attendance.map(record => (
//                 <Marker
//                   key={record._id}
//                   position={[record.locationIn.lat, record.locationIn.lng]}
//                 >
//                   <Popup>
//                     {translations[lang].user}: {record.user.name}<br />
//                     {translations[lang].checkIn}: {new Date(record.checkInTime).toLocaleString()}<br />
//                     {record.checkOutTime && (
//                       <>
//                         {translations[lang].checkOut}: {new Date(record.checkOutTime).toLocaleString()}
//                       </>
//                     )}
//                   </Popup>
//                 </Marker>
//               ))}
//             </MapContainer>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default AdminAttendanceMap;
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { apiGet } from '../helpers/api';

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

function AdminAttendanceMap() {
  const [branches, setBranches] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const lang = document.documentElement.getAttribute('lang') || 'ar';

  const translations = {
    en: {
      attendanceMap: 'Attendance Map',
      branch: 'Branch',
      user: 'User',
      checkIn: 'Check-In',
      checkOut: 'Check-Out',
      error: 'An error occurred',
      noLocation: 'No valid location data for this branch',
      noData: 'No valid attendance data available',
      loading: 'Loading...',
      branchLocation: 'Branch Location',
    },
    ar: {
      attendanceMap: 'خريطة الحضور',
      branch: 'الفرع',
      user: 'المستخدم',
      checkIn: 'تسجيل الدخول',
      checkOut: 'تسجيل الخروج',
      error: 'حدث خطأ',
      noLocation: 'لا توجد بيانات موقع صالحة لهذا الفرع',
      noData: 'لا توجد بيانات حضور صالحة متاحة',
      loading: 'جارٍ التحميل...',
      branchLocation: 'موقع الفرع',
    },
  };

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await apiGet('/admin/attendance');
        console.log('Raw attendance data:', res.data); // Debug raw response
        const filteredBranches = res.data
          .filter(({ branch }) => {
            const isValidBranch =
              branch &&
              branch.location &&
              typeof branch.location.lat === 'number' &&
              typeof branch.location.lng === 'number' &&
              !isNaN(branch.location.lat) &&
              !isNaN(branch.location.lng);
            if (!isValidBranch) {
              console.warn(`Branch ${branch?.name || 'unknown'} skipped due to invalid location:`, branch?.location);
            }
            return isValidBranch;
          })
          .map(({ branch, attendance, pagination }) => {
            const validAttendance = Array.isArray(attendance)
              ? attendance.filter(record => {
                  const isValidRecord =
                    record.user &&
                    record.branch &&
                    record.user.name &&
                    record.branch.name;
                  if (!isValidRecord) {
                    console.warn(`Invalid attendance record for branch ${branch.name}:`, record);
                  }
                  return isValidRecord;
                })
              : [];
            return { branch, attendance: validAttendance, pagination };
          });
        console.log('Filtered branches:', filteredBranches); // Debug filtered data
        setBranches(filteredBranches);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching attendance:', err);
        setError(err.response?.data?.message || translations[lang].error);
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [lang]);

  const defaultCenter = [30.0444, 31.2357]; // Fallback center (e.g., Cairo)

  if (loading) return <div className="container mt-4">{translations[lang].loading}</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">{translations[lang].attendanceMap}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {branches.length === 0 && !error && (
        <div className="alert alert-warning">{translations[lang].noData}</div>
      )}
      {branches.map(({ branch, attendance }, index) => (
        <div key={branch._id} className="card mb-4">
          <div className="card-body">
            <h3 className="card-title">{translations[lang].branch}: {branch.name}</h3>
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
                    record.locationIn && typeof record.locationIn.lat === 'number' && typeof record.locationIn.lng === 'number' ? (
                      <Marker
                        key={record._id}
                        position={[record.locationIn.lat, record.locationIn.lng]}
                      >
                        <Popup>
                          {translations[lang].user}: {record.user.name}<br />
                          {translations[lang].checkIn}: {new Date(record.checkInTime).toLocaleString()}<br />
                          {record.checkOutTime && (
                            <>
                              {translations[lang].checkOut}: {new Date(record.checkOutTime).toLocaleString()}
                            </>
                          )}
                        </Popup>
                      </Marker>
                    ) : null
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
      ))}
    </div>
  );
}

export default AdminAttendanceMap;