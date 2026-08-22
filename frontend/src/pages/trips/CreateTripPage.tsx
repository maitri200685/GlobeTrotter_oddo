import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Sparkles, 
  Compass, 
  CalendarDays, 
  Users, 
  Wallet, 
  Image as ImageIcon, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { useTrip } from '@/context/TripContext';
import { useToast } from '@/context/ToastContext';
import type { BudgetStyle, CurrencyCode } from '@/types/user.types';

export const CreateTripPage: React.FC = () => {
  const navigate = useNavigate();
  const { createTrip, isLoading } = useTrip();
  const { error } = useToast();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [travelStyle, setTravelStyle] = useState<BudgetStyle>('comfort');
  
  const [startDate, setStartDate] = useState('2026-10-10');
  const [endDate, setEndDate] = useState('2026-10-16');
  const [travelerCount, setTravelerCount] = useState(2);
  const [travelerType, setTravelerType] = useState<'solo' | 'couple' | 'friends' | 'family'>('couple');
  
  const [targetBudget, setTargetBudget] = useState(35000);
  const [currency, setCurrency] = useState<CurrencyCode>('INR');

  const presetCoverPhotos = [
    { name: 'Goa Coastal Sunset', url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&h=500&q=80' },
    { name: 'Jaipur Hawa Mahal', url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&h=500&q=80' },
    { name: 'Kerala Backwaters', url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&h=500&q=80' },
    { name: 'Manali Mountains', url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&h=500&q=80' },
    { name: 'Varanasi Ghats', url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&h=500&q=80' },
    { name: 'Udaipur Lake Palace', url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&h=500&q=80' },
  ];

  const [selectedCoverImage, setSelectedCoverImage] = useState(presetCoverPhotos[0].url);

  const calculateDays = () => {
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diff = Math.ceil(Math.abs(e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return isNaN(diff) || diff < 1 ? 1 : diff;
  };

  const handleNext = () => {
    if (step === 1 && !title.trim()) {
      error('Title Required', 'Please enter a name for your trip.');
      return;
    }
    if (step < 4) setStep((prev) => (prev + 1) as any);
  };

  const handlePrev = () => {
    if (step > 1) setStep((prev) => (prev - 1) as any);
  };

  const handleFinish = async () => {
    try {
      const created = await createTrip({
        title,
        description,
        startDate,
        endDate,
        travelerCount,
        travelerType,
        targetBudget,
        currency,
        coverImage: selectedCoverImage,
        travelStyle,
      });

      navigate(`/trips/${created.id}/cities`);
    } catch (err: any) {
      error('Creation Error', err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* Choice Banner at Top (AI vs Manual) */}
      <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-amber-50 rounded-2xl p-4 sm:p-5 border border-purple-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-purple-950">Want AI to build this for you?</h4>
            <p className="text-[11px] text-purple-800">
              Describe your journey in plain words and generate the whole trip in 60s.
            </p>
          </div>
        </div>

        <Button
          variant="ai-subtle"
          size="sm"
          onClick={() => navigate('/plan')}
          className="shrink-0 bg-white"
          leftIcon={<Sparkles className="w-4 h-4 text-purple-600" />}
        >
          Switch to AI Planner
        </Button>
      </div>

      {/* Main Wizard Card */}
      <Card variant="default" className="shadow-card">
        
        {/* Wizard Step Progress Header */}
        <div className="p-6 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta-600">
                Step {step} of 4
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 font-display">
                {step === 1 && 'Trip Title & Travel Style'}
                {step === 2 && 'Dates & Group Size'}
                {step === 3 && 'Budget Allocation'}
                {step === 4 && 'Trip Cover Photo'}
              </h2>
            </div>
            <Badge variant="teal" size="sm">
              Manual Builder
            </Badge>
          </div>

          {/* Progress Bar Track */}
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-terracotta-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        <CardContent className="p-6 space-y-6">
          
          {/* STEP 1: TITLE & TRAVEL STYLE */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <Input
                label="Trip Name"
                required
                placeholder="e.g. Goa Beach Vacation 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                helperText="Give your itinerary an exciting title."
              />

              <div>
                <label className="text-xs font-semibold text-slate-700 tracking-wide uppercase block mb-1.5">
                  Trip Description & Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Exploring beaches, heritage churches, and cafes with friends..."
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-terracotta-200 focus:border-terracotta-500 transition-all placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 tracking-wide uppercase block mb-2">
                  Select Travel Style
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'backpacker', label: 'Solo Backpacker', desc: 'Hostels, budget transit & food shacks', icon: '🎒' },
                    { id: 'comfort', label: 'Boutique Comfort', desc: 'Curated 3-4★ stays & cozy cafes', icon: '✨' },
                    { id: 'luxury', label: 'Luxury Heritage', desc: '5★ resorts & private transit', icon: '💎' },
                    { id: 'family', label: 'Family Friendly', desc: 'Group stays & relaxed daily pacing', icon: '👨‍👩‍👧‍👦' },
                  ].map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setTravelStyle(style.id as BudgetStyle)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                        travelStyle === style.id
                          ? 'bg-terracotta-50/70 border-terracotta-500 ring-2 ring-terracotta-200'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xl shrink-0">{style.icon}</span>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{style.label}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{style.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DATES & TRAVELERS */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  leftIcon={<CalendarDays className="w-4 h-4 text-slate-400" />}
                />
                <Input
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  leftIcon={<CalendarDays className="w-4 h-4 text-slate-400" />}
                />
              </div>

              <div className="p-3.5 rounded-xl bg-sand-50 border border-slate-200/70 flex items-center justify-between text-xs text-slate-700">
                <span className="font-semibold">Calculated Total Duration:</span>
                <Badge variant="teal" size="sm">
                  {calculateDays()} Days / {Math.max(0, calculateDays() - 1)} Nights
                </Badge>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 tracking-wide uppercase block mb-2">
                  Number of Travelers
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => setTravelerCount(Math.max(1, travelerCount - 1))}
                      className="px-3.5 py-2 text-slate-600 hover:bg-sand-100 font-bold"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 font-bold text-sm text-slate-900 min-w-[3rem] text-center">
                      {travelerCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTravelerCount(travelerCount + 1)}
                      className="px-3.5 py-2 text-slate-600 hover:bg-sand-100 font-bold"
                    >
                      +
                    </button>
                  </div>

                  <Select
                    options={[
                      { value: 'solo', label: 'Solo Traveler' },
                      { value: 'couple', label: 'Couple / Duo' },
                      { value: 'friends', label: 'Friends Group' },
                      { value: 'family', label: 'Family Vacation' },
                    ]}
                    value={travelerType}
                    onChange={(e) => setTravelerType(e.target.value as any)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: BUDGET & CURRENCY */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Target Total Budget"
                  type="number"
                  placeholder="35000"
                  value={targetBudget}
                  onChange={(e) => setTargetBudget(Number(e.target.value))}
                  leftIcon={<Wallet className="w-4 h-4 text-slate-400" />}
                  helperText="Total financial target for accommodations, activities & transport."
                />

                <Select
                  label="Currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                  options={[
                    { value: 'INR', label: '₹ INR — Indian Rupee' },
                    { value: 'USD', label: '$ USD — US Dollar' },
                    { value: 'EUR', label: '€ EUR — Euro' },
                    { value: 'GBP', label: '£ GBP — British Pound' },
                  ]}
                />
              </div>

              {/* Budget per Person Preview */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-900 space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Per Traveler Estimation:
                </p>
                <p className="text-lg font-extrabold text-emerald-800">
                  {currency === 'INR' ? '₹' : '$'}
                  {Math.round(targetBudget / travelerCount).toLocaleString()}
                  <span className="text-xs font-normal text-emerald-700"> / person ({travelerCount} travelers)</span>
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: COVER PHOTO PICKER */}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-xs text-slate-600">
                Choose a scenic photo for your trip dashboard or paste a custom image URL:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {presetCoverPhotos.map((photo) => {
                  const isSelected = selectedCoverImage === photo.url;
                  return (
                    <button
                      key={photo.name}
                      type="button"
                      onClick={() => setSelectedCoverImage(photo.url)}
                      className={`relative rounded-xl overflow-hidden h-28 border-2 transition-all cursor-pointer text-left group ${
                        isSelected
                          ? 'border-terracotta-500 ring-2 ring-terracotta-200'
                          : 'border-transparent hover:opacity-90'
                      }`}
                    >
                      <img
                        src={photo.url}
                        alt={photo.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <span className="absolute bottom-1.5 left-2 right-2 text-[10px] font-bold text-white truncate">
                        {photo.name}
                      </span>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-terracotta-500 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <Input
                label="Or Custom Cover Photo URL"
                placeholder="https://images.unsplash.com/..."
                value={selectedCoverImage}
                onChange={(e) => setSelectedCoverImage(e.target.value)}
                leftIcon={<ImageIcon className="w-4 h-4 text-slate-400" />}
              />
            </div>
          )}
        </CardContent>

        {/* Wizard Navigation Footer */}
        <CardFooter className="flex items-center justify-between pt-4 border-t border-slate-100">
          {step > 1 ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
          ) : (
            <Link to="/trips">
              <Button variant="ghost" size="sm">
                Cancel
              </Button>
            </Link>
          )}

          {step < 4 ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleNext}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Next Step
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              onClick={handleFinish}
              isLoading={isLoading}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Create Trip & Add Cities
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};
