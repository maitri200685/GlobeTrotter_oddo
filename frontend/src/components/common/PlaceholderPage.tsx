import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Compass, 
  Construction, 
  CheckCircle2 
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/context/ToastContext';

interface PlaceholderPageProps {
  title: string;
  subtitle: string;
  phaseNumber: number;
  phaseName: string;
  icon?: React.ReactNode;
  featuresList?: string[];
  primaryActionLabel?: string;
  primaryActionPath?: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  subtitle,
  phaseNumber,
  phaseName,
  icon,
  featuresList = [],
  primaryActionLabel,
  primaryActionPath,
}) => {
  const navigate = useNavigate();
  const { ai, info } = useToast();

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-terracotta-50 border border-terracotta-100 flex items-center justify-center text-terracotta-600 shadow-2xs">
            {icon || <Compass className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{title}</h1>
              <Badge variant="amber" size="xs">
                Phase {phaseNumber} Milestone
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {primaryActionLabel && primaryActionPath && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(primaryActionPath)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {primaryActionLabel}
            </Button>
          )}
        </div>
      </div>

      {/* Feature Preview Card */}
      <Card variant="default">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base sm:text-lg">
                Module Architecture: {phaseName}
              </CardTitle>
              <CardDescription>
                This route and its underlying services are defined in the master architectural roadmap.
              </CardDescription>
            </div>
            <Badge variant="teal" size="sm">
              Foundation Ready
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="bg-sand-50/60 rounded-xl p-4 border border-sand-200/60 mb-6">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Features Scheduled for Implementation in Phase {phaseNumber}:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {featuresList.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200/70 shadow-2xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-terracotta-500 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              variant="ai-subtle"
              size="sm"
              onClick={() => ai('AI Co-Pilot', `Testing interactive toast notification on ${title}`)}
              leftIcon={<Sparkles className="w-4 h-4 text-purple-600" />}
            >
              Test AI Notification
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => info('Phase Tracker', `Phase 1 App Shell & Design System active.`)}
            >
              Check System Status
            </Button>
            <Link to="/">
              <Button variant="secondary" size="sm">
                Return to Design Showcase
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
