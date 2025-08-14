import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiPost, apiGet } from '../helpers/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../style/Login.css';

function ResetPassword() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const { token } = useParams();
  const navigate = useNavigate();

  // التحقق من صحة الرمز عند تحميل المكون
  useEffect(() => {
    const verifyToken = async () => {
      try {
        setLoading(true);
        const response = await apiGet(`/auth/verify-reset-token/${token}`);
        if (response.data && response.data.user) {
          setTokenValid(true);
          setUserInfo(response.data.user);
        }
      } catch (err) {
        console.error('Token verification failed:', err);
        setTokenValid(false);
        setError(err.response?.data?.message || t('invalidOrExpiredToken'));
        
        // إعادة توجيه إلى صفحة forgot password بعد 3 ثواني
        setTimeout(() => {
          navigate('/forgot-password');
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verifyToken();
    } else {
      setLoading(false);
      setTokenValid(false);
      setError(t('invalidToken'));
    }
  }, [token, navigate, t]);

  useEffect(() => {
    if (window.bootstrap && window.bootstrap.Toast && (error || success)) {
      const toastElList = [].slice.call(document.querySelectorAll('.toast'));
      toastElList.forEach((toastEl) => {
        new window.bootstrap.Toast(toastEl, { autohide: true, delay: 5000 }).show();
      });
    }
  }, [error, success]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // التحقق من تطابق كلمات المرور
    if (formData.password !== formData.confirmPassword) {
      setError(t('passwordsDoNotMatch'));
      return;
    }

    // التحقق من قوة كلمة المرور
    if (formData.password.length < 6) {
      setError(t('passwordTooShort'));
      return;
    }

    try {
      setLoading(true);
      const res = await apiPost('/auth/reset-password', { 
        token, 
        password: formData.password 
      });
      
      setSuccess(res.data.message || t('resetSuccess'));
      setError('');
      
      // إعادة توجيه إلى صفحة تسجيل الدخول بعد 3 ثواني
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err.response?.data?.message || t('resetFailed'));
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  // عرض شاشة التحميل
  if (loading) {
    return (
      <div className="login-container bg-gradient-login">
        <div className="glass-card p-4 login-card animate-fade-in text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">{t('verifyingToken')}</p>
        </div>
      </div>
    );
  }

  // عرض رسالة خطأ إذا كان الرمز غير صالح
  if (!tokenValid) {
    return (
      <div className="login-container bg-gradient-login">
        <div className="glass-card p-4 login-card animate-fade-in">
          <div className="text-center mb-4">
            <i className="fas fa-exclamation-triangle text-danger" style={{ fontSize: '4rem' }}></i>
            <h2 className="card-title text-danger mt-3">{t('invalidToken')}</h2>
            <p className="text-muted">{error}</p>
            <p className="text-muted">{t('redirectingToForgotPassword')}</p>
            <div className="mt-4">
              <button 
                onClick={() => navigate('/forgot-password')} 
                className="btn btn-primary"
              >
                <i className="fas fa-arrow-left me-2"></i>
                {t('backToForgotPassword')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <h2 className="card-title">{t('resetPassword')}</h2>
          {userInfo && (
            <p className="text-muted">
              {t('resettingPasswordFor')} <strong>{userInfo.name}</strong> ({userInfo.email})
            </p>
          )}
        </div>

        {/* Toast للأخطاء */}
        {error && (
          <div className="toast-container position-fixed top-0 end-0 p-3">
            <div className="toast show toast-error" role="alert" aria-live="assertive" aria-atomic="true">
              <div className="toast-header toast-error text-white">
                <i className="fas fa-exclamation-triangle me-2"></i>
                <strong className="me-auto">{t('error')}</strong>
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
        {success && (
          <div className="toast-container position-fixed top-0 end-0 p-3">
            <div className="toast show toast-success" role="alert" aria-live="assertive" aria-atomic="true">
              <div className="toast-header toast-success text-white">
                <i className="fas fa-check-circle me-2"></i>
                <strong className="me-auto">{t('success')}</strong>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSuccess('')}
                ></button>
              </div>
              <div className="toast-body">
                {success}
                <div className="mt-2">
                  <small>{t('redirectingToLogin')}</small>
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">
              <i className="fas fa-lock me-2"></i>
              {t('newPassword')}
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-lock"></i>
              </span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-control glow-input"
                placeholder={t('enterNewPassword')}
                minLength="6"
                required
                disabled={loading}
              />
            </div>
            <small className="form-text text-muted">
              {t('passwordMinLength')}
            </small>
          </div>

          <div className="mb-3">
            <label className="form-label">
              <i className="fas fa-lock me-2"></i>
              {t('confirmPassword')}
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-lock"></i>
              </span>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="form-control glow-input"
                placeholder={t('confirmNewPassword')}
                minLength="6"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* مؤشر تطابق كلمات المرور */}
          {formData.password && formData.confirmPassword && (
            <div className="mb-3">
              {formData.password === formData.confirmPassword ? (
                <small className="text-success">
                  <i className="fas fa-check me-1"></i>
                  {t('passwordsMatch')}
                </small>
              ) : (
                <small className="text-danger">
                  <i className="fas fa-times me-1"></i>
                  {t('passwordsDoNotMatch')}
                </small>
              )}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-success w-100 animate-button"
            disabled={loading || formData.password !== formData.confirmPassword}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {t('processing')}
              </>
            ) : (
              <>
                <i className="fas fa-check me-2"></i>
                {t('resetPassword')}
              </>
            )}
          </button>

          <div className="text-center mt-3">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="btn btn-link"
              disabled={loading}
            >
              <i className="fas fa-arrow-left me-1"></i>
              {t('backToLogin')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;