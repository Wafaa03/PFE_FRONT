import { useState } from "react";
import { useNavigate } from "react-router";
import { Scale, Eye, EyeOff, Loader2 } from "lucide-react";
import { login, register, setAuth } from "../lib/auth";

export function Login() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    department: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        await register(formData.username, formData.password);
      }

      const { access_token, user } = await login(
        formData.username,
        formData.password
      );

      setAuth(access_token, {
        ...user,
        fullName: formData.fullName || user.username,
        department: formData.department || user.role,
      });

      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8DC] via-[#BAAEAB]/30 to-[#FFF8DC] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md mb-4">
            <Scale className="w-8 h-8 text-[#AB8E51]" />
          </div>
          <h1 className="text-3xl font-semibold text-[#806B64] mb-2">Legal AI Platform</h1>
          <p className="text-gray-600">Internal legal intelligence system</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
          <div className="flex gap-4 mb-6 border-b border-gray-200">
            <button
              type="button"
              onClick={() => { setIsSignUp(false); setError(""); }}
              className={`pb-3 px-1 font-medium transition-colors relative ${
                !isSignUp ? "text-[#AB8E51]" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Sign In
              {!isSignUp && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#AB8E51]"></div>
              )}
            </button>
            <button
              type="button"
              onClick={() => { setIsSignUp(true); setError(""); }}
              className={`pb-3 px-1 font-medium transition-colors relative ${
                isSignUp ? "text-[#AB8E51]" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Sign Up
              {isSignUp && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#AB8E51]"></div>
              )}
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD42D] focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD42D] focus:border-transparent"
                  >
                    <option value="">Select department</option>
                    <option value="Legal">Legal Department</option>
                    <option value="Compliance">Compliance</option>
                    <option value="Risk Management">Risk Management</option>
                    <option value="Corporate Affairs">Corporate Affairs</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD42D] focus:border-transparent"
                placeholder="your.username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD42D] focus:border-transparent"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#FFD42D] text-gray-900 font-medium rounded-lg hover:bg-[#FFD42D]/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSignUp ? "Create Account" : "Sign In"}
            </button>
          </form>

          {isSignUp && (
            <p className="mt-6 text-xs text-gray-500 text-center">
              By signing up, you agree to the bank's internal policies and data protection
              guidelines.
            </p>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>© 2026 Bank Corporation. Internal Use Only.</p>
        </div>
      </div>
    </div>
  );
}
