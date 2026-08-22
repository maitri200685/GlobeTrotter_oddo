import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Share2,
  Copy,
  Check,
  Globe,
  Lock,
  Eye,
  Link,
  Users,
  CalendarDays,
  MapPin,
  Wallet,
  Clock,
  Star,
  ArrowRight,
  Footprints,
  Hotel,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useTrip } from '@/context/TripContext';
import { useToast } from '@/context/ToastContext';

type PrivacySetting = 'public' | 'unlisted' | 'private';

export const TripSharePage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { trips, updateTrip, selectTrip, activeTrip } = useTrip();
  const { success, info } = useToast();

  const currentTrip = trips.find((t) => t.id === tripId) || activeTrip || trips[0];

  const [privacy, setPrivacy] = useState<PrivacySetting>(currentTrip?.isShared ? 'public' : 'private');
  const [linkCopied, setLinkCopied] = useState(false);

  if (!currentTrip) return null;

  const shareId = currentTrip.shareId || `gt-${currentTrip.id.slice(-6)}`;
  const shareUrl = `${window.location.origin}/share/${shareId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).catch(() => {});
    setLinkCopied(true);
    success('Link Copied!', 'Shareable trip link copied to clipboard.');
    setTimeout(() => setLinkCopied(false), 2500);
  };

  const handlePrivacyChange = async (newPrivacy: PrivacySetting) => {
    setPrivacy(newPrivacy);
    await updateTrip(currentTrip.id, {
      isShared: newPrivacy !== 'private',
      shareId: newPrivacy !== 'private' ? shareId : undefined,
    });
    info('Privacy Updated', `Trip is now ${newPrivacy === 'public' ? 'visible to everyone' : newPrivacy === 'unlisted' ? 'visible via link only' : 'private'}.`);
  };

  const currency = currentTrip.budget.currency === 'INR' ? '₹' : '$';

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-16">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-teal-600" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
              Share Trip
            </h1>
            <Badge variant={privacy === 'public' ? 'teal' : privacy === 'unlisted' ? 'amber' : 'neutral'} size="xs">
              {privacy === 'public' ? '🌍 Public' : privacy === 'unlisted' ? '🔗 Unlisted' : '🔒 Private'}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Share <strong>{currentTrip.title}</strong> with friends, family, or the GlobeTrotter community.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* LEFT: Share Controls */}
        <div className="lg:col-span-3 space-y-5">

          {/* Privacy Settings */}
          <Card variant="default" className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Privacy Settings</h3>
            <div className="space-y-2">
              {[
                {
                  value: 'public' as const,
                  icon: Globe,
                  label: 'Public',
                  desc: 'Anyone can discover and clone this trip in Explore.',
                  color: 'text-teal-600',
                  bg: 'bg-teal-50',
                  border: 'border-teal-400',
                },
                {
                  value: 'unlisted' as const,
                  icon: Link,
                  label: 'Unlisted (Link Only)',
                  desc: 'Only people with the link can view this trip.',
                  color: 'text-amber-600',
                  bg: 'bg-amber-50',
                  border: 'border-amber-400',
                },
                {
                  value: 'private' as const,
                  icon: Lock,
                  label: 'Private',
                  desc: 'Only you can see this trip.',
                  color: 'text-slate-600',
                  bg: 'bg-slate-50',
                  border: 'border-slate-400',
                },
              ].map((opt) => {
                const Icon = opt.icon;
                const isSelected = privacy === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handlePrivacyChange(opt.value)}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all text-left ${
                      isSelected ? `${opt.bg} ${opt.border}` : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isSelected ? opt.bg : 'bg-slate-100'}`}>
                      <Icon className={`w-4 h-4 ${isSelected ? opt.color : 'text-slate-400'}`} />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-bold ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>{opt.label}</p>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{opt.desc}</p>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-teal-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Share Link */}
          {privacy !== 'private' && (
            <Card variant="default" className="p-5 space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Shareable Link</h3>
              <div className="flex gap-2">
                <div className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 bg-sand-50 text-xs text-slate-600 font-mono truncate">
                  {shareUrl}
                </div>
                <Button
                  variant={linkCopied ? 'primary' : 'outline'}
                  size="sm"
                  onClick={handleCopyLink}
                  leftIcon={linkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                >
                  {linkCopied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              <p className="text-[11px] text-slate-400">
                Anyone with this link can view a read-only version of your itinerary.
              </p>
            </Card>
          )}

          {/* Share to Explore */}
          {privacy === 'public' && (
            <Card variant="default" className="p-5 border-teal-200 bg-teal-50/50 space-y-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-bold text-teal-900">Listed in Community Explore</h3>
              </div>
              <p className="text-xs text-teal-700 leading-relaxed">
                Your trip is now visible in the GlobeTrotter Explore hub. Fellow travelers can discover, save, and clone your itinerary!
              </p>
              <Button
                variant="outline"
                size="xs"
                onClick={() => navigate('/explore')}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                View in Explore
              </Button>
            </Card>
          )}
        </div>

        {/* RIGHT: Trip Preview Card */}
        <div className="lg:col-span-2 space-y-4">
          <Card variant="default" className="overflow-hidden shadow-card">
            {/* Cover */}
            <div className="relative h-40 bg-gradient-to-br from-teal-800 to-slate-900 overflow-hidden">
              {currentTrip.coverImage && (
                <img src={currentTrip.coverImage} alt={currentTrip.title} className="w-full h-full object-cover opacity-70" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4">
                <p className="text-white text-sm font-extrabold font-display leading-tight">{currentTrip.title}</p>
                <p className="text-white/60 text-[11px] mt-0.5">{currentTrip.cities.map((c) => c.cityName).join(' → ')}</p>
              </div>
            </div>

            {/* Trip Meta */}
            <CardContent className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <CalendarDays className="w-3.5 h-3.5 text-teal-600" />
                  <span>{currentTrip.totalDays} Days</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Users className="w-3.5 h-3.5 text-teal-600" />
                  <span>{currentTrip.travelerCount} Travelers</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Wallet className="w-3.5 h-3.5 text-amber-600" />
                  <span>{currency}{(currentTrip.budget.targetBudget || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Footprints className="w-3.5 h-3.5 text-terracotta-600" />
                  <span>{currentTrip.itinerary.length} Activities</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[11px] text-slate-500">Preview how others see your trip →</span>
              </div>
            </CardContent>
          </Card>

          <Button
            variant="outline"
            size="sm"
            fullWidth
            onClick={() => navigate(`/share/${shareId}`)}
            rightIcon={<Eye className="w-4 h-4" />}
          >
            Preview Public View
          </Button>
        </div>
      </div>
    </div>
  );
};
