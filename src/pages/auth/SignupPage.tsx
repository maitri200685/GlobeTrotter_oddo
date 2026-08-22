import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  UserPlus, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Globe, 
  Check, 
  Compass, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import type { BudgetStyle, CurrencyCode } from '@/types/user.types';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();
  const { error } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [budgetStyle, setBudgetStyle] = useState<BudgetStyle>('comfort');
  const [preferredCurrency, setPreferredCurrency] = useState<CurrencyCode>('INR');

  const budgetStyleOptions: { id: BudgetStyle; title: string; desc: string; icon: string }[] = [
    { id: 'backpacker', title: 'Solo Backpacker', desc: 'Hostels, local transit & hidden gems', icon: '🎒' },
    { id: 'comfort', title: 'Boutique Comfort', desc: 'Charming hotels, cozy cafes & curated tours', icon: '✨' },
    { id: 'luxury', title: 'Luxury & Heritage', desc: '5-star resorts, private transit & gourmet dining', icon: '💎' },
    { id: 'family', title: 'Family Friendly', desc: 'Spacious stays, relaxed pacing & group activities', icon: '👨‍👩‍👧‍👦' },
  ];

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      error('Missing Information', 'Please provide your name and email address.');
      return;
    }

    try {
      await signup({ name, email, password, budgetStyle, preferredCurrency });
      navigate('/dashboard');
    } catch (err: any) {
      error('Signup Failed', err.message || 'Unable to create account.');
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center py-8 px-4 max-w-xl mx-auto animate-fade-in">
      <div className="w-full text-center mb-6 space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-terracotta-500 text-white shadow-md mb-2">
          <Globe className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
          Start Planning with GlobeTrotter
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Create your personalized travel profile and build trips in minutes.
        </p>
      </div>

      <Card variant="default" className="w-full shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Create Free Account</CardTitle>
          <CardDescription>Tell us a bit about your travel style to personalize AI suggestions.</CardDescription>
        </CardHeader>

        <form onSubmit={handleSignup}>
          <CardContent className="space-y-5">
            <Input
              label="Full Name"
              required
              placeholder="e.g. Aarav Mehta"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<UserIcon className="w-4 h-4" />}
            />

            <Input
              label="Email Address"
              type="email"
              required
              placeholder="e.g. traveler@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Create Password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
            />

            {/* Travel Style Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-700 tracking-wide uppercase block mb-2">
                Preferred Travel Style
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {budgetStyleOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setBudgetStyle(opt.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                      budgetStyle === opt.id
                        ? 'bg-terracotta-50/70 border-terracotta-500 ring-2 ring-terracotta-200'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xl shrink-0">{opt.icon}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 leading-tight">{opt.title}</p>
                      <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <Select
              label="Default Currency"
              value={preferredCurrency}
              onChange={(e) => setPreferredCurrency(e.target.value as CurrencyCode)}
              options={[
                { value: 'INR', label: '₹ INR — Indian Rupee' },
                { value: 'USD', label: '$ USD — US Dollar' },
                { value: 'EUR', label: '€ EUR — Euro' },
                { value: 'GBP', label: '£ GBP — British Pound' },
              ]}
              helperText="You can change your currency anytime inside trip budgets."
            />
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              isLoading={isLoading}
              leftIcon={<UserPlus className="w-4 h-4" />}
            >
              Create Account & Go to Dashboard
            </Button>

            <p className="text-xs text-slate-500 text-center">
              Already have an account?{' '}
              <Link to="/login" className="text-terracotta-600 hover:text-terracotta-700 font-bold">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
