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
    workingDaysNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    workStartTime: '09:00',
    workEndTime: '17:00',
    absenceDeductionRate: 0,
    lateDeductionRate: 0,
    earlyLeaveDeductionRate: 0,
    allowRemoteAbsence: false,
    isNightShift: false,
    // حقول محسوبة تلقائياً - للعرض فقط
    calculatedWorkingHours: 8,
    expectedMonthlyWorkingDays: 22
  });
  
  const [branches, setBranches] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const daysOfWeek = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];

  // حساب ساعات العمل تلقائياً
  const calculateWorkingHours = (startTime, endTime, isNightShift = false) => {
    if (!startTime || !endTime) return 0;
    
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    let startMinutes = startHour * 60 + startMin;
    let endMinutes = endHour * 60 + endMin;
    
    if (isNightShift && endHour < startHour) {
      endMinutes += 24 * 60; // إضافة 24 ساعة للورديات الليلية
    }
    
    return Math.max(0, (endMinutes - startMinutes) / 60);
  };

  // حساب أيام العمل المتوقعة شهرياً
  const calculateMonthlyWorkingDays = (workingDaysNames) => {
    if (!workingDaysNames.length) return 0;
    
    // حساب متوسط الأيام العاملة في الشهر (4.33 أسبوع تقريباً)
    const weeksPerMonth = 4.33;
    return Math.round(workingDaysNames.length * weeksPerMonth);
  };

  // تحديث الحسابات عند تغيير الأوقات أو الأيام
  useEffect(() => {
    const calculatedHours = calculateWorkingHours(
      formData.workStartTime, 
      formData.workEndTime, 
      formData.isNightShift
    );
    
    const expectedDays = calculateMonthlyWorkingDays(formData.workingDaysNames);
    
    setFormData(prev => ({
      ...prev,
      calculatedWorkingHours: calculatedHours,
      expectedMonthlyWorkingDays: expectedDays
    }));
  }, [formData.workStartTime, formData.workEndTime, formData.isNightShift, formData.workingDaysNames]);

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
  }, [t]);

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':').map(Number);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = t('nameRequired');
    if (!formData.email) errors.email = t('emailRequired');
    if (!formData.branches.length) errors.branches = t('branchesRequired');
    if (!formData.salary || formData.salary <= 0) errors.salary = t('salaryRequired');
    if (!formData.workingDaysNames.length) errors.workingDaysNames = t('workingDaysRequired');
    
    if (!formData.workStartTime || !formData.workEndTime) {
      errors.time = t('timeRequired');
    } else {
      const calculatedHours = calculateWorkingHours(
        formData.workStartTime, 
        formData.workEndTime, 
        formData.isNightShift
      );
      
      if (calculatedHours <= 0) {
        errors.time = formData.isNightShift 
          ? t('invalidNightShiftTime')
          : t('endTimeAfterStart');
      }
    }
    
    // التحقق من معقولية معدلات الخصم (0-100%)
    if (formData.absenceDeductionRate < 0 || formData.absenceDeductionRate > 100) {
      errors.absenceDeductionRate = t('invalidDeductionRate');
    }
    if (formData.lateDeductionRate < 0 || formData.lateDeductionRate > 100) {
      errors.lateDeductionRate = t('invalidDeductionRate');
    }
    if (formData.earlyLeaveDeductionRate < 0 || formData.earlyLeaveDeductionRate > 100) {
      errors.earlyLeaveDeductionRate = t('invalidDeductionRate');
    }
    
    return errors;
  };

  const handleDayChange = (day) => {
    setFormData((prev) => {
      const workingDays = prev.workingDaysNames.includes(day)
        ? prev.workingDaysNames.filter((d) => d !== day)
        : [...prev.workingDaysNames, day];
      return { ...prev, workingDaysNames: workingDays };
    });
    setFormErrors((prev) => ({ ...prev, workingDaysNames: '' }));
  };

  const handleBranchChange = (branchId) => {
    setFormData((prev) => {
      const branches = prev.branches.includes(branchId)
        ? prev.branches.filter((id) => id !== branchId)
        : [...prev.branches, branchId];
      return { ...prev, branches };
    });
    setFormErrors((prev) => ({ ...prev, branches: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setFormErrors({});

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        workingDaysNames: formData.workingDaysNames.join(','),
        // إرسال معدلات الخصم كنسب عشرية (0-1)
        absenceDeductionRate: formData.absenceDeductionRate / 100,
        lateDeductionRate: formData.lateDeductionRate / 100,
        earlyLeaveDeductionRate: formData.earlyLeaveDeductionRate / 100,
        workStartTime: formatTime(formData.workStartTime),
        workEndTime: formatTime(formData.workEndTime),
        // حفظ الساعات المحسوبة
        workingHoursPerDay: formData.calculatedWorkingHours,
        requiredWorkingDays: formData.expectedMonthlyWorkingDays
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
      
      {/* Toast messages */}
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
        {/* البيانات الأساسية */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">{t('name')} *</label>
            <input
              type="text"
              className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
          </div>
          
          <div className="col-md-6 mb-3">
            <label className="form-label">{t('email')} *</label>
            <input
              type="email"
              className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
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
          
          <div className="col-md-6 mb-3">
            <label className="form-label">{t('salary')} * (شهري)</label>
            <input
              type="number"
              className={`form-control ${formErrors.salary ? 'is-invalid' : ''}`}
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              min="0"
              step="0.01"
            />
            {formErrors.salary && <div className="invalid-feedback">{formErrors.salary}</div>}
          </div>
        </div>

        {/* الفروع */}
        <div className="mb-3">
          <label className="form-label">{t('branches')} *</label>
          <div className="checkbox-group border p-3 rounded">
            {branches.map((branch) => (
              <div key={branch._id} className="form-check form-check-inline">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`branch-${branch._id}`}
                  checked={formData.branches.includes(branch._id)}
                  onChange={() => handleBranchChange(branch._id)}
                />
                <label className="form-check-label" htmlFor={`branch-${branch._id}`}>
                  {branch.name}
                </label>
              </div>
            ))}
          </div>
          {formErrors.branches && <div className="text-danger mt-1">{formErrors.branches}</div>}
        </div>

        {/* أيام العمل */}
        <div className="mb-3">
          <label className="form-label">{t('workingDaysNames')} *</label>
          <div className="checkbox-group border p-3 rounded">
            {daysOfWeek.map((day) => (
              <div key={day} className="form-check form-check-inline">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`day-${day}`}
                  checked={formData.workingDaysNames.includes(day)}
                  onChange={() => handleDayChange(day)}
                />
                <label className="form-check-label" htmlFor={`day-${day}`}>
                  {t(day.toLowerCase())}
                </label>
              </div>
            ))}
          </div>
          {formErrors.workingDaysNames && <div className="text-danger mt-1">{formErrors.workingDaysNames}</div>}
          <small className="text-muted">
            الأيام المتوقعة شهرياً: {formData.expectedMonthlyWorkingDays} يوم
          </small>
        </div>

        {/* أوقات العمل */}
        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">{t('workStartTime')} *</label>
            <input
              type="time"
              className={`form-control ${formErrors.time ? 'is-invalid' : ''}`}
              value={formData.workStartTime}
              onChange={(e) => setFormData({ ...formData, workStartTime: e.target.value })}
              required
            />
            {formErrors.time && <div className="invalid-feedback">{formErrors.time}</div>}
          </div>
          
          <div className="col-md-4 mb-3">
            <label className="form-label">{t('workEndTime')} *</label>
            <input
              type="time"
              className={`form-control ${formErrors.time ? 'is-invalid' : ''}`}
              value={formData.workEndTime}
              onChange={(e) => setFormData({ ...formData, workEndTime: e.target.value })}
              required
            />
            {formErrors.time && <div className="invalid-feedback">{formErrors.time}</div>}
          </div>
          
          <div className="col-md-4 mb-3">
            <label className="form-label">ساعات العمل اليومية</label>
            <input
              type="number"
              className="form-control"
              value={formData.calculatedWorkingHours}
              disabled
              style={{ backgroundColor: '#f8f9fa' }}
            />
            <small className="text-muted">محسوبة تلقائياً</small>
          </div>
        </div>

        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="isNightShift"
            checked={formData.isNightShift}
            onChange={(e) => setFormData({ ...formData, isNightShift: e.target.checked })}
          />
          <label className="form-check-label" htmlFor="isNightShift">
            {t('isNightShift')} (العمل عبر منتصف الليل)
          </label>
        </div>

        {/* معدلات الخصم */}
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
                  className={`form-control ${formErrors.absenceDeductionRate ? 'is-invalid' : ''}`}
                  value={formData.absenceDeductionRate}
                  onChange={(e) => setFormData({ ...formData, absenceDeductionRate: e.target.value })}
                  min="0"
                  max="100"
                  step="0.1"
                />
                {formErrors.absenceDeductionRate && <div className="invalid-feedback">{formErrors.absenceDeductionRate}</div>}
                <small className="text-muted">نسبة الخصم من الراتب اليومي عن كل يوم غياب</small>
              </div>
              
              <div className="col-md-4 mb-3">
                <label className="form-label">{t('lateDeductionRate')} (%)</label>
                <input
                  type="number"
                  className={`form-control ${formErrors.lateDeductionRate ? 'is-invalid' : ''}`}
                  value={formData.lateDeductionRate}
                  onChange={(e) => setFormData({ ...formData, lateDeductionRate: e.target.value })}
                  min="0"
                  max="100"
                  step="0.1"
                />
                {formErrors.lateDeductionRate && <div className="invalid-feedback">{formErrors.lateDeductionRate}</div>}
                <small className="text-muted">نسبة الخصم من الراتب الساعي عن كل ساعة تأخير</small>
              </div>
              
              <div className="col-md-4 mb-3">
                <label className="form-label">{t('earlyLeaveDeductionRate')} (%)</label>
                <input
                  type="number"
                  className={`form-control ${formErrors.earlyLeaveDeductionRate ? 'is-invalid' : ''}`}
                  value={formData.earlyLeaveDeductionRate}
                  onChange={(e) => setFormData({ ...formData, earlyLeaveDeductionRate: e.target.value })}
                  min="0"
                  max="100"
                  step="0.1"
                />
                {formErrors.earlyLeaveDeductionRate && <div className="invalid-feedback">{formErrors.earlyLeaveDeductionRate}</div>}
                <small className="text-muted">نسبة الخصم من الراتب الساعي عن كل ساعة انصراف مبكر</small>
              </div>
            </div>
          </div>
        </div>

        {/* باقي الحقول */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">{t('phone')}</label>
            <input
              type="text"
              className="form-control"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          
          <div className="col-md-6 mb-3">
            <label className="form-label">{t('address')}</label>
            <input
              type="text"
              className="form-control"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
        </div>

        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="allowRemoteAbsence"
            checked={formData.allowRemoteAbsence}
            onChange={(e) => setFormData({ ...formData, allowRemoteAbsence: e.target.checked })}
          />
          <label className="form-check-label" htmlFor="allowRemoteAbsence">
            {t('allowRemoteAbsence')}
          </label>
        </div>

        {/* معلومات الراتب المحسوبة */}
        <div className="card mb-3">
          <div className="card-header">
            <h5 className="mb-0">ملخص الراتب</h5>
          </div>
          <div className="card-body">
            {formData.salary > 0 && formData.expectedMonthlyWorkingDays > 0 && (
              <div className="row">
                <div className="col-md-4">
                  <strong>الراتب الشهري:</strong> {formData.salary} جنيه
                </div>
                <div className="col-md-4">
                  <strong>الراتب اليومي:</strong> {(formData.salary / formData.expectedMonthlyWorkingDays).toFixed(2)} جنيه
                </div>
                <div className="col-md-4">
                  <strong>الراتب الساعي:</strong> {formData.calculatedWorkingHours > 0 ? 
                    (formData.salary / (formData.expectedMonthlyWorkingDays * formData.calculatedWorkingHours)).toFixed(2) : '0'} جنيه
                </div>
              </div>
            )}
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-lg">
          <i className="fas fa-user-plus me-2"></i>{t('submit')}
        </button>
        <button type="button" className="btn btn-secondary btn-lg ms-2" onClick={() => navigate('/admin/dashboard')}>
          <i className="fas fa-arrow-left me-2"></i>{t('cancel')}
        </button>
      </form>
    </div>
  );
}

export default AddEmployee;