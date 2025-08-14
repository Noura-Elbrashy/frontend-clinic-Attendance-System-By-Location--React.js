
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { apiGet, apiPost } from '../helpers/api';
// import { useTranslation } from 'react-i18next';

// function AddEmployee() {
//   const { t } = useTranslation();
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     role: 'staff',
//     branches: [],
//     phone: '',
//     address: '',
//     salary: '',
//     requiredWorkingDays: 5,
//     workingDaysNames: 'Sunday,Monday,Tuesday,Wednesday,Thursday',
//     workingHoursPerDay: 8,
//     workStartTime: '09:00',
//     workEndTime: '17:00',
//     absenceDeductionRate: 0,
//     lateDeductionRate: 0,
//     earlyLeaveDeductionRate: 0,
//     allowRemoteAbsence: false,
//   });
//   const [branches, setBranches] = useState([]);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchBranches = async () => {
//       try {
//         const res = await apiGet('/branches');
//         setBranches(res.data);
//       } catch (err) {
//         setError(t('error'));
//       }
//     };
//     fetchBranches();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');
//     try {
//       const dataToSend = {
//         ...formData,
//         workingDaysNames: formData.workingDaysNames.split(',').map(day => day.trim()),
//         absenceDeductionRate: formData.absenceDeductionRate / 100,
//         lateDeductionRate: formData.lateDeductionRate / 100,
//         earlyLeaveDeductionRate: formData.earlyLeaveDeductionRate / 100,
//       };
//       const res = await apiPost('/users', dataToSend);
//       setSuccess(res.data.message || t('success'));
//       setTimeout(() => navigate('/admin/dashboard'), 2000);
//     } catch (err) {
//       setError(err.response?.data?.message || t('error'));
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <h2>{t('addEmployee')}</h2>
//       {error && <div className="alert alert-danger">{error}</div>}
//       {success && <div className="alert alert-success">{success}</div>}

//       <form onSubmit={handleSubmit}>
//         <div className="mb-3">
//           <label className="form-label">{t('name')}</label>
//           <input
//             type="text"
//             className="form-control"
//             value={formData.name}
//             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//             required
//           />
//         </div>
//         <div className="mb-3">
//           <label className="form-label">{t('email')}</label>
//           <input
//             type="email"
//             className="form-control"
//             value={formData.email}
//             onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//             required
//           />
//         </div>
//         <div className="mb-3">
//           <label className="form-label">{t('role')}</label>
//           <select
//             className="form-select"
//             value={formData.role}
//             onChange={(e) => setFormData({ ...formData, role: e.target.value })}
//           >
//             <option value="staff">{t('staff')}</option>
//             <option value="admin">{t('admin')}</option>
//           </select>
//         </div>
//         <div className="mb-3">
//           <label className="form-label">{t('branches')}</label>
//           <select
//             multiple
//             className="form-select"
//             value={formData.branches}
//             onChange={(e) => setFormData({ ...formData, branches: Array.from(e.target.selectedOptions, option => option.value) })}
//           >
//             {branches.map(branch => (
//               <option key={branch._id} value={branch._id}>{branch.name}</option>
//             ))}
//           </select>
//         </div>
//         <div className="mb-3">
//           <label className="form-label">{t('phone')}</label>
//           <input
//             type="text"
//             className="form-control"
//             value={formData.phone}
//             onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//           />
//         </div>
//         <div className="mb-3">
//           <label className="form-label">{t('address')}</label>
//           <input
//             type="text"
//             className="form-control"
//             value={formData.address}
//             onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//           />
//         </div>
//         <div className="mb-3">
//           <label className="form-label">{t('salary')}</label>
//           <input
//             type="number"
//             className="form-control"
//             value={formData.salary}
//             onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
//           />
//         </div>
//         <div className="mb-3">
//           <label className="form-label">{t('requiredWorkingDays')}</label>
//           <input
//             type="number"
//             className="form-control"
//             value={formData.requiredWorkingDays}
//             onChange={(e) => setFormData({ ...formData, requiredWorkingDays: e.target.value })}
//           />
//         </div>
//         <div className="mb-3">
//           <label className="form-label">{t('workingDaysNames')}</label>
//           <input
//             type="text"
//             className="form-control"
//             value={formData.workingDaysNames}
//             onChange={(e) => setFormData({ ...formData, workingDaysNames: e.target.value })}
//           />
//         </div>
//         <div className="mb-3">
//           <label className="form-label">{t('workingHoursPerDay')}</label>
//           <input
//             type="number"
//             className="form-control"
//             value={formData.workingHoursPerDay}
//             onChange={(e) => setFormData({ ...formData, workingHoursPerDay: e.target.value })}
//           />
//         </div>
//         <div className="mb-3">
//           <label className="form-label">{t('workStartTime')}</label>
//           <input
//             type="text"
//             className="form-control"
//             value={formData.workStartTime}
//             onChange={(e) => setFormData({ ...formData, workStartTime: e.target.value })}
//           />
//         </div>
//         <div className="mb-3">
//           <label className="form-label">{t('workEndTime')}</label>
//           <input
//             type="text"
//             className="form-control"
//             value={formData.workEndTime}
//             onChange={(e) => setFormData({ ...formData, workEndTime: e.target.value })}
//           />
//         </div>
//         <div className="mb-3">
//           <label className="form-label">{t('absenceDeductionRate')}</label>
//           <input
//             type="number"
//             className="form-control"
//             value={formData.absenceDeductionRate}
//             onChange={(e) => setFormData({ ...formData, absenceDeductionRate: e.target.value })}
//           />
//         </div>
//         <div className="mb-3">
//           <label className="form-label">{t('lateDeductionRate')}</label>
//           <input
//             type="number"
//             className="form-control"
//             value={formData.lateDeductionRate}
//             onChange={(e) => setFormData({ ...formData, lateDeductionRate: e.target.value })}
//           />
//         </div>
//         <div className="mb-3">
//           <label className="form-label">{t('earlyLeaveDeductionRate')}</label>
//           <input
//             type="number"
//             className="form-control"
//             value={formData.earlyLeaveDeductionRate}
//             onChange={(e) => setFormData({ ...formData, earlyLeaveDeductionRate: e.target.value })}
//           />
//         </div>
//         <div className="mb-3 form-check">
//           <input
//             type="checkbox"
//             className="form-check-input"
//             checked={formData.allowRemoteAbsence}
//             onChange={(e) => setFormData({ ...formData, allowRemoteAbsence: e.target.checked })}
//           />
//           <label className="form-check-label">{t('allowRemoteAbsence')}</label>
//         </div>
//         <button type="submit" className="btn btn-primary">
//           {t('submit')}
//         </button>
//       </form>
//     </div>
//   );
// }

// export default AddEmployee;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet, apiPost } from '../helpers/api';
import { useTranslation } from 'react-i18next';
import '../style/AddEmployee.css';

function AddEmployee() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'staff',
    branches: [],
    phone: '',
    address: '',
    salary: '',
    requiredWorkingDays: 5,
    workingDaysNames: 'Sunday,Monday,Tuesday,Wednesday,Thursday',
    workingHoursPerDay: 8,
    workStartTime: '09:00',
    workEndTime: '17:00',
    absenceDeductionRate: 0,
    lateDeductionRate: 0,
    earlyLeaveDeductionRate: 0,
    allowRemoteAbsence: false,
  });
  const [branches, setBranches] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await apiGet('/branches');
        setBranches(res.data);
      } catch (err) {
        setError(t('error'));
      }
    };
    fetchBranches();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const dataToSend = {
        ...formData,
        workingDaysNames: formData.workingDaysNames.split(',').map(day => day.trim()),
        absenceDeductionRate: formData.absenceDeductionRate / 100,
        lateDeductionRate: formData.lateDeductionRate / 100,
        earlyLeaveDeductionRate: formData.earlyLeaveDeductionRate / 100,
      };
      const res = await apiPost('/users', dataToSend);
      setSuccess(res.data.message || t('success'));
      setTimeout(() => navigate('/admin/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || t('error'));
    }
  };

  return (
    <div className="container mt-4">
      <h2>{t('addEmployee')}</h2>
      <div className="toast-container position-fixed top-0 end-0 p-3">
        {success && (
          <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header bg-success text-white">
              <i className="fas fa-check-circle me-2"></i>
              <strong className="me-auto">{t('success')}</strong>
              <button type="button" className="btn-close btn-close-white" onClick={() => setSuccess('')}></button>
            </div>
            <div className="toast-body">{success}</div>
          </div>
        )}
        {error && (
          <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header bg-danger text-white">
              <i className="fas fa-exclamation-triangle me-2"></i>
              <strong className="me-auto">{t('error')}</strong>
              <button type="button" className="btn-close btn-close-white" onClick={() => setError('')}></button>
            </div>
            <div className="toast-body">{error}</div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">{t('name')}</label>
          <input
            type="text"
            className="form-control"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">{t('email')}</label>
          <input
            type="email"
            className="form-control"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">{t('role')}</label>
          <select
            className="form-select"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="staff">{t('staff')}</option>
            <option value="admin">{t('admin')}</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">{t('branches')}</label>
          <select
            multiple
            className="form-select"
            value={formData.branches}
            onChange={(e) => setFormData({ ...formData, branches: Array.from(e.target.selectedOptions, option => option.value) })}
          >
            {branches.map(branch => (
              <option key={branch._id} value={branch._id}>{branch.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">{t('phone')}</label>
          <input
            type="text"
            className="form-control"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">{t('address')}</label>
          <input
            type="text"
            className="form-control"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">{t('salary')}</label>
          <input
            type="number"
            className="form-control"
            value={formData.salary}
            onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">{t('requiredWorkingDays')}</label>
          <input
            type="number"
            className="form-control"
            value={formData.requiredWorkingDays}
            onChange={(e) => setFormData({ ...formData, requiredWorkingDays: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">{t('workingDaysNames')}</label>
          <input
            type="text"
            className="form-control"
            value={formData.workingDaysNames}
            onChange={(e) => setFormData({ ...formData, workingDaysNames: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">{t('workingHoursPerDay')}</label>
          <input
            type="number"
            className="form-control"
            value={formData.workingHoursPerDay}
            onChange={(e) => setFormData({ ...formData, workingHoursPerDay: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">{t('workStartTime')}</label>
          <input
            type="text"
            className="form-control"
            value={formData.workStartTime}
            onChange={(e) => setFormData({ ...formData, workStartTime: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">{t('workEndTime')}</label>
          <input
            type="text"
            className="form-control"
            value={formData.workEndTime}
            onChange={(e) => setFormData({ ...formData, workEndTime: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">{t('absenceDeductionRate')}</label>
          <input
            type="number"
            className="form-control"
            value={formData.absenceDeductionRate}
            onChange={(e) => setFormData({ ...formData, absenceDeductionRate: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">{t('lateDeductionRate')}</label>
          <input
            type="number"
            className="form-control"
            value={formData.lateDeductionRate}
            onChange={(e) => setFormData({ ...formData, lateDeductionRate: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">{t('earlyLeaveDeductionRate')}</label>
          <input
            type="number"
            className="form-control"
            value={formData.earlyLeaveDeductionRate}
            onChange={(e) => setFormData({ ...formData, earlyLeaveDeductionRate: e.target.value })}
          />
        </div>
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            checked={formData.allowRemoteAbsence}
            onChange={(e) => setFormData({ ...formData, allowRemoteAbsence: e.target.checked })}
          />
          <label className="form-check-label">{t('allowRemoteAbsence')}</label>
        </div>
        <button type="submit" className="btn btn-primary">
          {t('submit')}
        </button>
      </form>
    </div>
  );
}

export default AddEmployee;