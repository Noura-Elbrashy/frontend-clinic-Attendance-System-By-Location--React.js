
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { apiPost } from '../helpers/api';

// function Login() {
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');
//   const navigate = useNavigate();
//   const lang = document.documentElement.getAttribute('lang') || 'ar';

//   const translations = {
//     en: {
//       login: 'Login',
//       email: 'Email',
//       password: 'Password',
//       loginFailed: 'Login failed. Please try again.',
//     },
//     ar: {
//       login: 'تسجيل الدخول',
//       email: 'البريد الإلكتروني',
//       password: 'كلمة المرور',
//       loginFailed: 'فشل تسجيل الدخول. حاول مرة أخرى.',
//     },
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await apiPost('/auth/login', formData);
//       localStorage.setItem('token', res.data.token);
//       navigate('/profile/me');
//     } catch (err) {
//       setError(err.response?.data?.message || translations[lang].loginFailed);
//     }
//   };

//   return (
//     <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
//       <div className="card shadow p-4" style={{ maxWidth: '400px', width: '100%' }}>
//         <h2 className="card-title text-center mb-4">RAN Clinic</h2>
//         {error && <div className="alert alert-danger">{error}</div>}
//         <form onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <label className="form-label">{translations[lang].email}</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleInputChange}
//               className="form-control"
//               required
//             />
//           </div>
//           <div className="mb-3">
//             <label className="form-label">{translations[lang].password}</label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleInputChange}
//               className="form-control"
//               required
//             />
//           </div>
//           <button type="submit" className="btn btn-primary w-100">{translations[lang].login}</button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Login;


import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiPost } from '../helpers/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../style/Login.css';
import logo from '../assets/logo.png';

function Login() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [resetEmail, setResetEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

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

  const handleResetEmailChange = (e) => {
    setResetEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiPost('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/profile/me');
    } catch (err) {
      setError(err.response?.data?.message || t('loginFailed'));
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiPost('/auth/forgot-password', { email: resetEmail });
      setSuccess(res.data.message || t('resetSuccess'));
      setResetEmail('');
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.message || t('resetFailed'));
    }
  };

  return (
    <div className="login-container bg-gradient-login">
      <div className="glass-card p-4 login-card animate-fade-in">
        <div className="text-center mb-4">
                    <img src={logo} alt="RAN Clinic Logo" className="rounded-circle shadow-sm mb-3" style={{ width: '4rem', height: '4rem' }} />
          
          <div className="logo-fallback" style={{ display: 'none' }}>
            RAN Clinic
          </div>
          <h2 className="card-title">{t('login')}</h2>
        </div>
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
              <div className="toast-body">{success}</div>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">{t('email')}</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-envelope"></i>
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-control glow-input"
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">{t('password')}</label>
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
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-success w-100 animate-button">
            <i className="fas fa-sign-in-alt me-2"></i>{t('login')}
          </button>
          <div className="text-center mt-3">
            <button
              type="button"
              className="btn btn-link forgot-password-link"
              onClick={() => setShowModal(true)}
            >
              {t('forgotPassword')}
            </button>
          </div>
        </form>
        <div
          className={`modal fade ${showModal ? 'show d-block' : ''}`}
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content glass-card">
              <div className="modal-header">
                <h5 className="modal-title">{t('resetPassword')}</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleResetSubmit}>
                  <div className="mb-3">
                    <label className="form-label">{t('email')}</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-envelope"></i>
                      </span>
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={handleResetEmailChange}
                        className="form-control glow-input"
                        required
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-success w-100 animate-button">
                    <i className="fas fa-paper-plane me-2"></i>{t('submit')}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
