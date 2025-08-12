// export default function Dashboard() {
//   return (
//     <div className="container py-5" style={{ backgroundColor: "#F5F9FF", minHeight: "90vh" }}>
//       <h2 style={{ color: "#4A90E2" }}>Dashboard</h2>
//       <p>Welcome to the RAN Clinic dashboard.</p>
//     </div>
//   );
// }
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet } from '../helpers/api';

function Dashboard() {
  const navigate = useNavigate();
  const lang = document.documentElement.getAttribute('lang') || 'ar';

  const translations = {
    en: { dashboard: 'Dashboard', welcome: 'Welcome to RAN Clinic Dashboard' },
    ar: { dashboard: 'لوحة التحكم', welcome: 'مرحبا بك في لوحة تحكم RAN Clinic' },
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await apiGet('/auth/profile');
      } catch (err) { // eslint-disable-line no-unused-vars
        navigate('/');
      }
    };
    checkAuth();
  }, [navigate]);

  return (
    <div className="container mt-4">
      <h2>{translations[lang].dashboard}</h2>
      <p>{translations[lang].welcome}</p>
    </div>
  );
}

export default Dashboard;