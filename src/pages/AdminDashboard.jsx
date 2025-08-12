// // import { useState, useEffect } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { apiGet } from '../helpers/api';

// // function AdminDashboard() {
// //   const [employees, setEmployees] = useState([]);
// //   const [branches, setBranches] = useState([]);
// //   const [selectedBranch, setSelectedBranch] = useState('');
// //   const [attendance, setAttendance] = useState([]);
// //   const [error, setError] = useState('');
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [itemsPerPage] = useState(10);
// //   const navigate = useNavigate();
// //   const lang = document.documentElement.getAttribute('lang') || 'ar';

// //   const translations = {
// //     en: {
// //       dashboard: 'Admin Dashboard',
// //       employees: 'Employees',
// //       name: 'Name',
// //       email: 'Email',
// //       branch: 'Branch',
// //       checkIn: 'Check-In',
// //       checkOut: 'Check-Out',
// //       status: 'Status',
// //       viewProfile: 'View Profile',
// //       selectBranch: 'Select Branch',
// //       allBranches: 'All Branches',
// //       error: 'An error occurred',
// //       previous: 'Previous',
// //       next: 'Next',
// //       page: 'Page',
// //     },
// //     ar: {
// //       dashboard: 'لوحة تحكم الإدارة',
// //       employees: 'الموظفون',
// //       name: 'الاسم',
// //       email: 'البريد الإلكتروني',
// //       branch: 'الفرع',
// //       checkIn: 'تسجيل الدخول',
// //       checkOut: 'تسجيل الخروج',
// //       status: 'الحالة',
// //       viewProfile: 'عرض الملف الشخصي',
// //       selectBranch: 'اختر الفرع',
// //       allBranches: 'جميع الفروع',
// //       error: 'حدث خطأ',
// //       previous: 'السابق',
// //       next: 'التالي',
// //       page: 'الصفحة',
// //     },
// //   };

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const branchRes = await apiGet('/branches');
// //         setBranches(branchRes.data);
// //         const userRes = await apiGet('/users');
// //         setEmployees(userRes.data);
// //         const attendanceRes = await apiGet('/admin/attendance');
// //         setAttendance(attendanceRes.data);
// //       } catch (err) {
// //         setError(translations[lang].error);
// //       }
// //     };
// //     fetchData();
// //   }, [lang]);

// //   const handleBranchFilter = async (branchId) => {
// //     setSelectedBranch(branchId);
// //     setCurrentPage(1);
// //     try {
// //       const attendanceRes = await apiGet(
// //         branchId ? `/admin/attendance?branch=${branchId}` : '/admin/attendance'
// //       );
// //       setAttendance(attendanceRes.data);
// //     } catch (err) {
// //       setError(translations[lang].error);
// //     }
// //   };

// //   const filteredEmployees = selectedBranch
// //     ? employees.filter((emp) =>
// //         emp.branches.some((b) => b._id.toString() === selectedBranch)
// //       )
// //     : employees;

// //   const indexOfLastItem = currentPage * itemsPerPage;
// //   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
// //   const currentEmployees = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
// //   const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

// //   const paginate = (pageNumber) => setCurrentPage(pageNumber);

// //   return (
// //     <div className="container mt-4">
// //       <h2 className="mb-4">{translations[lang].dashboard}</h2>
// //       {error && <div className="alert alert-danger">{error}</div>}

// //       <div className="mb-4">
// //         <label className="form-label">{translations[lang].selectBranch}</label>
// //         <select
// //           className="form-select"
// //           value={selectedBranch}
// //           onChange={(e) => handleBranchFilter(e.target.value)}
// //         >
// //           <option value="">{translations[lang].allBranches}</option>
// //           {branches.map((branch) => (
// //             <option key={branch._id} value={branch._id}>
// //               {branch.name}
// //             </option>
// //           ))}
// //         </select>
// //       </div>

// //       <div className="card mb-4">
// //         <div className="card-body">
// //           <h3 className="card-title">{translations[lang].employees}</h3>
// //           <div className="table-responsive">
// //             <table className="table table-bordered">
// //               <thead className="table-primary">
// //                 <tr>
// //                   <th>{translations[lang].name}</th>
// //                   <th>{translations[lang].email}</th>
// //                   <th>{translations[lang].branch}</th>
// //                   <th>{translations[lang].viewProfile}</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {currentEmployees.map((emp) => (
// //                   <tr key={emp._id}>
// //                     <td>{emp.name}</td>
// //                     <td>{emp.email}</td>
// //                     <td>{emp.branches.map((b) => b.name).join(', ')}</td>
// //                     <td>
// //                       <button
// //                         className="btn btn-primary"
// //                         onClick={() => navigate(`/users/${emp._id}`)}
// //                       >
// //                         {translations[lang].viewProfile}
// //                       </button>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>
// //           <nav>
// //             <ul className="pagination">
// //               <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
// //                 <button
// //                   className="page-link"
// //                   onClick={() => paginate(currentPage - 1)}
// //                 >
// //                   {translations[lang].previous}
// //                 </button>
// //               </li>
// //               {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
// //                 <li
// //                   key={number}
// //                   className={`page-item ${currentPage === number ? 'active' : ''}`}
// //                 >
// //                   <button className="page-link" onClick={() => paginate(number)}>
// //                     {number}
// //                   </button>
// //                 </li>
// //               ))}
// //               <li
// //                 className={`page-item ${
// //                   currentPage === totalPages ? 'disabled' : ''
// //                 }`}
// //               >
// //                 <button
// //                   className="page-link"
// //                   onClick={() => paginate(currentPage + 1)}
// //                 >
// //                   {translations[lang].next}
// //                 </button>
// //               </li>
// //             </ul>
// //           </nav>
// //         </div>
// //       </div>

// //       <div className="card">
// //         <div className="card-body">
// //           <h3 className="card-title">{translations[lang].employees} {translations[lang].attendance}</h3>
// //           <div className="table-responsive">
// //             <table className="table table-bordered">
// //               <thead className="table-primary">
// //                 <tr>
// //                   <th>{translations[lang].name}</th>
// //                   <th>{translations[lang].branch}</th>
// //                   <th>{translations[lang].checkIn}</th>
// //                   <th>{translations[lang].checkOut}</th>
// //                   <th>{translations[lang].status}</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {attendance.map((record) =>
// //                   record.attendance.map((att) => (
// //                     <tr key={att._id}>
// //                       <td>{att.user.name}</td>
// //                       <td>{att.branch.name}</td>
// //                       <td>{new Date(att.checkInTime).toLocaleTimeString()}</td>
// //                       <td>
// //                         {att.checkOutTime
// //                           ? new Date(att.checkOutTime).toLocaleTimeString()
// //                           : '-'}
// //                       </td>
// //                       <td>{translations[lang][att.dayStatus] || att.dayStatus}</td>
// //                     </tr>
// //                   ))
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default AdminDashboard;


// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { apiGet, apiPost, apiPut, apiDelete } from '../helpers/api';

// function AdminDashboard() {
//   const [users, setUsers] = useState([]);
//   const [branches, setBranches] = useState([]);
//   const [selectedBranch, setSelectedBranch] = useState('');
//   const [attendance, setAttendance] = useState([]);
//   const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'staff', branches: [] });
//   const [editingId, setEditingId] = useState(null);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);
//   const navigate = useNavigate();
//   const lang = document.documentElement.getAttribute('lang') || 'ar';

//   const translations = {
//     en: {
//       dashboard: 'Manage Employees',
//       users: 'The Employee',
//       name: 'Name',
//       email: 'Email',
//       role: 'Role',
//       branches: 'Branches',
//       addUser: 'Add Employee',
//       updateUser: 'Update Employee',
//       cancel: 'Cancel',
//       delete: 'Delete',
//       edit: 'Edit',
//       employees: 'Employees',
//       branch: 'Branch',
//       checkIn: 'Check-In',
//       checkOut: 'Check-Out',
//       status: 'Status',
//       viewProfile: 'View Profile',
//       selectBranch: 'Select Branch',
//       allBranches: 'All Branches',
//       error: 'An error occurred',
//       success: 'User created successfully',
//       updateSuccess: 'User updated successfully',
//       noData: 'No data available',
//       loading: 'Loading...',
//       previous: 'Previous',
//       next: 'Next',
//       page: 'Page',
//     },
//     ar: {
//       dashboard: 'إدارة الموظفين',
//       users: ' الموظف',
//       name: 'الاسم',
//       email: 'البريد الإلكتروني',
//       role: 'الدور',
//       branches: 'الفروع',
//       addUser: 'إضافة موظف',
//       updateUser: 'تحديث المستخدم',
//       cancel: 'إلغاء',
//       delete: 'حذف',
//       edit: 'تعديل',
//       employees: 'الموظفون',
//       branch: 'الفرع',
//       checkIn: 'تسجيل الدخول',
//       checkOut: 'تسجيل الخروج',
//       status: 'الحالة',
//       viewProfile: 'عرض الملف الشخصي',
//       selectBranch: 'اختر الفرع',
//       allBranches: 'جميع الفروع',
//       error: 'حدث خطأ',
//       success: 'تم إنشاء المستخدم بنجاح',
//       updateSuccess: 'تم تحديث المستخدم بنجاح',
//       noData: 'لا توجد بيانات متاحة',
//       loading: 'جارٍ التحميل...',
//       previous: 'السابق',
//       next: 'التالي',
//       page: 'الصفحة',
//     },
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const branchRes = await apiGet('/branches');
//         setBranches(branchRes.data);
//         const userRes = await apiGet('/users');
//         setUsers(userRes.data);
//         const attendanceRes = await apiGet('/admin/attendance');
//         setAttendance(attendanceRes.data);
//       } catch (err) {
//         setError(translations[lang].error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [lang]);

//   const handleBranchFilter = async (branchId) => {
//     setSelectedBranch(branchId);
//     setCurrentPage(1);
//     try {
//       const attendanceRes = await apiGet(
//         branchId ? `/admin/attendance?branch=${branchId}` : '/admin/attendance'
//       );
//       setAttendance(attendanceRes.data);
//     } catch (err) {
//       setError(translations[lang].error);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleBranchChange = (e) => {
//     const options = e.target.options;
//     const selected = [];
//     for (let i = 0; i < options.length; i++) {
//       if (options[i].selected) {
//         selected.push(options[i].value);
//       }
//     }
//     setFormData({ ...formData, branches: selected });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const data = { ...formData };
//       if (editingId) {
//         await apiPut(`/users/${editingId}`, data);
//         setSuccess(translations[lang].updateSuccess);
//       } else {
//         await apiPost('/auth/register', data);
//         setSuccess(translations[lang].success);
//       }
//       setFormData({ name: '', email: '', password: '', role: 'staff', branches: [] });
//       setEditingId(null);
//       const userRes = await apiGet('/users');
//       setUsers(userRes.data);
//       setError('');
//     } catch (err) {
//       setError(err.response?.data?.message || translations[lang].error);
//     }
//   };

//   const handleEdit = (user) => {
//     setFormData({
//       name: user.name,
//       email: user.email,
//       password: '',
//       role: user.role,
//       branches: user.branches?.map(b => b._id) || [],
//     });
//     setEditingId(user._id);
//   };

//   const handleDelete = async (id) => {
//     try {
//       await apiDelete(`/users/${id}`);
//       const userRes = await apiGet('/users');
//       setUsers(userRes.data);
//       setSuccess('User deleted successfully');
//       setError('');
//     } catch (err) {
//       setError(err.response?.data?.message || translations[lang].error);
//     }
//   };

//   const filteredUsers = selectedBranch
//     ? users.filter((user) =>
//         user.branches.some((b) => b._id.toString() === selectedBranch)
//       )
//     : users;

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   if (loading) return <div className="container mt-4">{translations[lang].loading}</div>;

//   return (
//     <div className="container mt-4">
//       <h2 className="mb-4">{translations[lang].dashboard}</h2>


//       <div className="card mb-4">
//         <div className="card-body">
//           <h3 className="card-title">{translations[lang].users}</h3>
//           <form onSubmit={handleSubmit}>
//             <div className="mb-3">
//               <label className="form-label">{translations[lang].name}</label>
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
//               <label className="form-label">{translations[lang].email}</label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 className="form-control"
//                 required
//               />
//             </div>
//             <div className="mb-3">
//               <label className="form-label">{translations[lang].password}</label>
//               <input
//                 type="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleInputChange}
//                 className="form-control"
//                 required={!editingId}
//               />
//             </div>
//             <div className="mb-3">
//               <label className="form-label">{translations[lang].role}</label>
//               <select
//                 name="role"
//                 value={formData.role}
//                 onChange={handleInputChange}
//                 className="form-select"
//                 required
//               >
//                 <option value="staff">Staff</option>
//                 <option value="admin">Admin</option>
//               </select>
//             </div>
//             <div className="mb-3">
//               <label className="form-label">{translations[lang].branches}</label>
//               <select
//                 name="branches"
//                 value={formData.branches}
//                 onChange={handleBranchChange}
//                 className="form-select"
//                 multiple
//               >
//                 {branches.map((branch) => (
//                   <option key={branch._id} value={branch._id}>
//                     {branch.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <button type="submit" className="btn btn-primary">
//               {editingId ? translations[lang].updateUser : translations[lang].addUser}
//             </button>
//             {editingId && (
//               <button
//                 type="button"
//                 className="btn btn-secondary ms-2"
//                 onClick={() => {
//                   setFormData({ name: '', email: '', password: '', role: 'staff', branches: [] });
//                   setEditingId(null);
//                 }}
//               >
//                 {translations[lang].cancel}
//               </button>
//             )}
//           </form>
//         </div>
//       </div>
//  <h2 className="mb-4">{translations[lang].employees}</h2>
//       {error && <div className="alert alert-danger">{error}</div>}
//       {success && <div className="alert alert-success">{success}</div>}

//       <div className="mb-4">
//         <label className="form-label">{translations[lang].selectBranch}</label>
//         <select
//           className="form-select"
//           value={selectedBranch}
//           onChange={(e) => handleBranchFilter(e.target.value)}
//         >
//           <option value="">{translations[lang].allBranches}</option>
//           {branches.map((branch) => (
//             <option key={branch._id} value={branch._id}>
//               {branch.name}
//             </option>
//           ))}
//         </select>
//       </div>
//       <div className="card mb-4">
//         <div className="card-body">
//           <h3 className="card-title">{translations[lang].employees}</h3>
//           <div className="table-responsive">
//             <table className="table table-bordered">
//               <thead className="table-primary">
//                 <tr>
//                   <th>{translations[lang].name}</th>
//                   <th>{translations[lang].email}</th>
//                   <th>{translations[lang].role}</th>
//                   <th>{translations[lang].branches}</th>
//                   <th>{translations[lang].actions}</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentUsers.map((user) => (
//                   <tr key={user._id}>
//                     <td>{user.name || 'N/A'}</td>
//                     <td>{user.email || 'N/A'}</td>
//                     <td>{user.role || 'N/A'}</td>
//                     <td>{user.branches?.map((b) => b.name).join(', ') || 'N/A'}</td>
//                     <td>
//                       <button
//                         className="btn btn-primary btn-sm me-2"
//                         onClick={() => navigate(`/profile/${user._id}`)}
//                       >
//                         {translations[lang].viewProfile}
//                       </button>
//                       <button
//                         className="btn btn-warning btn-sm me-2"
//                         onClick={() => handleEdit(user)}
//                       >
//                         {translations[lang].edit}
//                       </button>
//                       <button
//                         className="btn btn-danger btn-sm"
//                         onClick={() => handleDelete(user._id)}
//                       >
//                         {translations[lang].delete}
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//           <nav>
//             <ul className="pagination">
//               <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
//                 <button
//                   className="page-link"
//                   onClick={() => paginate(currentPage - 1)}
//                 >
//                   {translations[lang].previous}
//                 </button>
//               </li>
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
//                 <li
//                   key={number}
//                   className={`page-item ${currentPage === number ? 'active' : ''}`}
//                 >
//                   <button className="page-link" onClick={() => paginate(number)}>
//                     {number}
//                   </button>
//                 </li>
//               ))}
//               <li
//                 className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}
//               >
//                 <button
//                   className="page-link"
//                   onClick={() => paginate(currentPage + 1)}
//                 >
//                   {translations[lang].next}
//                 </button>
//               </li>
//             </ul>
//           </nav>
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
//                   <th>{translations[lang].checkIn}</th>
//                   <th>{translations[lang].checkOut}</th>
//                   <th>{translations[lang].status}</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {attendance.length === 0 ? (
//                   <tr>
//                     <td colSpan="5">{translations[lang].noData}</td>
//                   </tr>
//                 ) : (
//                   attendance.map((record) =>
//                     record.attendance.length === 0 ? (
//                       <tr key={record.branch._id}>
//                         <td colSpan="5">{translations[lang].noData}</td>
//                       </tr>
//                     ) : (
//                       record.attendance.map((att) => (
//                         <tr key={att._id}>
//                           <td>{att.user?.name || 'N/A'}</td>
//                           <td>{att.branch?.name || 'N/A'}</td>
//                           <td>{new Date(att.checkInTime).toLocaleTimeString()}</td>
//                           <td>
//                             {att.checkOutTime
//                               ? new Date(att.checkOutTime).toLocaleTimeString()
//                               : '-'}
//                           </td>
//                           <td>{translations[lang][att.dayStatus] || att.dayStatus}</td>
//                         </tr>
//                       ))
//                     )
//                   )
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AdminDashboard;


import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet, apiPost, apiPut, apiDelete } from '../helpers/api';

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [attendance, setAttendance] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [attendancePage, setAttendancePage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [editUser, setEditUser] = useState(null);
  const [totalSalaries, setTotalSalaries] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const navigate = useNavigate();
  const lang = document.documentElement.getAttribute('lang') || 'en';

  const translations = {
    en: {
      dashboard: 'Admin Dashboard',
      employees: 'Employees',
      name: 'Name',
      email: 'Email',
      branch: 'Branch',
      checkIn: 'Check-In',
      checkOut: 'Check-Out',
      date: 'Date',
      day: 'Day',
      status: 'Status',
      viewProfile: 'View Profile',
      selectBranch: 'Select Branch',
      selectDate: 'Select Date',
      allBranches: 'All Branches',
      error: 'An error occurred',
      previous: 'Previous',
      next: 'Next',
      page: 'Page',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      role: 'Role',
      phone: 'Phone',
      address: 'Address',
      salary: 'Salary',
      requiredWorkingDays: 'Required Working Days',
      workingDaysNames: 'Working Days Names',
      workingHoursPerDay: 'Working Hours Per Day',
      workStartTime: 'Work Start Time',
      workEndTime: 'Work End Time',
      absenceDeductionRate: 'Absence Deduction Rate (%)',
      lateDeductionRate: 'Late Deduction Rate (%)',
      earlyLeaveDeductionRate: 'Early Leave Deduction Rate (%)',
      allowRemoteAbsence: 'Allow Remote Absence',
      addEmployee: 'Add Employee',
      totalSalaries: 'Total Salaries',
      calculateSalaries: 'Calculate Salaries for Month',
      year: 'Year',
      month: 'Month',
      total: 'Total Salaries',
      branchTotal: 'Branch Total',
      noData: 'No data available',
      active: 'Active',
      resendActivation: 'Resend Activation',
      resendSuccess: 'Activation email resent',
    },
    ar: {
      dashboard: 'لوحة تحكم الإدارة',
      employees: 'الموظفون',
      name: 'الاسم',
      email: 'البريد الإلكتروني',
      branch: 'الفرع',
      checkIn: 'تسجيل الدخول',
      checkOut: 'تسجيل الخروج',
      date: 'التاريخ',
      day: 'اليوم',
      status: 'الحالة',
      viewProfile: 'عرض الملف الشخصي',
      selectBranch: 'اختر الفرع',
      selectDate: 'اختر التاريخ',
      allBranches: 'جميع الفروع',
      error: 'حدث خطأ',
      previous: 'السابق',
      next: 'التالي',
      page: 'الصفحة',
      edit: 'تعديل',
      delete: 'حذف',
      save: 'حفظ',
      cancel: 'إلغاء',
      role: 'الدور',
      phone: 'الهاتف',
      address: 'العنوان',
      salary: 'الراتب',
      requiredWorkingDays: 'أيام العمل المطلوبة',
      workingDaysNames: 'أسماء أيام العمل',
      workingHoursPerDay: 'ساعات العمل في اليوم',
      workStartTime: 'وقت بداية العمل',
      workEndTime: 'وقت نهاية العمل',
      absenceDeductionRate: 'نسبة خصم الغياب (%)',
      lateDeductionRate: 'نسبة خصم التأخير (%)',
      earlyLeaveDeductionRate: 'نسبة خصم المغادرة المبكرة (%)',
      allowRemoteAbsence: 'السماح بتسجيل الغياب عن بعد',
      addEmployee: 'إضافة موظف',
      totalSalaries: 'إجمالي المرتبات',
      calculateSalaries: 'حساب المرتبات للشهر',
      year: 'السنة',
      month: 'الشهر',
      total: 'إجمالي المرتبات',
      branchTotal: 'إجمالي الفرع',
      noData: 'لا توجد بيانات',
      active: 'مفعل',
      resendActivation: 'إعادة إرسال التفعيل',
      resendSuccess: 'تم إعادة إرسال إيميل التفعيل',
    },
  };
const [pendingDevices, setPendingDevices] = useState([]);
const [pendingPage, setPendingPage] = useState(1);
const [pendingPages, setPendingPages] = useState(1);

useEffect(() => {
  const fetchPending = async () => {
    const res = await apiGet(`/users/pending-devices?page=${pendingPage}`);
    setPendingDevices(res.data.pendingDevices);
    setPendingPages(res.data.pagination.pages);
  };
  fetchPending();
}, [pendingPage]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const branchRes = await apiGet('/branches');
        setBranches(branchRes.data);
        const userRes = await apiGet('/users');
        setEmployees(userRes.data);
        handleAttendanceFilter();
      } catch (err) {
        setError(translations[lang].error);
      }
    };
    fetchData();
  }, [lang]);

  const handleAttendanceFilter = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedBranch) params.append('branch', selectedBranch);
      if (selectedDate) params.append('date', selectedDate);
      params.append('page', attendancePage);
      params.append('limit', itemsPerPage);
      const attendanceRes = await apiGet(`/admin/attendance?${params.toString()}`);
      setAttendance(attendanceRes.data);
    } catch (err) {
      setError(translations[lang].error);
    }
  };

  useEffect(() => {
    handleAttendanceFilter();
  }, [selectedBranch, selectedDate, attendancePage]);

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
      workingDaysNames: user.workingDaysNames.join(','),
      absenceDeductionRate: user.absenceDeductionRate * 100,
      lateDeductionRate: user.lateDeductionRate * 100,
      earlyLeaveDeductionRate: user.earlyLeaveDeductionRate * 100,
    });
  };

  const handleDelete = async (id) => {
    try {
      await apiDelete(`/users/${id}`);
      setEmployees(employees.filter(u => u._id !== id));
      setSuccess('User deleted');
    } catch (err) {
      setError(err.response?.data?.message || translations[lang].error);
    }
  };

// AdminDashboard.jsx - handleSave المحدث
const handleSave = async () => {
  try {
    const dataToSend = {
      ...editUser,
      workingDaysNames: editUser.workingDaysNames, // لا تحويل هنا، لأنها string، والbackend يتعامل معها
      branches: editUser.branches,
    };
    console.log('Sending data:', dataToSend); // للتصحيح
    await apiPut(`/users/${editUser._id}`, dataToSend);
    // الباقي كما هو
  } catch (err) {
    console.error('Update error:', err.response?.data); // عرض الخطأ التفصيلي
    setError(translations[lang].error + ': ' + (err.response?.data?.message || err.message));
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
      setError(err.response?.data?.message || translations[lang].error);
    }
  };

  const handleResendActivation = async (userId) => {
    try {
     await apiPost(`/auth/resend-activation/${userId}`, { userId });

      setSuccess(translations[lang].resendSuccess);
    } catch (err) {
      setError(err.response?.data?.message || translations[lang].error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = employees.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const attendancePagination = attendance[0]?.pagination || { page: 1, pages: 1 };
  const attendancePrev = () => {
    if (attendancePage > 1) setAttendancePage(attendancePage - 1);
  };
  const attendanceNext = () => {
    if (attendancePage < attendancePagination.pages) setAttendancePage(attendancePage + 1);
  };
const handleApprove = async (userId, fingerprint) => {
  await apiPost('/users/approve-device', { userId, deviceFingerprint: fingerprint });
  // أعد تحميل الجدول
  const res = await apiGet(`/users/pending-devices?page=${pendingPage}`);
  setPendingDevices(res.data.pendingDevices);
};

const handleReject = async (userId, fingerprint) => {
  await apiPost('/users/reject-device', { userId, deviceFingerprint: fingerprint });
  // أعد تحميل
};
  return (
    <div className="container mt-4">
      <h2>{translations[lang].dashboard}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card mb-4">
        <div className="card-body">
          <h3 className="card-title">{translations[lang].employees}</h3>
          <button className="btn btn-primary mb-3" onClick={handleAddEmployee}>
            {translations[lang].addEmployee}
          </button>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-primary">
                <tr>
                  <th>{translations[lang].name}</th>
                  <th>{translations[lang].email}</th>
                  <th>{translations[lang].branch}</th>
                  <th>{translations[lang].active}</th>
                  <th>{translations[lang].actions}</th>
                </tr>
              </thead>
              <tbody>
                {currentEmployees.map((emp) => (
                  <tr key={emp._id}>
                    <td>{emp.name}</td>
                    <td>{emp.email}</td>
                    <td>{emp.branches.map(b => b.name).join(', ')}</td>
                    <td>{emp.isActive ? 'Yes' : 'No'}</td>
                    <td>
                      <button className="btn btn-sm btn-info me-1" onClick={() => navigate(`/profile/${emp._id}`)}>
                        {translations[lang].viewProfile}
                      </button>
                      <button className="btn btn-sm btn-warning me-1" onClick={() => handleEdit(emp)}>
                        {translations[lang].edit}
                      </button>
                      <button className="btn btn-sm btn-danger me-1" onClick={() => handleDelete(emp._id)}>
                        {translations[lang].delete}
                      </button>
                      {!emp.isActive && (
                        <button className="btn btn-sm btn-secondary" onClick={() => handleResendActivation(emp._id)}>
                          {translations[lang].resendActivation}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="tab-pane" id="pending-devices">
  <h2>Pending Devices</h2>
  <table className="table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Device</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {pendingDevices.map((d) => (
        <tr key={d.deviceFingerprint}>
          <td>{d.userName}</td>
          <td>{d.userEmail}</td>
          <td>{d.deviceFingerprint}</td>
          <td>
            <button onClick={() => handleApprove(d.userId, d.deviceFingerprint)}>Approve</button>
            <button onClick={() => handleReject(d.userId, d.deviceFingerprint)}>Reject</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
  <nav>
    <button onClick={() => setPendingPage(p => p - 1)} disabled={pendingPage === 1}>Previous</button>
    <span>{pendingPage} / {pendingPages}</span>
    <button onClick={() => setPendingPage(p => p + 1)} disabled={pendingPage === pendingPages}>Next</button>
  </nav>
</div>
          </div>
          <nav>
            <ul className="pagination">
              <li className="page-item">
                <button className="page-link" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                  {translations[lang].previous}
                </button>
              </li>
              <li className="page-item">
                <button className="page-link" onClick={() => paginate(currentPage + 1)} disabled={currentPage >= Math.ceil(employees.length / itemsPerPage)}>
                  {translations[lang].next}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {editUser && (
        <div className="card mb-4">
          <div className="card-body">
            <h3 className="card-title">{translations[lang].edit} {editUser.name}</h3>
            <form>
              <div className="mb-3">
                <label className="form-label">{translations[lang].name}</label>
                <input
                  type="text"
                  className="form-control"
                  value={editUser.name}
                  onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">{translations[lang].email}</label>
                <input
                  type="email"
                  className="form-control"
                  value={editUser.email}
                  onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">{translations[lang].role}</label>
                <select
                  className="form-select"
                  value={editUser.role}
                  onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                >
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">{translations[lang].branches}</label>
                <select
                  multiple
                  className="form-select"
                  value={editUser.branches}
                  onChange={(e) => setEditUser({ ...editUser, branches: Array.from(e.target.selectedOptions, option => option.value) })}
                >
                  {branches.map(branch => (
                    <option key={branch._id} value={branch._id}>{branch.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">{translations[lang].phone}</label>
                <input
                  type="text"
                  className="form-control"
                  value={editUser.phone || ''}
                  onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">{translations[lang].address}</label>
                <input
                  type="text"
                  className="form-control"
                  value={editUser.address || ''}
                  onChange={(e) => setEditUser({ ...editUser, address: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">{translations[lang].salary}</label>
                <input
                  type="number"
                  className="form-control"
                  value={editUser.salary || ''}
                  onChange={(e) => setEditUser({ ...editUser, salary: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">{translations[lang].requiredWorkingDays}</label>
                <input
                  type="number"
                  className="form-control"
                  value={editUser.requiredWorkingDays}
                  onChange={(e) => setEditUser({ ...editUser, requiredWorkingDays: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">{translations[lang].workingDaysNames} (comma-separated)</label>
                <input
                  type="text"
                  className="form-control"
                  value={editUser.workingDaysNames}
                  onChange={(e) => setEditUser({ ...editUser, workingDaysNames: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">{translations[lang].workingHoursPerDay}</label>
                <input
                  type="number"
                  className="form-control"
                  value={editUser.workingHoursPerDay}
                  onChange={(e) => setEditUser({ ...editUser, workingHoursPerDay: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">{translations[lang].workStartTime} (HH:MM)</label>
                <input
                  type="text"
                  className="form-control"
                  value={editUser.workStartTime || ''}
                  onChange={(e) => setEditUser({ ...editUser, workStartTime: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">{translations[lang].workEndTime} (HH:MM)</label>
                <input
                  type="text"
                  className="form-control"
                  value={editUser.workEndTime || ''}
                  onChange={(e) => setEditUser({ ...editUser, workEndTime: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">{translations[lang].absenceDeductionRate}</label>
                <input
                  type="number"
                  className="form-control"
                  value={editUser.absenceDeductionRate}
                  onChange={(e) => setEditUser({ ...editUser, absenceDeductionRate: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">{translations[lang].lateDeductionRate}</label>
                <input
                  type="number"
                  className="form-control"
                  value={editUser.lateDeductionRate}
                  onChange={(e) => setEditUser({ ...editUser, lateDeductionRate: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">{translations[lang].earlyLeaveDeductionRate}</label>
                <input
                  type="number"
                  className="form-control"
                  value={editUser.earlyLeaveDeductionRate}
                  onChange={(e) => setEditUser({ ...editUser, earlyLeaveDeductionRate: e.target.value })}
                />
              </div>
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={editUser.allowRemoteAbsence}
                  onChange={(e) => setEditUser({ ...editUser, allowRemoteAbsence: e.target.checked })}
                />
                <label className="form-check-label">{translations[lang].allowRemoteAbsence}</label>
              </div>
              <button type="button" className="btn btn-primary me-2" onClick={handleSave}>
                {translations[lang].save}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setEditUser(null)}>
                {translations[lang].cancel}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="card mb-4">
        <div className="card-body">
          <h3 className="card-title">{translations[lang].totalSalaries}</h3>
          <div className="row">
            <div className="col-md-3">
              <label className="form-label">{translations[lang].year}</label>
              <input
                type="number"
                className="form-control"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">{translations[lang].month}</label>
              <input
                type="number"
                className="form-control"
                value={month}
                min={1}
                max={12}
                onChange={(e) => setMonth(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">{translations[lang].selectBranch}</label>
              <select
                className="form-select"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
              >
                <option value="">{translations[lang].allBranches}</option>
                {branches.map(branch => (
                  <option key={branch._id} value={branch._id}>{branch.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <button className="btn btn-primary" onClick={handleCalculateSalaries}>
                {translations[lang].calculateSalaries}
              </button>
            </div>
          </div>
          {totalSalaries && (
            <div className="mt-3">
              <h4>{translations[lang].total}: {totalSalaries.totalSalaries}</h4>
              <table className="table table-bordered mt-2">
                <thead>
                  <tr>
                    <th>{translations[lang].branch}</th>
                    <th>{translations[lang].branchTotal}</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(totalSalaries.branchTotals).map(([branchId, total]) => {
                    const branchName = branches.find(b => b._id === branchId)?.name || branchId;
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

      <div className="card mb-4">
        <div className="card-body">
          <h3 className="card-title">{translations[lang].selectBranch}</h3>
          <select
            className="form-select mb-3"
            value={selectedBranch}
            onChange={(e) => handleBranchFilter(e.target.value)}
          >
            <option value="">{translations[lang].allBranches}</option>
            {branches.map(branch => (
              <option key={branch._id} value={branch._id}>{branch.name}</option>
            ))}
          </select>
          <div className="mb-3">
            <label className="form-label">{translations[lang].selectDate}</label>
            <input
              type="date"
              className="form-control"
              value={selectedDate}
              onChange={(e) => handleDateFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h3 className="card-title">{translations[lang].employees} {translations[lang].attendance}</h3>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-primary">
                <tr>
                  <th>{translations[lang].name}</th>
                  <th>{translations[lang].branch}</th>
                  <th>{translations[lang].date}</th>
                  <th>{translations[lang].day}</th>
                  <th>{translations[lang].checkIn}</th>
                  <th>{translations[lang].checkOut}</th>
                  <th>{translations[lang].status}</th>
                </tr>
              </thead>
              <tbody>
                {attendance.length === 0 ? (
                  <tr>
                    <td colSpan="7">{translations[lang].noData}</td>
                  </tr>
                ) : (
                  attendance.flatMap((record) =>
                    record.attendance.length === 0 ? (
                      <tr key={record.branch._id}>
                        <td colSpan="7">{translations[lang].noData}</td>
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
                            <td>{translations[lang][att.dayStatus] || att.dayStatus}</td>
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
                <button className="page-link" onClick={attendancePrev} disabled={attendancePage === 1}>
                  {translations[lang].previous}
                </button>
              </li>
              <li className="page-item disabled">
                <span className="page-link">{attendancePage} / {attendancePagination.pages}</span>
              </li>
              <li className="page-item">
                <button className="page-link" onClick={attendanceNext} disabled={attendancePage >= attendancePagination.pages}>
                  {translations[lang].next}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;