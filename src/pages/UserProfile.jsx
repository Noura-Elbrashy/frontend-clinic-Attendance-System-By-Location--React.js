import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiGet, apiPost } from '../helpers/api';
import '../style/UserProfile.css';

function UserProfile() {
  const { t } = useTranslation();
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
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [attendancePerPage] = useState(10);
  const navigate = useNavigate();

  // Show toast notifications - Fixed Bootstrap Toast issue
  const showToast = (message, type = 'success') => {
    // Create simple alert as fallback if Bootstrap is not loaded
    if (!window.bootstrap || !window.bootstrap.Toast) {
      alert(message);
      return;
    }

    const toastContainer = document.getElementById('toast-container') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type === 'success' ? 'success' : 'danger'} border-0`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    `;
    toastContainer.appendChild(toast);
    const bsToast = new window.bootstrap.Toast(toast);
    bsToast.show();
    toast.addEventListener('hidden.bs.toast', () => toast.remove());
  };

  const createToastContainer = () => {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container position-fixed top-0 end-0 p-3';
    container.style.zIndex = '1055';
    document.body.appendChild(container);
    return container;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await apiGet(id === 'me' ? '/auth/profile' : `/users/${id}`);
        setUser(res.data.user || res.data);
        
        // Fetch attendance data separately
        const attendanceRes = await apiGet(`/attendance/user/${id === 'me' ? res.data._id || res.data.user._id : id}`);
        setAttendance(attendanceRes.data || []);
        
        const profileRes = await apiGet('/auth/profile');
        setIsAdmin(profileRes.data.role === 'admin');
      } catch (err) {
        const errorMsg = err.response?.data?.message || t('error');
        setError(errorMsg);
        showToast(errorMsg, 'error');
        setTimeout(() => navigate('/'), 3000);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id, navigate, t]);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      showToast(t('accessDenied'), 'error');
      return;
    }
    try {
      const res = await apiPost(`/users/${user._id}/feedback`, { message: feedback, isWarning });
      setUser({ ...user, feedback: [...(user.feedback || []), res.data.feedback] });
      setFeedback('');
      setIsWarning(false);
      showToast(t('feedbackSuccess'));
    } catch (err) {
      const errorMsg = err.response?.data?.message || t('error');
      setError(errorMsg);
      showToast(errorMsg, 'error');
    }
  };

  const handleGenerateReport = async () => {
    if (!isAdmin) {
      showToast(t('accessDenied'), 'error');
      return;
    }
    try {
      // Fixed API endpoint
      const res = await apiGet(`/users/${user._id}/report/${year}/${month}`);
      setMonthlyReport(res.data);
      showToast(t('generateReportSuccess'));
    } catch (err) {
      const errorMsg = err.response?.data?.message || t('error');
      setError(errorMsg);
      showToast(errorMsg, 'error');
    }
  };

  const handleGrantRemote = async () => {
    if (!isAdmin) {
      showToast(t('accessDenied'), 'error');
      return;
    }
    try {
      await apiPost('/attendance/grant-remote-permission', { 
        userId: user._id, 
        branchId: remotePermissionBranch, 
        date: remotePermissionDate 
      });
      showToast(t('grantSuccess'));
      setRemotePermissionDate('');
      setRemotePermissionBranch('');
    } catch (err) {
      const errorMsg = err.response?.data?.message || t('error');
      setError(errorMsg);
      showToast(errorMsg, 'error');
    }
  };

  // const handleExportPDF = async () => {
  //   if (!isAdmin) {
  //     showToast(t('accessDenied'), 'error');
  //     return;
  //   }
  //   try {
  //     // Fixed API endpoint and headers
  //     const response = await fetch(`http://localhost:5000/api/report/user/${user._id}/pdf`, {
  //       headers: {
  //         'Authorization': `Bearer ${localStorage.getItem('token')}`
  //       }
  //     });
      
  //     if (response.ok) {
  //       const blob = await response.blob();
  //       const url = window.URL.createObjectURL(blob);
  //       const a = document.createElement('a');
  //       a.href = url;
  //       a.download = `${user.name}_report.pdf`;
  //       a.click();
  //       showToast(t('exportPDFSuccess'));
  //     } else {
  //       throw new Error(t('exportFailed'));
  //     }
  //   } catch (err) {
  //     showToast(t('exportFailed'), 'error');
  //   }
  // };
const handleExportPDF = async () => {
  try {
    const response = await fetch(`/api/report/user/${user._id}/pdf?lang=${t('lang')}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${user.name}_report.pdf`;
      a.click();
      showToast(t('exportPDFSuccess'));
    } else {
      throw new Error(t('exportFailed'));
    }
  } catch (err) {
    showToast(t('exportFailed'), 'error');
  }
};
  const handleExportExcel = async () => {
    if (!isAdmin) {
      showToast(t('accessDenied'), 'error');
      return;
    }
    try {
      // Fixed API endpoint and headers
      const response = await fetch(`http://localhost:5000/api/report/user/${user._id}/excel`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${user.name}_report.xlsx`;
        a.click();
        showToast(t('exportExcelSuccess'));
      } else {
        throw new Error(t('exportFailed'));
      }
    } catch (err) {
      showToast(t('exportFailed'), 'error');
    }
  };

  // Pagination logic
  const indexOfLastAttendance = currentPage * attendancePerPage;
  const indexOfFirstAttendance = indexOfLastAttendance - attendancePerPage;
  const currentAttendance = attendance.slice(indexOfFirstAttendance, indexOfLastAttendance);
  const totalPages = Math.ceil(attendance.length / attendancePerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate statistics
  const calculateStats = () => {
    if (!attendance.length) return {};
    
    const totalMinutes = attendance.reduce((sum, record) => {
      return sum + (record.durationMinutes || 0);
    }, 0);
    
    const totalHours = Math.round((totalMinutes / 60) * 100) / 100;
    const avgHoursPerDay = Math.round((totalHours / attendance.length) * 100) / 100;
    const workingDays = attendance.filter(record => record.dayStatus === 'working').length;
    const attendanceRate = Math.round((workingDays / attendance.length) * 100);
    
    return { totalHours, avgHoursPerDay, attendanceRate, workingDays };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="container-fluid mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">{t('loading')}</span>
          </div>
          <p className="mt-2">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container-fluid mt-4">
        <div className="alert alert-warning text-center">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {t('error')}
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">

      {/* Profile Header */}
      <div className="profile-header">
        <div className="row align-items-center">
          <div className="col-md-8">
            <h1 className="mb-3">
              <i className="fas fa-user-circle me-3"></i>
              {t('profile')}
            </h1>
            <div className="row">
              <div className="col-md-6">
                <h4>{user.name}</h4>
                <p className="mb-1">
                  <i className="fas fa-envelope me-2"></i>
                  {user.email}
                </p>
                {user.phone && (
                  <p className="mb-1">
                    <i className="fas fa-phone me-2"></i>
                    {user.phone}
                  </p>
                )}
                <p className="mb-0">
                  <i className="fas fa-building me-2"></i>
                  {user.branches?.map(b => b.name).join(', ') || t('noBranches')}
                </p>
              </div>
              <div className="col-md-6 text-md-end">
                <div className="d-flex flex-column gap-2 align-items-md-end">
                  <span className="badge bg-light text-dark fs-6">
                    <i className="fas fa-user-tag me-2"></i>
                    {t(user.role)}
                  </span>
                  {user.salary && (
                    <span className="badge bg-success fs-6">
                      <i className="fas fa-dollar-sign me-2"></i>
                      {user.salary} {t('currency')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Only show export buttons for admins */}
          {isAdmin && (
            <div className="col-md-4 text-md-end">
              <div className="d-flex gap-2 justify-content-md-end">
                <button className="btn btn-light btn-sm" onClick={handleExportPDF}>
                  <i className="fas fa-file-pdf text-danger me-2"></i>
                  {t('exportPDF')}
                </button>
                <button className="btn btn-light btn-sm" onClick={handleExportExcel}>
                  <i className="fas fa-file-excel text-success me-2"></i>
                  {t('exportExcel')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      {attendance.length > 0 && (
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <div className="stats-card text-center">
              <i className="fas fa-clock text-primary fs-1 mb-2"></i>
              <h4 className="text-primary">{stats.totalHours}</h4>
              <p className="text-muted mb-0">{t('totalHours')}</p>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="stats-card text-center">
              <i className="fas fa-calendar-day text-success fs-1 mb-2"></i>
              <h4 className="text-success">{stats.avgHoursPerDay}</h4>
              <p className="text-muted mb-0">{t('avgHoursPerDay')}</p>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="stats-card text-center">
              <i className="fas fa-percentage text-warning fs-1 mb-2"></i>
              <h4 className="text-warning">{stats.attendanceRate}%</h4>
              <p className="text-muted mb-0">{t('attendanceRate')}</p>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="stats-card text-center">
              <i className="fas fa-user-check text-info fs-1 mb-2"></i>
              <h4 className="text-info">{stats.workingDays}</h4>
              <p className="text-muted mb-0">{t('workingDays')}</p>
            </div>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col-lg-8">
          {/* Attendance History */}
          <div className="card card-modern mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="fas fa-history me-2"></i>
                {t('attendanceHistory')}
              </h5>
            </div>
            <div className="card-body p-0">
              {currentAttendance.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th><i className="fas fa-calendar me-2"></i>{t('date')}</th>
                        <th><i className="fas fa-building me-2"></i>{t('branch')}</th>
                        <th><i className="fas fa-sign-in-alt me-2"></i>{t('checkIn')}</th>
                        <th><i className="fas fa-sign-out-alt me-2"></i>{t('checkOut')}</th>
                        <th><i className="fas fa-clock me-2"></i>{t('lateMinutes')}</th>
                        <th><i className="fas fa-running me-2"></i>{t('earlyLeaveMinutes')}</th>
                        <th><i className="fas fa-info-circle me-2"></i>{t('status')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentAttendance.map((record, index) => (
                        <tr key={record._id || index}>
                          <td>{new Date(record.checkInTime || record.date).toLocaleDateString(t('lang') === 'ar' ? 'ar-EG' : 'en-US')}</td>
                          <td>
                            <span className="badge bg-secondary">
                              {record.branch?.name || t('unknown')}
                            </span>
                          </td>
                          <td>{record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString(t('lang') === 'ar' ? 'ar-EG' : 'en-US', {hour: '2-digit', minute: '2-digit'}) : '-'}</td>
                          <td>{record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString(t('lang') === 'ar' ? 'ar-EG' : 'en-US', {hour: '2-digit', minute: '2-digit'}) : '-'}</td>
                          <td>
                            {record.lateMinutes > 0 ? (
                              <span className="badge bg-warning">{record.lateMinutes}</span>
                            ) : (
                              <span className="text-success">0</span>
                            )}
                          </td>
                          <td>
                            {record.earlyLeaveMinutes > 0 ? (
                              <span className="badge bg-danger">{record.earlyLeaveMinutes}</span>
                            ) : (
                              <span className="text-success">0</span>
                            )}
                          </td>
                          <td>
                            <span className={`badge badge-status ${
                              record.dayStatus === 'working' ? 'bg-success' :
                              record.dayStatus === 'absent' ? 'bg-danger' :
                              record.dayStatus === 'late' ? 'bg-warning' :
                              'bg-secondary'
                            }`}>
                              {t(record.dayStatus) || record.dayStatus || t('unknown')}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="fas fa-calendar-times text-muted fs-1 mb-3"></i>
                  <p className="text-muted">{t('noAttendance')}</p>
                </div>
              )}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="card-footer bg-light">
                  <nav>
                    <ul className="pagination justify-content-center mb-0">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                          <i className="fas fa-chevron-left"></i> {t('previous')}
                        </button>
                      </li>
                      {[...Array(Math.min(5, totalPages))].map((_, index) => {
                        const pageNum = currentPage <= 3 ? index + 1 : currentPage - 2 + index;
                        if (pageNum > totalPages) return null;
                        return (
                          <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => paginate(pageNum)}>
                              {pageNum}
                            </button>
                          </li>
                        );
                      })}
                      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => paginate(currentPage + 1)}>
                          {t('next')} <i className="fas fa-chevron-right"></i>
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          {/* Feedback Section */}
          <div className="card card-modern mb-4">
            <div className="card-header bg-info text-white">
              <h6 className="mb-0">
                <i className="fas fa-comments me-2"></i>
                {t('feedback')}
              </h6>
            </div>
            <div className="card-body">
              {user.feedback && user.feedback.length > 0 ? (
                <div className="feedback-list" style={{maxHeight: '300px', overflowY: 'auto'}}>
                  {user.feedback.map((f, index) => (
                    <div key={index} className={`feedback-item ${f.isWarning ? 'warning' : ''}`}>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <p className="mb-1">{f.message}</p>
                          <small className="text-muted">
                            <i className="fas fa-calendar me-1"></i>
                            {new Date(f.date).toLocaleDateString(t('lang') === 'ar' ? 'ar-EG' : 'en-US')}
                          </small>
                        </div>
                        {f.isWarning && (
                          <span className="badge bg-warning">
                            <i className="fas fa-exclamation-triangle me-1"></i>
                            {t('warning')}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="fas fa-comment-slash text-muted fs-1 mb-3"></i>
                  <p className="text-muted">{t('noFeedback')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Admin Functions - Only visible to admins */}
          {isAdmin && (
            <>
              {/* Add Feedback */}
              <div className="card card-modern mb-4">
                <div className="card-header bg-warning text-white">
                  <h6 className="mb-0">
                    <i className="fas fa-plus-circle me-2"></i>
                    {t('addFeedback')}
                  </h6>
                </div>
                <div className="card-body">
                  <form onSubmit={handleFeedbackSubmit}>
                    <div className="mb-3">
                      <textarea
                        className="form-control"
                        rows="4"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder={t('addFeedbackPlaceholder')}
                        required
                      />
                    </div>
                    <div className="form-check mb-3">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="isWarning"
                        checked={isWarning}
                        onChange={(e) => setIsWarning(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="isWarning">
                        <i className="fas fa-exclamation-triangle text-warning me-2"></i>
                        {t('warning')}
                      </label>
                    </div>
                    <button type="submit" className="btn btn-custom w-100">
                      <i className="fas fa-paper-plane me-2"></i>
                      {t('submit')}
                    </button>
                  </form>
                </div>
              </div>

              {/* Grant Remote Permission */}
              <div className="card card-modern mb-4">
                <div className="card-header bg-success text-white">
                  <h6 className="mb-0">
                    <i className="fas fa-unlock me-2"></i>
                    {t('grantRemotePermission')}
                  </h6>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">
                      <i className="fas fa-calendar-alt me-2"></i>
                      {t('selectDate')}
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={remotePermissionDate}
                      onChange={(e) => setRemotePermissionDate(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      <i className="fas fa-building me-2"></i>
                      {t('selectBranch')}
                    </label>
                    <select
                      className="form-select"
                      value={remotePermissionBranch}
                      onChange={(e) => setRemotePermissionBranch(e.target.value)}
                    >
                      <option value="">{t('selectBranch')}</option>
                      {user.branches?.map(branch => (
                        <option key={branch._id} value={branch._id}>{branch.name}</option>
                      ))}
                    </select>
                  </div>
                  <button 
                    className="btn btn-custom w-100" 
                    onClick={handleGrantRemote}
                    disabled={!remotePermissionDate || !remotePermissionBranch}
                  >
                    <i className="fas fa-check me-2"></i>
                    {t('grant')}
                  </button>
                </div>
              </div>

              {/* Monthly Report - Only for admins */}
              <div className="card card-modern">
                <div className="card-header bg-dark text-white">
                  <h6 className="mb-0">
                    <i className="fas fa-chart-bar me-2"></i>
                    {t('monthlyReport')}
                  </h6>
                </div>
                <div className="card-body">
                  <div className="row mb-3">
                    <div className="col-6">
                      <label className="form-label">{t('year')}</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={year}
                        min="2020"
                        max="2030"
                        onChange={(e) => setYear(parseInt(e.target.value))}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label">{t('month')}</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={month}
                        min={1}
                        max={12}
                        onChange={(e) => setMonth(parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                  <button className="btn btn-custom w-100 mb-3" onClick={handleGenerateReport}>
                    <i className="fas fa-cog me-2"></i>
                    {t('generateReport')}
                  </button>

                  {monthlyReport && (
                    <div className="report-details">
                      <div className="alert alert-light">
                        <div className="row text-center">
                          <div className="col-4">
                            <div className="report-stat">
                              <i className="fas fa-briefcase text-primary fs-4"></i>
                              <div className="fw-bold text-primary">{monthlyReport.workingDays}</div>
                              <small className="text-muted">{t('workingDays')}</small>
                            </div>
                          </div>
                          <div className="col-4">
                            <div className="report-stat">
                              <i className="fas fa-calendar text-success fs-4"></i>
                              <div className="fw-bold text-success">{monthlyReport.holidays}</div>
                              <small className="text-muted">{t('holidays')}</small>
                            </div>
                          </div>
                          <div className="col-4">
                            <div className="report-stat">
                              <i className="fas fa-times-circle text-danger fs-4"></i>
                              <div className="fw-bold text-danger">{monthlyReport.absences}</div>
                              <small className="text-muted">{t('absences')}</small>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <h6 className="text-primary">
                          <i className="fas fa-clock me-2"></i>
                          {t('timeDetails')}
                        </h6>
                        <div className="row">
                          <div className="col-6">
                            <small className="text-muted d-block">{t('totalLateMinutes')}</small>
                            <span className="badge bg-warning">{monthlyReport.totalLateMinutes} {t('minutes')}</span>
                          </div>
                          <div className="col-6">
                            <small className="text-muted d-block">{t('totalEarlyLeaveMinutes')}</small>
                            <span className="badge bg-danger">{monthlyReport.totalEarlyLeaveMinutes} {t('minutes')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <h6 className="text-danger">
                          <i className="fas fa-minus-circle me-2"></i>
                          {t('deductions')}
                        </h6>
                        <div className="deduction-list">
                          <div className="d-flex justify-content-between py-1">
                            <span>{t('absence')}:</span>
                            <span className="text-danger fw-bold">{monthlyReport.deductions?.absence || 0} {t('currency')}</span>
                          </div>
                          <div className="d-flex justify-content-between py-1">
                            <span>{t('late')}:</span>
                            <span className="text-warning fw-bold">{monthlyReport.deductions?.late || 0} {t('currency')}</span>
                          </div>
                          <div className="d-flex justify-content-between py-1">
                            <span>{t('early')}:</span>
                            <span className="text-danger fw-bold">{monthlyReport.deductions?.early || 0} {t('currency')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="alert alert-success text-center">
                        <h5 className="mb-0">
                          <i className="fas fa-dollar-sign me-2"></i>
                          {t('netSalary')}: <span className="fw-bold">{monthlyReport.netSalary} {t('currency')}</span>
                        </h5>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
    </div>
  );
}

export default UserProfile;