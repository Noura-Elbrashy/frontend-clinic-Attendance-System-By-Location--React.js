
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { apiGet, apiPost, apiPut, apiDelete } from '../helpers/api';

// const AdminDashboard = () => {
//   const [employees, setEmployees] = useState([]);
//   const [branches, setBranches] = useState([]);
//   const [selectedBranch, setSelectedBranch] = useState('');
//   const [selectedDate, setSelectedDate] = useState('');
//   const [attendance, setAttendance] = useState([]);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [attendancePage, setAttendancePage] = useState(1);
//   const [itemsPerPage] = useState(10);
//   const [editUser, setEditUser] = useState(null);
//   const [totalSalaries, setTotalSalaries] = useState(null);
//   const [year, setYear] = useState(new Date().getFullYear());
//   const [month, setMonth] = useState(new Date().getMonth() + 1);
//   const navigate = useNavigate();
//   const lang = document.documentElement.getAttribute('lang') || 'en';

//   const translations = {
//     en: {
//       dashboard: 'Admin Dashboard',
//       employees: 'Employees',
//       name: 'Name',
//       email: 'Email',
//       branch: 'Branch',
//       checkIn: 'Check-In',
//       checkOut: 'Check-Out',
//       date: 'Date',
//       day: 'Day',
//       status: 'Status',
//       viewProfile: 'View Profile',
//       selectBranch: 'Select Branch',
//       selectDate: 'Select Date',
//       allBranches: 'All Branches',
//       error: 'An error occurred',
//       previous: 'Previous',
//       next: 'Next',
//       page: 'Page',
//       edit: 'Edit',
//       delete: 'Delete',
//       save: 'Save',
//       cancel: 'Cancel',
//       role: 'Role',
//       phone: 'Phone',
//       address: 'Address',
//       salary: 'Salary',
//       requiredWorkingDays: 'Required Working Days',
//       workingDaysNames: 'Working Days Names',
//       workingHoursPerDay: 'Working Hours Per Day',
//       workStartTime: 'Work Start Time',
//       workEndTime: 'Work End Time',
//       absenceDeductionRate: 'Absence Deduction Rate (%)',
//       lateDeductionRate: 'Late Deduction Rate (%)',
//       earlyLeaveDeductionRate: 'Early Leave Deduction Rate (%)',
//       allowRemoteAbsence: 'Allow Remote Absence',
//       addEmployee: 'Add Employee',
//       totalSalaries: 'Total Salaries',
//       calculateSalaries: 'Calculate Salaries for Month',
//       year: 'Year',
//       month: 'Month',
//       total: 'Total Salaries',
//       branchTotal: 'Branch Total',
//       noData: 'No data available',
//       active: 'Active',
//       resendActivation: 'Resend Activation',
//       resendSuccess: 'Activation email resent',
//     },
//     ar: {
//       dashboard: 'لوحة تحكم الإدارة',
//       employees: 'الموظفون',
//       name: 'الاسم',
//       email: 'البريد الإلكتروني',
//       branch: 'الفرع',
//       checkIn: 'تسجيل الدخول',
//       checkOut: 'تسجيل الخروج',
//       date: 'التاريخ',
//       day: 'اليوم',
//       status: 'الحالة',
//       viewProfile: 'عرض الملف الشخصي',
//       selectBranch: 'اختر الفرع',
//       selectDate: 'اختر التاريخ',
//       allBranches: 'جميع الفروع',
//       error: 'حدث خطأ',
//       previous: 'السابق',
//       next: 'التالي',
//       page: 'الصفحة',
//       edit: 'تعديل',
//       delete: 'حذف',
//       save: 'حفظ',
//       cancel: 'إلغاء',
//       role: 'الدور',
//       phone: 'الهاتف',
//       address: 'العنوان',
//       salary: 'الراتب',
//       requiredWorkingDays: 'أيام العمل المطلوبة',
//       workingDaysNames: 'أسماء أيام العمل',
//       workingHoursPerDay: 'ساعات العمل في اليوم',
//       workStartTime: 'وقت بداية العمل',
//       workEndTime: 'وقت نهاية العمل',
//       absenceDeductionRate: 'نسبة خصم الغياب (%)',
//       lateDeductionRate: 'نسبة خصم التأخير (%)',
//       earlyLeaveDeductionRate: 'نسبة خصم المغادرة المبكرة (%)',
//       allowRemoteAbsence: 'السماح بتسجيل الغياب عن بعد',
//       addEmployee: 'إضافة موظف',
//       totalSalaries: 'إجمالي المرتبات',
//       calculateSalaries: 'حساب المرتبات للشهر',
//       year: 'السنة',
//       month: 'الشهر',
//       total: 'إجمالي المرتبات',
//       branchTotal: 'إجمالي الفرع',
//       noData: 'لا توجد بيانات',
//       active: 'مفعل',
//       resendActivation: 'إعادة إرسال التفعيل',
//       resendSuccess: 'تم إعادة إرسال إيميل التفعيل',
//     },
//   };
// const [pendingDevices, setPendingDevices] = useState([]);
// const [pendingPage, setPendingPage] = useState(1);
// const [pendingPages, setPendingPages] = useState(1);

// useEffect(() => {
//   const fetchPending = async () => {
//     const res = await apiGet(`/users/pending-devices?page=${pendingPage}`);
//     setPendingDevices(res.data.pendingDevices);
//     setPendingPages(res.data.pagination.pages);
//   };
//   fetchPending();
// }, [pendingPage]);
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const branchRes = await apiGet('/branches');
//         setBranches(branchRes.data);
//         const userRes = await apiGet('/users');
//         setEmployees(userRes.data);
//         handleAttendanceFilter();
//       } catch (err) {
//         setError(translations[lang].error);
//       }
//     };
//     fetchData();
//   }, [lang]);

//   const handleAttendanceFilter = async () => {
//     try {
//       const params = new URLSearchParams();
//       if (selectedBranch) params.append('branch', selectedBranch);
//       if (selectedDate) params.append('date', selectedDate);
//       params.append('page', attendancePage);
//       params.append('limit', itemsPerPage);
//       const attendanceRes = await apiGet(`/admin/attendance?${params.toString()}`);
//       setAttendance(attendanceRes.data);
//     } catch (err) {
//       setError(translations[lang].error);
//     }
//   };

//   useEffect(() => {
//     handleAttendanceFilter();
//   }, [selectedBranch, selectedDate, attendancePage]);

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
//       branches: user.branches.map(b => b._id),
//       workingDaysNames: user.workingDaysNames.join(','),
//       absenceDeductionRate: user.absenceDeductionRate * 100,
//       lateDeductionRate: user.lateDeductionRate * 100,
//       earlyLeaveDeductionRate: user.earlyLeaveDeductionRate * 100,
//     });
//   };

//   const handleDelete = async (id) => {
//     try {
//       await apiDelete(`/users/${id}`);
//       setEmployees(employees.filter(u => u._id !== id));
//       setSuccess('User deleted');
//     } catch (err) {
//       setError(err.response?.data?.message || translations[lang].error);
//     }
//   };

// // AdminDashboard.jsx - handleSave المحدث
// const handleSave = async () => {
//   try {
//     const dataToSend = {
//       ...editUser,
//       workingDaysNames: editUser.workingDaysNames, // لا تحويل هنا، لأنها string، والbackend يتعامل معها
//       branches: editUser.branches,
//     };
//     console.log('Sending data:', dataToSend); // للتصحيح
//     await apiPut(`/users/${editUser._id}`, dataToSend);
//     // الباقي كما هو
//   } catch (err) {
//     console.error('Update error:', err.response?.data); // عرض الخطأ التفصيلي
//     setError(translations[lang].error + ': ' + (err.response?.data?.message || err.message));
//   }
// };

//   const handleAddEmployee = async () => {
//     navigate('/add-employee');
//   };

//   const handleCalculateSalaries = async () => {
//     try {
//       const res = await apiGet(`/admin/total-salaries?year=${year}&month=${month}${selectedBranch ? `&branchId=${selectedBranch}` : ''}`);
//       setTotalSalaries(res.data);
//     } catch (err) {
//       setError(err.response?.data?.message || translations[lang].error);
//     }
//   };

//   const handleResendActivation = async (userId) => {
//     try {
//      await apiPost(`/auth/resend-activation/${userId}`, { userId });

//       setSuccess(translations[lang].resendSuccess);
//     } catch (err) {
//       setError(err.response?.data?.message || translations[lang].error);
//     }
//   };

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentEmployees = employees.slice(indexOfFirstItem, indexOfLastItem);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   const attendancePagination = attendance[0]?.pagination || { page: 1, pages: 1 };
//   const attendancePrev = () => {
//     if (attendancePage > 1) setAttendancePage(attendancePage - 1);
//   };
//   const attendanceNext = () => {
//     if (attendancePage < attendancePagination.pages) setAttendancePage(attendancePage + 1);
//   };
// const handleApprove = async (userId, fingerprint) => {
//   await apiPost('/users/approve-device', { userId, deviceFingerprint: fingerprint });
//   // أعد تحميل الجدول
//   const res = await apiGet(`/users/pending-devices?page=${pendingPage}`);
//   setPendingDevices(res.data.pendingDevices);
// };

// const handleReject = async (userId, fingerprint) => {
//   await apiPost('/users/reject-device', { userId, deviceFingerprint: fingerprint });
//   // أعد تحميل
// };
//   return (
//     <div className="container mt-4">
//       <h2>{translations[lang].dashboard}</h2>
//       {error && <div className="alert alert-danger">{error}</div>}
//       {success && <div className="alert alert-success">{success}</div>}

//       <div className="card mb-4">
//         <div className="card-body">
//           <h3 className="card-title">{translations[lang].employees}</h3>
//           <button className="btn btn-primary mb-3" onClick={handleAddEmployee}>
//             {translations[lang].addEmployee}
//           </button>
//           <div className="table-responsive">
//             <table className="table table-bordered">
//               <thead className="table-primary">
//                 <tr>
//                   <th>{translations[lang].name}</th>
//                   <th>{translations[lang].email}</th>
//                   <th>{translations[lang].branch}</th>
//                   <th>{translations[lang].active}</th>
//                   <th>{translations[lang].actions}</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentEmployees.map((emp) => (
//                   <tr key={emp._id}>
//                     <td>{emp.name}</td>
//                     <td>{emp.email}</td>
//                     <td>{emp.branches.map(b => b.name).join(', ')}</td>
//                     <td>{emp.isActive ? 'Yes' : 'No'}</td>
//                     <td>
//                       <button className="btn btn-sm btn-info me-1" onClick={() => navigate(`/profile/${emp._id}`)}>
//                         {translations[lang].viewProfile}
//                       </button>
//                       <button className="btn btn-sm btn-warning me-1" onClick={() => handleEdit(emp)}>
//                         {translations[lang].edit}
//                       </button>
//                       <button className="btn btn-sm btn-danger me-1" onClick={() => handleDelete(emp._id)}>
//                         {translations[lang].delete}
//                       </button>
//                       {!emp.isActive && (
//                         <button className="btn btn-sm btn-secondary" onClick={() => handleResendActivation(emp._id)}>
//                           {translations[lang].resendActivation}
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             <div className="tab-pane" id="pending-devices">
//   <h2>Pending Devices</h2>
//   <table className="table">
//     <thead>
//       <tr>
//         <th>Name</th>
//         <th>Email</th>
//         <th>Device</th>
//         <th>Actions</th>
//       </tr>
//     </thead>
//     <tbody>
//       {pendingDevices.map((d) => (
//         <tr key={d.deviceFingerprint}>
//           <td>{d.userName}</td>
//           <td>{d.userEmail}</td>
//           <td>{d.deviceFingerprint}</td>
//           <td>
//             <button onClick={() => handleApprove(d.userId, d.deviceFingerprint)}>Approve</button>
//             <button onClick={() => handleReject(d.userId, d.deviceFingerprint)}>Reject</button>
//           </td>
//         </tr>
//       ))}
//     </tbody>
//   </table>
//   <nav>
//     <button onClick={() => setPendingPage(p => p - 1)} disabled={pendingPage === 1}>Previous</button>
//     <span>{pendingPage} / {pendingPages}</span>
//     <button onClick={() => setPendingPage(p => p + 1)} disabled={pendingPage === pendingPages}>Next</button>
//   </nav>
// </div>
//           </div>
//           <nav>
//             <ul className="pagination">
//               <li className="page-item">
//                 <button className="page-link" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
//                   {translations[lang].previous}
//                 </button>
//               </li>
//               <li className="page-item">
//                 <button className="page-link" onClick={() => paginate(currentPage + 1)} disabled={currentPage >= Math.ceil(employees.length / itemsPerPage)}>
//                   {translations[lang].next}
//                 </button>
//               </li>
//             </ul>
//           </nav>
//         </div>
//       </div>

//       {editUser && (
//         <div className="card mb-4">
//           <div className="card-body">
//             <h3 className="card-title">{translations[lang].edit} {editUser.name}</h3>
//             <form>
//               <div className="mb-3">
//                 <label className="form-label">{translations[lang].name}</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={editUser.name}
//                   onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
//                 />
//               </div>
//               <div className="mb-3">
//                 <label className="form-label">{translations[lang].email}</label>
//                 <input
//                   type="email"
//                   className="form-control"
//                   value={editUser.email}
//                   onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
//                 />
//               </div>
//               <div className="mb-3">
//                 <label className="form-label">{translations[lang].role}</label>
//                 <select
//                   className="form-select"
//                   value={editUser.role}
//                   onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
//                 >
//                   <option value="staff">Staff</option>
//                   <option value="admin">Admin</option>
//                 </select>
//               </div>
//               <div className="mb-3">
//                 <label className="form-label">{translations[lang].branches}</label>
//                 <select
//                   multiple
//                   className="form-select"
//                   value={editUser.branches}
//                   onChange={(e) => setEditUser({ ...editUser, branches: Array.from(e.target.selectedOptions, option => option.value) })}
//                 >
//                   {branches.map(branch => (
//                     <option key={branch._id} value={branch._id}>{branch.name}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="mb-3">
//                 <label className="form-label">{translations[lang].phone}</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={editUser.phone || ''}
//                   onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })}
//                 />
//               </div>
//               <div className="mb-3">
//                 <label className="form-label">{translations[lang].address}</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={editUser.address || ''}
//                   onChange={(e) => setEditUser({ ...editUser, address: e.target.value })}
//                 />
//               </div>
//               <div className="mb-3">
//                 <label className="form-label">{translations[lang].salary}</label>
//                 <input
//                   type="number"
//                   className="form-control"
//                   value={editUser.salary || ''}
//                   onChange={(e) => setEditUser({ ...editUser, salary: e.target.value })}
//                 />
//               </div>
//               <div className="mb-3">
//                 <label className="form-label">{translations[lang].requiredWorkingDays}</label>
//                 <input
//                   type="number"
//                   className="form-control"
//                   value={editUser.requiredWorkingDays}
//                   onChange={(e) => setEditUser({ ...editUser, requiredWorkingDays: e.target.value })}
//                 />
//               </div>
//               <div className="mb-3">
//                 <label className="form-label">{translations[lang].workingDaysNames} (comma-separated)</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={editUser.workingDaysNames}
//                   onChange={(e) => setEditUser({ ...editUser, workingDaysNames: e.target.value })}
//                 />
//               </div>
//               <div className="mb-3">
//                 <label className="form-label">{translations[lang].workingHoursPerDay}</label>
//                 <input
//                   type="number"
//                   className="form-control"
//                   value={editUser.workingHoursPerDay}
//                   onChange={(e) => setEditUser({ ...editUser, workingHoursPerDay: e.target.value })}
//                 />
//               </div>
//               <div className="mb-3">
//                 <label className="form-label">{translations[lang].workStartTime} (HH:MM)</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={editUser.workStartTime || ''}
//                   onChange={(e) => setEditUser({ ...editUser, workStartTime: e.target.value })}
//                 />
//               </div>
//               <div className="mb-3">
//                 <label className="form-label">{translations[lang].workEndTime} (HH:MM)</label>
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={editUser.workEndTime || ''}
//                   onChange={(e) => setEditUser({ ...editUser, workEndTime: e.target.value })}
//                 />
//               </div>
//               <div className="mb-3">
//                 <label className="form-label">{translations[lang].absenceDeductionRate}</label>
//                 <input
//                   type="number"
//                   className="form-control"
//                   value={editUser.absenceDeductionRate}
//                   onChange={(e) => setEditUser({ ...editUser, absenceDeductionRate: e.target.value })}
//                 />
//               </div>
//               <div className="mb-3">
//                 <label className="form-label">{translations[lang].lateDeductionRate}</label>
//                 <input
//                   type="number"
//                   className="form-control"
//                   value={editUser.lateDeductionRate}
//                   onChange={(e) => setEditUser({ ...editUser, lateDeductionRate: e.target.value })}
//                 />
//               </div>
//               <div className="mb-3">
//                 <label className="form-label">{translations[lang].earlyLeaveDeductionRate}</label>
//                 <input
//                   type="number"
//                   className="form-control"
//                   value={editUser.earlyLeaveDeductionRate}
//                   onChange={(e) => setEditUser({ ...editUser, earlyLeaveDeductionRate: e.target.value })}
//                 />
//               </div>
//               <div className="mb-3 form-check">
//                 <input
//                   type="checkbox"
//                   className="form-check-input"
//                   checked={editUser.allowRemoteAbsence}
//                   onChange={(e) => setEditUser({ ...editUser, allowRemoteAbsence: e.target.checked })}
//                 />
//                 <label className="form-check-label">{translations[lang].allowRemoteAbsence}</label>
//               </div>
//               <button type="button" className="btn btn-primary me-2" onClick={handleSave}>
//                 {translations[lang].save}
//               </button>
//               <button type="button" className="btn btn-secondary" onClick={() => setEditUser(null)}>
//                 {translations[lang].cancel}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       <div className="card mb-4">
//         <div className="card-body">
//           <h3 className="card-title">{translations[lang].totalSalaries}</h3>
//           <div className="row">
//             <div className="col-md-3">
//               <label className="form-label">{translations[lang].year}</label>
//               <input
//                 type="number"
//                 className="form-control"
//                 value={year}
//                 onChange={(e) => setYear(e.target.value)}
//               />
//             </div>
//             <div className="col-md-3">
//               <label className="form-label">{translations[lang].month}</label>
//               <input
//                 type="number"
//                 className="form-control"
//                 value={month}
//                 min={1}
//                 max={12}
//                 onChange={(e) => setMonth(e.target.value)}
//               />
//             </div>
//             <div className="col-md-3">
//               <label className="form-label">{translations[lang].selectBranch}</label>
//               <select
//                 className="form-select"
//                 value={selectedBranch}
//                 onChange={(e) => setSelectedBranch(e.target.value)}
//               >
//                 <option value="">{translations[lang].allBranches}</option>
//                 {branches.map(branch => (
//                   <option key={branch._id} value={branch._id}>{branch.name}</option>
//                 ))}
//               </select>
//             </div>
//             <div className="col-md-3 d-flex align-items-end">
//               <button className="btn btn-primary" onClick={handleCalculateSalaries}>
//                 {translations[lang].calculateSalaries}
//               </button>
//             </div>
//           </div>
//           {totalSalaries && (
//             <div className="mt-3">
//               <h4>{translations[lang].total}: {totalSalaries.totalSalaries}</h4>
//               <table className="table table-bordered mt-2">
//                 <thead>
//                   <tr>
//                     <th>{translations[lang].branch}</th>
//                     <th>{translations[lang].branchTotal}</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {Object.entries(totalSalaries.branchTotals).map(([branchId, total]) => {
//                     const branchName = branches.find(b => b._id === branchId)?.name || branchId;
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

//       <div className="card mb-4">
//         <div className="card-body">
//           <h3 className="card-title">{translations[lang].selectBranch}</h3>
//           <select
//             className="form-select mb-3"
//             value={selectedBranch}
//             onChange={(e) => handleBranchFilter(e.target.value)}
//           >
//             <option value="">{translations[lang].allBranches}</option>
//             {branches.map(branch => (
//               <option key={branch._id} value={branch._id}>{branch.name}</option>
//             ))}
//           </select>
//           <div className="mb-3">
//             <label className="form-label">{translations[lang].selectDate}</label>
//             <input
//               type="date"
//               className="form-control"
//               value={selectedDate}
//               onChange={(e) => handleDateFilter(e.target.value)}
//             />
//           </div>
//         </div>
//       </div>

//       <div className="card">
//         <div className="card-body">
//           <h3 className="card-title">{translations[lang].employees} {translations[lang].attendance}</h3>
//           <div className="table-responsive">
//             <table className="table table-bordered">
//               <thead className="table-primary">
//                 <tr>
//                   <th>{translations[lang].name}</th>
//                   <th>{translations[lang].branch}</th>
//                   <th>{translations[lang].date}</th>
//                   <th>{translations[lang].day}</th>
//                   <th>{translations[lang].checkIn}</th>
//                   <th>{translations[lang].checkOut}</th>
//                   <th>{translations[lang].status}</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {attendance.length === 0 ? (
//                   <tr>
//                     <td colSpan="7">{translations[lang].noData}</td>
//                   </tr>
//                 ) : (
//                   attendance.flatMap((record) =>
//                     record.attendance.length === 0 ? (
//                       <tr key={record.branch._id}>
//                         <td colSpan="7">{translations[lang].noData}</td>
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
//                             <td>{translations[lang][att.dayStatus] || att.dayStatus}</td>
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
//                 <button className="page-link" onClick={attendancePrev} disabled={attendancePage === 1}>
//                   {translations[lang].previous}
//                 </button>
//               </li>
//               <li className="page-item disabled">
//                 <span className="page-link">{attendancePage} / {attendancePagination.pages}</span>
//               </li>
//               <li className="page-item">
//                 <button className="page-link" onClick={attendanceNext} disabled={attendancePage >= attendancePagination.pages}>
//                   {translations[lang].next}
//                 </button>
//               </li>
//             </ul>
//           </nav>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AdminDashboard;
//ترجمه
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { apiGet, apiPost, apiPut, apiDelete } from '../helpers/api';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '@fortawesome/fontawesome-free/css/all.min.css';
// import '../style/AdminDashboard.css';

// const AdminDashboard = () => {
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
//   const navigate = useNavigate();
//   const lang = document.documentElement.getAttribute('lang') || 'en';

//   // Initialize Bootstrap Toast
//   useEffect(() => {
//     if (window.bootstrap && window.bootstrap.Toast) {
//       const toastElList = [].slice.call(document.querySelectorAll('.toast'));
//       toastElList.forEach((toastEl) => {
//         new window.bootstrap.Toast(toastEl, { autohide: true, delay: 5000 }).show();
//       });
//     }
//   }, [error, success]);

//   const translations = {
//     en: {
//       dashboard: 'Admin Dashboard',
//       employees: 'Employees',
//       name: 'Name',
//       email: 'Email',
//       branch: 'Branch',
//       checkIn: 'Check-In',
//       checkOut: 'Check-Out',
//       date: 'Date',
//       day: 'Day',
//       status: 'Status',
//       viewProfile: 'View Profile',
//       selectBranch: 'Select Branch',
//       selectDate: 'Select Date',
//       allBranches: 'All Branches',
//       error: 'An error occurred',
//       previous: 'Previous',
//       next: 'Next',
//       page: 'Page',
//       edit: 'Edit',
//       delete: 'Delete',
//       save: 'Save',
//       cancel: 'Cancel',
//       role: 'Role',
//       phone: 'Phone',
//       address: 'Address',
//       salary: 'Salary',
//       requiredWorkingDays: 'Required Working Days',
//       workingDaysNames: 'Working Days Names',
//       workingHoursPerDay: 'Working Hours Per Day',
//       workStartTime: 'Work Start Time',
//       workEndTime: 'Work End Time',
//       absenceDeductionRate: 'Absence Deduction Rate (%)',
//       lateDeductionRate: 'Late Deduction Rate (%)',
//       earlyLeaveDeductionRate: 'Early Leave Deduction Rate (%)',
//       allowRemoteAbsence: 'Allow Remote Absence',
//       addEmployee: 'Add Employee',
//       totalSalaries: 'Total Salaries',
//       calculateSalaries: 'Calculate Salaries for Month',
//       year: 'Year',
//       month: 'Month',
//       total: 'Total Salaries',
//       branchTotal: 'Branch Total',
//       noData: 'No data available',
//       active: 'Active',
//       resendActivation: 'Resend Activation',
//       resendSuccess: 'Activation email resent',
//       confirmDelete: 'Are you sure you want to delete this user?',
//       attendance: 'Attendance',
//       attendanceFilters: 'Attendance Filters',
//     },
//     ar: {
//       dashboard: 'لوحة تحكم الإدارة',
//       employees: 'الموظفون',
//       name: 'الاسم',
//       email: 'البريد الإلكتروني',
//       branch: 'الفرع',
//       checkIn: 'تسجيل الدخول',
//       checkOut: 'تسجيل الخروج',
//       date: 'التاريخ',
//       day: 'اليوم',
//       status: 'الحالة',
//       viewProfile: 'عرض الملف الشخصي',
//       selectBranch: 'اختر الفرع',
//       selectDate: 'اختر التاريخ',
//       allBranches: 'جميع الفروع',
//       error: 'حدث خطأ',
//       previous: 'السابق',
//       next: 'التالي',
//       page: 'الصفحة',
//       edit: 'تعديل',
//       delete: 'حذف',
//       save: 'حفظ',
//       cancel: 'إلغاء',
//       role: 'الدور',
//       phone: 'الهاتف',
//       address: 'العنوان',
//       salary: 'الراتب',
//       requiredWorkingDays: 'أيام العمل المطلوبة',
//       workingDaysNames: 'أسماء أيام العمل',
//       workingHoursPerDay: 'ساعات العمل في اليوم',
//       workStartTime: 'وقت بداية العمل',
//       workEndTime: 'وقت نهاية العمل',
//       absenceDeductionRate: 'نسبة خصم الغياب (%)',
//       lateDeductionRate: 'نسبة خصم التأخير (%)',
//       earlyLeaveDeductionRate: 'نسبة خصم المغادرة المبكرة (%)',
//       allowRemoteAbsence: 'السماح بتسجيل الغياب عن بعد',
//       addEmployee: 'إضافة موظف',
//       totalSalaries: 'إجمالي المرتبات',
//       calculateSalaries: 'حساب المرتبات للشهر',
//       year: 'السنة',
//       month: 'الشهر',
//       total: 'إجمالي المرتبات',
//       branchTotal: 'إجمالي الفرع',
//       noData: 'لا توجد بيانات',
//       active: 'مفعل',
//       resendActivation: 'إعادة إرسال التفعيل',
//       resendSuccess: 'تم إعادة إرسال إيميل التفعيل',
//       confirmDelete: 'هل أنت متأكد من حذف هذا المستخدم؟',
//       attendance: 'الحضور',
//       attendanceFilters: 'فلاتر الحضور',
//     },
//   };

//   useEffect(() => {
//     const fetchPending = async () => {
//       try {
//         const params = new URLSearchParams();
//         params.append('page', pendingPage);
//         if (pendingFilterName) params.append('name', encodeURIComponent(pendingFilterName));
//         const res = await apiGet(`/users/pending-devices?${params.toString()}`);
//         setPendingDevices(res.data.pendingDevices || []);
//         setPendingPages(res.data.pagination?.pages || 1);
//       } catch (err) {
//         setError(translations[lang].error);
//       }
//     };
//     fetchPending();
//   }, [pendingPage, pendingFilterName, lang]);

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
//         setError(translations[lang].error);
//       }
//     };
//     fetchData();
//   }, [currentPage, filterName, filterBranch, lang]);

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
//       setError(translations[lang].error);
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
//       branches: user.branches.map(b => b._id),
//       workingDaysNames: Array.isArray(user.workingDaysNames)
//         ? user.workingDaysNames.join(',')
//         : user.workingDaysNames || '',
//       absenceDeductionRate: user.absenceDeductionRate * 100,
//       lateDeductionRate: user.lateDeductionRate * 100,
//       earlyLeaveDeductionRate: user.earlyLeaveDeductionRate * 100,
//     });
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm(translations[lang].confirmDelete)) {
//       try {
//         await apiDelete(`/users/${id}`);
//         const params = new URLSearchParams();
//         params.append('page', currentPage);
//         params.append('limit', itemsPerPage);
//         if (filterName) params.append('name', encodeURIComponent(filterName));
//         if (filterBranch) params.append('branch', filterBranch);
//         const userRes = await apiGet(`/users?${params.toString()}`);
//         setEmployees(userRes.data.users || []);
//         setTotalPages(userRes.data.totalPages || 1);
//         setSuccess('User deleted');
//       } catch (err) {
//         setError(err.response?.data?.message || translations[lang].error);
//       }
//     }
//   };

//   const handleSave = async () => {
//     try {
//       const dataToSend = {
//         ...editUser,
//         workingDaysNames: editUser.workingDaysNames,
//         branches: editUser.branches,
//         absenceDeductionRate: editUser.absenceDeductionRate / 100,
//         lateDeductionRate: editUser.lateDeductionRate / 100,
//         earlyLeaveDeductionRate: editUser.earlyLeaveDeductionRate / 100,
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
//       setSuccess('User updated successfully');
//     } catch (err) {
//       console.error('Update error:', err.response?.data);
//       setError(translations[lang].error + ': ' + (err.response?.data?.message || err.message));
//     }
//   };

//   const handleAddEmployee = async () => {
//     navigate('/add-employee');
//   };

//   const handleCalculateSalaries = async () => {
//     try {
//       const res = await apiGet(`/admin/total-salaries?year=${year}&month=${month}${selectedBranch ? `&branchId=${selectedBranch}` : ''}`);
//       setTotalSalaries(res.data);
//     } catch (err) {
//       setError(err.response?.data?.message || translations[lang].error);
//     }
//   };

//   const handleResendActivation = async (userId) => {
//     try {
//       await apiPost(`/auth/resend-activation/${userId}`, { userId });
//       setSuccess(translations[lang].resendSuccess);
//     } catch (err) {
//       setError(err.response?.data?.message || translations[lang].error);
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
//       setSuccess('Device approved successfully');
//     } catch (err) {
//       setError(err.response?.data?.message || translations[lang].error);
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
//       setSuccess('Device rejected successfully');
//     } catch (err) {
//       setError(err.response?.data?.message || translations[lang].error);
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
//       <h2 className="dashboard-title"><i className="fas fa-tachometer-alt me-2"></i>{translations[lang].dashboard}</h2>

//       {/* Toast Container */}
//       <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
//         {error && (
//           <div className="toast align-items-center text-white bg-danger border-0 show" role="alert" aria-live="assertive" aria-atomic="true">
//             <div className="d-flex">
//               <div className="toast-body">
//                 <i className="fas fa-exclamation-circle me-2"></i>{error}
//               </div>
//               <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setError('')}></button>
//             </div>
//           </div>
//         )}
//         {success && (
//           <div className="toast align-items-center text-white bg-success border-0 show" role="alert" aria-live="assertive" aria-atomic="true">
//             <div className="d-flex">
//               <div className="toast-body">
//                 <i className="fas fa-check-circle me-2"></i>{success}
//               </div>
//               <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setSuccess('')}></button>
//             </div>
//           </div>
//         )}
//       </div>

//       <div className="card shadow-sm mb-4">
//         <div className="card-body">
//           <h3 className="card-title"><i className="fas fa-users me-2"></i>{translations[lang].employees}</h3>
//           <button className="btn btn-primary mb-3" onClick={handleAddEmployee}>
//             <i className="fas fa-user-plus me-2"></i>{translations[lang].addEmployee}
//           </button>
//           <div className="row mb-3">
//             <div className="col-md-6">
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder={translations[lang].name}
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
//                 <option value="">{translations[lang].allBranches}</option>
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
//                   <th>{translations[lang].name}</th>
//                   <th>{translations[lang].email}</th>
//                   <th>{translations[lang].branch}</th>
//                   <th>{translations[lang].active}</th>
//                   <th>{translations[lang].actions}</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {employees.length === 0 ? (
//                   <tr>
//                     <td colSpan="5">{translations[lang].noData}</td>
//                   </tr>
//                 ) : (
//                   employees.map((emp) => (
//                     <tr key={emp._id}>
//                       <td>{emp.name}</td>
//                       <td>{emp.email}</td>
//                       <td>{emp.branches.map(b => b.name).join(', ')}</td>
//                       <td>
//                         {emp.isActive ? (
//                           <span className="badge bg-success">{translations[lang].active}</span>
//                         ) : (
//                           <span className="badge bg-secondary">Inactive</span>
//                         )}
//                       </td>
//                       <td>
//                         <button
//                           className="btn btn-sm btn-info me-1"
//                           onClick={() => navigate(`/profile/${emp._id}`)}
//                         >
//                           <i className="fas fa-eye"></i> {translations[lang].viewProfile}
//                         </button>
//                         <button className="btn btn-sm btn-warning me-1" onClick={() => handleEdit(emp)}>
//                           <i className="fas fa-edit"></i> {translations[lang].edit}
//                         </button>
//                         <button className="btn btn-sm btn-danger me-1" onClick={() => handleDelete(emp._id)}>
//                           <i className="fas fa-trash"></i> {translations[lang].delete}
//                         </button>
//                         {!emp.isActive && (
//                           <button
//                             className="btn btn-sm btn-secondary"
//                             onClick={() => handleResendActivation(emp._id)}
//                           >
//                             <i className="fas fa-envelope"></i> {translations[lang].resendActivation}
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
//                   <i className="fas fa-chevron-left"></i> {translations[lang].previous}
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
//                   {translations[lang].next} <i className="fas fa-chevron-right"></i>
//                 </button>
//               </li>
//             </ul>
//           </nav>
//         </div>
//       </div>

//       <div className="card shadow-sm mb-4">
//         <div className="card-body">
//           <h3 className="card-title"><i className="fas fa-mobile-alt me-2"></i>Pending Devices</h3>
//           <div className="row mb-3">
//             <div className="col-md-12">
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder={`${translations[lang].name} or ${translations[lang].email}`}
//                 value={pendingFilterName}
//                 onChange={(e) => { setPendingFilterName(e.target.value); setPendingPage(1); }}
//               />
//             </div>
//           </div>
//           <div className="table-responsive">
//             <table className="table table-hover">
//               <thead className="table-primary">
//                 <tr>
//                   <th>{translations[lang].name}</th>
//                   <th>{translations[lang].email}</th>
//                   <th>{translations[lang].branch}</th>
//                   <th>Device</th>
//                   <th>{translations[lang].actions}</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {pendingDevices.length === 0 ? (
//                   <tr>
//                     <td colSpan="5">{translations[lang].noData}</td>
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
//                           <i className="fas fa-check"></i> Approve
//                         </button>
//                         <button
//                           className="btn btn-sm btn-danger"
//                           onClick={() => handleReject(d.userId, d.deviceFingerprint)}
//                         >
//                           <i className="fas fa-times"></i> Reject
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
//                   <i className="fas fa-chevron-left"></i> {translations[lang].previous}
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
//                   {translations[lang].next} <i className="fas fa-chevron-right"></i>
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
//                 <h5 className="modal-title"><i className="fas fa-user-edit me-2"></i>{translations[lang].edit} {editUser.name}</h5>
//                 <button type="button" className="btn-close" onClick={() => setEditUser(null)} aria-label="Close"></button>
//               </div>
//               <div className="modal-body">
//                 <form>
//                   <div className="row">
//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">{translations[lang].name}</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         value={editUser.name}
//                         onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
//                       />
//                     </div>
//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">{translations[lang].email}</label>
//                       <input
//                         type="email"
//                         className="form-control"
//                         value={editUser.email}
//                         onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
//                       />
//                     </div>
//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">{translations[lang].role}</label>
//                       <select
//                         className="form-select"
//                         value={editUser.role}
//                         onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
//                       >
//                         <option value="staff">Staff</option>
//                         <option value="admin">Admin</option>
//                       </select>
//                     </div>
//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">{translations[lang].branches}</label>
//                       <select
//                         multiple
//                         className="form-select"
//                         value={editUser.branches}
//                         onChange={(e) =>
//                           setEditUser({
//                             ...editUser,
//                             branches: Array.from(e.target.selectedOptions, (option) => option.value),
//                           })
//                         }
//                       >
//                         {branches.map((branch) => (
//                           <option key={branch._id} value={branch._id}>
//                             {branch.name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">{translations[lang].phone}</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         value={editUser.phone || ''}
//                         onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })}
//                       />
//                     </div>
//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">{translations[lang].address}</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         value={editUser.address || ''}
//                         onChange={(e) => setEditUser({ ...editUser, address: e.target.value })}
//                       />
//                     </div>
//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">{translations[lang].salary}</label>
//                       <input
//                         type="number"
//                         className="form-control"
//                         value={editUser.salary || ''}
//                         onChange={(e) => setEditUser({ ...editUser, salary: e.target.value })}
//                       />
//                     </div>
//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">{translations[lang].requiredWorkingDays}</label>
//                       <input
//                         type="number"
//                         className="form-control"
//                         value={editUser.requiredWorkingDays}
//                         onChange={(e) => setEditUser({ ...editUser, requiredWorkingDays: e.target.value })}
//                       />
//                     </div>
//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">{translations[lang].workingDaysNames} (comma-separated)</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         value={editUser.workingDaysNames}
//                         onChange={(e) => setEditUser({ ...editUser, workingDaysNames: e.target.value })}
//                       />
//                     </div>
//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">{translations[lang].workingHoursPerDay}</label>
//                       <input
//                         type="number"
//                         className="form-control"
//                         value={editUser.workingHoursPerDay}
//                         onChange={(e) => setEditUser({ ...editUser, workingHoursPerDay: e.target.value })}
//                       />
//                     </div>
//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">{translations[lang].workStartTime} (HH:MM)</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         value={editUser.workStartTime || ''}
//                         onChange={(e) => setEditUser({ ...editUser, workStartTime: e.target.value })}
//                       />
//                     </div>
//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">{translations[lang].workEndTime} (HH:MM)</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         value={editUser.workEndTime || ''}
//                         onChange={(e) => setEditUser({ ...editUser, workEndTime: e.target.value })}
//                       />
//                     </div>
//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">{translations[lang].absenceDeductionRate}</label>
//                       <input
//                         type="number"
//                         className="form-control"
//                         value={editUser.absenceDeductionRate}
//                         onChange={(e) => setEditUser({ ...editUser, absenceDeductionRate: e.target.value })}
//                       />
//                     </div>
//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">{translations[lang].lateDeductionRate}</label>
//                       <input
//                         type="number"
//                         className="form-control"
//                         value={editUser.lateDeductionRate}
//                         onChange={(e) => setEditUser({ ...editUser, lateDeductionRate: e.target.value })}
//                       />
//                     </div>
//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">{translations[lang].earlyLeaveDeductionRate}</label>
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
//                       <label className="form-check-label">{translations[lang].allowRemoteAbsence}</label>
//                     </div>
//                   </div>
//                 </form>
//               </div>
//               <div className="modal-footer">
//                 <button type="button" className="btn btn-primary" onClick={handleSave}>
//                   <i className="fas fa-save me-2"></i>{translations[lang].save}
//                 </button>
//                 <button type="button" className="btn btn-secondary" onClick={() => setEditUser(null)}>
//                   <i className="fas fa-times me-2"></i>{translations[lang].cancel}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="card shadow-sm mb-4">
//         <div className="card-body">
//           <h3 className="card-title"><i className="fas fa-money-bill-wave me-2"></i>{translations[lang].totalSalaries}</h3>
//           <div className="row">
//             <div className="col-md-3 mb-3">
//               <label className="form-label">{translations[lang].year}</label>
//               <input
//                 type="number"
//                 className="form-control"
//                 value={year}
//                 onChange={(e) => setYear(e.target.value)}
//               />
//             </div>
//             <div className="col-md-3 mb-3">
//               <label className="form-label">{translations[lang].month}</label>
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
//               <label className="form-label">{translations[lang].selectBranch}</label>
//               <select
//                 className="form-select"
//                 value={selectedBranch}
//                 onChange={(e) => setSelectedBranch(e.target.value)}
//               >
//                 <option value="">{translations[lang].allBranches}</option>
//                 {branches.map((branch) => (
//                   <option key={branch._id} value={branch._id}>
//                     {branch.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="col-md-3 d-flex align-items-end mb-3">
//               <button className="btn btn-primary w-100" onClick={handleCalculateSalaries}>
//                 <i className="fas fa-calculator me-2"></i>{translations[lang].calculateSalaries}
//               </button>
//             </div>
//           </div>
//           {totalSalaries && (
//             <div className="mt-3">
//               <h4>{translations[lang].total}: {totalSalaries.totalSalaries}</h4>
//               <table className="table table-bordered mt-2">
//                 <thead>
//                   <tr>
//                     <th>{translations[lang].branch}</th>
//                     <th>{translations[lang].branchTotal}</th>
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
//           <h3 className="card-title"><i className="fas fa-filter me-2"></i>{translations[lang].attendanceFilters}</h3>
//           <div className="row">
//             <div className="col-md-4 mb-3">
//               <label className="form-label">{translations[lang].selectBranch}</label>
//               <select
//                 className="form-select"
//                 value={selectedBranch}
//                 onChange={(e) => handleBranchFilter(e.target.value)}
//               >
//                 <option value="">{translations[lang].allBranches}</option>
//                 {branches.map((branch) => (
//                   <option key={branch._id} value={branch._id}>
//                     {branch.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="col-md-4 mb-3">
//               <label className="form-label">{translations[lang].selectDate}</label>
//               <input
//                 type="date"
//                 className="form-control"
//                 value={selectedDate}
//                 onChange={(e) => handleDateFilter(e.target.value)}
//               />
//             </div>
//             <div className="col-md-4 mb-3">
//               <label className="form-label">{translations[lang].name}</label>
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
//           <h3 className="card-title"><i className="fas fa-clipboard-check me-2"></i>{translations[lang].attendance}</h3>
//           <div className="table-responsive">
//             <table className="table table-hover">
//               <thead className="table-primary">
//                 <tr>
//                   <th>{translations[lang].name}</th>
//                   <th>{translations[lang].branch}</th>
//                   <th>{translations[lang].date}</th>
//                   <th>{translations[lang].day}</th>
//                   <th>{translations[lang].checkIn}</th>
//                   <th>{translations[lang].checkOut}</th>
//                   <th>{translations[lang].status}</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {attendance.length === 0 ? (
//                   <tr>
//                     <td colSpan="7">{translations[lang].noData}</td>
//                   </tr>
//                 ) : (
//                   attendance.flatMap((record) =>
//                     record.attendance.length === 0 ? (
//                       <tr key={record.branch._id}>
//                         <td colSpan="7">{translations[lang].noData}</td>
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
//                             <td>{translations[lang][att.dayStatus] || att.dayStatus}</td>
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
//                   <i className="fas fa-chevron-left"></i> {translations[lang].previous}
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
//                   {translations[lang].next} <i className="fas fa-chevron-right"></i>
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
  const [deleteUserId, setDeleteUserId] = useState(null); // New state for delete confirmation
  const navigate = useNavigate();

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
      branches: user.branches.map(b => b._id),
      workingDaysNames: Array.isArray(user.workingDaysNames)
        ? user.workingDaysNames.join(',')
        : user.workingDaysNames || '',
      absenceDeductionRate: user.absenceDeductionRate * 100,
      lateDeductionRate: user.lateDeductionRate * 100,
      earlyLeaveDeductionRate: user.earlyLeaveDeductionRate * 100,
    });
  };

  const handleDelete = async (id) => {
    setDeleteUserId(id); // Show the confirmation modal
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
      setDeleteUserId(null); // Close the modal
    } catch (err) {
      setError(err.response?.data?.message || t('error'));
      setDeleteUserId(null); // Close the modal
    }
  };

  const handleSave = async () => {
    try {
      const dataToSend = {
        ...editUser,
        workingDaysNames: editUser.workingDaysNames,
        branches: editUser.branches,
        absenceDeductionRate: editUser.absenceDeductionRate / 100,
        lateDeductionRate: editUser.lateDeductionRate / 100,
        earlyLeaveDeductionRate: editUser.earlyLeaveDeductionRate / 100,
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
    } catch (err) {
      console.error('Update error:', err.response?.data);
      setError(t('error') + ': ' + (err.response?.data?.message || err.message));
    }
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
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={confirmDelete}
                >
                  <i className="fas fa-check me-2"></i>{t('delete')}
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => setDeleteUserId(null)}
                >
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
                onChange={(e) => { setFilterName(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <div className="col-md-6">
              <select
                className="form-select"
                value={filterBranch}
                onChange={(e) => { setFilterBranch(e.target.value); setCurrentPage(1); }}
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
                      <td>{emp.branches.map(b => b.name).join(', ')}</td>
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
                        <button className="btn btn-sm btn-warning me-1" onClick={() => handleEdit(emp)}>
                          <i className="fas fa-edit"></i> {t('edit')}
                        </button>
                        <button className="btn btn-sm btn-danger me-1" onClick={() => handleDelete(emp._id)}>
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
                <span className="page-link">{currentPage} / {totalPages}</span>
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
                onChange={(e) => { setPendingFilterName(e.target.value); setPendingPage(1); }}
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
                      <td>{d.branches?.map(b => b.name).join(', ') || 'N/A'}</td>
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
                  onClick={() => setPendingPage(p => p - 1)}
                  disabled={pendingPage === 1}
                >
                  <i className="fas fa-chevron-left"></i> {t('previous')}
                </button>
              </li>
              <li className="page-item disabled">
                <span className="page-link">{pendingPage} / {pendingPages}</span>
              </li>
              <li className="page-item">
                <button
                  className="page-link"
                  onClick={() => setPendingPage(p => p + 1)}
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
                <h5 className="modal-title"><i className="fas fa-user-edit me-2"></i>{t('edit')} {editUser.name}</h5>
                <button type="button" className="btn-close" onClick={() => setEditUser(null)} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">{t('name')}</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editUser.name}
                        onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">{t('email')}</label>
                      <input
                        type="email"
                        className="form-control"
                        value={editUser.email}
                        onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                      />
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
                      <label className="form-label">{t('branches')}</label>
                      <select
                        multiple
                        className="form-select"
                        value={editUser.branches}
                        onChange={(e) =>
                          setEditUser({
                            ...editUser,
                            branches: Array.from(e.target.selectedOptions, (option) => option.value),
                          })
                        }
                      >
                        {branches.map((branch) => (
                          <option key={branch._id} value={branch._id}>
                            {branch.name}
                          </option>
                        ))}
                      </select>
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
                    <div className="col-md-6 mb-3">
                      <label className="form-label">{t('salary')}</label>
                      <input
                        type="number"
                        className="form-control"
                        value={editUser.salary || ''}
                        onChange={(e) => setEditUser({ ...editUser, salary: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">{t('requiredWorkingDays')}</label>
                      <input
                        type="number"
                        className="form-control"
                        value={editUser.requiredWorkingDays}
                        onChange={(e) => setEditUser({ ...editUser, requiredWorkingDays: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">{t('workingDaysNames')}</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editUser.workingDaysNames}
                        onChange={(e) => setEditUser({ ...editUser, workingDaysNames: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">{t('workingHoursPerDay')}</label>
                      <input
                        type="number"
                        className="form-control"
                        value={editUser.workingHoursPerDay}
                        onChange={(e) => setEditUser({ ...editUser, workingHoursPerDay: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">{t('workStartTime')}</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editUser.workStartTime || ''}
                        onChange={(e) => setEditUser({ ...editUser, workStartTime: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">{t('workEndTime')}</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editUser.workEndTime || ''}
                        onChange={(e) => setEditUser({ ...editUser, workEndTime: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">{t('absenceDeductionRate')}</label>
                      <input
                        type="number"
                        className="form-control"
                        value={editUser.absenceDeductionRate}
                        onChange={(e) => setEditUser({ ...editUser, absenceDeductionRate: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">{t('lateDeductionRate')}</label>
                      <input
                        type="number"
                        className="form-control"
                        value={editUser.lateDeductionRate}
                        onChange={(e) => setEditUser({ ...editUser, lateDeductionRate: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">{t('earlyLeaveDeductionRate')}</label>
                      <input
                        type="number"
                        className="form-control"
                        value={editUser.earlyLeaveDeductionRate}
                        onChange={(e) => setEditUser({ ...editUser, earlyLeaveDeductionRate: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6 mb-3 form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={editUser.allowRemoteAbsence}
                        onChange={(e) => setEditUser({ ...editUser, allowRemoteAbsence: e.target.checked })}
                      />
                      <label className="form-check-label">{t('allowRemoteAbsence')}</label>
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
                onChange={(e) => { setAttendanceFilterName(e.target.value); setAttendancePage(1); }}
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
                <span className="page-link">{attendancePage} / {attendancePagination.pages}</span>
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