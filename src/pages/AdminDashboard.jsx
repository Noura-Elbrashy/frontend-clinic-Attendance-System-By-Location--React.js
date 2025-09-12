// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { apiGet, apiPost, apiPut, apiDelete } from '../helpers/api';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '@fortawesome/fontawesome-free/css/all.min.css';
// import '../style/AdminDashboard.css';

// const AdminDashboard = () => {
//   const { t } = useTranslation();
//   const [employees, setEmployees] = useState([]);
//   const [branches, setBranches] = useState([]);
//   const [selectedBranch, setSelectedBranch] = useState('');
//   const [selectedDate, setSelectedDate] = useState('');
//   const [attendance, setAttendance] = useState([]);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [attendancePage, setAttendancePage] = useState(1);
//   const [itemsPerPage] = useState(10);
//   const [editUser, setEditUser] = useState(null);
//   const [totalSalaries, setTotalSalaries] = useState(null);
//   const [year, setYear] = useState(new Date().getFullYear());
//   const [month, setMonth] = useState(new Date().getMonth() + 1);
//   const [pendingDevices, setPendingDevices] = useState([]);
//   const [pendingPage, setPendingPage] = useState(1);
//   const [pendingPages, setPendingPages] = useState(1);
//   const [filterName, setFilterName] = useState('');
//   const [filterBranch, setFilterBranch] = useState('');
//   const [pendingFilterName, setPendingFilterName] = useState('');
//   const [attendanceFilterName, setAttendanceFilterName] = useState('');
//   const [deleteUserId, setDeleteUserId] = useState(null);
//   const [formErrors, setFormErrors] = useState({});
//   const navigate = useNavigate();

//   // Days of the week for checkboxes
//   const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

//   // Initialize Bootstrap Toast
//   useEffect(() => {
//     if (window.bootstrap && window.bootstrap.Toast) {
//       const toastElList = [].slice.call(document.querySelectorAll('.toast'));
//       toastElList.forEach((toastEl) => {
//         new window.bootstrap.Toast(toastEl, { autohide: true, delay: 5000 }).show();
//       });
//     }
//   }, [error, success]);

//   useEffect(() => {
//     const fetchPending = async () => {
//       try {
//         const params = new URLSearchParams();
//         params.append('page', pendingPage);
//         if (pendingFilterName) params.append('search', encodeURIComponent(pendingFilterName));
//         const res = await apiGet(`/users/pending-devices?${params.toString()}`);
//         setPendingDevices(res.data.pendingDevices || []);
//         setPendingPages(res.data.pagination?.pages || 1);
//       } catch (err) {
//         setError(t('error'));
//       }
//     };
//     fetchPending();
//   }, [pendingPage, pendingFilterName, t]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const branchRes = await apiGet('/branches');
//         setBranches(branchRes.data || []);
//         const params = new URLSearchParams();
//         params.append('page', currentPage);
//         params.append('limit', itemsPerPage);
//         if (filterName) params.append('name', encodeURIComponent(filterName));
//         if (filterBranch) params.append('branch', filterBranch);
//         const userRes = await apiGet(`/users?${params.toString()}`);
//         setEmployees(userRes.data.users || []);
//         setTotalPages(userRes.data.totalPages || 1);
//         handleAttendanceFilter();
//       } catch (err) {
//         setError(t('error'));
//       }
//     };
//     fetchData();
//   }, [currentPage, filterName, filterBranch, t]);

//   const handleAttendanceFilter = async () => {
//     try {
//       const params = new URLSearchParams();
//       if (selectedBranch) params.append('branch', selectedBranch);
//       if (selectedDate) params.append('date', selectedDate);
//       if (attendanceFilterName) params.append('name', encodeURIComponent(attendanceFilterName));
//       params.append('page', attendancePage);
//       params.append('limit', itemsPerPage);
//       const attendanceRes = await apiGet(`/admin/attendance?${params.toString()}`);
//       setAttendance(attendanceRes.data || []);
//     } catch (err) {
//       setError(t('error'));
//     }
//   };

//   useEffect(() => {
//     handleAttendanceFilter();
//   }, [selectedBranch, selectedDate, attendancePage, attendanceFilterName]);

//   const handleBranchFilter = (branchId) => {
//     setSelectedBranch(branchId);
//     setAttendancePage(1);
//   };

//   const handleDateFilter = (date) => {
//     setSelectedDate(date);
//     setAttendancePage(1);
//   };

//   const handleEdit = (user) => {
//     setEditUser({
//       ...user,
//       branches: Array.isArray(user.branches) ? user.branches.map(b => b._id) : [],
//       workingDaysNames: Array.isArray(user.workingDaysNames) ? user.workingDaysNames : (user.workingDaysNames ? user.workingDaysNames.split(',') : []),
//       absenceDeductionRate: user.absenceDeductionRate * 100,
//       lateDeductionRate: user.lateDeductionRate * 100,
//       earlyLeaveDeductionRate: user.earlyLeaveDeductionRate * 100,
//       workStartTime: user.workStartTime || '',
//       workEndTime: user.workEndTime || '',
//       isNightShift: user.isNightShift || false,
//     });
//     setFormErrors({});
//   };

//   const handleDelete = async (id) => {
//     setDeleteUserId(id);
//   };

//   const confirmDelete = async () => {
//     try {
//       await apiDelete(`/users/${deleteUserId}`);
//       const params = new URLSearchParams();
//       params.append('page', currentPage);
//       params.append('limit', itemsPerPage);
//       if (filterName) params.append('name', encodeURIComponent(filterName));
//       if (filterBranch) params.append('branch', filterBranch);
//       const userRes = await apiGet(`/users?${params.toString()}`);
//       setEmployees(userRes.data.users || []);
//       setTotalPages(userRes.data.totalPages || 1);
//       setSuccess(t('success'));
//       setDeleteUserId(null);
//     } catch (err) {
//       setError(err.response?.data?.message || t('error'));
//       setDeleteUserId(null);
//     }
//   };

//   const validateForm = () => {
//     const errors = {};
//     if (!editUser.name) errors.name = t('nameRequired');
//     if (!editUser.email) errors.email = t('emailRequired');
//     if (!editUser.workingDaysNames.length) errors.workingDaysNames = t('workingDaysRequired');
//     if (!editUser.workStartTime || !editUser.workEndTime) {
//       errors.time = t('timeRequired');
//     } else {
//       const startTime = editUser.workStartTime.split(':').map(Number);
//       const endTime = editUser.workEndTime.split(':').map(Number);
//       const startMinutes = startTime[0] * 60 + startTime[1];
//       const endMinutes = endTime[0] * 60 + endTime[1];
//       if (!editUser.isNightShift && endMinutes <= startMinutes) {
//         errors.time = t('endTimeAfterStart');
//       }
//     }
//     if (!editUser.branches.length) errors.branches = t('branchesRequired');
//     if (!editUser.salary || editUser.salary <= 0) errors.salary = t('salaryRequired');
//     if (!editUser.requiredWorkingDays || editUser.requiredWorkingDays <= 0) {
//       errors.requiredWorkingDays = t('requiredWorkingDaysRequired');
//     }
//     if (!editUser.workingHoursPerDay || editUser.workingHoursPerDay <= 0) {
//       errors.workingHoursPerDay = t('workingHoursRequired');
//     }
//     return errors;
//   };

//   const formatTime = (time) => {
//     if (!time) return '';
//     const [hours, minutes] = time.split(':').map(Number);
//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
//   };

//   const handleSave = async () => {
//     const errors = validateForm();
//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors);
//       return;
//     }
//     try {
//       const dataToSend = {
//         ...editUser,
//         workingDaysNames: editUser.workingDaysNames.join(','), // تحويل array إلى string
//         branches: editUser.branches,
//         absenceDeductionRate: editUser.absenceDeductionRate / 100,
//         lateDeductionRate: editUser.lateDeductionRate / 100,
//         earlyLeaveDeductionRate: editUser.earlyLeaveDeductionRate / 100,
//         isNightShift: editUser.isNightShift,
//         workStartTime: formatTime(editUser.workStartTime),
//         workEndTime: formatTime(editUser.workEndTime),
//       };
//       await apiPut(`/users/${editUser._id}`, dataToSend);
//       const params = new URLSearchParams();
//       params.append('page', currentPage);
//       params.append('limit', itemsPerPage);
//       if (filterName) params.append('name', encodeURIComponent(filterName));
//       if (filterBranch) params.append('branch', filterBranch);
//       const userRes = await apiGet(`/users?${params.toString()}`);
//       setEmployees(userRes.data.users || []);
//       setTotalPages(userRes.data.totalPages || 1);
//       setEditUser(null);
//       setSuccess(t('success'));
//       setFormErrors({});
//     } catch (err) {
//       console.error('Update error:', err.response?.data);
//       setError(t('error') + ': ' + (err.response?.data?.message || err.message));
//     }
//   };

//   const handleDayChange = (day) => {
//     setEditUser((prev) => {
//       const workingDaysNames = prev.workingDaysNames.includes(day)
//         ? prev.workingDaysNames.filter((d) => d !== day)
//         : [...prev.workingDaysNames, day];
//       return { ...prev, workingDaysNames };
//     });
//     setFormErrors((prev) => ({ ...prev, workingDaysNames: '' }));
//   };

//   const handleBranchChange = (branchId) => {
//     setEditUser((prev) => {
//       const branches = prev.branches.includes(branchId)
//         ? prev.branches.filter((id) => id !== branchId)
//         : [...prev.branches, branchId];
//       return { ...prev, branches };
//     });
//     setFormErrors((prev) => ({ ...prev, branches: '' }));
//   };

//   const handleAddEmployee = async () => {
//     navigate('/add-employee');
//   };

//   const handleCalculateSalaries = async () => {
//     try {
//       const res = await apiGet(`/admin/total-salaries?year=${year}&month=${month}${selectedBranch ? `&branchId=${selectedBranch}` : ''}`);
//       setTotalSalaries(res.data);
//     } catch (err) {
//       setError(err.response?.data?.message || t('error'));
//     }
//   };

//   const handleResendActivation = async (userId) => {
//     try {
//       await apiPost(`/auth/resend-activation/${userId}`, { userId });
//       setSuccess(t('resendSuccess'));
//     } catch (err) {
//       setError(err.response?.data?.message || t('error'));
//     }
//   };

//   const handleApprove = async (userId, fingerprint) => {
//     try {
//       await apiPost('/users/approve-device', { userId, deviceFingerprint: fingerprint });
//       const params = new URLSearchParams();
//       params.append('page', pendingPage);
//       if (pendingFilterName) params.append('name', encodeURIComponent(pendingFilterName));
//       const res = await apiGet(`/users/pending-devices?${params.toString()}`);
//       setPendingDevices(res.data.pendingDevices || []);
//       setPendingPages(res.data.pagination?.pages || 1);
//       setSuccess(t('success'));
//     } catch (err) {
//       setError(err.response?.data?.message || t('error'));
//     }
//   };

//   const handleReject = async (userId, fingerprint) => {
//     try {
//       await apiPost('/users/reject-device', { userId, deviceFingerprint: fingerprint });
//       const params = new URLSearchParams();
//       params.append('page', pendingPage);
//       if (pendingFilterName) params.append('name', encodeURIComponent(pendingFilterName));
//       const res = await apiGet(`/users/pending-devices?${params.toString()}`);
//       setPendingDevices(res.data.pendingDevices || []);
//       setPendingPages(res.data.pagination?.pages || 1);
//       setSuccess(t('success'));
//     } catch (err) {
//       setError(err.response?.data?.message || t('error'));
//     }
//   };

//   const paginate = (pageNumber) => {
//     if (pageNumber >= 1 && pageNumber <= totalPages) {
//       setCurrentPage(pageNumber);
//     }
//   };

//   const attendancePagination = attendance[0]?.pagination || { page: 1, pages: 1 };
//   const attendancePrev = () => {
//     if (attendancePage > 1) setAttendancePage(attendancePage - 1);
//   };
//   const attendanceNext = () => {
//     if (attendancePage < attendancePagination.pages) setAttendancePage(attendancePage + 1);
//   };

//   return (
//     <div className="container-fluid dashboard-container">
//       <h2 className="dashboard-title"><i className="fas fa-tachometer-alt me-2"></i>{t('dashboard')}</h2>

//       {/* Toast Container */}
//       <div className="toast-container position-fixed top-0 end-0 p-3">
//         {success && (
//           <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
//             <div className="toast-header bg-success text-white">
//               <i className="fas fa-check-circle me-2"></i>
//               <strong className="me-auto">{t('success')}</strong>
//               <button type="button" className="btn-close btn-close-white" onClick={() => setSuccess('')}></button>
//             </div>
//             <div className="toast-body">{success}</div>
//           </div>
//         )}
//         {error && (
//           <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
//             <div className="toast-header bg-danger text-white">
//               <i className="fas fa-exclamation-triangle me-2"></i>
//               <strong className="me-auto">{t('error')}</strong>
//               <button type="button" className="btn-close btn-close-white" onClick={() => setError('')}></button>
//             </div>
//             <div className="toast-body">{error}</div>
//           </div>
//         )}
//       </div>

//       {/* Delete Confirmation Modal */}
//       {deleteUserId && (
//         <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
//           <div className="modal-dialog modal-dialog-centered" role="document">
//             <div className="modal-content delete-modal">
//               <div className="modal-header bg-danger text-white">
//                 <h5 className="modal-title">
//                   <i className="fas fa-exclamation-triangle me-2"></i>{t('delete')} {t('user')}
//                 </h5>
//                 <button
//                   type="button"
//                   className="btn-close btn-close-white"
//                   onClick={() => setDeleteUserId(null)}
//                   aria-label="Close"
//                 ></button>
//               </div>
//               <div className="modal-body">
//                 <p>{t('confirmDelete')}</p>
//               </div>
//               <div className="modal-footer">
//                 <button
//                   type="button"
//                   className="btn btn-success"
//                   onClick={confirmDelete}
//                 >
//                   <i className="fas fa-check me-2"></i>{t('delete')}
//                 </button>
//                 <button
//                   type="button"
//                   className="btn btn-danger"
//                   onClick={() => setDeleteUserId(null)}
//                 >
//                   <i className="fas fa-times me-2"></i>{t('cancel')}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="card shadow-sm mb-4">
//         <div className="card-body">
//           <h3 className="card-title"><i className="fas fa-users me-2"></i>{t('employees')}</h3>
//           <button className="btn btn-primary mb-3" onClick={handleAddEmployee}>
//             <i className="fas fa-user-plus me-2"></i>{t('addEmployee')}
//           </button>
//           <div className="row mb-3">
//             <div className="col-md-6">
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder={t('name')}
//                 value={filterName}
//                 onChange={(e) => { setFilterName(e.target.value); setCurrentPage(1); }}
//               />
//             </div>
//             <div className="col-md-6">
//               <select
//                 className="form-select"
//                 value={filterBranch}
//                 onChange={(e) => { setFilterBranch(e.target.value); setCurrentPage(1); }}
//               >
//                 <option value="">{t('allBranches')}</option>
//                 {branches.map((branch) => (
//                   <option key={branch._id} value={branch._id}>
//                     {branch.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//           <div className="table-responsive">
//             <table className="table table-hover">
//               <thead className="table-primary">
//                 <tr>
//                   <th>{t('name')}</th>
//                   <th>{t('email')}</th>
//                   <th>{t('branch')}</th>
//                   <th>{t('active')}</th>
//                   <th>{t('actions')}</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {employees.length === 0 ? (
//                   <tr>
//                     <td colSpan="5">{t('noData')}</td>
//                   </tr>
//                 ) : (
//                   employees.map((emp) => (
//                     <tr key={emp._id}>
//                       <td>{emp.name}</td>
//                       <td>{emp.email}</td>
//                       <td>{emp.branches.map(b => b.name).join(', ')}</td>
//                       <td>
//                         {emp.isActive ? (
//                           <span className="badge bg-success">{t('active')}</span>
//                         ) : (
//                           <span className="badge bg-secondary">{t('inactive')}</span>
//                         )}
//                       </td>
//                       <td>
//                         <button
//                           className="btn btn-sm btn-info me-1"
//                           onClick={() => navigate(`/profile/${emp._id}`)}
//                         >
//                           <i className="fas fa-eye"></i> {t('viewProfile')}
//                         </button>
//                         <button className="btn btn-sm btn-warning me-1" onClick={() => handleEdit(emp)}>
//                           <i className="fas fa-edit"></i> {t('edit')}
//                         </button>
//                         <button className="btn btn-sm btn-danger me-1" onClick={() => handleDelete(emp._id)}>
//                           <i className="fas fa-trash"></i> {t('delete')}
//                         </button>
//                         {!emp.isActive && (
//                           <button
//                             className="btn btn-sm btn-secondary"
//                             onClick={() => handleResendActivation(emp._id)}
//                           >
//                             <i className="fas fa-envelope"></i> {t('resendActivation')}
//                           </button>
//                         )}
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//           <nav>
//             <ul className="pagination justify-content-center">
//               <li className="page-item">
//                 <button
//                   className="page-link"
//                   onClick={() => paginate(currentPage - 1)}
//                   disabled={currentPage === 1}
//                 >
//                   <i className="fas fa-chevron-left"></i> {t('previous')}
//                 </button>
//               </li>
//               <li className="page-item disabled">
//                 <span className="page-link">{currentPage} / {totalPages}</span>
//               </li>
//               <li className="page-item">
//                 <button
//                   className="page-link"
//                   onClick={() => paginate(currentPage + 1)}
//                   disabled={currentPage >= totalPages}
//                 >
//                   {t('next')} <i className="fas fa-chevron-right"></i>
//                 </button>
//               </li>
//             </ul>
//           </nav>
//         </div>
//       </div>

//       <div className="card shadow-sm mb-4">
//         <div className="card-body">
//           <h3 className="card-title"><i className="fas fa-mobile-alt me-2"></i>{t('pendingDevices')}</h3>
//           <div className="row mb-3">
//             <div className="col-md-12">
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder={`${t('name')} or ${t('email')}`}
//                 value={pendingFilterName}
//                 onChange={(e) => { setPendingFilterName(e.target.value); setPendingPage(1); }}
//               />
//             </div>
//           </div>
//           <div className="table-responsive">
//             <table className="table table-hover">
//               <thead className="table-primary">
//                 <tr>
//                   <th>{t('name')}</th>
//                   <th>{t('email')}</th>
//                   <th>{t('branch')}</th>
//                   <th>{t('device')}</th>
//                   <th>{t('actions')}</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {pendingDevices.length === 0 ? (
//                   <tr>
//                     <td colSpan="5">{t('noData')}</td>
//                   </tr>
//                 ) : (
//                   pendingDevices.map((d) => (
//                     <tr key={d.deviceFingerprint}>
//                       <td>{d.userName}</td>
//                       <td>{d.userEmail}</td>
//                       <td>{d.branches?.map(b => b.name).join(', ') || 'N/A'}</td>
//                       <td>{d.deviceFingerprint}</td>
//                       <td>
//                         <button
//                           className="btn btn-sm btn-success me-1"
//                           onClick={() => handleApprove(d.userId, d.deviceFingerprint)}
//                         >
//                           <i className="fas fa-check"></i> {t('approve')}
//                         </button>
//                         <button
//                           className="btn btn-sm btn-danger"
//                           onClick={() => handleReject(d.userId, d.deviceFingerprint)}
//                         >
//                           <i className="fas fa-times"></i> {t('reject')}
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//           <nav>
//             <ul className="pagination justify-content-center">
//               <li className="page-item">
//                 <button
//                   className="page-link"
//                   onClick={() => setPendingPage(p => p - 1)}
//                   disabled={pendingPage === 1}
//                 >
//                   <i className="fas fa-chevron-left"></i> {t('previous')}
//                 </button>
//               </li>
//               <li className="page-item disabled">
//                 <span className="page-link">{pendingPage} / {pendingPages}</span>
//               </li>
//               <li className="page-item">
//                 <button
//                   className="page-link"
//                   onClick={() => setPendingPage(p => p + 1)}
//                   disabled={pendingPage >= pendingPages}
//                 >
//                   {t('next')} <i className="fas fa-chevron-right"></i>
//                 </button>
//               </li>
//             </ul>
//           </nav>
//         </div>
//       </div>

//       {editUser && (
//         <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
//           <div className="modal-dialog modal-lg" role="document">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title"><i className="fas fa-user-edit me-2"></i>{t('edit')} {editUser.name}</h5>
//                 <button type="button" className="btn-close" onClick={() => setEditUser(null)} aria-label="Close"></button>
//               </div>
//               <div className="modal-body">
//                 <form>
//                   <div className="row">
//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">{t('name')}</label>
//                       <input
//                         type="text"
//                         className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
//                         value={editUser.name}
//                         onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
//                       />
//                       {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
//                     </div>
//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">{t('email')}</label>
//                       <input
//                         type="email"
//                         className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
//                         value={editUser.email}
//                         onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
//                       />
//                       {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
//                     </div>
//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">{t('role')}</label>
//                       <select
//                         className="form-select"
//                         value={editUser.role}
//                         onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
//                       >
//                         <option value="staff">{t('staff')}</option>
//                         <option value="admin">{t('admin')}</option>
//                       </select>
//                     </div>
//                     <div className="col-md-12 mb-3">
//                       <label className="form-label">{t('branches')}</label>
//                       <div className="checkbox-group">
//                         {branches.map((branch) => (
//                           <div key={branch._id} className="form-check form-check-inline">
//                             <input
//                               type="checkbox"
//                               className="form-check-input"
//                               id={`edit-branch-${branch._id}`}
//                               checked={editUser.branches.includes(branch._id)}
//                               onChange={() => handleBranchChange(branch._id)}
//                             />
//                             <label className="form-check-label" htmlFor={`edit-branch-${branch._id}`}>
//                               {branch.name}
//                             </label>
//                           </div>
//                         ))}
//                       </div>
//                       {formErrors.branches && <div className="text-danger">{formErrors.branches}</div>}
//                     </div>
//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">{t('phone')}</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         value={editUser.phone || ''}
//                         onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })}
//                       />
//                     </div>
//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">{t('address')}</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         value={editUser.address || ''}
//                         onChange={(e) => setEditUser({ ...editUser, address: e.target.value })}
//                       />
//                     </div>
//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">{t('salary')}</label>
//                       <input
//                         type="number"
//                         className={`form-control ${formErrors.salary ? 'is-invalid' : ''}`}
//                         value={editUser.salary || ''}
//                         onChange={(e) => setEditUser({ ...editUser, salary: e.target.value })}
//                       />
//                       {formErrors.salary && <div className="invalid-feedback">{formErrors.salary}</div>}
//                     </div>
//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">{t('requiredWorkingDays')}</label>
//                       <input
//                         type="number"
//                         className={`form-control ${formErrors.requiredWorkingDays ? 'is-invalid' : ''}`}
//                         value={editUser.requiredWorkingDays}
//                         onChange={(e) => setEditUser({ ...editUser, requiredWorkingDays: e.target.value })}
//                       />
//                       {formErrors.requiredWorkingDays && <div className="invalid-feedback">{formErrors.requiredWorkingDays}</div>}
//                     </div>
//                     <div className="col-md-12 mb-3">
//                       <label className="form-label">{t('workingDaysNames')}</label>
//                       <div className="checkbox-group">
//                         {daysOfWeek.map((day) => (
//                           <div key={day} className="form-check form-check-inline">
//                             <input
//                               type="checkbox"
//                               className="form-check-input"
//                               id={`edit-day-${day}`}
//                               checked={editUser.workingDaysNames.includes(day)}
//                               onChange={() => handleDayChange(day)}
//                             />
//                             <label className="form-check-label" htmlFor={`edit-day-${day}`}>
//                               {t(day.toLowerCase())}
//                             </label>
//                           </div>
//                         ))}
//                       </div>
//                       {formErrors.workingDaysNames && <div className="text-danger">{formErrors.workingDaysNames}</div>}
//                     </div>
//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">{t('workingHoursPerDay')}</label>
//                       <input
//                         type="number"
//                         className={`form-control ${formErrors.workingHoursPerDay ? 'is-invalid' : ''}`}
//                         value={editUser.workingHoursPerDay}
//                         onChange={(e) => setEditUser({ ...editUser, workingHoursPerDay: e.target.value })}
//                       />
//                       {formErrors.workingHoursPerDay && <div className="invalid-feedback">{formErrors.workingHoursPerDay}</div>}
//                     </div>
//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">{t('workStartTime')}</label>
//                       <input
//                         type="time"
//                         className={`form-control ${formErrors.time ? 'is-invalid' : ''}`}
//                         value={editUser.workStartTime}
//                         onChange={(e) => setEditUser({ ...editUser, workStartTime: e.target.value })}
//                       />
//                       {formErrors.time && <div className="invalid-feedback">{formErrors.time}</div>}
//                     </div>
//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">{t('workEndTime')}</label>
//                       <input
//                         type="time"
//                         className={`form-control ${formErrors.time ? 'is-invalid' : ''}`}
//                         value={editUser.workEndTime}
//                         onChange={(e) => setEditUser({ ...editUser, workEndTime: e.target.value })}
//                       />
//                       {formErrors.time && <div className="invalid-feedback">{formErrors.time}</div>}
//                     </div>
//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">{t('absenceDeductionRate')}</label>
//                       <input
//                         type="number"
//                         className="form-control"
//                         value={editUser.absenceDeductionRate}
//                         onChange={(e) => setEditUser({ ...editUser, absenceDeductionRate: e.target.value })}
//                       />
//                     </div>
//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">{t('lateDeductionRate')}</label>
//                       <input
//                         type="number"
//                         className="form-control"
//                         value={editUser.lateDeductionRate}
//                         onChange={(e) => setEditUser({ ...editUser, lateDeductionRate: e.target.value })}
//                       />
//                     </div>
//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">{t('earlyLeaveDeductionRate')}</label>
//                       <input
//                         type="number"
//                         className="form-control"
//                         value={editUser.earlyLeaveDeductionRate}
//                         onChange={(e) => setEditUser({ ...editUser, earlyLeaveDeductionRate: e.target.value })}
//                       />
//                     </div>
//                     <div className="col-md-6 mb-3 form-check">
//                       <input
//                         type="checkbox"
//                         className="form-check-input"
//                         checked={editUser.allowRemoteAbsence}
//                         onChange={(e) => setEditUser({ ...editUser, allowRemoteAbsence: e.target.checked })}
//                       />
//                       <label className="form-check-label">{t('allowRemoteAbsence')}</label>
//                     </div>
//                     <div className="col-md-6 mb-3 form-check">
//                       <input
//                         type="checkbox"
//                         className="form-check-input"
//                         checked={editUser.isNightShift}
//                         onChange={(e) => setEditUser({ ...editUser, isNightShift: e.target.checked })}
//                       />
//                       <label className="form-check-label">{t('isNightShift')}</label>
//                     </div>
//                   </div>
//                 </form>
//               </div>
//               <div className="modal-footer">
//                 <button type="button" className="btn btn-primary" onClick={handleSave}>
//                   <i className="fas fa-save me-2"></i>{t('save')}
//                 </button>
//                 <button type="button" className="btn btn-secondary" onClick={() => setEditUser(null)}>
//                   <i className="fas fa-times me-2"></i>{t('cancel')}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="card shadow-sm mb-4">
//         <div className="card-body">
//           <h3 className="card-title"><i className="fas fa-money-bill-wave me-2"></i>{t('totalSalaries')}</h3>
//           <div className="row">
//             <div className="col-md-3 mb-3">
//               <label className="form-label">{t('year')}</label>
//               <input
//                 type="number"
//                 className="form-control"
//                 value={year}
//                 onChange={(e) => setYear(e.target.value)}
//               />
//             </div>
//             <div className="col-md-3 mb-3">
//               <label className="form-label">{t('month')}</label>
//               <input
//                 type="number"
//                 className="form-control"
//                 value={month}
//                 min={1}
//                 max={12}
//                 onChange={(e) => setMonth(e.target.value)}
//               />
//             </div>
//             <div className="col-md-3 mb-3">
//               <label className="form-label">{t('selectBranch')}</label>
//               <select
//                 className="form-select"
//                 value={selectedBranch}
//                 onChange={(e) => setSelectedBranch(e.target.value)}
//               >
//                 <option value="">{t('allBranches')}</option>
//                 {branches.map((branch) => (
//                   <option key={branch._id} value={branch._id}>
//                     {branch.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="col-md-3 d-flex align-items-end mb-3">
//               <button className="btn btn-primary w-100" onClick={handleCalculateSalaries}>
//                 <i className="fas fa-calculator me-2"></i>{t('calculateSalaries')}
//               </button>
//             </div>
//           </div>
//           {totalSalaries && (
//             <div className="mt-3">
//               <h4>{t('total')}: {totalSalaries.totalSalaries}</h4>
//               <table className="table table-bordered mt-2">
//                 <thead>
//                   <tr>
//                     <th>{t('branch')}</th>
//                     <th>{t('branchTotal')}</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {Object.entries(totalSalaries.branchTotals).map(([branchId, total]) => {
//                     const branchName = branches.find((b) => b._id === branchId)?.name || branchId;
//                     return (
//                       <tr key={branchId}>
//                         <td>{branchName}</td>
//                         <td>{total}</td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="card shadow-sm mb-4">
//         <div className="card-body">
//           <h3 className="card-title"><i className="fas fa-filter me-2"></i>{t('attendanceFilters')}</h3>
//           <div className="row">
//             <div className="col-md-4 mb-3">
//               <label className="form-label">{t('selectBranch')}</label>
//               <select
//                 className="form-select"
//                 value={selectedBranch}
//                 onChange={(e) => handleBranchFilter(e.target.value)}
//               >
//                 <option value="">{t('allBranches')}</option>
//                 {branches.map((branch) => (
//                   <option key={branch._id} value={branch._id}>
//                     {branch.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="col-md-4 mb-3">
//               <label className="form-label">{t('selectDate')}</label>
//               <input
//                 type="date"
//                 className="form-control"
//                 value={selectedDate}
//                 onChange={(e) => handleDateFilter(e.target.value)}
//               />
//             </div>
//             <div className="col-md-4 mb-3">
//               <label className="form-label">{t('name')}</label>
//               <input
//                 type="text"
//                 className="form-control"
//                 value={attendanceFilterName}
//                 onChange={(e) => { setAttendanceFilterName(e.target.value); setAttendancePage(1); }}
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="card shadow-sm">
//         <div className="card-body">
//           <h3 className="card-title"><i className="fas fa-clipboard-check me-2"></i>{t('attendance')}</h3>
//           <div className="table-responsive">
//             <table className="table table-hover">
//               <thead className="table-primary">
//                 <tr>
//                   <th>{t('name')}</th>
//                   <th>{t('branch')}</th>
//                   <th>{t('date')}</th>
//                   <th>{t('day')}</th>
//                   <th>{t('checkIn')}</th>
//                   <th>{t('checkOut')}</th>
//                   <th>{t('status')}</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {attendance.length === 0 ? (
//                   <tr>
//                     <td colSpan="7">{t('noData')}</td>
//                   </tr>
//                 ) : (
//                   attendance.flatMap((record) =>
//                     record.attendance.length === 0 ? (
//                       <tr key={record.branch._id}>
//                         <td colSpan="7">{t('noData')}</td>
//                       </tr>
//                     ) : (
//                       record.attendance.map((att) => {
//                         const attDate = new Date(att.checkInTime);
//                         return (
//                           <tr key={att._id}>
//                             <td>{att.user?.name || 'N/A'}</td>
//                             <td>{att.branch?.name || 'N/A'}</td>
//                             <td>{attDate.toLocaleDateString()}</td>
//                             <td>{attDate.toLocaleString('en-us', { weekday: 'long' })}</td>
//                             <td>{attDate.toLocaleTimeString()}</td>
//                             <td>
//                               {att.checkOutTime
//                                 ? new Date(att.checkOutTime).toLocaleTimeString()
//                                 : '-'}
//                             </td>
//                             <td>{t(att.dayStatus) || att.dayStatus}</td>
//                           </tr>
//                         );
//                       })
//                     )
//                   )
//                 )}
//               </tbody>
//             </table>
//           </div>
//           <nav>
//             <ul className="pagination justify-content-center">
//               <li className="page-item">
//                 <button
//                   className="page-link"
//                   onClick={attendancePrev}
//                   disabled={attendancePage === 1}
//                 >
//                   <i className="fas fa-chevron-left"></i> {t('previous')}
//                 </button>
//               </li>
//               <li className="page-item disabled">
//                 <span className="page-link">{attendancePage} / {attendancePagination.pages}</span>
//               </li>
//               <li className="page-item">
//                 <button
//                   className="page-link"
//                   onClick={attendanceNext}
//                   disabled={attendancePage >= attendancePagination.pages}
//                 >
//                   {t('next')} <i className="fas fa-chevron-right"></i>
//                 </button>
//               </li>
//             </ul>
//           </nav>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiGet, apiPost, apiPut, apiDelete } from '../helpers/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../style/AdminDashboard.css';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [employees, setEmployees] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [attendance, setAttendance] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [attendancePage, setAttendancePage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [editUser, setEditUser] = useState(null);
  const [totalSalaries, setTotalSalaries] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [pendingDevices, setPendingDevices] = useState([]);
  const [pendingPage, setPendingPage] = useState(1);
  const [pendingPages, setPendingPages] = useState(1);
  const [filterName, setFilterName] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [pendingFilterName, setPendingFilterName] = useState('');
  const [attendanceFilterName, setAttendanceFilterName] = useState('');
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Calculate working hours
  const calculateWorkingHours = (startTime, endTime, isNightShift = false) => {
    if (!startTime || !endTime) return 0;
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    let startMinutes = startHour * 60 + startMin;
    let endMinutes = endHour * 60 + endMin;
    if (isNightShift && endHour < startHour) {
      endMinutes += 24 * 60;
    }
    return Math.max(0, (endMinutes - startMinutes) / 60);
  };

  // Calculate expected monthly working days
  const calculateMonthlyWorkingDays = (workingDaysNames) => {
    if (!workingDaysNames.length) return 0;
    const weeksPerMonth = 4.33;
    return Math.round(workingDaysNames.length * weeksPerMonth);
  };

  // Initialize Bootstrap Toast
  useEffect(() => {
    if (window.bootstrap && window.bootstrap.Toast) {
      const toastElList = [].slice.call(document.querySelectorAll('.toast'));
      toastElList.forEach((toastEl) => {
        new window.bootstrap.Toast(toastEl, { autohide: true, delay: 5000 }).show();
      });
    }
  }, [error, success]);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const params = new URLSearchParams();
        params.append('page', pendingPage);
        if (pendingFilterName) params.append('search', encodeURIComponent(pendingFilterName));
        const res = await apiGet(`/users/pending-devices?${params.toString()}`);
        setPendingDevices(res.data.pendingDevices || []);
        setPendingPages(res.data.pagination?.pages || 1);
      } catch (err) {
        setError(t('error'));
      }
    };
    fetchPending();
  }, [pendingPage, pendingFilterName, t]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const branchRes = await apiGet('/branches');
        setBranches(branchRes.data || []);
        const params = new URLSearchParams();
        params.append('page', currentPage);
        params.append('limit', itemsPerPage);
        if (filterName) params.append('name', encodeURIComponent(filterName));
        if (filterBranch) params.append('branch', filterBranch);
        const userRes = await apiGet(`/users?${params.toString()}`);
        setEmployees(userRes.data.users || []);
        setTotalPages(userRes.data.totalPages || 1);
        handleAttendanceFilter();
      } catch (err) {
        setError(t('error'));
      }
    };
    fetchData();
  }, [currentPage, filterName, filterBranch, t]);

  const handleAttendanceFilter = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedBranch) params.append('branch', selectedBranch);
      if (selectedDate) params.append('date', selectedDate);
      if (attendanceFilterName) params.append('name', encodeURIComponent(attendanceFilterName));
      params.append('page', attendancePage);
      params.append('limit', itemsPerPage);
      const attendanceRes = await apiGet(`/admin/attendance?${params.toString()}`);
      setAttendance(attendanceRes.data || []);
    } catch (err) {
      setError(t('error'));
    }
  };

  useEffect(() => {
    handleAttendanceFilter();
  }, [selectedBranch, selectedDate, attendancePage, attendanceFilterName]);

  useEffect(() => {
    if (editUser) {
      const calculatedHours = calculateWorkingHours(
        editUser.workStartTime,
        editUser.workEndTime,
        editUser.isNightShift
      );
      const expectedDays = calculateMonthlyWorkingDays(editUser.workingDaysNames);
      setEditUser((prev) => ({
        ...prev,
        calculatedWorkingHours: calculatedHours,
        expectedMonthlyWorkingDays: expectedDays,
      }));
    }
  }, [editUser?.workStartTime, editUser?.workEndTime, editUser?.isNightShift, editUser?.workingDaysNames]);

  const handleBranchFilter = (branchId) => {
    setSelectedBranch(branchId);
    setAttendancePage(1);
  };

  const handleDateFilter = (date) => {
    setSelectedDate(date);
    setAttendancePage(1);
  };

  const handleEdit = (user) => {
    setEditUser({
      ...user,
      branches: Array.isArray(user.branches) ? user.branches.map((b) => b._id) : [],
      workingDaysNames: Array.isArray(user.workingDaysNames)
        ? user.workingDaysNames
        : user.workingDaysNames
        ? user.workingDaysNames.split(',')
        : [],
      absenceDeductionRate: user.absenceDeductionRate * 100,
      lateDeductionRate: user.lateDeductionRate * 100,
      earlyLeaveDeductionRate: user.earlyLeaveDeductionRate * 100,
      workStartTime: user.workStartTime || '09:00',
      workEndTime: user.workEndTime || '17:00',
      isNightShift: user.isNightShift || false,
      allowRemoteAbsence: user.allowRemoteAbsence || false,
      calculatedWorkingHours: user.workingHoursPerDay || 8,
      expectedMonthlyWorkingDays: user.requiredWorkingDays || 22,
    });
    setFormErrors({});
  };

  const handleDelete = async (id) => {
    setDeleteUserId(id);
  };

  const confirmDelete = async () => {
    try {
      await apiDelete(`/users/${deleteUserId}`);
      const params = new URLSearchParams();
      params.append('page', currentPage);
      params.append('limit', itemsPerPage);
      if (filterName) params.append('name', encodeURIComponent(filterName));
      if (filterBranch) params.append('branch', filterBranch);
      const userRes = await apiGet(`/users?${params.toString()}`);
      setEmployees(userRes.data.users || []);
      setTotalPages(userRes.data.totalPages || 1);
      setSuccess(t('success'));
      setDeleteUserId(null);
    } catch (err) {
      setError(err.response?.data?.message || t('error'));
      setDeleteUserId(null);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!editUser.name) errors.name = t('nameRequired');
    if (!editUser.email) errors.email = t('emailRequired');
    if (!editUser.workingDaysNames.length) errors.workingDaysNames = t('workingDaysRequired');
    if (!editUser.workStartTime || !editUser.workEndTime) {
      errors.time = t('timeRequired');
    } else {
      const calculatedHours = calculateWorkingHours(
        editUser.workStartTime,
        editUser.workEndTime,
        editUser.isNightShift
      );
      if (calculatedHours <= 0) {
        errors.time = editUser.isNightShift ? t('invalidNightShiftTime') : t('endTimeAfterStart');
      }
    }
    if (!editUser.branches.length) errors.branches = t('branchesRequired');
    if (!editUser.salary || editUser.salary <= 0) errors.salary = t('salaryRequired');
    if (editUser.absenceDeductionRate < 0 || editUser.absenceDeductionRate > 100) {
      errors.absenceDeductionRate = t('invalidDeductionRate');
    }
    if (editUser.lateDeductionRate < 0 || editUser.lateDeductionRate > 100) {
      errors.lateDeductionRate = t('invalidDeductionRate');
    }
    if (editUser.earlyLeaveDeductionRate < 0 || editUser.earlyLeaveDeductionRate > 100) {
      errors.earlyLeaveDeductionRate = t('invalidDeductionRate');
    }
    return errors;
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':').map(Number);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const handleSave = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    try {
      const dataToSend = {
        ...editUser,
        workingDaysNames: editUser.workingDaysNames.join(','),
        branches: editUser.branches,
        absenceDeductionRate: editUser.absenceDeductionRate / 100,
        lateDeductionRate: editUser.lateDeductionRate / 100,
        earlyLeaveDeductionRate: editUser.earlyLeaveDeductionRate / 100,
        isNightShift: editUser.isNightShift,
        allowRemoteAbsence: editUser.allowRemoteAbsence,
        workStartTime: formatTime(editUser.workStartTime),
        workEndTime: formatTime(editUser.workEndTime),
        workingHoursPerDay: editUser.calculatedWorkingHours,
        requiredWorkingDays: editUser.expectedMonthlyWorkingDays,
      };
      await apiPut(`/users/${editUser._id}`, dataToSend);
      const params = new URLSearchParams();
      params.append('page', currentPage);
      params.append('limit', itemsPerPage);
      if (filterName) params.append('name', encodeURIComponent(filterName));
      if (filterBranch) params.append('branch', filterBranch);
      const userRes = await apiGet(`/users?${params.toString()}`);
      setEmployees(userRes.data.users || []);
      setTotalPages(userRes.data.totalPages || 1);
      setEditUser(null);
      setSuccess(t('success'));
      setFormErrors({});
    } catch (err) {
      console.error('Update error:', err.response?.data);
      setError(t('error') + ': ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDayChange = (day) => {
    setEditUser((prev) => {
      const workingDaysNames = prev.workingDaysNames.includes(day)
        ? prev.workingDaysNames.filter((d) => d !== day)
        : [...prev.workingDaysNames, day];
      return { ...prev, workingDaysNames };
    });
    setFormErrors((prev) => ({ ...prev, workingDaysNames: '' }));
  };

  const handleBranchChange = (branchId) => {
    setEditUser((prev) => {
      const branches = prev.branches.includes(branchId)
        ? prev.branches.filter((id) => id !== branchId)
        : [...prev.branches, branchId];
      return { ...prev, branches };
    });
    setFormErrors((prev) => ({ ...prev, branches: '' }));
  };

  const handleAddEmployee = async () => {
    navigate('/add-employee');
  };

  const handleCalculateSalaries = async () => {
    try {
      const res = await apiGet(`/admin/total-salaries?year=${year}&month=${month}${selectedBranch ? `&branchId=${selectedBranch}` : ''}`);
      setTotalSalaries(res.data);
    } catch (err) {
      setError(err.response?.data?.message || t('error'));
    }
  };

  const handleResendActivation = async (userId) => {
    try {
      await apiPost(`/auth/resend-activation/${userId}`, { userId });
      setSuccess(t('resendSuccess'));
    } catch (err) {
      setError(err.response?.data?.message || t('error'));
    }
  };

  const handleApprove = async (userId, fingerprint) => {
    try {
      await apiPost('/users/approve-device', { userId, deviceFingerprint: fingerprint });
      const params = new URLSearchParams();
      params.append('page', pendingPage);
      if (pendingFilterName) params.append('name', encodeURIComponent(pendingFilterName));
      const res = await apiGet(`/users/pending-devices?${params.toString()}`);
      setPendingDevices(res.data.pendingDevices || []);
      setPendingPages(res.data.pagination?.pages || 1);
      setSuccess(t('success'));
    } catch (err) {
      setError(err.response?.data?.message || t('error'));
    }
  };

  const handleReject = async (userId, fingerprint) => {
    try {
      await apiPost('/users/reject-device', { userId, deviceFingerprint: fingerprint });
      const params = new URLSearchParams();
      params.append('page', pendingPage);
      if (pendingFilterName) params.append('name', encodeURIComponent(pendingFilterName));
      const res = await apiGet(`/users/pending-devices?${params.toString()}`);
      setPendingDevices(res.data.pendingDevices || []);
      setPendingPages(res.data.pagination?.pages || 1);
      setSuccess(t('success'));
    } catch (err) {
      setError(err.response?.data?.message || t('error'));
    }
  };

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const attendancePagination = attendance[0]?.pagination || { page: 1, pages: 1 };
  const attendancePrev = () => {
    if (attendancePage > 1) setAttendancePage(attendancePage - 1);
  };
  const attendanceNext = () => {
    if (attendancePage < attendancePagination.pages) setAttendancePage(attendancePage + 1);
  };

  return (
    <div className="container-fluid dashboard-container">
      <h2 className="dashboard-title"><i className="fas fa-tachometer-alt me-2"></i>{t('dashboard')}</h2>

      {/* Toast Container */}
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

      {/* Delete Confirmation Modal */}
      {deleteUserId && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content delete-modal">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">
                  <i className="fas fa-exclamation-triangle me-2"></i>{t('delete')} {t('user')}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setDeleteUserId(null)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p>{t('confirmDelete')}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-success" onClick={confirmDelete}>
                  <i className="fas fa-check me-2"></i>{t('delete')}
                </button>
                <button type="button" className="btn btn-danger" onClick={() => setDeleteUserId(null)}>
                  <i className="fas fa-times me-2"></i>{t('cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h3 className="card-title"><i className="fas fa-users me-2"></i>{t('employees')}</h3>
          <button className="btn btn-primary mb-3" onClick={handleAddEmployee}>
            <i className="fas fa-user-plus me-2"></i>{t('addEmployee')}
          </button>
          <div className="row mb-3">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder={t('name')}
                value={filterName}
                onChange={(e) => {
                  setFilterName(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="col-md-6">
              <select
                className="form-select"
                value={filterBranch}
                onChange={(e) => {
                  setFilterBranch(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">{t('allBranches')}</option>
                {branches.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-primary">
                <tr>
                  <th>{t('name')}</th>
                  <th>{t('email')}</th>
                  <th>{t('branch')}</th>
                  <th>{t('active')}</th>
                  <th>{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {employees.length === 0 ? (
                  <tr>
                    <td colSpan="5">{t('noData')}</td>
                  </tr>
                ) : (
                  employees.map((emp) => (
                    <tr key={emp._id}>
                      <td>{emp.name}</td>
                      <td>{emp.email}</td>
                      <td>{emp.branches.map((b) => b.name).join(', ')}</td>
                      <td>
                        {emp.isActive ? (
                          <span className="badge bg-success">{t('active')}</span>
                        ) : (
                          <span className="badge bg-secondary">{t('inactive')}</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-info me-1"
                          onClick={() => navigate(`/profile/${emp._id}`)}
                        >
                          <i className="fas fa-eye"></i> {t('viewProfile')}
                        </button>
                        <button
                          className="btn btn-sm btn-warning me-1"
                          onClick={() => handleEdit(emp)}
                        >
                          <i className="fas fa-edit"></i> {t('edit')}
                        </button>
                        <button
                          className="btn btn-sm btn-danger me-1"
                          onClick={() => handleDelete(emp._id)}
                        >
                          <i className="fas fa-trash"></i> {t('delete')}
                        </button>
                        {!emp.isActive && (
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleResendActivation(emp._id)}
                          >
                            <i className="fas fa-envelope"></i> {t('resendActivation')}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <nav>
            <ul className="pagination justify-content-center">
              <li className="page-item">
                <button
                  className="page-link"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <i className="fas fa-chevron-left"></i> {t('previous')}
                </button>
              </li>
              <li className="page-item disabled">
                <span className="page-link">
                  {currentPage} / {totalPages}
                </span>
              </li>
              <li className="page-item">
                <button
                  className="page-link"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  {t('next')} <i className="fas fa-chevron-right"></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h3 className="card-title"><i className="fas fa-mobile-alt me-2"></i>{t('pendingDevices')}</h3>
          <div className="row mb-3">
            <div className="col-md-12">
              <input
                type="text"
                className="form-control"
                placeholder={`${t('name')} or ${t('email')}`}
                value={pendingFilterName}
                onChange={(e) => {
                  setPendingFilterName(e.target.value);
                  setPendingPage(1);
                }}
              />
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-primary">
                <tr>
                  <th>{t('name')}</th>
                  <th>{t('email')}</th>
                  <th>{t('branch')}</th>
                  <th>{t('device')}</th>
                  <th>{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {pendingDevices.length === 0 ? (
                  <tr>
                    <td colSpan="5">{t('noData')}</td>
                  </tr>
                ) : (
                  pendingDevices.map((d) => (
                    <tr key={d.deviceFingerprint}>
                      <td>{d.userName}</td>
                      <td>{d.userEmail}</td>
                      <td>{d.branches?.map((b) => b.name).join(', ') || 'N/A'}</td>
                      <td>{d.deviceFingerprint}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-success me-1"
                          onClick={() => handleApprove(d.userId, d.deviceFingerprint)}
                        >
                          <i className="fas fa-check"></i> {t('approve')}
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleReject(d.userId, d.deviceFingerprint)}
                        >
                          <i className="fas fa-times"></i> {t('reject')}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <nav>
            <ul className="pagination justify-content-center">
              <li className="page-item">
                <button
                  className="page-link"
                  onClick={() => setPendingPage((p) => p - 1)}
                  disabled={pendingPage === 1}
                >
                  <i className="fas fa-chevron-left"></i> {t('previous')}
                </button>
              </li>
              <li className="page-item disabled">
                <span className="page-link">
                  {pendingPage} / {pendingPages}
                </span>
              </li>
              <li className="page-item">
                <button
                  className="page-link"
                  onClick={() => setPendingPage((p) => p + 1)}
                  disabled={pendingPage >= pendingPages}
                >
                  {t('next')} <i className="fas fa-chevron-right"></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {editUser && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-user-edit me-2"></i>
                  {t('edit')} {editUser.name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditUser(null)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">{t('name')} *</label>
                      <input
                        type="text"
                        className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                        value={editUser.name}
                        onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                      />
                      {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">{t('email')} *</label>
                      <input
                        type="email"
                        className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                        value={editUser.email}
                        onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                      />
                      {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">{t('role')}</label>
                      <select
                        className="form-select"
                        value={editUser.role}
                        onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                      >
                        <option value="staff">{t('staff')}</option>
                        <option value="admin">{t('admin')}</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">{t('salary')} * (شهري)</label>
                      <input
                        type="number"
                        className={`form-control ${formErrors.salary ? 'is-invalid' : ''}`}
                        value={editUser.salary}
                        onChange={(e) => setEditUser({ ...editUser, salary: e.target.value })}
                        min="0"
                        step="0.01"
                      />
                      {formErrors.salary && <div className="invalid-feedback">{formErrors.salary}</div>}
                    </div>
                    <div className="col-md-12 mb-3">
                      <label className="form-label">{t('branches')} *</label>
                      <div className="checkbox-group border p-3 rounded">
                        {branches.map((branch) => (
                          <div key={branch._id} className="form-check form-check-inline">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id={`edit-branch-${branch._id}`}
                              checked={editUser.branches.includes(branch._id)}
                              onChange={() => handleBranchChange(branch._id)}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`edit-branch-${branch._id}`}
                            >
                              {branch.name}
                            </label>
                          </div>
                        ))}
                      </div>
                      {formErrors.branches && (
                        <div className="text-danger mt-1">{formErrors.branches}</div>
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">{t('phone')}</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editUser.phone || ''}
                        onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">{t('address')}</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editUser.address || ''}
                        onChange={(e) => setEditUser({ ...editUser, address: e.target.value })}
                      />
                    </div>
                    <div className="col-md-12 mb-3">
                      <label className="form-label">{t('workingDaysNames')} *</label>
                      <div className="checkbox-group border p-3 rounded">
                        {daysOfWeek.map((day) => (
                          <div key={day} className="form-check form-check-inline">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id={`edit-day-${day}`}
                              checked={editUser.workingDaysNames.includes(day)}
                              onChange={() => handleDayChange(day)}
                            />
                            <label className="form-check-label" htmlFor={`edit-day-${day}`}>
                              {t(day.toLowerCase())}
                            </label>
                          </div>
                        ))}
                      </div>
                      {formErrors.workingDaysNames && (
                        <div className="text-danger mt-1">{formErrors.workingDaysNames}</div>
                      )}
                      <small className="text-muted">
                        الأيام المتوقعة شهرياً: {editUser.expectedMonthlyWorkingDays} يوم
                      </small>
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">{t('workStartTime')} *</label>
                      <input
                        type="time"
                        className={`form-control ${formErrors.time ? 'is-invalid' : ''}`}
                        value={editUser.workStartTime}
                        onChange={(e) =>
                          setEditUser({ ...editUser, workStartTime: e.target.value })
                        }
                      />
                      {formErrors.time && <div className="invalid-feedback">{formErrors.time}</div>}
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">{t('workEndTime')} *</label>
                      <input
                        type="time"
                        className={`form-control ${formErrors.time ? 'is-invalid' : ''}`}
                        value={editUser.workEndTime}
                        onChange={(e) =>
                          setEditUser({ ...editUser, workEndTime: e.target.value })
                        }
                      />
                      {formErrors.time && <div className="invalid-feedback">{formErrors.time}</div>}
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">ساعات العمل اليومية</label>
                      <input
                        type="number"
                        className="form-control"
                        value={editUser.calculatedWorkingHours}
                        disabled
                        style={{ backgroundColor: '#f8f9fa' }}
                      />
                      <small className="text-muted">محسوبة تلقائياً</small>
                    </div>
                    <div className="mb-3 form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="isNightShift"
                        checked={editUser.isNightShift}
                        onChange={(e) =>
                          setEditUser({ ...editUser, isNightShift: e.target.checked })
                        }
                      />
                      <label className="form-check-label" htmlFor="isNightShift">
                        {t('isNightShift')} (العمل عبر منتصف الليل)
                      </label>
                    </div>
                    <div className="card mb-3">
                      <div className="card-header">
                        <h5 className="mb-0">معدلات الخصم (%)</h5>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-4 mb-3">
                            <label className="form-label">{t('absenceDeductionRate')} (%)</label>
                            <input
                              type="number"
                              className={`form-control ${
                                formErrors.absenceDeductionRate ? 'is-invalid' : ''
                              }`}
                              value={editUser.absenceDeductionRate}
                              onChange={(e) =>
                                setEditUser({
                                  ...editUser,
                                  absenceDeductionRate: e.target.value,
                                })
                              }
                              min="0"
                              max="100"
                              step="0.1"
                            />
                            {formErrors.absenceDeductionRate && (
                              <div className="invalid-feedback">
                                {formErrors.absenceDeductionRate}
                              </div>
                            )}
                            <small className="text-muted">
                              نسبة الخصم من الراتب اليومي عن كل يوم غياب
                            </small>
                          </div>
                          <div className="col-md-4 mb-3">
                            <label className="form-label">{t('lateDeductionRate')} (%)</label>
                            <input
                              type="number"
                              className={`form-control ${
                                formErrors.lateDeductionRate ? 'is-invalid' : ''
                              }`}
                              value={editUser.lateDeductionRate}
                              onChange={(e) =>
                                setEditUser({
                                  ...editUser,
                                  lateDeductionRate: e.target.value,
                                })
                              }
                              min="0"
                              max="100"
                              step="0.1"
                            />
                            {formErrors.lateDeductionRate && (
                              <div className="invalid-feedback">
                                {formErrors.lateDeductionRate}
                              </div>
                            )}
                            <small className="text-muted">
                              نسبة الخصم من الراتب الساعي عن كل ساعة تأخير
                            </small>
                          </div>
                          <div className="col-md-4 mb-3">
                            <label className="form-label">{t('earlyLeaveDeductionRate')} (%)</label>
                            <input
                              type="number"
                              className={`form-control ${
                                formErrors.earlyLeaveDeductionRate ? 'is-invalid' : ''
                              }`}
                              value={editUser.earlyLeaveDeductionRate}
                              onChange={(e) =>
                                setEditUser({
                                  ...editUser,
                                  earlyLeaveDeductionRate: e.target.value,
                                })
                              }
                              min="0"
                              max="100"
                              step="0.1"
                            />
                            {formErrors.earlyLeaveDeductionRate && (
                              <div className="invalid-feedback">
                                {formErrors.earlyLeaveDeductionRate}
                              </div>
                            )}
                            <small className="text-muted">
                              نسبة الخصم من الراتب الساعي عن كل ساعة انصراف مبكر
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mb-3 form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="allowRemoteAbsence"
                        checked={editUser.allowRemoteAbsence}
                        onChange={(e) =>
                          setEditUser({ ...editUser, allowRemoteAbsence: e.target.checked })
                        }
                      />
                      <label className="form-check-label" htmlFor="allowRemoteAbsence">
                        {t('allowRemoteAbsence')}
                      </label>
                    </div>
                    <div className="card mb-3">
                      <div className="card-header">
                        <h5 className="mb-0">ملخص الراتب</h5>
                      </div>
                      <div className="card-body">
                        {editUser.salary > 0 && editUser.expectedMonthlyWorkingDays > 0 && (
                          <div className="row">
                            <div className="col-md-4">
                              <strong>الراتب الشهري:</strong> {editUser.salary} جنيه
                            </div>
                            <div className="col-md-4">
                              <strong>الراتب اليومي:</strong>{' '}
                              {(editUser.salary / editUser.expectedMonthlyWorkingDays).toFixed(2)}{' '}
                              جنيه
                            </div>
                            <div className="col-md-4">
                              <strong>الراتب الساعي:</strong>{' '}
                              {editUser.calculatedWorkingHours > 0
                                ? (
                                    editUser.salary /
                                    (editUser.expectedMonthlyWorkingDays *
                                      editUser.calculatedWorkingHours)
                                  ).toFixed(2)
                                : '0'}{' '}
                              جنيه
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={handleSave}>
                  <i className="fas fa-save me-2"></i>{t('save')}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setEditUser(null)}>
                  <i className="fas fa-times me-2"></i>{t('cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h3 className="card-title"><i className="fas fa-money-bill-wave me-2"></i>{t('totalSalaries')}</h3>
          <div className="row">
            <div className="col-md-3 mb-3">
              <label className="form-label">{t('year')}</label>
              <input
                type="number"
                className="form-control"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label">{t('month')}</label>
              <input
                type="number"
                className="form-control"
                value={month}
                min={1}
                max={12}
                onChange={(e) => setMonth(e.target.value)}
              />
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label">{t('selectBranch')}</label>
              <select
                className="form-select"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
              >
                <option value="">{t('allBranches')}</option>
                {branches.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3 d-flex align-items-end mb-3">
              <button className="btn btn-primary w-100" onClick={handleCalculateSalaries}>
                <i className="fas fa-calculator me-2"></i>{t('calculateSalaries')}
              </button>
            </div>
          </div>
          {totalSalaries && (
            <div className="mt-3">
              <h4>{t('total')}: {totalSalaries.totalSalaries}</h4>
              <table className="table table-bordered mt-2">
                <thead>
                  <tr>
                    <th>{t('branch')}</th>
                    <th>{t('branchTotal')}</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(totalSalaries.branchTotals).map(([branchId, total]) => {
                    const branchName = branches.find((b) => b._id === branchId)?.name || branchId;
                    return (
                      <tr key={branchId}>
                        <td>{branchName}</td>
                        <td>{total}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h3 className="card-title"><i className="fas fa-filter me-2"></i>{t('attendanceFilters')}</h3>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">{t('selectBranch')}</label>
              <select
                className="form-select"
                value={selectedBranch}
                onChange={(e) => handleBranchFilter(e.target.value)}
              >
                <option value="">{t('allBranches')}</option>
                {branches.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">{t('selectDate')}</label>
              <input
                type="date"
                className="form-control"
                value={selectedDate}
                onChange={(e) => handleDateFilter(e.target.value)}
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">{t('name')}</label>
              <input
                type="text"
                className="form-control"
                value={attendanceFilterName}
                onChange={(e) => {
                  setAttendanceFilterName(e.target.value);
                  setAttendancePage(1);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="card-title"><i className="fas fa-clipboard-check me-2"></i>{t('attendance')}</h3>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-primary">
                <tr>
                  <th>{t('name')}</th>
                  <th>{t('branch')}</th>
                  <th>{t('date')}</th>
                  <th>{t('day')}</th>
                  <th>{t('checkIn')}</th>
                  <th>{t('checkOut')}</th>
                  <th>{t('status')}</th>
                </tr>
              </thead>
              <tbody>
                {attendance.length === 0 ? (
                  <tr>
                    <td colSpan="7">{t('noData')}</td>
                  </tr>
                ) : (
                  attendance.flatMap((record) =>
                    record.attendance.length === 0 ? (
                      <tr key={record.branch._id}>
                        <td colSpan="7">{t('noData')}</td>
                      </tr>
                    ) : (
                      record.attendance.map((att) => {
                        const attDate = new Date(att.checkInTime);
                        return (
                          <tr key={att._id}>
                            <td>{att.user?.name || 'N/A'}</td>
                            <td>{att.branch?.name || 'N/A'}</td>
                            <td>{attDate.toLocaleDateString()}</td>
                            <td>{attDate.toLocaleString('en-us', { weekday: 'long' })}</td>
                            <td>{attDate.toLocaleTimeString()}</td>
                            <td>
                              {att.checkOutTime
                                ? new Date(att.checkOutTime).toLocaleTimeString()
                                : '-'}
                            </td>
                            <td>{t(att.dayStatus) || att.dayStatus}</td>
                          </tr>
                        );
                      })
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
          <nav>
            <ul className="pagination justify-content-center">
              <li className="page-item">
                <button
                  className="page-link"
                  onClick={attendancePrev}
                  disabled={attendancePage === 1}
                >
                  <i className="fas fa-chevron-left"></i> {t('previous')}
                </button>
              </li>
              <li className="page-item disabled">
                <span className="page-link">
                  {attendancePage} / {attendancePagination.pages}
                </span>
              </li>
              <li className="page-item">
                <button
                  className="page-link"
                  onClick={attendanceNext}
                  disabled={attendancePage >= attendancePagination.pages}
                >
                  {t('next')} <i className="fas fa-chevron-right"></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;