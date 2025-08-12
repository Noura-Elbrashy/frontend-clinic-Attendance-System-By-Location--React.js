// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { apiGet, apiPost } from '../helpers/api';

// function UserProfile() {
//   const { id } = useParams();
//   const [user, setUser] = useState(null);
//   const [attendance, setAttendance] = useState([]);
//   const [feedback, setFeedback] = useState('');
//   const [isWarning, setIsWarning] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [isAdmin, setIsAdmin] = useState(false);
//   const navigate = useNavigate();
//   const lang = document.documentElement.getAttribute('lang') || 'ar';

//   const translations = {
//     en: {
//       profile: 'Profile',
//       name: 'Name',
//       email: 'Email',
//       branches: 'Branches',
//       attendanceHistory: 'Attendance History',
//       date: 'Date',
//       branch: 'Branch',
//       checkIn: 'Check-In',
//       checkOut: 'Check-Out',
//       status: 'Status',
//       feedback: 'Feedback/Warnings',
//       addFeedback: 'Add Feedback',
//       submit: 'Submit',
//       warning: 'Warning',
//       monthlyReport: 'Monthly Report',
//       workingDays: 'Working Days',
//       holidays: 'Holidays',
//       absences: 'Absences',
//       error: 'An error occurred',
//       feedbackSuccess: 'Feedback added successfully',
//     },
//     ar: {
//       profile: 'الملف الشخصي',
//       name: 'الاسم',
//       email: 'البريد الإلكتروني',
//       branches: 'الفروع',
//       attendanceHistory: 'سجل الحضور',
//       date: 'التاريخ',
//       branch: 'الفرع',
//       checkIn: 'تسجيل الدخول',
//       checkOut: 'تسجيل الخروج',
//       status: 'الحالة',
//       feedback: 'التعليقات/التحذيرات',
//       addFeedback: 'إضافة تعليق',
//       submit: 'إرسال',
//       warning: 'تحذير',
//       monthlyReport: 'تقرير شهري',
//       workingDays: 'أيام العمل',
//       holidays: 'الإجازات',
//       absences: 'الغيابات',
//       error: 'حدث خطأ',
//       feedbackSuccess: 'تم إضافة التعليق بنجاح',
//     },
//   };

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await apiGet(id === 'me' ? '/auth/profile' : `/users/${id}`);
//         setUser(res.data.user || res.data);
//         setAttendance(res.data.attendance || []);
//         const profileRes = await apiGet('/auth/profile');
//         setIsAdmin(profileRes.data.role === 'admin');
//       } catch (err) { // eslint-disable-line no-unused-vars
//         setError(err.response?.data?.message || translations[lang].error);
//         navigate('/');
//       }
//     };
//     fetchProfile();
//   }, [id, navigate, lang]);

//   const handleFeedbackSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await apiPost(`/users/${user._id}/feedback`, { message: feedback, isWarning });
//       setSuccess(translations[lang].feedbackSuccess);
//       setFeedback('');
//       setIsWarning(false);
//       const res = await apiGet(`/users/${user._id}`);
//       setUser(res.data.user);
//     } catch (err) { // eslint-disable-line no-unused-vars
//       setError(err.response?.data?.message || translations[lang].error);
//     }
//   };

//   const handleReport = async (year, month) => {
//     try {
//       const res = await apiGet(`/users/${user._id}/report/${year}/${month}`);
//       setSuccess(JSON.stringify(res.data, null, 2)); // Display report as JSON for now
//     } catch (err) { // eslint-disable-line no-unused-vars
//       setError(err.response?.data?.message || translations[lang].error);
//     }
//   };

//   if (!user) return <div>Loading...</div>;

//   return (
//     <div className="container mt-4">
//       <h2 className="mb-4">{translations[lang].profile}</h2>
//       {error && <div className="alert alert-danger">{error}</div>}
//       {success && <div className="alert alert-success">{success}</div>}

//       <div className="card mb-4">
//         <div className="card-body">
//           <h3 className="card-title">{translations[lang].profile}</h3>
//           <p><strong>{translations[lang].name}:</strong> {user.name}</p>
//           <p><strong>{translations[lang].email}:</strong> {user.email}</p>
//           <p><strong>{translations[lang].branches}:</strong> {user.branches.map(b => b.name).join(', ')}</p>
//         </div>
//       </div>

//       <div className="card mb-4">
//         <div className="card-body">
//           <h3 className="card-title">{translations[lang].attendanceHistory}</h3>
//           <div className="table-responsive">
//             <table className="table table-bordered">
//               <thead className="table-primary">
//                 <tr>
//                   <th>{translations[lang].date}</th>
//                   <th>{translations[lang].branch}</th>
//                   <th>{translations[lang].checkIn}</th>
//                   <th>{translations[lang].checkOut}</th>
//                   <th>{translations[lang].status}</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {attendance.map(record => (
//                   <tr key={record._id}>
//                     <td>{new Date(record.checkInTime).toLocaleDateString()}</td>
//                     <td>{record.branch.name}</td>
//                     <td>{new Date(record.checkInTime).toLocaleTimeString()}</td>
//                     <td>{record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : '-'}</td>
//                     <td>{translations[lang][record.dayStatus] || record.dayStatus}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {isAdmin && (
//         <div className="card mb-4">
//           <div className="card-body">
//             <h3 className="card-title">{translations[lang].addFeedback}</h3>
//             <form onSubmit={handleFeedbackSubmit}>
//               <div className="mb-3">
//                 <label className="form-label">{translations[lang].feedback}</label>
//                 <textarea
//                   className="form-control"
//                   value={feedback}
//                   onChange={(e) => setFeedback(e.target.value)}
//                   required
//                 ></textarea>
//               </div>
//               <div className="mb-3 form-check">
//                 <input
//                   type="checkbox"
//                   className="form-check-input"
//                   checked={isWarning}
//                   onChange={(e) => setIsWarning(e.target.checked)}
//                 />
//                 <label className="form-check-label">{translations[lang].warning}</label>
//               </div>
//               <button type="submit" className="btn btn-primary">{translations[lang].submit}</button>
//             </form>
//           </div>
//         </div>
//       )}

//       <div className="card mb-4">
//         <div className="card-body">
//           <h3 className="card-title">{translations[lang].feedback}</h3>
//           {user.feedback.length === 0 ? (
//             <p>No feedback available</p>
//           ) : (
//             <ul className="list-group">
//               {user.feedback.map((f, index) => (
//                 <li key={index} className={`list-group-item ${f.isWarning ? 'list-group-item-warning' : ''}`}>
//                   {f.message} ({new Date(f.date).toLocaleDateString()}) {f.isWarning ? translations[lang].warning : ''}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </div>

//       {isAdmin && (
//         <div className="card">
//           <div className="card-body">
//             <h3 className="card-title">{translations[lang].monthlyReport}</h3>
//             <button
//               className="btn btn-info"
//               onClick={() => handleReport(new Date().getFullYear(), new Date().getMonth() + 1)}
//             >
//               {translations[lang].monthlyReport}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default UserProfile;
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiGet, apiPost } from '../helpers/api';

function UserProfile() {
  const [year, setYear] = useState(new Date().getFullYear());
const [month, setMonth] = useState(new Date().getMonth() + 1);
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [isWarning, setIsWarning] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [monthlyReport, setMonthlyReport] = useState(null);
  const [remotePermissionDate, setRemotePermissionDate] = useState('');
  const [remotePermissionBranch, setRemotePermissionBranch] = useState('');
  const navigate = useNavigate();
  const lang = document.documentElement.getAttribute('lang') || 'ar';

  const translations = {
    en: {
      profile: 'Profile',
      name: 'Name',
      email: 'Email',
      branches: 'Branches',
      attendanceHistory: 'Attendance History',
      date: 'Date',
      branch: 'Branch',
      checkIn: 'Check-In',
      checkOut: 'Check-Out',
      status: 'Status',
      lateMinutes: 'Late Minutes',
      earlyLeaveMinutes: 'Early Leave Minutes',
      feedback: 'Feedback/Warnings',
      addFeedback: 'Add Feedback',
      submit: 'Submit',
      warning: 'Warning',
      monthlyReport: 'Monthly Report',
      workingDays: 'Working Days',
      holidays: 'Holidays',
      absences: 'Absences',
      totalLateMinutes: 'Total Late Minutes',
      totalEarlyLeaveMinutes: 'Total Early Leave Minutes',
      netSalary: 'Net Salary',
      deductions: 'Deductions',
      absence: 'Absence',
      late: 'Late',
      early: 'Early',
      error: 'An error occurred',
      feedbackSuccess: 'Feedback added successfully',
      generateReport: 'Generate Report',
      year: 'Year',
      month: 'Month',
      grantRemotePermission: 'Grant Remote Permission',
      selectDate: 'Select Date',
      selectBranch: 'Select Branch',
      grant: 'Grant',
    },
    ar: {
      profile: 'الملف الشخصي',
      name: 'الاسم',
      email: 'البريد الإلكتروني',
      branches: 'الفروع',
      attendanceHistory: 'سجل الحضور',
      date: 'التاريخ',
      branch: 'الفرع',
      checkIn: 'تسجيل الدخول',
      checkOut: 'تسجيل الخروج',
      status: 'الحالة',
      lateMinutes: 'دقائق التأخير',
      earlyLeaveMinutes: 'دقائق المغادرة المبكرة',
      feedback: 'التعليقات/التحذيرات',
      addFeedback: 'إضافة تعليق',
      submit: 'إرسال',
      warning: 'تحذير',
      monthlyReport: 'تقرير شهري',
      workingDays: 'أيام العمل',
      holidays: 'الإجازات',
      absences: 'الغيابات',
      totalLateMinutes: 'إجمالي دقائق التأخير',
      totalEarlyLeaveMinutes: 'إجمالي دقائق المغادرة المبكرة',
      netSalary: 'الراتب الصافي',
      deductions: 'الخصومات',
      absence: 'الغياب',
      late: 'التأخير',
      early: 'المغادرة المبكرة',
      error: 'حدث خطأ',
      feedbackSuccess: 'تم إضافة التعليق بنجاح',
      generateReport: 'إنشاء التقرير',
      year: 'السنة',
      month: 'الشهر',
      grantRemotePermission: 'منح إذن تسجيل عن بعد',
      selectDate: 'اختر التاريخ',
      selectBranch: 'اختر الفرع',
      grant: 'منح',
    },
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiGet(id === 'me' ? '/auth/profile' : `/users/${id}`);
        setUser(res.data.user || res.data);
        setAttendance(res.data.attendance || []);
        const profileRes = await apiGet('/auth/profile');
        setIsAdmin(profileRes.data.role === 'admin');
      } catch (err) {
        setError(err.response?.data?.message || translations[lang].error);
        navigate('/');
      }
    };
    fetchProfile();
  }, [id, navigate, lang]);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiPost(`/users/${user._id}/feedback`, { message: feedback, isWarning });
      setUser({ ...user, feedback: [...user.feedback, res.data.feedback] });
      setFeedback('');
      setIsWarning(false);
      setSuccess(translations[lang].feedbackSuccess);
    } catch (err) {
      setError(err.response?.data?.message || translations[lang].error);
    }
  };

  const handleGenerateReport = async () => {
    try {
      const res = await apiGet(`/users/${user._id}/monthly-report?year=${year}&month=${month}`);
      setMonthlyReport(res.data);
    } catch (err) {
      setError(err.response?.data?.message || translations[lang].error);
    }
  };

  const handleGrantRemote = async () => {
    try {
      await apiPost('/attendance/grant-remote-permission', { userId: user._id, branchId: remotePermissionBranch, date: remotePermissionDate });
      setSuccess('تم منح الإذن');
      setRemotePermissionDate('');
      setRemotePermissionBranch('');
    } catch (err) {
      setError(err.response?.data?.message || translations[lang].error);
    }
  };

  return (
    <div className="container mt-4">
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {user ? (
        <>
          <h2>{translations[lang].profile}</h2>
          <p>{translations[lang].name}: {user.name}</p>
          <p>{translations[lang].email}: {user.email}</p>
          <p>{translations[lang].branches}: {user.branches.map(b => b.name).join(', ')}</p>

          <div className="card mb-4">
            <div className="card-body">
              <h3 className="card-title">{translations[lang].attendanceHistory}</h3>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>{translations[lang].date}</th>
                    <th>{translations[lang].branch}</th>
                    <th>{translations[lang].checkIn}</th>
                    <th>{translations[lang].checkOut}</th>
                    <th>{translations[lang].lateMinutes}</th>
                    <th>{translations[lang].earlyLeaveMinutes}</th>
                    <th>{translations[lang].status}</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((record) => (
                    <tr key={record._id}>
                      <td>{new Date(record.checkInTime).toLocaleDateString()}</td>
                      <td>{record.branch.name}</td>
                      <td>{new Date(record.checkInTime).toLocaleTimeString()}</td>
                      <td>{record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : '-'}</td>
                      <td>{record.lateMinutes || 0}</td>
                      <td>{record.earlyLeaveMinutes || 0}</td>
                      <td>{translations[lang][record.dayStatus] || record.dayStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {isAdmin && (
            <div className="card mb-4">
              <div className="card-body">
                <h3 className="card-title">{translations[lang].addFeedback}</h3>
                <form onSubmit={handleFeedbackSubmit}>
                  <div className="mb-3">
                    <label className="form-label">{translations[lang].feedback}</label>
                    <textarea
                      className="form-control"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={isWarning}
                      onChange={(e) => setIsWarning(e.target.checked)}
                    />
                    <label className="form-check-label">{translations[lang].warning}</label>
                  </div>
                  <button type="submit" className="btn btn-primary">{translations[lang].submit}</button>
                </form>
              </div>
            </div>
          )}

          <div className="card mb-4">
            <div className="card-body">
              <h3 className="card-title">{translations[lang].feedback}</h3>
              {user.feedback.length === 0 ? (
                <p>No feedback available</p>
              ) : (
                <ul className="list-group">
                  {user.feedback.map((f, index) => (
                    <li key={index} className={`list-group-item ${f.isWarning ? 'list-group-item-warning' : ''}`}>
                      {f.message} ({new Date(f.date).toLocaleDateString()}) {f.isWarning ? translations[lang].warning : ''}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body">
              <h3 className="card-title">{translations[lang].monthlyReport}</h3>
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
                <div className="col-md-3 d-flex align-items-end">
                  <button className="btn btn-info" onClick={handleGenerateReport}>
                    {translations[lang].generateReport}
                  </button>
                </div>
              </div>
              {monthlyReport && (
                <div className="mt-3">
                  <p>{translations[lang].workingDays}: {monthlyReport.workingDays}</p>
                  <p>{translations[lang].holidays}: {monthlyReport.holidays}</p>
                  <p>{translations[lang].absences}: {monthlyReport.absences}</p>
                  <p>{translations[lang].totalLateMinutes}: {monthlyReport.totalLateMinutes}</p>
                  <p>{translations[lang].totalEarlyLeaveMinutes}: {monthlyReport.totalEarlyLeaveMinutes}</p>
                  <p>{translations[lang].deductions}:</p>
                  <ul>
                    <li>{translations[lang].absence}: {monthlyReport.deductions.absence}</li>
                    <li>{translations[lang].late}: {monthlyReport.deductions.late}</li>
                    <li>{translations[lang].early}: {monthlyReport.deductions.early}</li>
                  </ul>
                  <p>{translations[lang].netSalary}: {monthlyReport.netSalary}</p>
                </div>
              )}
            </div>
          </div>

          {isAdmin && (
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">{translations[lang].grantRemotePermission}</h3>
                <div className="row">
                  <div className="col-md-4">
                    <label className="form-label">{translations[lang].selectDate}</label>
                    <input
                      type="date"
                      className="form-control"
                      value={remotePermissionDate}
                      onChange={(e) => setRemotePermissionDate(e.target.value)}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">{translations[lang].selectBranch}</label>
                    <select
                      className="form-select"
                      value={remotePermissionBranch}
                      onChange={(e) => setRemotePermissionBranch(e.target.value)}
                    >
                      <option value="">{translations[lang].selectBranch}</option>
                      {user.branches.map(branch => (
                        <option key={branch._id} value={branch._id}>{branch.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4 d-flex align-items-end">
                    <button className="btn btn-primary" onClick={handleGrantRemote}>
                      {translations[lang].grant}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default UserProfile;