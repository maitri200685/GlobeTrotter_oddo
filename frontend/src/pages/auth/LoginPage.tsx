import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LogIn, 
  Mail, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  Globe, 
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, switchDemoPersona, demoPersonas, isLoading } = useAuth();
  const { error } = useToast();

  const [email, setEmail] = useState('aarav.travels@globe.io');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  // Return to intended page if redirected
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

  const handleDemoClick = async (personaId: string) => {
    try {
      await switchDemoPersona(personaId);
      navigate(from, { replace: true });
    } catch (err: any) {
      error('Demo Login Failed', err.message);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center py-8 px-4 max-w-5xl mx-auto animate-fade-in">
      <div className="w-full max-w-md text-center mb-6 space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-terracotta-500 text-white shadow-md mb-2">
          <Globe className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
          Welcome to GlobeTrotter
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Sign in to access your synchronized travel plans or choose an instant demo persona below.
        </p>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left / Top: Quick Demo Personas (1-Click Login) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-gradient-to-br from-terracotta-50/70 via-sand-50 to-amber-50/50 rounded-2xl p-5 border border-terracotta-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-terracotta-600" />
                <h3 className="text-sm font-bold text-slate-900">Instant 1-Click Demo Login</h3>
              </div>
              <Badge variant="terracotta" size="xs">Recommended</Badge>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              Select any pre-configured traveler persona to instantly explore the complete application without typing:
            </p>

            <div className="space-y-2.5">
              {demoPersonas.map((persona) => (
                <button
                  key={persona.id}
                  type="button"
                  onClick={() => handleDemoClick(persona.id)}
                  disabled={isLoading}
                  className="w-full bg-white hover:bg-sand-50/90 active:scale-[0.99] border border-slate-200/90 hover:border-terracotta-400 rounded-xl p-3 flex items-center justify-between text-left transition-all shadow-2xs group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={persona.avatarUrl}
                      alt={persona.personaName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-terracotta-600 transition-colors">
                        {persona.personaName}
                      </h4>
                      <p className="text-[11px] text-slate-500">{persona.tagline}</p>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {persona.user.preferences.preferredCurrency} • {persona.user.stats.tripsPlanned} Trips
                      </span>
                    </div>
                  </div>

                  <div className="w-7 h-7 rounded-full bg-sand-100 group-hover:bg-terracotta-500 group-hover:text-white text-slate-500 flex items-center justify-center transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right / Bottom: Standard Email Login Form */}
        <div className="lg:col-span-6">
          <Card variant="default" className="shadow-card">
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
      </div>
    </div>
  );
};
