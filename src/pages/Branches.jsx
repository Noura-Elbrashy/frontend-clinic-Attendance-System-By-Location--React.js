// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { apiGet, apiPost, apiPut, apiDelete } from '../helpers/api';

// function Branches() {
//   const [branches, setBranches] = useState([]);
//   const [formData, setFormData] = useState({ name: '', lat: '', lng: '', radius: '' });
//   const [editingId, setEditingId] = useState(null);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const navigate = useNavigate();

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
//     try {
//       const res = await apiGet('/branches');
//       setBranches(res.data);
//     } catch (err) { 
//       setError(err.response?.data?.message || 'Failed to fetch branches');
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
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
//         setSuccess('Branch updated successfully');
//       } else {
//         await apiPost('/branches', data);
//         setSuccess('Branch created successfully');
//       }
//       setFormData({ name: '', lat: '', lng: '', radius: '' });
//       setEditingId(null);
//       fetchBranches();
//       setError('');
//     } catch (err) { 
//       setError(err.response?.data?.message || 'Failed to save branch');
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
//       setSuccess('Branch deleted successfully');
//       fetchBranches();
//       setError('');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to delete branch');
//       setSuccess('');
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <h2 className="mb-4">Manage Branches</h2>
//       {error && <div className="alert alert-danger">{error}</div>}
//       {success && <div className="alert alert-success">{success}</div>}

//       <div className="card mb-4">
//         <div className="card-body">
//           <h3 className="card-title">{editingId ? 'Edit Branch' : 'Add Branch'}</h3>
//           <form onSubmit={handleSubmit}>
//             <div className="mb-3">
//               <label className="form-label">Branch Name</label>
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
//               <label className="form-label">Latitude</label>
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
//               <label className="form-label">Longitude</label>
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
//               <label className="form-label">Radius (meters)</label>
//               <input
//                 type="number"
//                 name="radius"
//                 value={formData.radius}
//                 onChange={handleInputChange}
//                 className="form-control"
//                 required
//               />
//             </div>
//             <button type="submit" className="btn btn-primary">
//               {editingId ? 'Update Branch' : 'Add Branch'}
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
//                 Cancel
//               </button>
//             )}
//           </form>
//         </div>
//       </div>

//       <div className="table-responsive">
//         <table className="table table-bordered">
//           <thead className="table-primary">
//             <tr>
//               <th>Name</th>
//               <th>Latitude</th>
//               <th>Longitude</th>
//               <th>Radius (m)</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {branches.map((branch) => (
//               <tr key={branch._id}>
//                 <td>{branch.name}</td>
//                 <td>{branch.location.lat}</td>
//                 <td>{branch.location.lng}</td>
//                 <td>{branch.radius}</td>
//                 <td>
//                   <button
//                     className="btn btn-warning btn-sm me-2"
//                     onClick={() => handleEdit(branch)}
//                   >
//                     Edit
//                   </button>
//                   <button
//                     className="btn btn-danger btn-sm"
//                     onClick={() => handleDelete(branch._id)}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default Branches;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet, apiPost, apiPut, apiDelete } from '../helpers/api';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function Branches() {
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({ name: '', lat: '', lng: '', radius: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const lang = document.documentElement.getAttribute('lang') || 'ar';

  const translations = {
    en: {
      manageBranches: 'Manage Branches',
      addBranch: 'Add Branch',
      editBranch: 'Edit Branch',
      branchName: 'Branch Name',
      latitude: 'Latitude',
      longitude: 'Longitude',
      radius: 'Radius (m)',
      actions: 'Actions',
      update: 'Update',
      cancel: 'Cancel',
    },
    ar: {
      manageBranches: 'إدارة الفروع',
      addBranch: 'إضافة فرع',
      editBranch: 'تعديل فرع',
      branchName: 'اسم الفرع',
      latitude: 'خط العرض',
      longitude: 'خط الطول',
      radius: 'النطاق (متر)',
      actions: 'الإجراءات',
      update: 'تحديث',
      cancel: 'إلغاء',
    },
  };

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await apiGet('/auth/profile');
        if (res.data.role !== 'admin') {
          navigate('/dashboard');
        } else {
          fetchBranches();
        }
      } catch (err) { // eslint-disable-line no-unused-vars
        navigate('/');
      }
    };
    checkAdmin();
  }, [navigate]);

  const fetchBranches = async () => {
    try {
      const res = await apiGet('/branches');
      setBranches(res.data);
    } catch (err) { // eslint-disable-line no-unused-vars
      setError(err.response?.data?.message || translations[lang].error || 'فشل في جلب الفروع');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMapClick = (lat, lng) => {
    setFormData({ ...formData, lat, lng });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        name: formData.name,
        location: { lat: parseFloat(formData.lat), lng: parseFloat(formData.lng) },
        radius: parseFloat(formData.radius),
      };
      if (editingId) {
        await apiPut(`/branches/${editingId}`, data);
        setSuccess(translations[lang].editBranchSuccess || 'تم تعديل الفرع بنجاح');
      } else {
        await apiPost('/branches', data);
        setSuccess(translations[lang].addBranchSuccess || 'تم إضافة الفرع بنجاح');
      }
      setFormData({ name: '', lat: '', lng: '', radius: '' });
      setEditingId(null);
      fetchBranches();
      setError('');
    } catch (err) { // eslint-disable-line no-unused-vars
      setError(err.response?.data?.message || translations[lang].error || 'فشل في حفظ الفرع');
      setSuccess('');
    }
  };

  const handleEdit = (branch) => {
    setFormData({
      name: branch.name,
      lat: branch.location.lat,
      lng: branch.location.lng,
      radius: branch.radius,
    });
    setEditingId(branch._id);
  };

  const handleDelete = async (id) => {
    try {
      await apiDelete(`/branches/${id}`);
      setSuccess(translations[lang].deleteBranchSuccess || 'تم حذف الفرع بنجاح');
      fetchBranches();
      setError('');
    } catch (err) { // eslint-disable-line no-unused-vars
      setError(err.response?.data?.message || translations[lang].error || 'فشل في حذف الفرع');
      setSuccess('');
    }
  };

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        handleMapClick(e.latlng.lat, e.latlng.lng);
      },
    });
    return formData.lat && formData.lng ? (
      <Marker position={[formData.lat, formData.lng]} />
    ) : null;
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">{translations[lang].manageBranches}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card mb-4">
        <div className="card-body">
          <h3 className="card-title">{editingId ? translations[lang].editBranch : translations[lang].addBranch}</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">{translations[lang].branchName}</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">{translations[lang].latitude}</label>
              <input
                type="number"
                name="lat"
                value={formData.lat}
                onChange={handleInputChange}
                className="form-control"
                step="any"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">{translations[lang].longitude}</label>
              <input
                type="number"
                name="lng"
                value={formData.lng}
                onChange={handleInputChange}
                className="form-control"
                step="any"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">{translations[lang].radius}</label>
              <input
                type="number"
                name="radius"
                value={formData.radius}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Select Location on Map</label>
              <MapContainer center={[30.0444, 31.2357]} zoom={13} style={{ height: '400px', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapClickHandler />
              </MapContainer>
            </div>
            <button type="submit" className="btn btn-primary">
              {editingId ? translations[lang].update : translations[lang].addBranch}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => {
                  setFormData({ name: '', lat: '', lng: '', radius: '' });
                  setEditingId(null);
                }}
              >
                {translations[lang].cancel}
              </button>
            )}
          </form>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-primary">
            <tr>
              <th>{translations[lang].branchName}</th>
              <th>{translations[lang].latitude}</th>
              <th>{translations[lang].longitude}</th>
              <th>{translations[lang].radius}</th>
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
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(branch)}
                  >
                    {translations[lang].edit}
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(branch._id)}
                  >
                    {translations[lang].delete}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Branches;