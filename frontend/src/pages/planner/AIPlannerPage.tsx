import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Send,
  MapPin,
  Calendar,
  Users,
  Wallet,
  Compass,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Loader2,
  ChevronRight,
  Star,
  Clock,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/context/ToastContext';
import { useTrip } from '@/context/TripContext';
import { useAuth } from '@/context/AuthContext';

type PlannerStep =
  | 'destination'
  | 'dates'
  | 'travelers'
  | 'budget'
  | 'vibes'
  | 'generating'
  | 'result';

interface ChatMessage {
  id: string;
  role: 'ai' | 'user';
  text: string;
  timestamp: string;
}

const VIBE_OPTIONS = [
  { id: 'beaches', label: '🏖️ Beaches & Coast' },
  { id: 'heritage', label: '🏛️ Heritage & Culture' },
  { id: 'mountains', label: '⛰️ Mountains & Trek' },
  { id: 'food', label: '🍜 Food & Gastronomy' },
  { id: 'adventure', label: '🤿 Adventure & Sports' },
  { id: 'nightlife', label: '🎶 Nightlife & Music' },
  { id: 'wellness', label: '🧘 Wellness & Relaxation' },
  { id: 'wildlife', label: '🦁 Wildlife & Nature' },
];

const GENERATION_STEPS = [
  'Analyzing destination & travel seasons...',
  'Mapping optimal routes & city stops...',
  'Curating hotel recommendations...',
  'Building day-by-day activity schedule...',
  'Optimizing budget across all categories...',
  'Finalizing your personalized itinerary...',
];

export const AIPlannerPage: React.FC = () => {
  const navigate = useNavigate();
  const { success, info } = useToast();
  const { trips } = useTrip();
  const { user } = useAuth();

  const [step, setStep] = useState<PlannerStep>('destination');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState(50000);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [inputText, setInputText] = useState('');
  const [generationStep, setGenerationStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'ai',
      text: `Hi ${user?.name?.split(' ')[0] || 'Traveler'}! 🌍 I'm your GlobeTrotter AI. Tell me — where do you dream of going next? Type a destination or choose a quick suggestion below.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const STEP_ORDER: PlannerStep[] = ['destination', 'dates', 'travelers', 'budget', 'vibes', 'generating', 'result'];
  const currentStepIndex = STEP_ORDER.indexOf(step);
  const progressPct = Math.round((currentStepIndex / (STEP_ORDER.length - 1)) * 100);

  const addMessage = (role: 'ai' | 'user', text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2),
        role,
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleDestinationSubmit = () => {
    if (!destination.trim()) return;
    addMessage('user', destination);
    setTimeout(() => {
      addMessage('ai', `Great choice! ✈️ **${destination}** is an amazing destination. Now, when are you planning to travel? Pick your start and end dates.`);
      setStep('dates');
    }, 600);
  };

  const handleDatesSubmit = () => {
    if (!startDate || !endDate) return;
    const days = Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000);
    addMessage('user', `${startDate} to ${endDate} (${days} days)`);
    setTimeout(() => {
      addMessage('ai', `Perfect — a **${days}-day trip** to ${destination}! How many travelers will be joining you?`);
      setStep('travelers');
    }, 600);
  };

  const handleTravelersSubmit = () => {
    addMessage('user', `${travelers} traveler${travelers > 1 ? 's' : ''}`);
    setTimeout(() => {
      addMessage('ai', `${travelers === 1 ? 'A solo adventure!' : `A group of ${travelers}!`} 🎒 What's your total budget? This helps me recommend the right hotels and experiences.`);
      setStep('budget');
    }, 600);
  };

  const handleBudgetSubmit = () => {
    addMessage('user', `₹${budget.toLocaleString()} total budget`);
    setTimeout(() => {
      addMessage('ai', `That's a solid budget! 💰 Last step — what travel vibes are you going for? Select everything that excites you!`);
      setStep('vibes');
    }, 600);
  };

  const toggleVibe = (id: string) => {
    setSelectedVibes((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const handleGeneratePlan = async () => {
    if (selectedVibes.length === 0) {
      info('Select Vibes', 'Please select at least one travel vibe to continue.');
      return;
    }

    const vibeLabels = selectedVibes
      .map((v) => VIBE_OPTIONS.find((o) => o.id === v)?.label || v)
      .join(', ');

    addMessage('user', `Vibes: ${vibeLabels}`);
    addMessage('ai', `Perfect! Generating your personalized **${destination}** itinerary now... ✨`);

    setStep('generating');
    setIsGenerating(true);

    // Simulate step-by-step AI generation
    for (let i = 0; i < GENERATION_STEPS.length; i++) {
      await new Promise((res) => setTimeout(res, 700));
      setGenerationStep(i + 1);
    }

    setIsGenerating(false);
    setStep('result');

    addMessage('ai', `🎉 Your **${destination}** itinerary is ready! I've planned a perfectly balanced trip with the best hotels, curated activities, and a budget that works. You can now view and customize it in your Trip Planner!`);
    success('Trip Plan Ready!', `Your ${destination} trip is ready to view.`);
  };

  const handleUseExistingTrip = () => {
    if (trips.length > 0) {
      navigate(`/trips/${trips[0].id}`);
    } else {
      navigate('/trips/create');
    }
  };

  const totalDays = startDate && endDate
    ? Math.max(1, Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000))
    : 0;

  return (
    <div className="animate-fade-in max-w-7xl mx-auto pb-16">

      {/* Page Header */}
      <div className="pb-6 border-b border-slate-200/80 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
            GlobeTrotter AI Travel Planner
          </h1>
          <Badge variant="ai" size="xs">BETA</Badge>
        </div>
        <p className="text-xs text-slate-500">
          Answer a few questions and our AI generates your complete, personalized itinerary in seconds.
        </p>
      </div>

      {/* 7-Step Progress Visualizer */}
      <div className="mb-8 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Planning Progress</span>
          <span className="font-bold text-slate-700">{progressPct}% complete</span>
        </div>
        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 via-terracotta-500 to-teal-500 transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-medium">
          {['Destination', 'Dates', 'Travelers', 'Budget', 'Vibes', 'Generating', 'Plan Ready'].map((s, i) => (
            <span
              key={s}
              className={`transition-colors ${i <= currentStepIndex ? 'text-purple-600 font-bold' : ''}`}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* SPLIT-SCREEN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* LEFT — CONVERSATIONAL CHAT */}
        <div className="lg:col-span-7 space-y-4">
          {/* Chat Messages */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden flex flex-col h-[520px]">
            <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-sand-50 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-terracotta-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">GlobeTrotter AI</p>
                <p className="text-[10px] text-emerald-600 font-semibold">● Online • Powered by Gemini</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {msg.role === 'ai' && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-terracotta-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'ai'
                        ? 'bg-slate-100 text-slate-800 rounded-tl-none'
                        : 'bg-gradient-to-br from-purple-500 to-terracotta-500 text-white rounded-tr-none'
                    }`}
                  >
                    <p
                      className="whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{
                        __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                      }}
                    />
                    <span className="text-[10px] opacity-50 mt-1 block">{msg.timestamp}</span>
                  </div>
                </div>
              ))}

              {/* Generation Steps Loader */}
              {isGenerating && (
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-terracotta-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
                  </div>
                  <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-tl-none space-y-2 max-w-[85%]">
                    {GENERATION_STEPS.map((s, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        {i < generationStep ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        ) : i === generationStep ? (
                          <Loader2 className="w-3.5 h-3.5 text-purple-500 animate-spin shrink-0" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />
                        )}
                        <span className={i < generationStep ? 'text-slate-500 line-through' : i === generationStep ? 'text-slate-900 font-semibold' : 'text-slate-400'}>
                          {s}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input Controls Per Step */}
            <div className="p-4 border-t border-slate-100 space-y-3 bg-white">
              {step === 'destination' && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Where do you want to go? (e.g. Goa, Jaipur, Kerala)"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleDestinationSubmit()}
                      className="flex-1 px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                    />
                    <Button variant="ai-subtle" size="sm" onClick={handleDestinationSubmit}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['Goa 🏖️', 'Jaipur 🏰', 'Kerala 🌿', 'Ladakh 🏔️', 'Varanasi 🪔'].map((dest) => (
                      <button
                        key={dest}
                        type="button"
                        onClick={() => { setDestination(dest.split(' ')[0]); setTimeout(handleDestinationSubmit, 100); }}
                        className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-[11px] font-semibold hover:bg-purple-100 cursor-pointer transition-colors"
                      >
                        {dest}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 'dates' && (
                <div className="flex items-center gap-2 flex-wrap">
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" />
                  <span className="text-slate-400 text-xs">to</span>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" />
                  <Button variant="ai-subtle" size="sm" onClick={handleDatesSubmit}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {step === 'travelers' && (
                <div className="flex items-center gap-3">
                  <button onClick={() => setTravelers(Math.max(1, travelers - 1))} className="w-9 h-9 rounded-xl border border-slate-300 flex items-center justify-center text-lg font-bold hover:bg-slate-100 cursor-pointer">−</button>
                  <span className="text-lg font-extrabold text-slate-900 w-16 text-center">{travelers} {travelers === 1 ? 'Person' : 'People'}</span>
                  <button onClick={() => setTravelers(Math.min(20, travelers + 1))} className="w-9 h-9 rounded-xl border border-slate-300 flex items-center justify-center text-lg font-bold hover:bg-slate-100 cursor-pointer">+</button>
                  <Button variant="ai-subtle" size="sm" onClick={handleTravelersSubmit}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {step === 'budget' && (
                <div className="space-y-2">
                  <input type="range" min={5000} max={500000} step={5000} value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full accent-purple-500" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">₹5,000</span>
                    <span className="text-base font-extrabold text-slate-900">₹{budget.toLocaleString()}</span>
                    <span className="text-xs text-slate-500">₹5,00,000</span>
                  </div>
                  <Button variant="ai-subtle" size="sm" fullWidth onClick={handleBudgetSubmit}>
                    Confirm Budget <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}

              {step === 'vibes' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {VIBE_OPTIONS.map((vibe) => (
                      <button
                        key={vibe.id}
                        type="button"
                        onClick={() => toggleVibe(vibe.id)}
                        className={`px-2.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-center ${
                          selectedVibes.includes(vibe.id)
                            ? 'bg-purple-100 border-2 border-purple-400 text-purple-800'
                            : 'bg-sand-50 border border-slate-200 text-slate-700 hover:border-purple-300'
                        }`}
                      >
                        {vibe.label}
                      </button>
                    ))}
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    onClick={handleGeneratePlan}
                    leftIcon={<Sparkles className="w-4 h-4" />}
                  >
                    Generate My Itinerary ✨
                  </Button>
                </div>
              )}

              {step === 'result' && (
                <Button
                  variant="primary"
                  size="sm"
                  fullWidth
                  onClick={handleUseExistingTrip}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  View My Trips & Open Planner
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT — LIVE TRIP BRIEF */}
        <div className="lg:col-span-5 space-y-4">
          <Card variant="default" className="overflow-hidden border-purple-200/60 shadow-card">
            <div className="p-4 bg-gradient-to-br from-purple-600 via-purple-700 to-slate-900 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-yellow-300" />
                <span className="text-xs font-bold tracking-wider uppercase text-purple-200">Live Trip Brief</span>
              </div>
              <h3 className="text-xl font-extrabold font-display">
                {destination || 'Your Dream Destination'} ✨
              </h3>
              <p className="text-purple-200 text-xs mt-1">Personalized by GlobeTrotter AI</p>
            </div>

            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-sand-50 border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <Calendar className="w-3 h-3" />
                    <span>Duration</span>
                  </div>
                  <p className="text-sm font-extrabold text-slate-900">
                    {totalDays > 0 ? `${totalDays} Days` : '—'}
                  </p>
                  {startDate && <p className="text-[10px] text-slate-500">{startDate}</p>}
                </div>

                <div className="p-3 rounded-2xl bg-sand-50 border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <Users className="w-3 h-3" />
                    <span>Travelers</span>
                  </div>
                  <p className="text-sm font-extrabold text-slate-900">
                    {travelers > 0 ? `${travelers} People` : '—'}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-sand-50 border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <Wallet className="w-3 h-3" />
                    <span>Total Budget</span>
                  </div>
                  <p className="text-sm font-extrabold text-slate-900">
                    {budget > 0 ? `₹${budget.toLocaleString()}` : '—'}
                  </p>
                  {travelers > 0 && budget > 0 && (
                    <p className="text-[10px] text-slate-500">₹{Math.round(budget / travelers).toLocaleString()} pp</p>
                  )}
                </div>

                <div className="p-3 rounded-2xl bg-sand-50 border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <Compass className="w-3 h-3" />
                    <span>Vibes</span>
                  </div>
                  <p className="text-sm font-extrabold text-slate-900">
                    {selectedVibes.length > 0 ? `${selectedVibes.length} Selected` : '—'}
                  </p>
                </div>
              </div>

              {/* Selected Vibes */}
              {selectedVibes.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selectedVibes.map((v) => {
                    const vibe = VIBE_OPTIONS.find((o) => o.id === v);
                    return (
                      <span key={v} className="px-2.5 py-0.5 bg-purple-50 text-purple-800 border border-purple-200 rounded-full text-[11px] font-semibold">
                        {vibe?.label}
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Result CTA */}
              {step === 'result' && (
                <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <p className="text-xs font-bold text-emerald-800">Plan generated successfully!</p>
                  </div>
                  <p className="text-[11px] text-emerald-700 leading-relaxed">
                    Your AI-generated {destination} itinerary includes hotel recommendations, day-by-day activities, and a balanced budget breakdown.
                  </p>
                  <Button
                    variant="primary"
                    size="xs"
                    fullWidth
                    onClick={handleUseExistingTrip}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Open in Trip Planner
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Sample Plans */}
          {step === 'destination' && (
            <Card variant="flat" className="p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Trending AI Plan Ideas</h4>
              {[
                { dest: 'Goa', days: 5, budget: '₹25,000', tag: '🏖️ Beach & Party' },
                { dest: 'Rajasthan', days: 8, budget: '₹45,000', tag: '🏰 Heritage Circuit' },
                { dest: 'Ladakh', days: 9, budget: '₹78,500', tag: '🏔️ High Mountain Adventure' },
              ].map((plan) => (
                <div key={plan.dest} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 text-xs hover:border-purple-300 transition-colors cursor-pointer"
                  onClick={() => { setDestination(plan.dest); setTimeout(handleDestinationSubmit, 100); }}>
                  <div>
                    <p className="font-bold text-slate-900">{plan.dest} • {plan.days} Days</p>
                    <p className="text-slate-500">{plan.tag}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-slate-900">{plan.budget}</p>
                    <Badge variant="ai" size="xs">Try This</Badge>
                  </div>
                </div>
              ))}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
