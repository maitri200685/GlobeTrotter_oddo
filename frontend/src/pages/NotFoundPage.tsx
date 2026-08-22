import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-6 animate-fade-in">
      <div className="relative w-28 h-28">
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-terracotta-100 to-sand-200 flex items-center justify-center">
          <Compass className="w-12 h-12 text-terracotta-500 animate-spin" style={{ animationDuration: '4s' }} />
        </div>
        <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center shadow-md">
          <span className="text-xl">🗺️</span>
        </div>
      </div>

      <div className="space-y-2 max-w-sm">
        <h1 className="text-5xl font-extrabold text-slate-900 font-display">404</h1>
        <h2 className="text-xl font-bold text-slate-800">Lost in Transit?</h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          Looks like this page doesn't exist or the route has been updated. Let's get you back on the right path!
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Go Back
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/')}
          leftIcon={<Home className="w-4 h-4" />}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};
