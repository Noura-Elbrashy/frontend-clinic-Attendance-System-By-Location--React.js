import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiPost } from '../helpers/api';

function LeaveRequestForm({ userId }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    type: 'annual',
    startDate: '',
    endDate: '',
    notes: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await apiPost('/users/request-leave', { ...formData, userId });
      setSuccess(t('leaveRequestSubmitted'));
      setFormData({ type: 'annual', startDate: '', endDate: '', notes: '' });
    } catch (err) {
      setError(err.response?.data?.message || t('error'));
    }
  };

  return (
    <div className="card mb-3">
      <div className="card-header">{t('requestLeave')}</div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">{t('leaveType')}</label>
            <select
              className="form-select"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="annual">{t('annual')}</option>
              <option value="sick">{t('sick')}</option>
              <option value="emergency">{t('emergency')}</option>
              <option value="unpaid">{t('unpaid')}</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">{t('startDate')}</label>
            <input
              type="date"
              className="form-control"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">{t('endDate')}</label>
            <input
              type="date"
              className="form-control"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">{t('notes')}</label>
            <textarea
              className="form-control"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            <i className="fas fa-paper-plane me-2"></i>{t('submit')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LeaveRequestForm;