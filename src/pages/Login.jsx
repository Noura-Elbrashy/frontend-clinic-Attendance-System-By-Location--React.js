// import { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const response = await axios.post("http://localhost:5000/api/users/login", {
//         email,
//         password,
//       });

//       localStorage.setItem("token", response.data.token);
//       navigate("/dashboard");
//     } catch (err) {
//       if (err.response?.data?.message) {
//         setError(err.response.data.message);
//       } else {
//         setError("Login failed. Please try again.");
//       }
//     }
//   };

//   return (
//     <div className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: "#F5F9FF" }}>
//       <div className="card shadow p-4" style={{ width: "100%", maxWidth: "400px", borderRadius: "15px" }}>
//         <h3 className="text-center mb-4" style={{ color: "#4A90E2" }}>RAN Clinic</h3>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <label className="form-label">Email</label>
//             <input
//               type="email"
//               className="form-control"
//               required
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>
//           <div className="mb-3">
//             <label className="form-label">Password</label>
//             <input
//               type="password"
//               className="form-control"
//               required
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>
//           {error && <div className="alert alert-danger text-center">{error}</div>}
//           <button type="submit" className="btn w-100" style={{ backgroundColor: "#4A90E2", color: "white" }}>
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
// ,,,,,,,,,,,,,,,,,,,,,,,
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { apiPost } from '../helpers/api';

// function Login() {
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');
//   const navigate = useNavigate();
//   const lang = document.documentElement.getAttribute('lang') || 'ar';

//   const translations = {
//     en: { login: 'Login', email: 'Email', password: 'Password' },
//     ar: { login: 'تسجيل الدخول', email: 'البريد الإلكتروني', password: 'كلمة المرور' },
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
//       navigate('/dashboard');
//     } catch (err) { 
//       setError(err.response?.data?.message || translations[lang].loginFailed || 'تسجيل الدخول فشل');
//     }
//   };

//   return (
//     <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
//       <div className="card shadow p-4" style={{ maxWidth: '400px', width: '100%' }}>
//         <h2 className="card-title text-center mb-4">{translations[lang].login}</h2>
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
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiPost } from '../helpers/api';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const lang = document.documentElement.getAttribute('lang') || 'ar';

  const translations = {
    en: {
      login: 'Login',
      email: 'Email',
      password: 'Password',
      loginFailed: 'Login failed. Please try again.',
    },
    ar: {
      login: 'تسجيل الدخول',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      loginFailed: 'فشل تسجيل الدخول. حاول مرة أخرى.',
    },
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiPost('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || translations[lang].loginFailed);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card shadow p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="card-title text-center mb-4">RAN Clinic</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">{translations[lang].email}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">{translations[lang].password}</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">{translations[lang].login}</button>
        </form>
      </div>
    </div>
  );
}

export default Login;