import { useState } from "react";
import { useNavigate } from "react-router";
import { Scale, Eye, EyeOff } from "lucide-react";

export function Login() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    department: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple authentication simulation
    if (isSignUp) {
      // Store user data in localStorage (demo purposes only)
      localStorage.setItem("legalAI_user", JSON.stringify({
        email: formData.email,
        fullName: formData.fullName,
        department: formData.department,
      }));
      localStorage.setItem("legalAI_authenticated", "true");
      navigate("/");
    } else {
      // Login
      localStorage.setItem("legalAI_authenticated", "true");
      localStorage.setItem("legalAI_user", JSON.stringify({
        email: formData.email,
        fullName: "Legal Team",
        department: "Banking Division",
      }));
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8DC] via-[#BAAEAB]/30 to-[#FFF8DC] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md mb-4">
            <Scale className="w-8 h-8 text-[#AB8E51]" />
          </div>
          <h1 className="text-3xl font-semibold text-[#806B64] mb-2">Legal AI Platform</h1>
          <p className="text-gray-600">Internal legal intelligence system</p>
        </div>

        {/* Login/Signup Card */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
          {/* Tab Switcher */}
          <div className="flex gap-4 mb-6 border-b border-gray-200">
            <button
              onClick={() => setIsSignUp(false)}
              className={`pb-3 px-1 font-medium transition-colors relative ${
                !isSignUp
                  ? "text-[#AB8E51]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Sign In
              {!isSignUp && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#AB8E51]"></div>
              )}
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`pb-3 px-1 font-medium transition-colors relative ${
                isSignUp
                  ? "text-[#AB8E51]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Sign Up
              {isSignUp && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#AB8E51]"></div>
              )}
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
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
                    required
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
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD42D] focus:border-transparent"
                placeholder="your.email@bank.com"
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

            {!isSignUp && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 border-gray-300 rounded text-[#AB8E51] focus:ring-[#FFD42D]"
                  />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-[#AB8E51] hover:underline">
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-[#FFD42D] text-gray-900 font-medium rounded-lg hover:bg-[#FFD42D]/90 transition-colors"
            >
              {isSignUp ? "Create Account" : "Sign In"}
            </button>
          </form>

          {/* Additional Info */}
          {isSignUp && (
            <p className="mt-6 text-xs text-gray-500 text-center">
              By signing up, you agree to the bank's internal policies and data protection
              guidelines.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>© 2026 Bank Corporation. Internal Use Only.</p>
        </div>
      </div>
    </div>
  );
}
