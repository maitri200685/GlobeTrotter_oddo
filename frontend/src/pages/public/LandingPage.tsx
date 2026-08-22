import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  ArrowRight,
  Compass,
  Clock,
  PieChart,
  Calendar,
  Star,
  Heart,
  ChevronLeft,
  ChevronRight,
  Search,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

/* ─── Data ────────────────────────────────────────────────────── */

const heroSlides = [
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    image:
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1920&q=85',
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    country: 'India',
    image:
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1920&q=85',
  },
  {
    id: 'swiss-alps',
    name: 'Swiss Alps',
    country: 'Switzerland',
    image:
      'https://images.unsplash.com/photo-1531210483974-4f8c1f33fd35?auto=format&fit=crop&w=1920&q=85',
  },
  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    image:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1920&q=85',
  },
];

const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    context: 'Traveling across Italy',
    stars: 5,
    text: 'Planning our Italy trip used to mean spreadsheets, tabs and endless notes. GlobeTrotter gave us one clear itinerary and made the whole process so much easier.',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80',
  },
  {
    id: 2,
    name: 'Aarav Mehta',
    context: 'Solo trip through Rajasthan',
    stars: 5,
    text: 'I had 10 days and no real plan. Told GlobeTrotter what I wanted and it built me a full Rajasthan itinerary. The budget tracker kept me from overspending every single day.',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80',
  },
  {
    id: 3,
    name: 'Elena Rostova',
    context: 'Kyoto & Tokyo in 12 days',
    stars: 5,
    text: 'The day-by-day timeline view is the best feature. Seeing my full Japan trip across one calendar gave me total confidence. Nothing was missed.',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&h=80&q=80',
  },
  {
    id: 4,
    name: 'Marcus & Leila',
    context: 'Honeymoon in Bali & Singapore',
    stars: 5,
    text: 'We planned our entire honeymoon in an afternoon. Hotels, activities, transport — all in one place. No more switching between fifteen browser tabs.',
    avatar:
      'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?auto=format&fit=crop&w=80&h=80&q=80',
  },
];

const featuredDestinations = [
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    image:
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&h=400&q=80',
    tagline: 'World-class art, historic boulevards & gastronomy',
  },
  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    image:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&h=400&q=80',
    tagline: 'Spiritual temples, emerald rice terraces & surf coastlines',
  },
  {
    id: 'kyoto',
    name: 'Kyoto',
    country: 'Japan',
    image:
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&h=400&q=80',
    tagline: 'Ancient shrines, bamboo groves & traditional tea culture',
  },
  {
    id: 'swiss-alps',
    name: 'Swiss Alps',
    country: 'Switzerland',
    image:
      'https://images.unsplash.com/photo-1531210483974-4f8c1f33fd35?auto=format&fit=crop&w=600&h=400&q=80',
    tagline: 'Snow-capped peaks, alpine villages & pristine lakes',
  },
  {
    id: 'santorini',
    name: 'Santorini',
    country: 'Greece',
    image:
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&h=400&q=80',
    tagline: 'Clifftop views, blue-domed villages & island sunsets',
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'UAE',
    image:
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&h=400&q=80',
    tagline: 'Futuristic skyline, desert dunes & luxury experiences',
  },
];

const communityTrips = [
  {
    id: 1,
    title: '7 Days in Japan',
    destinations: ['Tokyo', 'Kyoto', 'Osaka'],
    duration: '7 days',
    stops: 3,
    budget: '$2,100',
    image:
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=500&h=280&q=80',
  },
  {
    id: 2,
    title: 'Weekend in Paris',
    destinations: ['Paris'],
    duration: '3 days',
    stops: 1,
    budget: '$850',
    image:
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=500&h=280&q=80',
  },
  {
    id: 3,
    title: '10 Days Across Italy',
    destinations: ['Rome', 'Florence', 'Venice'],
    duration: '10 days',
    stops: 3,
    budget: '$2,400',
    image:
      'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=500&h=280&q=80',
  },
];

/* ─── Component ───────────────────────────────────────────────── */

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { toggleSavedDestination, user } = useAuth();

  /* Hero slideshow */
  const [activeSlide, setActiveSlide] = useState(0);
  const slideTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetSlideTimer = useCallback(() => {
    if (slideTimerRef.current) clearInterval(slideTimerRef.current);
    slideTimerRef.current = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % heroSlides.length);
    }, 3200);
  }, []);

  useEffect(() => {
    resetSlideTimer();
    return () => { if (slideTimerRef.current) clearInterval(slideTimerRef.current); };
  }, [resetSlideTimer]);

  const goToSlide = (index: number) => {
    setActiveSlide(index);
    resetSlideTimer();
  };

  /* Testimonial carousel */
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const testimonialTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetTestimonialTimer = useCallback(() => {
    if (testimonialTimerRef.current) clearInterval(testimonialTimerRef.current);
    testimonialTimerRef.current = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
  }, []);

  useEffect(() => {
    resetTestimonialTimer();
    return () => { if (testimonialTimerRef.current) clearInterval(testimonialTimerRef.current); };
  }, [resetTestimonialTimer]);

  const goToTestimonial = (index: number) => {
    setActiveTestimonial(index);
    resetTestimonialTimer();
  };

  /* Scroll reveal via IntersectionObserver */
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('lp-revealed');
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.lp-reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* ─── Render ─────────────────────────────────────────────── */
  return (
    /* Negative margins cancel AppLayout's max-w-7xl padding + py-6 */
    <div className="-mt-6 -mx-4 sm:-mx-6 lg:-mx-8 overflow-x-hidden">

      {/* ══════════════════════════════════════════
          1. HERO — Cinematic Destination Slideshow
      ══════════════════════════════════════════ */}
      <section
        id="homepage-hero"
        className="lp-fullbleed relative"
        style={{ height: 'min(92vh, 900px)', minHeight: '580px' }}
        aria-label="Hero"
      >
        {/* Slide images */}
        {heroSlides.map((slide, i) => (
          <div
            key={slide.id}
            className={`hero-slide ${i === activeSlide ? 'hero-slide-active' : ''}`}
            aria-hidden={i !== activeSlide}
          >
            <img src={slide.image} alt={slide.name} className="hero-img" loading={i === 0 ? 'eager' : 'lazy'} />
          </div>
        ))}

        {/* Gradient — subtle, image stays dominant */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent pointer-events-none" />

        {/* Hero content */}
        <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto w-full">
          <div className="max-w-2xl">
            <p className="hero-eyebrow text-xs sm:text-sm font-bold tracking-[0.22em] uppercase text-amber-300 mb-5">
              Plan · Explore · Experience
            </p>

            <h1 className="hero-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.06] tracking-tight font-display mb-6">
              Your journey,
              <br />
              <span className="text-amber-300">planned your way.</span>
            </h1>

            <p className="hero-subtext text-base sm:text-lg text-white/85 max-w-xl leading-relaxed mb-10">
              Plan multi-city trips, discover places to stay and things to do, manage your budget,
              and build your complete journey — all in one place.
            </p>

            <div className="hero-ctas flex flex-col sm:flex-row gap-3 mb-10">
              <button
                id="hero-plan-my-trip-btn"
                onClick={() => navigate('/plan')}
                className="inline-flex items-center justify-center gap-2 bg-terracotta-500 hover:bg-terracotta-600 text-white px-8 py-4 rounded-full text-sm font-bold shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
              >
                Plan My Trip
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                id="hero-explore-trips-btn"
                onClick={() => navigate('/explore')}
                className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 border border-white/40 text-white px-8 py-4 rounded-full text-sm font-bold backdrop-blur-sm transition-all duration-200"
              >
                Explore Trips
              </button>
            </div>

            {/* Destination indicators */}
            <div className="hero-indicators flex items-center gap-2 flex-wrap">
              {heroSlides.map((slide, i) => (
                <button
                  key={slide.id}
                  id={`hero-indicator-${slide.id}`}
                  onClick={() => goToSlide(i)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${
                    i === activeSlide
                      ? 'bg-white text-slate-900 shadow-md'
                      : 'bg-white/15 text-white/80 hover:bg-white/25 border border-white/20'
                  }`}
                  aria-label={`View ${slide.name}, ${slide.country}`}
                  aria-pressed={i === activeSlide}
                >
                  <MapPin className="w-3 h-3 shrink-0" />
                  {slide.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          2. WHY GLOBETROTTER — Value Props
      ══════════════════════════════════════════ */}
      <section id="why-globetrotter" className="lp-reveal py-20 sm:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest uppercase text-terracotta-500 mb-3">
              Why GlobeTrotter
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display leading-tight">
              Everything you need for a better trip
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="group p-7 rounded-2xl border border-slate-100 bg-white hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-terracotta-50 border border-terracotta-100 flex items-center justify-center text-terracotta-600 mb-5 group-hover:bg-terracotta-100 transition-colors">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Plan Your Route</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Build multi-city journeys and organize every stop in one place.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group p-7 rounded-2xl border border-slate-100 bg-white hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 mb-5 group-hover:bg-teal-100 transition-colors">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Discover More</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Find destinations, hotels and activities that fit your trip and style.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group p-7 rounded-2xl border border-slate-100 bg-white hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-5 group-hover:bg-amber-100 transition-colors">
                <PieChart className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Stay on Budget</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                See estimated costs and understand exactly where your money goes.
              </p>
            </div>

            {/* Card 4 */}
            <div className="group p-7 rounded-2xl border border-slate-100 bg-white hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 mb-5 group-hover:bg-sky-100 transition-colors">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Travel With a Plan</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Turn your ideas into a clear, shareable day-by-day itinerary.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          3. HOW IT WORKS — 4 Steps
      ══════════════════════════════════════════ */}
      <section id="how-it-works" className="lp-reveal py-20 sm:py-28 bg-[#FAF9F6]">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-widest uppercase text-terracotta-500 mb-3">
              Simple Process
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
              How it works
            </h2>
          </div>

          <div className="relative">
            {/* Connector line — desktop only */}
            <div
              className="hidden lg:block absolute h-px bg-gradient-to-r from-terracotta-200 via-amber-200 to-terracotta-200"
              style={{ top: '2rem', left: '12.5%', right: '12.5%' }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
              {[
                {
                  num: '01',
                  title: 'Tell us where you want to go',
                  desc: 'Enter your destination, travel dates, and style.',
                },
                {
                  num: '02',
                  title: 'Customize your trip',
                  desc: 'Adjust stops, accommodation and your budget.',
                },
                {
                  num: '03',
                  title: 'Build your itinerary',
                  desc: 'Get a day-by-day plan with activities, hotels and transport.',
                },
                {
                  num: '04',
                  title: 'Travel with confidence',
                  desc: 'Your complete journey, organized and ready to go.',
                },
              ].map(({ num, title, desc }) => (
                <div key={num} className="flex flex-col items-center text-center">
                  <div className="relative z-10 w-16 h-16 rounded-full bg-white border-2 border-terracotta-200 flex items-center justify-center mb-5 shadow-sm">
                    <span className="text-xl font-black text-terracotta-500 font-display">{num}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2 max-w-[160px]">{title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-[160px]">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          4. AI PLANNER PREVIEW
      ══════════════════════════════════════════ */}
      <section id="ai-planner-preview" className="lp-reveal py-20 sm:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

            {/* Left: Copy */}
            <div className="space-y-6">
              <p className="text-xs font-bold tracking-widest uppercase text-terracotta-500">
                AI Travel Planner
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display leading-tight">
                Tell us what kind of trip you're dreaming about.
              </h2>
              <p className="text-slate-500 leading-relaxed text-sm sm:text-base">
                Share your destination, dates, budget and travel style. GlobeTrotter turns
                your ideas into a complete, ready-to-follow journey.
              </p>

              <div className="bg-[#FAF9F6] rounded-2xl p-5 border border-slate-200">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Example prompt
                </p>
                <p className="text-sm text-slate-700 italic leading-relaxed">
                  "I have 7 days in Italy. I want Rome, Florence and Venice — good food,
                  comfortable hotels and a moderate budget."
                </p>
              </div>

              <button
                id="ai-planner-build-trip-btn"
                onClick={() => navigate('/plan')}
                className="inline-flex items-center gap-2 bg-terracotta-500 hover:bg-terracotta-600 text-white px-8 py-4 rounded-full text-sm font-bold shadow-md transition-all duration-200 hover:scale-105"
              >
                Build My Trip
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right: Mock itinerary */}
            <div className="bg-[#FAF9F6] rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Italy Trip</p>
                  <p className="text-lg font-extrabold text-slate-900 font-display">7 Days · 3 Cities</p>
                </div>
                <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-200">
                  €2,100 est.
                </span>
              </div>

              {/* Route */}
              <div className="flex items-center gap-2 flex-wrap text-sm font-semibold text-slate-700">
                {(['Rome', 'Florence', 'Venice'] as const).map((city, i) => (
                  <React.Fragment key={city}>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-terracotta-500" />
                      {city}
                    </span>
                    {i < 2 && <ArrowRight className="w-3 h-3 text-slate-300" />}
                  </React.Fragment>
                ))}
              </div>

              {/* Summary cards */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Hotel', value: 'Boutique 4★', sub: '€140/night', colorClass: 'text-amber-600' },
                  { label: 'Activities', value: '14 curated', sub: 'per city', colorClass: 'text-teal-600' },
                  { label: 'Transport', value: 'Train passes', sub: 'Rome → Venice', colorClass: 'text-sky-600' },
                  { label: 'Budget', value: '€300/day', sub: 'est. total', colorClass: 'text-terracotta-600' },
                ].map(({ label, value, sub, colorClass }) => (
                  <div key={label} className="bg-white rounded-xl p-3.5 border border-slate-100">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">{label}</p>
                    <p className={`text-sm font-bold ${colorClass}`}>{value}</p>
                    <p className="text-[11px] text-slate-400">{sub}</p>
                  </div>
                ))}
              </div>

              {/* Day 1 mini timeline */}
              <div className="bg-white rounded-xl border border-slate-100 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Day 1 · Rome
                </p>
                <div className="space-y-2.5">
                  {[
                    { time: '09:00', act: 'Colosseum & Roman Forum' },
                    { time: '13:00', act: 'Lunch — Trastevere' },
                    { time: '15:30', act: 'Vatican Museums' },
                    { time: '19:30', act: 'Dinner — Piazza Navona' },
                  ].map(({ time, act }) => (
                    <div key={time} className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-slate-400 w-10 shrink-0">{time}</span>
                      <div className="flex items-center gap-2 flex-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-terracotta-400 shrink-0" />
                        <span className="text-xs text-slate-700">{act}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          5. FEATURED DESTINATIONS
      ══════════════════════════════════════════ */}
      <section id="featured-destinations" className="lp-reveal py-20 sm:py-28 bg-[#FAF9F6]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-terracotta-500 mb-2">
                Destinations
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
                Popular places to explore
              </h2>
            </div>
            <button
              id="featured-view-all-btn"
              onClick={() => navigate('/explore')}
              className="text-sm font-semibold text-terracotta-600 hover:text-terracotta-700 flex items-center gap-1 transition-colors"
            >
              View all <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDestinations.map(dest => {
              const isSaved = user?.savedDestinations?.includes(dest.name);
              return (
                <div
                  key={dest.id}
                  className="group rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                  onClick={() => navigate(`/plan?destination=${encodeURIComponent(dest.name)}`)}
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        if (user) toggleSavedDestination(dest.name);
                        else navigate('/login');
                      }}
                      aria-label={`Save ${dest.name} to wishlist`}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white backdrop-blur-sm text-slate-600 hover:text-terracotta-500 transition-all shadow-sm"
                    >
                      <Heart
                        className={`w-4 h-4 ${isSaved ? 'fill-terracotta-500 text-terracotta-500' : ''}`}
                      />
                    </button>

                    <div className="absolute bottom-3 left-4">
                      <p className="text-xl font-extrabold text-white leading-none">{dest.name}</p>
                      <p className="text-xs text-white/80 mt-0.5">{dest.country}</p>
                    </div>
                  </div>

                  <div className="p-4">
                    <p className="text-sm text-slate-500 leading-relaxed">{dest.tagline}</p>
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-medium">Plan this trip</span>
                      <ArrowRight className="w-4 h-4 text-terracotta-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          6. TRIP PLANNING PREVIEW — "Your journey in one view"
      ══════════════════════════════════════════ */}
      <section id="trip-planning-preview" className="lp-reveal py-20 sm:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest uppercase text-terracotta-500 mb-3">
              What GlobeTrotter looks like
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display leading-tight">
              Your entire journey, in one view
            </h2>
            <p className="text-slate-500 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
              Every trip is organized into a clear day-by-day timeline with accommodation,
              activities and a running cost breakdown.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Day timeline */}
            <div className="lg:col-span-2 bg-[#FAF9F6] rounded-3xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Day 1 of 7</p>
                  <p className="text-lg font-extrabold text-slate-900 font-display">Rome, Italy</p>
                </div>
                <span className="text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-full">
                  Monday, Oct 14
                </span>
              </div>
              <div className="space-y-3">
                {[
                  { time: '09:00', title: 'Colosseum', type: 'Activity', cost: '€18', icon: '🏛️' },
                  { time: '12:30', title: 'Lunch at Roscioli', type: 'Food & Drink', cost: '€32', icon: '🍝' },
                  { time: '14:30', title: 'Check in — Hotel de Russie', type: 'Hotel', cost: '€185', icon: '🏨' },
                  { time: '17:00', title: 'Roman Forum walk', type: 'Activity', cost: 'Free', icon: '🏛️' },
                  { time: '19:30', title: 'Dinner near Pantheon', type: 'Food & Drink', cost: '€55', icon: '🍽️' },
                ].map(({ time, title, type, cost, icon }) => (
                  <div key={time} className="flex items-start gap-4">
                    <div className="w-12 shrink-0 text-right">
                      <span className="text-[11px] font-bold text-slate-400">{time}</span>
                    </div>
                    <div className="flex-1 flex items-center gap-3 bg-white rounded-xl border border-slate-100 p-3.5 hover:border-terracotta-200 transition-colors">
                      <span className="text-lg">{icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900">{title}</p>
                        <p className="text-xs text-slate-400">{type}</p>
                      </div>
                      <span className="text-xs font-bold text-slate-700 shrink-0">{cost}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cost breakdown column */}
            <div className="space-y-4">
              <div className="bg-[#FAF9F6] rounded-3xl border border-slate-200 p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Day 1 Costs
                </p>
                <div className="space-y-3">
                  {[
                    { label: 'Hotel', amount: '€185', pct: 62 },
                    { label: 'Activities', amount: '€18', pct: 6 },
                    { label: 'Food & Drink', amount: '€87', pct: 29 },
                    { label: 'Transport', amount: '€10', pct: 3 },
                  ].map(({ label, amount, pct }) => (
                    <div key={label}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-600 font-medium">{label}</span>
                        <span className="font-bold text-slate-900">{amount}</span>
                      </div>
                      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-terracotta-400 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">Day 1 Total</span>
                  <span className="text-xl font-black text-terracotta-600 font-display">€300</span>
                </div>
              </div>

              <div className="bg-[#FAF9F6] rounded-3xl border border-slate-200 p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  7-Day Total
                </p>
                <p className="text-3xl font-black text-slate-900 font-display">€2,100</p>
                <p className="text-xs text-slate-400 mt-1">per person · moderate budget</p>
                <button
                  id="trip-preview-plan-btn"
                  onClick={() => navigate('/plan')}
                  className="mt-5 w-full bg-terracotta-500 hover:bg-terracotta-600 text-white py-3 rounded-xl text-sm font-bold transition-all duration-200"
                >
                  Plan a trip like this
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          7. COMMUNITY / SHARED TRIPS
      ══════════════════════════════════════════ */}
      <section id="community-trips" className="lp-reveal py-20 sm:py-28 bg-[#FAF9F6]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-terracotta-500 mb-2">
                Inspiration
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
                Get inspired by real trips.
              </h2>
            </div>
            <button
              id="community-explore-btn"
              onClick={() => navigate('/explore')}
              className="text-sm font-semibold text-terracotta-600 hover:text-terracotta-700 flex items-center gap-1 transition-colors"
            >
              Explore all trips <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {communityTrips.map(trip => (
              <div
                key={trip.id}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                onClick={() => navigate('/explore')}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={trip.image}
                    alt={trip.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <p className="text-base font-extrabold text-white">{trip.title}</p>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {trip.duration}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {trip.stops} stops
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 truncate">{trip.destinations.join(' · ')}</span>
                    <span className="text-sm font-bold text-slate-900 shrink-0">{trip.budget}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              id="community-explore-all-btn"
              onClick={() => navigate('/explore')}
              className="inline-flex items-center gap-2 border border-terracotta-300 text-terracotta-700 hover:bg-terracotta-50 px-8 py-3.5 rounded-full text-sm font-bold transition-all duration-200"
            >
              Explore All Trips
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          8. TESTIMONIAL CAROUSEL
      ══════════════════════════════════════════ */}
      <section id="testimonials" className="lp-reveal py-20 sm:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest uppercase text-terracotta-500 mb-3">
              Traveler Stories
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
              What travelers say
            </h2>
          </div>

          {/* Carousel */}
          <div className="relative" style={{ minHeight: '280px' }}>
            {testimonials.map((t, i) => (
              <div
                key={t.id}
                className="testimonial-card"
                style={{
                  opacity: i === activeTestimonial ? 1 : 0,
                  transform: i === activeTestimonial ? 'translateY(0)' : 'translateY(12px)',
                  pointerEvents: i === activeTestimonial ? 'auto' : 'none',
                }}
              >
                {/* Stars */}
                <div className="flex items-center gap-1 mb-7">
                  {Array.from({ length: t.stars }).map((_, si) => (
                    <Star key={si} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-xl sm:text-2xl font-medium text-slate-800 leading-relaxed max-w-2xl italic mb-9">
                  "{t.text}"
                </blockquote>

                {/* Attribution */}
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-terracotta-100"
                  />
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.context}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              id="testimonial-prev-btn"
              onClick={() =>
                goToTestimonial((activeTestimonial - 1 + testimonials.length) % testimonials.length)
              }
              aria-label="Previous testimonial"
              className="w-10 h-10 rounded-full border border-slate-200 hover:border-terracotta-300 hover:bg-terracotta-50 flex items-center justify-center text-slate-500 hover:text-terracotta-600 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  id={`testimonial-dot-${i}`}
                  onClick={() => goToTestimonial(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    i === activeTestimonial
                      ? 'w-7 h-2.5 bg-terracotta-500'
                      : 'w-2.5 h-2.5 bg-slate-200 hover:bg-slate-300'
                  }`}
                />
              ))}
            </div>

            <button
              id="testimonial-next-btn"
              onClick={() => goToTestimonial((activeTestimonial + 1) % testimonials.length)}
              aria-label="Next testimonial"
              className="w-10 h-10 rounded-full border border-slate-200 hover:border-terracotta-300 hover:bg-terracotta-50 flex items-center justify-center text-slate-500 hover:text-terracotta-600 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          9. WHAT IS GLOBETROTTER — Above footer
      ══════════════════════════════════════════ */}
      <section id="what-is-globetrotter" className="lp-reveal py-20 sm:py-28 bg-[#FAF9F6] border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
            What is GlobeTrotter?
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            GlobeTrotter is a personalized travel planning platform that helps you turn a travel
            idea into a complete journey. Discover destinations, organize multi-city stops, find
            activities and stays, plan your days, and keep track of your budget — all in one place.
          </p>
          <p className="text-sm text-slate-400">
            From the first idea to the final itinerary, plan your trip with clarity.
          </p>
          <button
            id="what-is-gt-start-planning-btn"
            onClick={() => navigate('/plan')}
            className="inline-flex items-center gap-2 bg-terracotta-500 hover:bg-terracotta-600 text-white px-10 py-4 rounded-full text-sm font-bold shadow-md transition-all duration-200 hover:scale-105"
          >
            Start Planning
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          10. FINAL CTA BAND
      ══════════════════════════════════════════ */}
      <section
        id="final-cta"
        className="lp-reveal py-16 sm:py-20"
        style={{ background: 'linear-gradient(135deg, #C94331 0%, #E05A47 50%, #D97706 100%)' }}
      >
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center space-y-5">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            Your next journey starts here.
          </h2>
          <p className="text-white/85 text-base max-w-md mx-auto">
            Tell us where you're going. We'll help you figure out the rest.
          </p>
          <button
            id="final-cta-plan-btn"
            onClick={() => navigate('/plan')}
            className="inline-flex items-center gap-2 bg-white text-terracotta-700 hover:bg-sand-50 px-10 py-4 rounded-full text-sm font-bold shadow-xl transition-all duration-200 hover:scale-105"
          >
            Plan My Trip
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          11. FOOTER — Large Illustrated Travel Scene
      ══════════════════════════════════════════ */}
      <footer id="site-footer" className="bg-terracotta-800">
        {/* ─ Large SVG Travel Illustration ─ */}
        <div className="w-full overflow-hidden leading-none">
          <svg
            viewBox="0 0 1440 340"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto block"
            aria-hidden="true"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="ftSky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#B5442A" />
                <stop offset="100%" stopColor="#8A2C21" />
              </linearGradient>
              <linearGradient id="ftGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Sky background */}
            <rect width="1440" height="340" fill="url(#ftSky)" />

            {/* Sun glow */}
            <circle cx="1280" cy="65" r="60" fill="url(#ftGlow)" />
            <circle cx="1280" cy="65" r="38" fill="#FBBF24" opacity="0.92" />
            <circle cx="1280" cy="65" r="50" fill="#FCD34D" opacity="0.18" />

            {/* Far mountain range */}
            <path
              d="M0,215 L80,145 L145,175 L230,100 L310,145 L390,115 L465,150 L545,85 L620,135 L700,100 L775,145 L855,82 L930,135 L1010,100 L1085,145 L1165,88 L1240,140 L1315,105 L1380,145 L1440,115 L1440,340 L0,340 Z"
              fill="#7A2419"
              opacity="0.75"
            />

            {/* Mid mountain range */}
            <path
              d="M0,255 L70,200 L140,220 L215,170 L290,205 L365,175 L440,210 L515,170 L590,205 L665,175 L740,215 L815,170 L890,210 L965,178 L1040,215 L1115,175 L1190,210 L1265,178 L1340,210 L1440,185 L1440,340 L0,340 Z"
              fill="#6B1E12"
            />

            {/* Ground / earth */}
            <path
              d="M0,295 Q180,280 360,290 Q540,300 720,288 Q900,276 1080,292 Q1260,308 1440,290 L1440,340 L0,340 Z"
              fill="#5A1A0E"
            />

            {/* Scattered stars */}
            <g fill="#FFF5F2" opacity="0.28">
              {[450,68,520,45,490,82,760,38,800,52,825,28,960,55,1010,30,1050,68].map((v, i) =>
                i % 2 === 0 ? null : (
                  <circle key={i} cx={[450,520,490,760,800,825,960,1010,1050][Math.floor(i/2)]} cy={v} r={i % 4 === 1 ? 1.5 : 1} />
                )
              )}
              <circle cx="450" cy="68" r="1.5" />
              <circle cx="520" cy="45" r="1" />
              <circle cx="490" cy="82" r="1" />
              <circle cx="760" cy="38" r="1.5" />
              <circle cx="800" cy="52" r="1" />
              <circle cx="825" cy="28" r="1.5" />
              <circle cx="960" cy="55" r="1" />
              <circle cx="1010" cy="30" r="1.5" />
              <circle cx="1050" cy="68" r="1" />
              <circle cx="340" cy="42" r="1" />
              <circle cx="620" cy="60" r="1" />
              <circle cx="1160" cy="42" r="1.5" />
            </g>

            {/* ── AIRPLANE (main, left-center) ── */}
            <g transform="translate(190,52) rotate(-7)">
              <ellipse cx="32" cy="9" rx="33" ry="7" fill="#FFF5F2" opacity="0.92" />
              <polygon points="32,2 60,9 32,16" fill="#FFD0C7" opacity="0.85" />
              <polygon points="12,2 -2,-12 22,2" fill="#FFF5F2" opacity="0.9" />
              <polygon points="12,16 -2,28 22,16" fill="#FFF5F2" opacity="0.9" />
              <polygon points="30,2 24,-5 36,2" fill="#FFF5F2" opacity="0.85" />
              <ellipse cx="50" cy="9" rx="4" ry="2.5" fill="#FFD0C7" opacity="0.7" />
            </g>

            {/* ── AIRPLANE (small, far right) ── */}
            <g transform="translate(1095,48) rotate(-5) scale(0.58)">
              <ellipse cx="32" cy="9" rx="33" ry="7" fill="#FFF5F2" opacity="0.65" />
              <polygon points="32,2 60,9 32,16" fill="#FFD0C7" opacity="0.6" />
              <polygon points="12,2 -2,-12 22,2" fill="#FFF5F2" opacity="0.65" />
              <polygon points="12,16 -2,28 22,16" fill="#FFF5F2" opacity="0.65" />
            </g>

            {/* ── HOT AIR BALLOON 1 (terracotta+amber) ── */}
            <g transform="translate(590,22)">
              <ellipse cx="28" cy="34" rx="28" ry="38" fill="#F37562" opacity="0.92" />
              {/* Stripe overlay */}
              <path d="M5,34 Q28,18 51,34" stroke="#FFF5F2" strokeWidth="1.2" fill="none" opacity="0.55" />
              <path d="M5,44 Q28,28 51,44" stroke="#FFF5F2" strokeWidth="1.2" fill="none" opacity="0.55" />
              <path d="M28,-4 L28,72" stroke="#FFF5F2" strokeWidth="1" fill="none" opacity="0.3" />
              {/* Vertical panel lines */}
              <path d="M10,5 Q28,72 10,72" stroke="#E05A47" strokeWidth="1" fill="none" opacity="0.3" />
              <path d="M46,5 Q28,72 46,72" stroke="#E05A47" strokeWidth="1" fill="none" opacity="0.3" />
              {/* Basket */}
              <rect x="19" y="70" width="18" height="12" rx="3" fill="#E8C170" opacity="0.9" />
              <line x1="19" y1="70" x2="10" y2="75" stroke="#C9A557" strokeWidth="1.5" />
              <line x1="37" y1="70" x2="46" y2="75" stroke="#C9A557" strokeWidth="1.5" />
              <line x1="23" y1="70" x2="20" y2="75" stroke="#C9A557" strokeWidth="1" opacity="0.7" />
              <line x1="33" y1="70" x2="36" y2="75" stroke="#C9A557" strokeWidth="1" opacity="0.7" />
            </g>

            {/* ── HOT AIR BALLOON 2 (amber+cream) ── */}
            <g transform="translate(888,18)">
              <ellipse cx="22" cy="27" rx="22" ry="30" fill="#FBBF24" opacity="0.85" />
              <path d="M4,27 Q22,14 40,27" stroke="#FFF5F2" strokeWidth="1" fill="none" opacity="0.5" />
              <path d="M4,36 Q22,23 40,36" stroke="#FFF5F2" strokeWidth="1" fill="none" opacity="0.5" />
              <path d="M22,-3 L22,57" stroke="#FFF5F2" strokeWidth="1" fill="none" opacity="0.3" />
              <rect x="14" y="55" width="16" height="10" rx="2" fill="#E8C170" opacity="0.85" />
              <line x1="14" y1="55" x2="8" y2="59" stroke="#C9A557" strokeWidth="1.2" />
              <line x1="30" y1="55" x2="36" y2="59" stroke="#C9A557" strokeWidth="1.2" />
            </g>

            {/* ── BIRDS ── */}
            <g stroke="#FFF5F2" strokeWidth="1.4" fill="none" opacity="0.45">
              <path d="M330,90 Q336,84 342,90" />
              <path d="M348,85 Q354,79 360,85" />
              <path d="M365,94 Q371,88 377,94" />
              <path d="M730,52 Q736,46 742,52" />
              <path d="M750,58 Q756,52 762,58" />
              <path d="M1140,38 Q1146,32 1152,38" />
              <path d="M1160,44 Q1166,38 1172,44" />
            </g>

            {/* ── PALM TREE LEFT ── */}
            <g transform="translate(44,200)">
              <rect x="9" y="38" width="9" height="58" rx="4" fill="#4A1A0A" />
              <ellipse cx="13" cy="38" rx="22" ry="9" fill="#2D7A4F" opacity="0.9" transform="rotate(-22,13,38)" />
              <ellipse cx="13" cy="34" rx="19" ry="8" fill="#3D8A5A" opacity="0.85" transform="rotate(14,13,34)" />
              <ellipse cx="13" cy="30" rx="17" ry="7" fill="#2D7A4F" opacity="0.9" transform="rotate(-38,13,30)" />
              <ellipse cx="13" cy="36" rx="18" ry="7" fill="#3D8A5A" opacity="0.8" transform="rotate(32,13,36)" />
            </g>
            <g transform="translate(82,212)">
              <rect x="6" y="25" width="7" height="44" rx="3" fill="#4A1A0A" />
              <ellipse cx="9" cy="25" rx="16" ry="7" fill="#3D8A5A" opacity="0.8" transform="rotate(-16,9,25)" />
              <ellipse cx="9" cy="22" rx="14" ry="6" fill="#2D7A4F" opacity="0.75" transform="rotate(22,9,22)" />
            </g>

            {/* ── PALM TREE RIGHT ── */}
            <g transform="translate(1350,205)">
              <rect x="9" y="35" width="9" height="52" rx="4" fill="#4A1A0A" />
              <ellipse cx="13" cy="35" rx="22" ry="9" fill="#2D7A4F" opacity="0.9" transform="rotate(22,13,35)" />
              <ellipse cx="13" cy="31" rx="19" ry="8" fill="#3D8A5A" opacity="0.85" transform="rotate(-12,13,31)" />
              <ellipse cx="13" cy="28" rx="17" ry="7" fill="#2D7A4F" opacity="0.9" transform="rotate(35,13,28)" />
            </g>
            <g transform="translate(1395,220)">
              <rect x="5" y="20" width="7" height="38" rx="3" fill="#4A1A0A" />
              <ellipse cx="8" cy="20" rx="14" ry="6" fill="#3D8A5A" opacity="0.75" transform="rotate(-18,8,20)" />
              <ellipse cx="8" cy="17" rx="12" ry="5" fill="#2D7A4F" opacity="0.7" transform="rotate(20,8,17)" />
            </g>

            {/* ── GLOBE ── */}
            <g transform="translate(700,172)">
              <circle cx="22" cy="22" r="22" fill="none" stroke="#FFF5F2" strokeWidth="1.8" opacity="0.62" />
              <ellipse cx="22" cy="22" rx="11" ry="22" fill="none" stroke="#FFF5F2" strokeWidth="1.1" opacity="0.42" />
              <line x1="0" y1="22" x2="44" y2="22" stroke="#FFF5F2" strokeWidth="1.1" opacity="0.42" />
              <path d="M3,13 Q22,9 41,13" stroke="#FFF5F2" strokeWidth="1" fill="none" opacity="0.38" />
              <path d="M3,31 Q22,35 41,31" stroke="#FFF5F2" strokeWidth="1" fill="none" opacity="0.38" />
              {/* Tiny location dot */}
              <circle cx="30" cy="18" r="2.5" fill="#FBBF24" opacity="0.8" />
            </g>

            {/* ── COMPASS ── */}
            <g transform="translate(375,178)">
              <circle cx="20" cy="20" r="20" fill="none" stroke="#FFF5F2" strokeWidth="1.8" opacity="0.6" />
              <circle cx="20" cy="20" r="15" fill="none" stroke="#FFF5F2" strokeWidth="0.7" opacity="0.3" />
              {/* N label */}
              <text x="17" y="8" fontSize="6" fill="#FFF5F2" opacity="0.5" fontWeight="bold">N</text>
              <polygon points="20,6 23,20 20,18 17,20" fill="#F37562" opacity="0.85" />
              <polygon points="20,34 23,20 20,22 17,20" fill="#FFF5F2" opacity="0.6" />
              <circle cx="20" cy="20" r="2.5" fill="#FFF5F2" opacity="0.85" />
            </g>

            {/* ── CAMERA ── */}
            <g transform="translate(248,198)">
              <rect x="0" y="6" width="32" height="22" rx="4" fill="#FFF5F2" opacity="0.65" />
              <rect x="9" y="0" width="14" height="8" rx="2" fill="#FFF5F2" opacity="0.55" />
              <circle cx="16" cy="18" r="7" fill="none" stroke="#B5442A" strokeWidth="2" opacity="0.7" />
              <circle cx="16" cy="18" r="4" fill="#E05A47" opacity="0.5" />
              <rect x="23" y="8" width="5" height="4" rx="1" fill="#FBBF24" opacity="0.75" />
              <circle cx="4" cy="10" r="1.5" fill="#FBBF24" opacity="0.6" />
            </g>

            {/* ── LUGGAGE / SUITCASE ── */}
            <g transform="translate(820,242)">
              <rect x="2" y="10" width="34" height="28" rx="4" fill="#FFF5F2" opacity="0.72" />
              <rect x="10" y="4" width="20" height="8" rx="2" fill="none" stroke="#FFF5F2" strokeWidth="2" opacity="0.72" />
              <line x1="19" y1="10" x2="19" y2="38" stroke="#E05A47" strokeWidth="1.8" opacity="0.65" />
              <line x1="2" y1="24" x2="36" y2="24" stroke="#E05A47" strokeWidth="1.1" opacity="0.5" />
              {/* Wheels */}
              <circle cx="7" cy="38" r="2" fill="#C9A557" opacity="0.7" />
              <circle cx="31" cy="38" r="2" fill="#C9A557" opacity="0.7" />
            </g>

            {/* ── TENT / CAMP ── */}
            <g transform="translate(1040,235)">
              <polygon points="35,0 5,55 65,55" fill="#E05A47" opacity="0.82" />
              <polygon points="35,6 18,55 35,55" fill="#C94331" opacity="0.6" />
              <rect x="24" y="40" width="22" height="15" rx="1" fill="#3D1A10" opacity="0.9" />
              {/* Guy ropes */}
              <line x1="5" y1="55" x2="-5" y2="65" stroke="#FFF5F2" strokeWidth="1" opacity="0.35" />
              <line x1="65" y1="55" x2="75" y2="65" stroke="#FFF5F2" strokeWidth="1" opacity="0.35" />
            </g>

            {/* ── LOCATION PIN ── */}
            <g transform="translate(432,155)">
              <path
                d="M17,0 C8,0 0,8 0,17 C0,28 17,46 17,46 C17,46 34,28 34,17 C34,8 26,0 17,0 Z"
                fill="#FBBF24"
                opacity="0.85"
              />
              <circle cx="17" cy="17" r="7" fill="#B5442A" opacity="0.8" />
            </g>

            {/* ── MAP SCROLL ── */}
            <g transform="translate(995,185)">
              <rect x="0" y="0" width="40" height="32" rx="3" fill="#E8C170" opacity="0.65" />
              {/* Grid lines */}
              <line x1="13" y1="0" x2="13" y2="32" stroke="#A83324" strokeWidth="0.8" opacity="0.45" />
              <line x1="26" y1="0" x2="26" y2="32" stroke="#A83324" strokeWidth="0.8" opacity="0.45" />
              <line x1="0" y1="11" x2="40" y2="11" stroke="#A83324" strokeWidth="0.8" opacity="0.45" />
              <line x1="0" y1="22" x2="40" y2="22" stroke="#A83324" strokeWidth="0.8" opacity="0.45" />
              {/* Tiny pin */}
              <circle cx="7" cy="6" r="2.5" fill="#E05A47" opacity="0.75" />
              {/* Route line */}
              <path d="M7,6 Q20,14 33,8" stroke="#E05A47" strokeWidth="1.2" fill="none" strokeDasharray="2,2" opacity="0.6" />
            </g>

            {/* ── SAILBOAT ── */}
            <g transform="translate(1175,260)">
              {/* Hull */}
              <path d="M0,25 Q22,35 44,25 L40,32 Q22,40 4,32 Z" fill="#E8C170" opacity="0.75" />
              {/* Mast */}
              <line x1="18" y1="32" x2="18" y2="0" stroke="#FFF5F2" strokeWidth="1.8" opacity="0.65" />
              {/* Main sail */}
              <polygon points="18,0 18,28 2,22" fill="#FFF5F2" opacity="0.65" />
              {/* Jib */}
              <polygon points="18,5 18,25 32,20" fill="#FFF5F2" opacity="0.45" />
            </g>

            {/* ── BICYCLE ── */}
            <g transform="translate(130,250)">
              <circle cx="11" cy="20" r="11" fill="none" stroke="#FFF5F2" strokeWidth="2" opacity="0.52" />
              <circle cx="43" cy="20" r="11" fill="none" stroke="#FFF5F2" strokeWidth="2" opacity="0.52" />
              {/* Frame */}
              <path d="M11,20 L27,4 L43,20 L27,20 Z" fill="none" stroke="#FFF5F2" strokeWidth="1.8" opacity="0.52" />
              {/* Handlebar */}
              <path d="M27,4 L34,0 L38,6" fill="none" stroke="#FFF5F2" strokeWidth="1.5" opacity="0.5" />
              {/* Seat */}
              <line x1="23" y1="20" x2="27" y2="4" stroke="#FFF5F2" strokeWidth="1.5" opacity="0.5" />
              <line x1="20" y1="19" x2="26" y2="19" stroke="#FFF5F2" strokeWidth="2" opacity="0.5" />
            </g>

            {/* ── PASSPORT ── */}
            <g transform="translate(658,244)">
              <rect x="0" y="0" width="24" height="32" rx="3" fill="#2D7A4F" opacity="0.65" />
              <rect x="0" y="0" width="5" height="32" rx="2" fill="#1F5E3A" opacity="0.65" />
              <circle cx="14" cy="13" r="5" fill="none" stroke="#FFF5F2" strokeWidth="1.1" opacity="0.55" />
              <line x1="6" y1="21" x2="22" y2="21" stroke="#FFF5F2" strokeWidth="0.9" opacity="0.45" />
              <line x1="6" y1="25" x2="20" y2="25" stroke="#FFF5F2" strokeWidth="0.9" opacity="0.45" />
              {/* Emblem */}
              <circle cx="14" cy="13" r="2" fill="#FFF5F2" opacity="0.4" />
            </g>

            {/* ── BEACH UMBRELLA ── */}
            <g transform="translate(1268,242)">
              <line x1="11" y1="0" x2="11" y2="42" stroke="#FFF5F2" strokeWidth="2.2" opacity="0.65" />
              <path d="M-14,7 Q11,-10 36,7 Z" fill="#F37562" opacity="0.8" />
              <path d="M-3,7 Q11,0 25,7" fill="#FBBF24" opacity="0.7" />
              {/* Stake in ground */}
              <line x1="11" y1="42" x2="14" y2="52" stroke="#FFF5F2" strokeWidth="1.5" opacity="0.4" />
            </g>

            {/* ── WAVES at base ── */}
            <path
              d="M0,308 Q90,298 180,308 Q270,318 360,308 Q450,298 540,308 Q630,318 720,308 Q810,298 900,308 Q990,318 1080,308 Q1170,298 1260,308 Q1350,318 1440,308"
              stroke="#FFF5F2"
              strokeWidth="1.8"
              fill="none"
              opacity="0.18"
            />
            <path
              d="M0,320 Q90,314 180,320 Q270,326 360,320 Q450,314 540,320 Q630,326 720,320 Q810,314 900,320 Q990,326 1080,320 Q1170,314 1260,320 Q1350,326 1440,320"
              stroke="#FFF5F2"
              strokeWidth="1.2"
              fill="none"
              opacity="0.12"
            />

            {/* ── SMALL LOCATION PINS scattered ── */}
            <g opacity="0.5">
              <circle cx="550" cy="155" r="3.5" fill="#FBBF24" />
              <path d="M550,145 C546,145 543,148 543,152 C543,157 550,163 550,163 C550,163 557,157 557,152 C557,148 554,145 550,145 Z" fill="#FBBF24" opacity="0.7" />
              <circle cx="550" cy="152" r="2" fill="#A83324" opacity="0.7" />
            </g>

            {/* ── SMALL HIKING FIGURE ── */}
            <g transform="translate(1320,258)" stroke="#FFF5F2" strokeWidth="1.5" fill="none" opacity="0.45">
              <circle cx="8" cy="4" r="4" />
              <line x1="8" y1="8" x2="8" y2="22" />
              <line x1="8" y1="14" x2="2" y2="19" />
              <line x1="8" y1="14" x2="14" y2="19" />
              <line x1="8" y1="22" x2="4" y2="32" />
              <line x1="8" y1="22" x2="12" y2="32" />
              {/* Walking stick */}
              <line x1="14" y1="10" x2="18" y2="34" />
            </g>
          </svg>
        </div>

        {/* ─ Footer navigation ─ */}
        <div className="bg-terracotta-900 pt-14 pb-10">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">

            {/* Brand */}
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 rounded-xl bg-terracotta-500 flex items-center justify-center shadow-sm">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20" />
                  <path d="M12 2c2.5 4 2.5 16 0 20" />
                  <path d="M12 2c-2.5 4-2.5 16 0 20" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-extrabold text-white font-display tracking-tight leading-none">
                  Globe<span className="text-amber-400">Trotter</span>
                </p>
                <p className="text-[10px] text-white/45 uppercase tracking-widest mt-0.5">
                  Personalized Travel
                </p>
              </div>
            </div>

            {/* Nav columns */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/45 mb-4">
                  Explore
                </p>
                <ul className="space-y-3">
                  <li>
                    <Link
                      to="/explore"
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      Destinations
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/explore"
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      Explore Trips
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/45 mb-4">
                  Plan
                </p>
                <ul className="space-y-3">
                  <li>
                    <Link
                      to="/plan"
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      AI Planner
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/trips"
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      My Trips
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/trips"
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      Budget
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/45 mb-4">
                  Account
                </p>
                <ul className="space-y-3">
                  <li>
                    <Link
                      to="/login"
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      Log In
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/signup"
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      Sign Up
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/profile"
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      Profile
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/45 mb-4">
                  Legal
                </p>
                <ul className="space-y-3">
                  <li>
                    <span className="text-sm text-white/50 cursor-default select-none">Privacy</span>
                  </li>
                  <li>
                    <span className="text-sm text-white/50 cursor-default select-none">Terms</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-white/35">
                © 2025 GlobeTrotter. Plan better, travel further.
              </p>
              <p className="text-xs text-white/25">Built for travelers, by travelers.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
