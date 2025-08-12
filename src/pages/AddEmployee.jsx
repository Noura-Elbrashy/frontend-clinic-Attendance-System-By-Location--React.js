import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet, apiPost } from '../helpers/api';

function AddEmployee() {
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
  const lang = document.documentElement.getAttribute('lang') || 'en';

  const translations = {
    en: {
      addEmployee: 'Add Employee',
      name: 'Name',
      email: 'Email',
      role: 'Role',
      branches: 'Branches',
      phone: 'Phone',
      address: 'Address',
      salary: 'Salary',
      requiredWorkingDays: 'Required Working Days',
      workingDaysNames: 'Working Days Names (comma-separated)',
      workingHoursPerDay: 'Working Hours Per Day',
      workStartTime: 'Work Start Time',
      workEndTime: 'Work End Time',
      absenceDeductionRate: 'Absence Deduction Rate (%)',
      lateDeductionRate: 'Late Deduction Rate (%)',
      earlyLeaveDeductionRate: 'Early Leave Deduction Rate (%)',
      allowRemoteAbsence: 'Allow Remote Absence',
      submit: 'Add Employee',
      success: 'Employee added successfully. Activation email sent.',
      error: 'An error occurred',
    },
    ar: {
      addEmployee: 'إضافة موظف',
      name: 'الاسم',
      email: 'البريد الإلكتروني',
      role: 'الدور',
      branches: 'الفروع',
      phone: 'الهاتف',
      address: 'العنوان',
      salary: 'الراتب',
      requiredWorkingDays: 'أيام العمل المطلوبة',
      workingDaysNames: 'أسماء أيام العمل (مفصولة بفاصلة)',
      workingHoursPerDay: 'ساعات العمل في اليوم',
      workStartTime: 'وقت بداية العمل',
      workEndTime: 'وقت نهاية العمل',
      absenceDeductionRate: 'نسبة خصم الغياب (%)',
      lateDeductionRate: 'نسبة خصم التأخير (%)',
      earlyLeaveDeductionRate: 'نسبة خصم المغادرة المبكرة (%)',
      allowRemoteAbsence: 'السماح بتسجيل الغياب عن بعد',
      submit: 'إضافة الموظف',
      success: 'تم إضافة الموظف بنجاح. تم إرسال إيميل التفعيل.',
      error: 'حدث خطأ',
    },
  };

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await apiGet('/branches');
        setBranches(res.data);
      } catch (err) {
        setError(translations[lang].error);
      }
    };
    fetchBranches();
  }, [lang]);

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
      setSuccess(res.data.message || translations[lang].success);
      setTimeout(() => navigate('/admin/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || translations[lang].error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>{translations[lang].addEmployee}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">{translations[lang].name}</label>
          <input
            type="text"
            className="form-control"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">{translations[lang].email}</label>
          <input
            type="email"
            className="form-control"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">{translations[lang].role}</label>
          <select
            className="form-select"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
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
            value={formData.branches}
            onChange={(e) => setFormData({ ...formData, branches: Array.from(e.target.selectedOptions, option => option.value) })}
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
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">{translations[lang].address}</label>
          <input
            type="text"
            className="form-control"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">{translations[lang].salary}</label>
          <input
            type="number"
            className="form-control"
            value={formData.salary}
            onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">{translations[lang].requiredWorkingDays}</label>
          <input
            type="number"
            className="form-control"
            value={formData.requiredWorkingDays}
            onChange={(e) => setFormData({ ...formData, requiredWorkingDays: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">{translations[lang].workingDaysNames}</label>
          <input
            type="text"
            className="form-control"
            value={formData.workingDaysNames}
            onChange={(e) => setFormData({ ...formData, workingDaysNames: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">{translations[lang].workingHoursPerDay}</label>
          <input
            type="number"
            className="form-control"
            value={formData.workingHoursPerDay}
            onChange={(e) => setFormData({ ...formData, workingHoursPerDay: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">{translations[lang].workStartTime}</label>
          <input
            type="text"
            className="form-control"
            value={formData.workStartTime}
            onChange={(e) => setFormData({ ...formData, workStartTime: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">{translations[lang].workEndTime}</label>
          <input
            type="text"
            className="form-control"
            value={formData.workEndTime}
            onChange={(e) => setFormData({ ...formData, workEndTime: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">{translations[lang].absenceDeductionRate}</label>
          <input
            type="number"
            className="form-control"
            value={formData.absenceDeductionRate}
            onChange={(e) => setFormData({ ...formData, absenceDeductionRate: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">{translations[lang].lateDeductionRate}</label>
          <input
            type="number"
            className="form-control"
            value={formData.lateDeductionRate}
            onChange={(e) => setFormData({ ...formData, lateDeductionRate: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">{translations[lang].earlyLeaveDeductionRate}</label>
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
          <label className="form-check-label">{translations[lang].allowRemoteAbsence}</label>
        </div>
        <button type="submit" className="btn btn-primary">
          {translations[lang].submit}
        </button>
      </form>
    </div>
  );
}

export default AddEmployee;