import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Mail, Lock, User, Eye, EyeOff, Sparkles } from "lucide-react";
import { KiruLogo } from "../components/KiruLogo";

export default function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState<{ 
    name?: string; 
    email?: string; 
    password?: string; 
    confirmPassword?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: { 
      name?: string; 
      email?: string; 
      password?: string; 
      confirmPassword?: string;
    } = {};
    
    if (!formData.name) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Call signup API
    setIsLoading(true);
    setApiError('');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setApiError(data.error || 'Failed to create account');
        return;
      }
      
      // Store user data and token
      const userData = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        level: "Beginner Pythonista",
        streak: 0,
        joinedDate: new Date().toISOString()
      };
      
      localStorage.setItem('kiruUser', JSON.stringify(userData));
      localStorage.setItem('kiruToken', data.token);
      localStorage.setItem('isAuthenticated', 'true');
      
      // Navigate to user dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup error:', error);
      setApiError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-12" style={{ fontFamily: 'var(--font-sans)' }}>
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12">
            <KiruLogo className="w-full h-full" />
          </div>
          <span className="text-3xl font-bold text-foreground" style={{ fontFamily: 'var(--font-serif)' }}>
            Kiru
          </span>
        </Link>

        {/* Sign Up Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-card rounded-2xl border border-border p-8 shadow-xl"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400">Start Learning Today</span>
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
              Create Account
            </h1>
            <p className="text-muted-foreground">
              Join thousands of developers learning with AI
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* API Error */}
            {apiError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {apiError}
              </div>
            )}
            
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    setErrors({ ...errors, name: undefined });
                  }}
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-input-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setErrors({ ...errors, email: undefined });
                  }}
                  placeholder="your@email.com"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-input-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    setErrors({ ...errors, password: undefined });
                  }}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 rounded-xl bg-input-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({ ...formData, confirmPassword: e.target.value });
                    setErrors({ ...errors, confirmPassword: undefined });
                  }}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 rounded-xl bg-input-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms */}
            <p className="text-xs text-muted-foreground">
              By signing up, you agree to our{" "}
              <button type="button" className="text-blue-400 hover:text-blue-300">Terms of Service</button>
              {" "}and{" "}
              <button type="button" className="text-blue-400 hover:text-blue-300">Privacy Policy</button>
            </p>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-orange-500 text-white font-medium shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-card text-muted-foreground">or</span>
            </div>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link to="/signin" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
