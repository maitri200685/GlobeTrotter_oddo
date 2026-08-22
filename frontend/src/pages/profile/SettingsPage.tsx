import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Wallet, 
  Bell, 
  ShieldAlert, 
  Save, 
  Check, 
  RefreshCw,
  Sparkles,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import type { CurrencyCode, TravelPace, DietaryPreference, BudgetStyle } from '@/types/user.types';

export const SettingsPage: React.FC = () => {
  const { user, updateProfile, updatePreferences, logout } = useAuth();
  const { success, error, info } = useToast();

  if (!user) return null;

  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || '');
  const [homeAirportOrCity, setHomeAirportOrCity] = useState(user.preferences.homeAirportOrCity || '');
  const [preferredCurrency, setPreferredCurrency] = useState<CurrencyCode>(user.preferences.preferredCurrency);
  const [budgetStyle, setBudgetStyle] = useState<BudgetStyle>(user.preferences.budgetStyle);
  const [travelPace, setTravelPace] = useState<TravelPace>(user.preferences.travelPace);
  const [dietary, setDietary] = useState<DietaryPreference>(user.preferences.dietary);
  const [emailNotifications, setEmailNotifications] = useState(user.preferences.emailNotifications);
  const [tripAlerts, setTripAlerts] = useState(user.preferences.tripAlerts);
  const [marketingEmails, setMarketingEmails] = useState(user.preferences.marketingEmails);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        name,
        bio,
        preferences: {
          ...user.preferences,
          homeAirportOrCity,
          preferredCurrency,
          budgetStyle,
          travelPace,
          dietary,
          emailNotifications,
          tripAlerts,
          marketingEmails,
        },
      });
      success('Settings Saved', 'Your profile and travel preferences have been updated.');
    } catch (err: any) {
      error('Update Failed', err.message || 'Unable to update settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetStorage = () => {
    if (window.confirm('Are you sure you want to reset your local preferences cache to default?')) {
      window.localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sand-100 flex items-center justify-center text-slate-700">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Account & Travel Settings
            </h1>
            <p className="text-xs text-slate-500">
              Customize how GlobeTrotter plans your itineraries, calculates budgets, and sends alerts.
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={handleSaveAll}
          isLoading={isSaving}
          leftIcon={<Save className="w-4 h-4" />}
        >
          Save All Changes
        </Button>
      </div>

      <form onSubmit={handleSaveAll} className="space-y-6">
        
        {/* 1. PERSONAL INFORMATION */}
        <Card variant="default">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-4 h-4 text-terracotta-500" />
              <span>Personal Details</span>
            </CardTitle>
            <CardDescription>Your public traveler profile information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aarav Mehta"
              />
              <Input
                label="Email Address"
                value={user.email}
                disabled
                helperText="Account email cannot be modified."
              />
            </div>

            <Input
              label="Home City / Departure Airport"
              value={homeAirportOrCity}
              onChange={(e) => setHomeAirportOrCity(e.target.value)}
              placeholder="e.g. Mumbai (BOM) or Ahmedabad (AMD)"
              leftIcon={<MapPin className="w-4 h-4" />}
              helperText="Used for automatic departure transit recommendations."
            />

            <div>
              <label className="text-xs font-semibold text-slate-700 tracking-wide uppercase block mb-1.5">
                Travel Bio & Style Notes
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell AI about your favorite activities, hobbies, and travel memories..."
                className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-terracotta-200 focus:border-terracotta-500 transition-all placeholder:text-slate-400"
              />
            </div>
          </CardContent>
        </Card>

        {/* 2. TRAVEL PREFERENCES */}
        <Card variant="default">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-600" />
              <span>Trip Planning & Budget Defaults</span>
            </CardTitle>
            <CardDescription>These options calibrate AI recommendations and budget calculations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Preferred Currency"
                value={preferredCurrency}
                onChange={(e) => setPreferredCurrency(e.target.value as CurrencyCode)}
                options={[
                  { value: 'INR', label: '₹ INR — Indian Rupee' },
                  { value: 'USD', label: '$ USD — US Dollar' },
                  { value: 'EUR', label: '€ EUR — Euro' },
                  { value: 'GBP', label: '£ GBP — British Pound' },
                ]}
                helperText="Default currency for estimated costs."
              />

              <Select
                label="Travel Style / Accommodation Tier"
                value={budgetStyle}
                onChange={(e) => setBudgetStyle(e.target.value as BudgetStyle)}
                options={[
                  { value: 'backpacker', label: '🎒 Solo Backpacker / Hostels' },
                  { value: 'comfort', label: '✨ Boutique Comfort & Curated' },
                  { value: 'luxury', label: '💎 Luxury & Heritage Resorts' },
                  { value: 'family', label: '👨‍👩‍👧‍👦 Family / Group Stays' },
                ]}
              />

              <Select
                label="Preferred Daily Pace"
                value={travelPace}
                onChange={(e) => setTravelPace(e.target.value as TravelPace)}
                options={[
                  { value: 'relaxed', label: '🌴 Relaxed (1-2 activities / day)' },
                  { value: 'balanced', label: '⚖️ Balanced (2-3 activities / day)' },
                  { value: 'packed', label: '⚡ Packed (4+ activities / day)' },
                ]}
              />

              <Select
                label="Dietary Requirement"
                value={dietary}
                onChange={(e) => setDietary(e.target.value as DietaryPreference)}
                options={[
                  { value: 'any', label: '🍽️ Any / No Restrictions' },
                  { value: 'vegetarian', label: '🥗 Pure Vegetarian' },
                  { value: 'vegan', label: '🌱 Vegan' },
                  { value: 'halal', label: '🌙 Halal' },
                  { value: 'jain', label: '🪷 Jain Vegetarian' },
                  { value: 'gluten-free', label: '🌾 Gluten Free' },
                ]}
              />
            </div>
          </CardContent>
        </Card>

        {/* 3. NOTIFICATION PREFERENCES */}
        <Card variant="default">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="w-4 h-4 text-sky-600" />
              <span>Notification Preferences</span>
            </CardTitle>
            <CardDescription>Control alerts for price drops, budget thresholds, and upcoming trips.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl hover:bg-sand-50 transition-colors cursor-pointer">
              <div>
                <p className="text-xs font-bold text-slate-800">Trip & Flight Alerts</p>
                <p className="text-[11px] text-slate-500">Real-time alerts when hotel or flight rates change.</p>
              </div>
              <input
                type="checkbox"
                checked={tripAlerts}
                onChange={(e) => setTripAlerts(e.target.checked)}
                className="rounded text-terracotta-500 focus:ring-terracotta-400 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl hover:bg-sand-50 transition-colors cursor-pointer border-t border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-800">Budget Warning Alerts</p>
                <p className="text-[11px] text-slate-500">Notify when expenses exceed 85% of target budget.</p>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="rounded text-terracotta-500 focus:ring-terracotta-400 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl hover:bg-sand-50 transition-colors cursor-pointer border-t border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-800">AI Travel Digest & Community Trips</p>
                <p className="text-[11px] text-slate-500">Weekly curated destination guides and trending community routes.</p>
              </div>
              <input
                type="checkbox"
                checked={marketingEmails}
                onChange={(e) => setMarketingEmails(e.target.checked)}
                className="rounded text-terracotta-500 focus:ring-terracotta-400 w-4 h-4"
              />
            </label>
          </CardContent>
        </Card>

        {/* 4. DANGER ZONE / STORAGE RESET */}
        <Card variant="flat" className="border-rose-200 bg-rose-50/40">
          <CardHeader>
            <CardTitle className="text-base text-rose-800 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Storage & Session Management</span>
            </CardTitle>
            <CardDescription>Reset local mock data or sign out of your account.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs text-rose-900 font-semibold">Reset Local Mock Data</p>
              <p className="text-[11px] text-rose-700">Clears all saved itineraries, mock bookings, and resets to seed state.</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="xs"
              className="border-rose-300 text-rose-700 hover:bg-rose-100"
              onClick={handleResetStorage}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Reset Mock Storage
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save All Preferences
          </Button>
        </div>
      </form>
    </div>
  );
};
