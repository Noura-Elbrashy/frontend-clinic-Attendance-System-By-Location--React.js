import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiPost } from '../helpers/api';

function ActivateAccount() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(null);
  const { token } = useParams();
  const navigate = useNavigate();
  const lang = document.documentElement.getAttribute('lang') || 'en';

  const translations = {
    en: {
      title: 'Activate Your Account',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      activate: 'Activate Account',
      passwordMismatch: 'Passwords do not match',
      successMessage: 'Account activated successfully. Redirecting to login...',
      invalidToken: 'Invalid or expired activation link',
      loading: 'Processing...',
      backToLogin: 'Back to Login',
      tokenExpired: 'This activation link has expired. Please contact admin for a new one.',
    },
    ar: {
      title: 'تفعيل حسابك',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      activate: 'تفعيل الحساب',
      passwordMismatch: 'كلمات المرور غير متطابقة',
      successMessage: 'تم تفعيل الحساب بنجاح. جاري التوجه إلى صفحة تسجيل الدخول...',
      invalidToken: 'رابط التفعيل غير صالح أو منتهي الصلاحية',
      loading: 'جاري المعالجة...',
      backToLogin: 'العودة لصفحة الدخول',
      tokenExpired: 'انتهت صلاحية رابط التفعيل. يرجى التواصل مع الإدارة للحصول على رابط جديد.',
    },
  };

  useEffect(() => {
    const validateToken = async () => {
      try {
        await apiPost('/users/validate-token', { token });
        setTokenValid(true);
      } catch (err) {
        setTokenValid(false);
        setError(err.response?.data?.message || translations[lang].invalidToken);
      }
    };
    if (token) {
      validateToken();
    } else {
      setTokenValid(false);
      setError(translations[lang].invalidToken);
    }
  }, [token, lang]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError(translations[lang].passwordMismatch);
    }

    if (password.length < 6) {
      return setError(lang === 'en' ? 'Password must be at least 6 characters' : 'كلمة المرور يجب أن تكون على الأقل 6 أحرف');
    }

    setLoading(true);
    setError('');

    try {
      await apiPost('/users/activate', { token, password });
      setSuccess(translations[lang].successMessage);
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to activate account';
      if (errorMessage.includes('expired')) {
        setError(translations[lang].tokenExpired);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  if (tokenValid === null) {
    return <div>{translations[lang].loading}</div>;
  }

  if (!tokenValid) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          {translations[lang].backToLogin}
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">
            <i className="fas fa-user-check me-2"></i>
            {translations[lang].title}
          </h2>
          
          {error && (
            <div className="alert alert-danger" role="alert">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}
          
          {success && (
            <div className="alert alert-success" role="alert">
              <i className="fas fa-check-circle me-2"></i>
              {success}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">
                <i className="fas fa-lock me-2"></i>
                {translations[lang].password}
              </label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={loading || success}
                placeholder={lang === 'en' ? 'Enter new password' : "أدخل كلمة المرور الجديدة"}
              />
              <small className="form-text text-muted">
                {lang === 'en' ? 'Password must be at least 6 characters' : 'كلمة المرور يجب أن تكون على الأقل 6 أحرف'}
              </small>
            </div>
            
            <div className="mb-4">
              <label className="form-label">
                <i className="fas fa-lock me-2"></i>
                {translations[lang].confirmPassword}
              </label>
              <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                disabled={loading || success}
                placeholder={lang === 'en' ? 'Confirm new password' : "أعد إدخال كلمة المرور"}
              />
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary w-100"
              disabled={loading || success}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {translations[lang].loading}
                </>
              ) : (
                translations[lang].activate
              )}
            </button>
          </form>
          
          <div className="text-center mt-3">
            <button 
              className="btn btn-link"
              onClick={() => navigate('/')}
              disabled={loading}
            >
              {translations[lang].backToLogin}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivateAccount;