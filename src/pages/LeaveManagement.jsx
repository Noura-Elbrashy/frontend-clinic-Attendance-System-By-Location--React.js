import React, { useState, useEffect } from 'react';
import { apiGet, apiPost } from '../helpers/api';
import LeaveRequestForm from './LeaveRequestForm';


function LeaveManagement() {
  const [activeTab, setActiveTab] = useState('myLeaves');
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    leaveType: '',
    year: new Date().getFullYear()
  });

  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserData();
    fetchLeaveBalance();
    if (activeTab === 'myLeaves') {
      fetchMyLeaves();
    } else if (activeTab === 'pending' && user?.role === 'admin') {
      fetchPendingRequests();
    }
  }, [activeTab, filters]);

  const fetchUserData = async () => {
    try {
      const response = await apiGet('/users/me');
      setUser(response.data.user);
    } catch (error) {
      console.error('خطأ في جلب بيانات المستخدم:', error);
    }
  };

  const fetchLeaveBalance = async () => {
    try {
      const response = await apiGet('/leave/balance');
      setLeaveBalance(response.data);
    } catch (error) {
      console.error('خطأ في جلب رصيد الإجازات:', error);
    }
  };

  const fetchMyLeaves = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.leaveType) params.append('leaveType', filters.leaveType);
      if (filters.year) params.append('year', filters.year);

const response = await apiGet(`/leave/my?${params}`);
      setLeaveRequests(response.data.requests);
    } catch (error) {
      console.error('خطأ في جلب طلبات الإجازة:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const response = await apiGet('/leave/all?status=pending');
      setPendingRequests(response.data.requests);
    } catch (error) {
      console.error('خطأ في جلب الطلبات المعلقة:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSubmit = async (requestData) => {
    try {
await apiPost('/leave', requestData);
      setShowRequestForm(false);
      fetchMyLeaves();
      fetchLeaveBalance();
      // إظهار رسالة نجاح
    } catch (error) {
      console.error('خطأ في تقديم الطلب:', error);
    }
  };

  const handleRequestAction = async (requestId, action, reason = '') => {
    try {
      await apiPost(`/leave/${requestId}/status`, {
  status: action === 'approve' ? 'approved' : 'rejected',
  rejectionReason: reason
});

      
      fetchPendingRequests();
      // إظهار رسالة نجاح
    } catch (error) {
      console.error('خطأ في معالجة الطلب:', error);
    }
  };

  const cancelLeaveRequest = async (requestId) => {
    try {
await apiPost(`/leave/${requestId}/status`, { status: 'cancelled' });
      fetchMyLeaves();
      fetchLeaveBalance();
    } catch (error) {
      console.error('خطأ في إلغاء الطلب:', error);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { class: 'warning', text: 'قيد المراجعة' },
      approved: { class: 'success', text: 'موافق عليه' },
      rejected: { class: 'danger', text: 'مرفوض' },
      cancelled: { class: 'secondary', text: 'ملغي' }
    };
    
    const statusInfo = statusMap[status] || { class: 'secondary', text: status };
    return (
      <span className={`badge bg-${statusInfo.class}`}>
        {statusInfo.text}
      </span>
    );
  };

  const getLeaveTypeText = (type) => {
    const types = {
      annual: 'إجازة سنوية',
      sick: 'إجازة مرضية',
      emergency: 'إجازة طارئة',
      unpaid: 'إجازة غير مدفوعة',
      maternity: 'إجازة أمومة',
      paternity: 'إجازة أبوة'
    };
    return types[type] || type;
  };

  return (
    <div className="leave-management">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2><i className="fas fa-calendar-alt me-2"></i>إدارة الإجازات</h2>
              <button 
                className="btn btn-primary"
                onClick={() => setShowRequestForm(true)}
              >
                <i className="fas fa-plus me-2"></i>طلب إجازة جديدة
              </button>
            </div>

            {/* رصيد الإجازات */}
            {leaveBalance && (
              <div className="row mb-4">
                <div className="col-12">
                  <div className="card">
                    <div className="card-header bg-info text-white">
                      <h5 className="mb-0">رصيد الإجازات لعام {leaveBalance.currentYear}</h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        {Object.entries(leaveBalance.available).map(([type, days]) => (
                          leaveBalance.leaveSettings?.allowedLeaveTypes[type] && (
                            <div key={type} className="col-md-3 col-sm-6 mb-3">
                              <div className="balance-card text-center p-3 border rounded">
                                <h6 className="text-muted">{getLeaveTypeText(type)}</h6>
                                <div className="balance-display">
                                  <span className={`fs-3 fw-bold ${days > 0 ? 'text-success' : 'text-danger'}`}>
                                    {days}
                                  </span>
                                  <small className="text-muted d-block">
                                    من أصل {leaveBalance.maxAllowed[type]} يوم
                                  </small>
                                </div>
                                {leaveBalance.pending[type] > 0 && (
                                  <small className="text-warning">
                                    ({leaveBalance.pending[type]} قيد المراجعة)
                                  </small>
                                )}
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* التبويبات */}
            <div className="card">
              <div className="card-header">
                <ul className="nav nav-tabs card-header-tabs">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'myLeaves' ? 'active' : ''}`}
                      onClick={() => setActiveTab('myLeaves')}
                    >
                      <i className="fas fa-user me-2"></i>إجازاتي
                    </button>
                  </li>
                  {user?.role === 'admin' && (
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeTab === 'pending' ? 'active' : ''}`}
                        onClick={() => setActiveTab('pending')}
                      >
                        <i className="fas fa-clock me-2"></i>
                        الطلبات المعلقة
                        {pendingRequests.length > 0 && (
                          <span className="badge bg-warning ms-2">{pendingRequests.length}</span>
                        )}
                      </button>
                    </li>
                  )}
                </ul>
              </div>

              <div className="card-body">
                {/* الفلاتر */}
                <div className="row mb-3">
                  <div className="col-md-3">
                    <select
                      className="form-select"
                      value={filters.status}
                      onChange={(e) => setFilters({...filters, status: e.target.value})}
                    >
                      <option value="">جميع الحالات</option>
                      <option value="pending">قيد المراجعة</option>
                      <option value="approved">موافق عليه</option>
                      <option value="rejected">مرفوض</option>
                      <option value="cancelled">ملغي</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <select
                      className="form-select"
                      value={filters.leaveType}
                      onChange={(e) => setFilters({...filters, leaveType: e.target.value})}
                    >
                      <option value="">جميع الأنواع</option>
                      <option value="annual">إجازة سنوية</option>
                      <option value="sick">إجازة مرضية</option>
                      <option value="emergency">إجازة طارئة</option>
                      <option value="unpaid">إجازة غير مدفوعة</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <select
                      className="form-select"
                      value={filters.year}
                      onChange={(e) => setFilters({...filters, year: e.target.value})}
                    >
                      {[2023, 2024, 2025, 2026].map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* عرض الطلبات */}
                {loading ? (
                  <div className="text-center p-4">
                    <div className="spinner-border" role="status"></div>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>نوع الإجازة</th>
                          <th>من</th>
                          <th>إلى</th>
                          <th>عدد الأيام</th>
                          <th>السبب</th>
                          <th>الحالة</th>
                          <th>تاريخ التقديم</th>
                          <th>الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(activeTab === 'myLeaves' ? leaveRequests : pendingRequests).map((request) => (
                          <tr key={request._id}>
                            <td>{getLeaveTypeText(request.leaveType)}</td>
                            <td>{new Date(request.startDate).toLocaleDateString('ar-EG')}</td>
                            <td>{new Date(request.endDate).toLocaleDateString('ar-EG')}</td>
                            <td>{request.totalDays}</td>
                            <td title={request.reason}>
                              {request.reason.length > 30 
                                ? request.reason.substring(0, 30) + '...'
                                : request.reason
                              }
                            </td>
                            <td>{getStatusBadge(request.status)}</td>
                            <td>{new Date(request.createdAt).toLocaleDateString('ar-EG')}</td>
                            <td>
                              {activeTab === 'myLeaves' ? (
                                // إجراءات الموظف
                                <div className="btn-group btn-group-sm">
                                  {request.status === 'pending' && (
                                    <button
                                      className="btn btn-outline-danger"
                                      onClick={() => cancelLeaveRequest(request._id)}
                                      title="إلغاء الطلب"
                                    >
                                      <i className="fas fa-times"></i>
                                    </button>
                                  )}
                                  <button
                                    className="btn btn-outline-info"
                                    title="عرض التفاصيل"
                                  >
                                    <i className="fas fa-eye"></i>
                                  </button>
                                </div>
                              ) : (
                                // إجراءات المدير
                                request.status === 'pending' && (
                                  <div className="btn-group btn-group-sm">
                                    <button
                                      className="btn btn-outline-success"
                                      onClick={() => handleRequestAction(request._id, 'approve')}
                                      title="موافقة"
                                    >
                                      <i className="fas fa-check"></i>
                                    </button>
                                    <button
                                      className="btn btn-outline-danger"
                                      onClick={() => {
                                        const reason = prompt('سبب الرفض:');
                                        if (reason) {
                                          handleRequestAction(request._id, 'reject', reason);
                                        }
                                      }}
                                      title="رفض"
                                    >
                                      <i className="fas fa-times"></i>
                                    </button>
                                  </div>
                                )
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {(activeTab === 'myLeaves' ? leaveRequests : pendingRequests).length === 0 && (
                      <div className="text-center p-4 text-muted">
                        <i className="fas fa-calendar-times fa-3x mb-3"></i>
                        <p>لا توجد طلبات إجازة</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* نموذج طلب الإجازة */}
      {showRequestForm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <LeaveRequestForm
                onSuccess={(data) => {
                  setShowRequestForm(false);
                  fetchMyLeaves();
                  fetchLeaveBalance();
                }}
                onCancel={() => setShowRequestForm(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LeaveManagement;