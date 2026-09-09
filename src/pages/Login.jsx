import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { requestOTP, login } = useAuth();
  const navigate = useNavigate();

  const handleRequestOTP = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError('');
    setMessage('');

    try {
      await requestOTP(email);

      setStep('otp');
      setMessage(`OTP was sent to ${email}. Please check your inbox.`);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        'Unable to send OTP. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError('');

    try {
      await login(email, otp);

      navigate('/');
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
        'Invalid or expired OTP. Please request a new OTP.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = () => {
    setStep('email');
    setOtp('');
    setError('');
    setMessage('');
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-md rounded-lg bg-white p-8 shadow">
        <h1 className="mb-2 text-center text-2xl font-bold">
          {step === 'email' ? 'Login with OTP' : 'Verify OTP'}
        </h1>

        <p className="mb-6 text-center text-sm text-gray-500">
          No password and no registration required.
        </p>

        {error && (
          <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        {message && (
          <p className="mb-4 rounded bg-green-50 p-3 text-sm text-green-700">
            {message}
          </p>
        )}

        {step === 'email' ? (
          <form onSubmit={handleRequestOTP} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                placeholder="customer@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
                className="w-full rounded border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="rounded bg-blue-50 p-3 text-center text-sm text-blue-800">
              OTP sent to <strong>{email}</strong>
            </div>

            <div>
              <label
                htmlFor="otp"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Enter 6-digit OTP
              </label>

              <input
                id="otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                placeholder="123456"
                value={otp}
                onChange={(event) =>
                  setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))
                }
                required
                maxLength="6"
                autoFocus
                className="w-full rounded border border-gray-300 px-4 py-3 text-center text-2xl tracking-[0.4em] outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full rounded bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>

            <button
              type="button"
              onClick={handleChangeEmail}
              disabled={loading}
              className="w-full py-2 text-sm text-blue-600 hover:underline"
            >
              Change email / Resend OTP
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-xs text-gray-500">
          Your account is created automatically on your first successful OTP verification.
        </p>
      </div>
    </div>
  );
};

export default Login;