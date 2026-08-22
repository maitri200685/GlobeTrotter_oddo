import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LogIn, 
  Mail, 
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { AuthGlassLayout } from '@/components/layout/AuthGlassLayout';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();
  const { error } = useToast();

  const [email, setEmail] = useState('aarav.travels@globe.io');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      await login({ email, password, rememberMe });
      navigate(from, { replace: true });
    } catch (err: any) {
      const msg = err.message || 'Login failed. Please check your credentials.';
      setFormError(msg);
      error('Login Failed', msg);
    }
  };

  return (
    <AuthGlassLayout maxWidth="max-w-md">
      <div className="animate-fade-in flex flex-col justify-center min-h-[calc(100vh-8rem)]">
        <div className="w-full text-center mb-6 space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]">
            Welcome Back
          </h1>
          <p className="text-xs sm:text-sm text-white/75">
            Sign in to continue planning your next adventure.
          </p>
        </div>

        <Card
          variant="default"
          className="
            w-full shadow-2xl backdrop-blur-xl bg-white/85 border border-white/40
            rounded-3xl ring-1 ring-black/5
          "
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Sign In with Credentials</CardTitle>
            <CardDescription>Enter your email and password to continue.</CardDescription>
          </CardHeader>

          <form onSubmit={handleStandardLogin}>
            <CardContent className="space-y-4 pt-2">
              <Input
                label="Email Address"
                type="email"
                required
                placeholder="e.g. user@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
              />

              <Input
                label="Password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
              />

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-terracotta-500 focus:ring-terracotta-400"
                  />
                  <span>Remember me</span>
                </label>

                <Link to="/forgot-password" className="text-terracotta-600 hover:text-terracotta-700 font-semibold">
                  Forgot password?
                </Link>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                  {formError}
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                isLoading={isLoading}
                leftIcon={<LogIn className="w-4 h-4" />}
              >
                Sign In to Dashboard
              </Button>

              <p className="text-xs text-slate-500 text-center">
                Don't have an account?{' '}
                <Link to="/signup" className="text-terracotta-600 hover:text-terracotta-700 font-bold">
                  Create free account
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AuthGlassLayout>
  );
};
