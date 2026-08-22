import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, Globe, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';

export const ForgotPasswordPage: React.FC = () => {
  const { success, error } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      error('Email Required', 'Please enter your email address.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      success('Recovery Email Sent', `We have sent password reset instructions to ${email}`);
    }, 400);
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center py-8 px-4 max-w-md mx-auto animate-fade-in">
      <div className="w-full text-center mb-6 space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-terracotta-500 text-white shadow-md mb-2">
          <Globe className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 font-display">
          Reset Your Password
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Enter your account email to receive recovery instructions.
        </p>
      </div>

      <Card variant="default" className="w-full shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Account Recovery</CardTitle>
          <CardDescription>We will send a secure password reset link to your inbox.</CardDescription>
        </CardHeader>

        {isSubmitted ? (
          <CardContent className="space-y-4 text-center py-6">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Check Your Inbox</h3>
            <p className="text-xs text-slate-600">
              We've dispatched a recovery link to <span className="font-semibold text-slate-800">{email}</span>. Click the link in the email to set a new password.
            </p>
            <div className="pt-2">
              <Link to="/login">
                <Button variant="primary" size="sm">
                  Return to Sign In
                </Button>
              </Link>
            </div>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <Input
                label="Registered Email Address"
                type="email"
                required
                placeholder="e.g. user@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                helperText="Enter the email associated with your GlobeTrotter account."
              />
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              <Button
                type="submit"
                variant="primary"
                size="md"
                fullWidth
                isLoading={isLoading}
                leftIcon={<Send className="w-4 h-4" />}
              >
                Send Reset Link
              </Button>

              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Sign In</span>
              </Link>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
};
