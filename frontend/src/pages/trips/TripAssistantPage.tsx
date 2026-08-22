import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Send,
  CheckCircle2,
  XCircle,
  Loader2,
  Plus,
  Minus,
  RefreshCw,
  ArrowRight,
  TrendingDown,
  Calendar,
  Hotel,
  Footprints,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useTrip } from '@/context/TripContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

interface AISuggestion {
  id: string;
  type: 'swap_hotel' | 'remove_activity' | 'add_activity' | 'reschedule' | 'budget_cut';
  title: string;
  description: string;
  budgetImpact: number; // negative = saves money, positive = adds cost
  currency: string;
  applied: boolean;
  dismissed: boolean;
}

interface AssistantMessage {
  id: string;
  role: 'ai' | 'user';
  text: string;
  suggestions?: AISuggestion[];
}

const PROMPT_CHIPS = [
  { label: '💰 Make it cheaper', query: 'How can I reduce costs?' },
  { label: '🏖️ Add more beach time', query: 'Add beach activities to my schedule' },
  { label: '😌 Relax Day 3', query: 'Make Day 3 a rest day' },
  { label: '⭐ Upgrade stays', query: 'Recommend better hotels for my budget' },
  { label: '🍜 Best food spots', query: 'Add top rated restaurants to my itinerary' },
  { label: '📸 More photo spots', query: 'Add scenic photography locations' },
];

export const TripAssistantPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { trips, updateTrip, selectTrip, activeTrip } = useTrip();
  const { user } = useAuth();
  const { success, info } = useToast();

  const currentTrip = trips.find((t) => t.id === tripId) || activeTrip || trips[0];

  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'welcome',
      role: 'ai',
      text: `Hi! I'm your GlobeTrotter AI Co-Pilot for **${currentTrip?.title || 'your trip'}** ✨. I've analyzed your itinerary and I have some optimization suggestions. Ask me anything or try one of the quick prompts below!`,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tripId) selectTrip(tripId);
  }, [tripId, selectTrip]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!currentTrip) return null;

  const generateSuggestions = (query: string): AISuggestion[] => {
    const isAboutCost = query.toLowerCase().includes('cheap') || query.toLowerCase().includes('cost') || query.toLowerCase().includes('budget');
    const isAboutRelax = query.toLowerCase().includes('relax') || query.toLowerCase().includes('rest');
    const isAboutFood = query.toLowerCase().includes('food') || query.toLowerCase().includes('restaurant');
    const isAboutStay = query.toLowerCase().includes('hotel') || query.toLowerCase().includes('stay') || query.toLowerCase().includes('upgrade');

    if (isAboutCost) {
      return [
        {
          id: 'sug-1',
          type: 'swap_hotel',
          title: 'Switch to a 3★ Boutique Stay',
          description: 'Swap your current hotel to a well-rated 3-star guesthouse. Same location, great reviews, much lower price.',
          budgetImpact: -4200,
          currency: currentTrip.budget.currency,
          applied: false,
          dismissed: false,
        },
        {
          id: 'sug-2',
          type: 'remove_activity',
          title: 'Remove Overpriced Guided Tour',
          description: 'The private guided tour on Day 2 can be done independently for free using audio guides.',
          budgetImpact: -2800,
          currency: currentTrip.budget.currency,
          applied: false,
          dismissed: false,
        },
      ];
    }

    if (isAboutRelax) {
      return [
        {
          id: 'sug-3',
          type: 'reschedule',
          title: 'Convert Day 3 to Free Time',
          description: 'Remove all scheduled activities from Day 3 and add a "Leisure & Exploration" block instead.',
          budgetImpact: -1500,
          currency: currentTrip.budget.currency,
          applied: false,
          dismissed: false,
        },
      ];
    }

    if (isAboutFood) {
      return [
        {
          id: 'sug-4',
          type: 'add_activity',
          title: 'Add Sunset Seafood Dinner (Day 2, 19:00)',
          description: 'Top-rated beachside seafood restaurant. 4.8★ on Google. Advance booking recommended.',
          budgetImpact: 1800,
          currency: currentTrip.budget.currency,
          applied: false,
          dismissed: false,
        },
        {
          id: 'sug-5',
          type: 'add_activity',
          title: 'Local Street Food Walk (Day 1, 12:00)',
          description: 'Guided local street food experience covering 8 signature dishes. Best value food tour in the city.',
          budgetImpact: 800,
          currency: currentTrip.budget.currency,
          applied: false,
          dismissed: false,
        },
      ];
    }

    return [
      {
        id: 'sug-6',
        type: 'budget_cut',
        title: 'Optimize Transport Costs',
        description: 'Taking local transport instead of private cabs between 3 stops can save significant money.',
        budgetImpact: -3200,
        currency: currentTrip.budget.currency,
        applied: false,
        dismissed: false,
      },
    ];
  };

  const generateAIResponse = (query: string): string => {
    const lower = query.toLowerCase();
    if (lower.includes('cheap') || lower.includes('cost') || lower.includes('budget')) {
      return `Great question! I've analyzed your **${currentTrip.title}** budget and found **2 key optimizations** that can save you up to ₹7,000 without compromising on experience. Here are my recommendations:`;
    }
    if (lower.includes('relax') || lower.includes('rest')) {
      return `I can definitely help you build in more downtime! Looking at your Day 3, I suggest removing the packed morning schedule and replacing it with a **free leisure block**. This will save some budget too!`;
    }
    if (lower.includes('food') || lower.includes('restaurant')) {
      return `Your trip is missing some amazing culinary experiences! I've found **2 must-visit food spots** in ${currentTrip.cities[0]?.cityName || 'your destination'} that perfectly match your vibe and budget. Check them out:`;
    }
    if (lower.includes('hotel') || lower.includes('stay') || lower.includes('upgrade')) {
      return `I've reviewed the hotel options for your trip. Based on your travel style and remaining budget, here's what I recommend for your stays:`;
    }
    return `That's a great question about your **${currentTrip.title}** trip! Based on your current itinerary, here's what I suggest to make it even better:`;
  };

  const handleSend = async (query?: string) => {
    const text = query || inputText.trim();
    if (!text) return;

    setInputText('');
    setMessages((prev) => [...prev, { id: Math.random().toString(36).substring(2), role: 'user', text }]);
    setIsThinking(true);

    await new Promise((res) => setTimeout(res, 1200));

    const suggestions = generateSuggestions(text);
    const aiText = generateAIResponse(text);

    setMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2),
        role: 'ai',
        text: aiText,
        suggestions: suggestions.length > 0 ? suggestions : undefined,
      },
    ]);

    setIsThinking(false);
  };

  const handleApplySuggestion = async (suggestion: AISuggestion) => {
    setAppliedSuggestions((prev) => new Set([...prev, suggestion.id]));

    // Update trip budget to reflect the change
    const impactAmount = suggestion.budgetImpact;
    const newTotal = Math.max(0, (currentTrip.budget.totalEstimatedCost || 0) + impactAmount);

    await updateTrip(currentTrip.id, {
      budget: {
        ...currentTrip.budget,
        totalEstimatedCost: newTotal,
      },
    });

    success(
      'Change Applied!',
      `"${suggestion.title}" applied. Budget ${impactAmount < 0 ? 'reduced' : 'updated'} by ${suggestion.currency === 'INR' ? '₹' : '$'}${Math.abs(impactAmount).toLocaleString()}.`
    );
  };

  return (
    <div className="animate-fade-in max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200/80 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
            In-Trip AI Co-Pilot
          </h1>
          <Badge variant="ai" size="xs">Active</Badge>
        </div>
        <p className="text-xs text-slate-500">
          Optimize your <strong>{currentTrip.title}</strong> itinerary in real-time. Ask to cut costs, swap hotels, or reshape any day.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Chat */}
        <div className="lg:col-span-8 flex flex-col h-[640px]">
          <div className="flex-1 overflow-y-auto space-y-4 p-1 scrollbar-thin mb-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {msg.role === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-terracotta-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="space-y-3 max-w-[88%]">
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'ai'
                      ? 'bg-white border border-slate-200 shadow-2xs text-slate-800 rounded-tl-none'
                      : 'bg-gradient-to-br from-purple-500 to-terracotta-500 text-white rounded-tr-none'
                  }`}>
                    <p dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  </div>

                  {/* Suggestion Diff Cards */}
                  {msg.suggestions?.map((sug) => {
                    const isApplied = appliedSuggestions.has(sug.id);
                    return (
                      <div key={sug.id} className={`border rounded-2xl overflow-hidden transition-all ${isApplied ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-white shadow-2xs'}`}>
                        <div className="p-4 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-1.5 mb-1">
                                {isApplied ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                ) : (
                                  <Zap className="w-4 h-4 text-purple-500 shrink-0" />
                                )}
                                <span className="text-sm font-bold text-slate-900">{sug.title}</span>
                              </div>
                              <p className="text-xs text-slate-500 leading-relaxed">{sug.description}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <span className={`text-sm font-extrabold ${sug.budgetImpact < 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                {sug.budgetImpact < 0 ? '−' : '+'}{sug.currency === 'INR' ? '₹' : '$'}{Math.abs(sug.budgetImpact).toLocaleString()}
                              </span>
                              <p className="text-[10px] text-slate-400">budget impact</p>
                            </div>
                          </div>

                          {!isApplied && (
                            <div className="flex gap-2 pt-1">
                              <Button
                                variant="primary"
                                size="xs"
                                onClick={() => handleApplySuggestion(sug)}
                                leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                              >
                                Apply Change
                              </Button>
                              <Button variant="ghost" size="xs">Dismiss</Button>
                            </div>
                          )}

                          {isApplied && (
                            <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Applied to your trip!
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-terracotta-500 flex items-center justify-center shrink-0">
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                </div>
                <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-2xs text-sm text-slate-500 italic">
                  Analyzing your itinerary...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Prompt Chips */}
          <div className="flex flex-wrap gap-2 mb-3">
            {PROMPT_CHIPS.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => handleSend(chip.query)}
                className="px-3 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-[11px] font-semibold text-purple-800 hover:bg-purple-100 cursor-pointer transition-colors"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`Ask anything about your ${currentTrip.title} trip...`}
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500 bg-white"
            />
            <Button variant="primary" size="sm" onClick={() => handleSend()} leftIcon={<Send className="w-4 h-4" />}>
              Send
            </Button>
          </div>
        </div>

        {/* RIGHT: Trip Summary */}
        <div className="lg:col-span-4 space-y-4">
          <Card variant="default" className="p-5 space-y-4 border-purple-200/50">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-600" />
              Trip Snapshot
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 rounded-xl bg-sand-50 border border-slate-200">
                <span className="text-slate-600 font-medium">Total Days</span>
                <span className="font-bold text-slate-900">{currentTrip.totalDays} days</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-sand-50 border border-slate-200">
                <span className="text-slate-600 font-medium">Events Scheduled</span>
                <span className="font-bold text-slate-900">{currentTrip.itinerary.length} activities</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-sand-50 border border-slate-200">
                <span className="text-slate-600 font-medium">Hotels Booked</span>
                <span className="font-bold text-slate-900">{currentTrip.hotels.length} stays</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-sand-50 border border-slate-200">
                <span className="text-slate-600 font-medium">Estimated Cost</span>
                <span className="font-bold text-slate-900">
                  {currentTrip.budget.currency === 'INR' ? '₹' : '$'}{(currentTrip.budget.totalEstimatedCost || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-sand-50 border border-slate-200">
                <span className="text-slate-600 font-medium">Budget Target</span>
                <span className="font-bold text-slate-900">
                  {currentTrip.budget.currency === 'INR' ? '₹' : '$'}{(currentTrip.budget.targetBudget || 0).toLocaleString()}
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              size="xs"
              fullWidth
              onClick={() => navigate(`/trips/${currentTrip.id}/budget`)}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Full Budget Breakdown
            </Button>
          </Card>

          <Card variant="flat" className="p-4 space-y-2">
            <h4 className="text-xs font-bold text-slate-700">Quick Actions</h4>
            <Button variant="outline" size="xs" fullWidth onClick={() => navigate(`/trips/${currentTrip.id}/builder`)} leftIcon={<Calendar className="w-3.5 h-3.5" />}>
              Open Itinerary Builder
            </Button>
            <Button variant="outline" size="xs" fullWidth onClick={() => navigate(`/trips/${currentTrip.id}/hotels`)} leftIcon={<Hotel className="w-3.5 h-3.5" />}>
              Find Better Hotels
            </Button>
            <Button variant="outline" size="xs" fullWidth onClick={() => navigate(`/trips/${currentTrip.id}/activities`)} leftIcon={<Footprints className="w-3.5 h-3.5" />}>
              Add Activities
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
