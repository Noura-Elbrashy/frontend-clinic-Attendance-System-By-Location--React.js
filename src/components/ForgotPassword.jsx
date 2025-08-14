import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiPost } from '../helpers/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../style/Login.css';

function ForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (window.bootstrap && window.bootstrap.Toast && (error || message)) {
      const toastElList = [].slice.call(document.querySelectorAll('.toast'));
      toastElList.forEach((toastEl) => {
        new window.bootstrap.Toast(toastEl, { autohide: true, delay: 5000 }).show();
      });
    }
  }, [error, message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('يرجى إدخال عنوان البريد الإلكتروني');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setMessage('');
      
      const response = await apiPost('/auth/forgot-password', { email });
      
      setMessage('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني');
      setEmail(''); // مسح الحقل بعد النجاح
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(err.response?.data?.message || 'حدث خطأ أثناء إرسال الطلب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container bg-gradient-login">
      <div className="glass-card p-4 login-card animate-fade-in">
        <div className="text-center mb-4">
          <img
            src="/assets/logo.png"
            alt="RAN Clinic"
            className="login-logo"
            onError={(e) => (e.target.style.display = 'none')}
          />
          <div className="logo-fallback" style={{ display: 'none' }}>
            RAN Clinic
          </div>
          <h2 className="card-title">نسيت كلمة المرور؟</h2>
          <p className="text-muted">
            أدخل عنوان بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور
          </p>
        </div>

        {/* Toast للأخطاء */}
        {error && (
          <div className="toast-container position-fixed top-0 end-0 p-3">
            <div className="toast show toast-error" role="alert" aria-live="assertive" aria-atomic="true">
              <div className="toast-header toast-error text-white">
                <i className="fas fa-exclamation-triangle me-2"></i>
                <strong className="me-auto">خطأ</strong>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setError('')}
                ></button>
              </div>
              <div className="toast-body">{error}</div>
            </div>
          </div>
        )}

        {/* Toast للنجاح */}
        {message && (
          <div className="toast-container position-fixed top-0 end-0 p-3">
            <div className="toast show toast-success" role="alert" aria-live="assertive" aria-atomic="true">
              <div className="toast-header toast-success text-white">
                <i className="fas fa-check-circle me-2"></i>
                <strong className="me-auto">نجح</strong>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setMessage('')}
                ></button>
              </div>
              <div className="toast-body">{message}</div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">
              <i className="fas fa-envelope me-2"></i>
              البريد الإلكتروني
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-envelope"></i>
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control glow-input"
                placeholder="أدخل بريدك الإلكتروني"
                required
                disabled={loading}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-100 animate-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                جاري الإرسال...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane me-2"></i>
                إرسال رابط إعادة التعيين
              </>
            )}
          </button>

          <div className="text-center mt-3">
            <Link to="/login" className="btn btn-link">
              <i className="fas fa-arrow-left me-1"></i>
              العودة إلى تسجيل الدخول
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;