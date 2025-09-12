
import { useState, useEffect } from 'react';
import { apiPost, apiGet } from '../helpers/api';
import logo from '../assets/logo.png';
import { useTranslation } from 'react-i18next';
import '../style/attendance-styles.css';
function Attendance() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const { t } = useTranslation();

  // دالة لتوليد معلومات الجهاز الأساسية
  const generateDeviceInfo = async () => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Device fingerprint', 2, 2);
      
      const deviceData = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        hardwareConcurrency: navigator.hardwareConcurrency || 0,
        deviceMemory: navigator.deviceMemory || 0,
        screenResolution: `${screen.width}x${screen.height}`,
        colorDepth: screen.colorDepth,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        canvasFingerprint: canvas.toDataURL()
      };

      const deviceId = await generateDeviceId(deviceData);
      const browserFingerprint = await generateBrowserFingerprint(deviceData);

      return {
        deviceId,
        browserFingerprint,
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating device info:', error);
      return null;
    }
  };

  const generateDeviceId = async (deviceData) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(
      `${deviceData.platform}-${deviceData.hardwareConcurrency}-${deviceData.deviceMemory}-${deviceData.screenResolution}-${deviceData.timeZone}`
    );
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const generateBrowserFingerprint = async (deviceData) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(
      `${deviceData.userAgent}-${deviceData.language}-${deviceData.canvasFingerprint}-${deviceData.colorDepth}`
    );
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const checkBiometricsSupport = async () => {
    if ('PublicKeyCredential' in window && navigator.credentials) {
      try {
        const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        setBiometricsAvailable(available);
        return available;
      } catch (error) {
        console.error('Error checking biometrics support:', error);
        setBiometricsAvailable(false);
        return false;
      }
    }
    setBiometricsAvailable(false);
    return false;
  };

  const registerBiometrics = async () => {
    if (!biometricsAvailable || !deviceInfo) return false;

    try {
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: new Uint8Array(32),
          rp: { name: "RAN Clinic Attendance" },
          user: {
            id: new TextEncoder().encode(deviceInfo.deviceId),
            name: "user",
            displayName: "User"
          },
          pubKeyCredParams: [{ alg: -7, type: "public-key" }],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required"
          }
        }
      });

      if (credential) {
        setBiometricsEnabled(true);
        window.biometricsRegistered = true;
        return true;
      }
    } catch (error) {
      console.error('Biometrics registration failed:', error);
    }
    return false;
  };

  const verifyBiometrics = async () => {
    if (!biometricsEnabled || !deviceInfo) return false;

    try {
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array(32),
          userVerification: "required"
        }
      });

      return !!credential;
    } catch (error) {
      console.error('Biometrics verification failed:', error);
      return false;
    }
  };

  useEffect(() => {
    const initializeDevice = async () => {
      setLoading(true);
      try {
        const info = await generateDeviceInfo();
        setDeviceInfo(info);

        const biometricsSupported = await checkBiometricsSupport();
        if (biometricsSupported && window.biometricsRegistered) {
          setBiometricsEnabled(true);
        }

const res = await apiGet('/branches');
        setBranches(res.data || []);
      } catch (err) {
        console.error('Initialization error:', err);
        setError(t('error'));
      } finally {
        setLoading(false);
      }
    };

    initializeDevice();
  }, []);

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error(t('geolocationNotSupported')));
      }
      navigator.geolocation.getCurrentPosition(
        (position) => resolve({ 
          lat: position.coords.latitude, 
          lng: position.coords.longitude 
        }),
        (err) => reject(err),
        { 
          enableHighAccuracy: true, 
          timeout: 15000, 
          maximumAge: 300000
        }
      );
    });
  };

  const performAction = async (action, endpoint) => {
    if (!selectedBranch || !deviceInfo) {
      setError(t('error'));
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (biometricsEnabled) {
        const biometricsVerified = await verifyBiometrics();
        if (!biometricsVerified) {
          setError(t('biometricVerificationFailed'));
          setLoading(false);
          return;
        }
      }

      const { lat, lng } = await getLocation();
      
      const response = await apiPost(endpoint, { 
        lat, 
        lng, 
        branchId: selectedBranch, 
        deviceInfo 
      });

      let successMessage = t(`${action}Success`);
      
      if (response.data.lateMinutes && response.data.lateMinutes > 0) {
        successMessage += ` (${t('late')} ${response.data.lateMinutes} ${t('minutes')})`;
      }
      if (response.data.earlyLeaveMinutes && response.data.earlyLeaveMinutes > 0) {
        successMessage += ` (${t('earlyLeave')} ${response.data.earlyLeaveMinutes} ${t('minutes')})`;
      }

      setSuccess(successMessage);
    } catch (err) {
      console.error(`${action} error:`, err);
      let errorMessage = err.response?.data?.message || t('error');
      
      if (err.response?.data?.isNewDevice) {
        errorMessage = t('devicePending');
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = () => performAction('checkIn', '/attendance/checkin');
  const handleCheckOut = () => performAction('checkOut', '/attendance/checkout');
  const handleRecordAbsence = () => performAction('recordAbsence', '/attendance/record-absence');

  const handleEnableBiometrics = async () => {
    const registered = await registerBiometrics();
    if (registered) {
      setSuccess(t('biometricsEnabledSuccess'));
    } else {
      setError(t('biometricsEnableFailed'));
    }
  };

  if (loading && !deviceInfo) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">{t('loading')}</span>
          </div>
          <p className="mt-3">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card shadow-lg border-0" style={{ maxWidth: '450px', width: '100%' }}>
        <div className="card-header bg-primary text-white text-center py-4">
          <img 
            src={logo} 
            alt="RAN Clinic Logo" 
            className="rounded-circle shadow-sm mb-3" 
            style={{ width: '4rem', height: '4rem' }} 
          />
          <h2 className="card-title mb-0 fs-4">{t('attendance')}</h2>
        </div>
        
        <div className="card-body p-4">
          {error && (
            <div className="alert alert-danger d-flex align-items-center" role="alert">
              <i className="fas fa-exclamation-triangle me-2"></i>
              <div>{error}</div>
            </div>
          )}
          
          {success && (
            <div className="alert alert-success d-flex align-items-center" role="alert">
              <i className="fas fa-check-circle me-2"></i>
              <div>{success}</div>
            </div>
          )}

          {deviceInfo && (
            <div className="alert alert-info mb-3">
              <small>
                <i className="fas fa-mobile-alt me-1"></i>
                {t('deviceId')}: {deviceInfo.deviceId.substring(0, 8)}...
              </small>
            </div>
          )}

          <div className="mb-3">
            <label className="form-label fw-bold">
              <i className="fas fa-building me-2"></i>
              {t('selectBranch')}
            </label>
            <select
              className="form-select"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              disabled={loading}
            >
              <option value="">{t('selectBranch')}</option>
              {branches.map(branch => (
                <option key={branch._id} value={branch._id}>{branch.name}</option>
              ))}
            </select>
          </div>

          {biometricsAvailable && (
            <div className="mb-3 p-3 bg-light rounded">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <label className="form-label mb-1 fw-bold">
                    <i className="fas fa-fingerprint me-2"></i>
                    {t('biometricsPrompt')}
                  </label>
                  <div className="form-check">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      checked={biometricsEnabled}
                      disabled
                    />
                    <label className="form-check-label">
                      {t(biometricsEnabled ? 'biometricsEnabled' : 'biometricsDisabled')}
                    </label>
                  </div>
                </div>
                {!biometricsEnabled && (
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={handleEnableBiometrics}
                    disabled={loading}
                  >
                    {t('enableBiometrics')}
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="d-grid gap-3">
            <button
              onClick={handleCheckIn}
              className="btn btn-success btn-lg shadow-sm"
              disabled={!selectedBranch || !deviceInfo || loading}
            >
              {loading ? (
                <>
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">{t('loading')}</span>
                  </div>
                  {t('loading')}
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt me-2"></i>
                  {t('checkIn')}
                </>
              )}
            </button>

            <button
              onClick={handleCheckOut}
              className="btn btn-danger btn-lg shadow-sm"
              disabled={!selectedBranch || !deviceInfo || loading}
            >
              {loading ? (
                <>
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">{t('loading')}</span>
                  </div>
                  {t('loading')}
                </>
              ) : (
                <>
                  <i className="fas fa-sign-out-alt me-2"></i>
                  {t('checkOut')}
                </>
              )}
            </button>

            <button
              onClick={handleRecordAbsence}
              className="btn btn-warning btn-lg shadow-sm"
              disabled={!selectedBranch || !deviceInfo || loading}
            >
              {loading ? (
                <>
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">{t('loading')}</span>
                  </div>
                  {t('loading')}
                </>
              ) : (
                <>
                  <i className="fas fa-user-times me-2"></i>
                  {t('recordAbsence')}
                </>
              )}
            </button>
          </div>

          <div className="mt-4 text-center">
            <small className="text-muted">
              <i className="fas fa-shield-alt me-1"></i>
              {t('secureMultiLayerVerification')}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Attendance;

