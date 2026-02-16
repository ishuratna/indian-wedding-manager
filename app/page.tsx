import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-rose-100">

      {/* Navigation */}
      <nav className="border-b border-rose-50 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">💍</span>
            <div className="flex flex-col -gap-1">
              <span className="font-bold text-xl tracking-wide text-rose-600 font-serif leading-none">EasyWeddings</span>
              <span className="text-[10px] text-slate-500 font-medium tracking-widest uppercase ml-0.5">India</span>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <Link href="#features" className="text-sm font-semibold text-slate-600 hover:text-rose-600 transition-colors hidden sm:block">Features</Link>
            <Link href="#pricing" className="text-sm font-semibold text-slate-600 hover:text-rose-600 transition-colors hidden sm:block">Pricing</Link>
            <Link
              href="/login"
              className="px-6 py-2.5 text-sm font-semibold text-white bg-rose-600 rounded-full hover:bg-rose-700 transition-all shadow-md hover:shadow-rose-100"
            >
              Planner Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 sm:pt-32 sm:pb-24 px-6 text-center relative overflow-hidden min-h-[600px] flex items-center justify-center">
        {/* Background Image */}
        <Image
          src="/images/hero-wedding.png"
          alt="Indian wedding ceremony under a mandap"
          fill
          className="object-cover"
          priority
        />
        {/* Dark Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70 z-[1]"></div>

        <div className="max-w-5xl mx-auto space-y-8 relative z-10">
          <div className="inline-flex items-center rounded-full border border-rose-300/30 bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold text-rose-200 mb-4">
            ✨ India&apos;s #1 Platform for Modern Wedding Planners
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-white font-serif leading-tight drop-shadow-lg">
            Seamless Planning for <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-rose-300 to-amber-300">Unforgettable Celebrations.</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed font-light drop-shadow">
            Bring order to the beautiful chaos of Indian weddings. Manage guest lists, RSVPs, vendor payments, and travel logistics—all from one elegant dashboard.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link
              href="/signup"
              className="h-14 px-8 rounded-full bg-rose-600 text-white font-semibold flex items-center justify-center hover:bg-rose-700 hover:-translate-y-0.5 transition-all shadow-lg shadow-rose-900/30"
            >
              Start Free Trial
            </Link>
            <Link
              href="#features"
              className="h-14 px-8 rounded-full border border-white/30 text-white font-semibold flex items-center justify-center hover:bg-white/10 backdrop-blur-sm transition-all"
            >
              Explore Features
            </Link>
          </div>
        </div>
      </section>

      {/* Wedding Gallery Strip */}
      <section className="bg-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg group">
              <Image src="/images/hero-wedding.png" alt="Bride and groom under mandap" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <span className="absolute bottom-4 left-4 text-white font-semibold text-sm drop-shadow">The Ceremony</span>
            </div>
            <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg group">
              <Image src="/images/wedding-celebration.png" alt="Sangeet celebration" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <span className="absolute bottom-4 left-4 text-white font-semibold text-sm drop-shadow">The Celebration</span>
            </div>
            <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg group">
              <Image src="/images/wedding-rituals.png" alt="Hindu wedding rituals" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <span className="absolute bottom-4 left-4 text-white font-semibold text-sm drop-shadow">The Rituals</span>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="border-y border-slate-100 bg-slate-50/50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div className="space-y-1">
              <div className="text-4xl font-bold text-slate-900 font-serif">500+</div>
              <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">Planners Trusted</div>
            </div>
            <div className="space-y-1">
              <div className="text-4xl font-bold text-slate-900 font-serif">1 Lakh+</div>
              <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">Guests Managed</div>
            </div>
            <div className="space-y-1">
              <div className="text-4xl font-bold text-slate-900 font-serif">₹20Cr+</div>
              <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">Budgets Tracked</div>
            </div>
            <div className="space-y-1">
              <div className="text-4xl font-bold text-slate-900 font-serif">4.9/5</div>
              <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">Customer Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-serif mb-4">Everything You Need to Orchestrate Perfection</h2>
            <p className="text-lg text-slate-500">
              We combine professional project management tools with the warmth and flexibility needed for Indian family dynamics.
            </p>
          </div>

          {/* Feature 1: WhatsApp */}
          <div className="flex flex-col md:flex-row items-center gap-12 mb-24">
            <div className="md:w-1/2 relative">
              <div className="relative h-[420px] w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-100">
                <Image src="/images/feature-whatsapp.png" alt="WhatsApp Bot collecting RSVPs" fill className="object-cover" />
              </div>
            </div>
            <div className="md:w-1/2 space-y-6">
              <div className="inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-sm font-semibold text-rose-600">💬 Core Feature</div>
              <h3 className="text-3xl font-bold text-slate-900 font-serif">WhatsApp Guest Assistant</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                Stop chasing 500 relatives on the phone. Our intelligent bot handles the entire guest data collection process via WhatsApp—the app your guests already use every day.
              </p>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 mt-1 shrink-0">✓</span>
                  <span><strong>Automated RSVP Collection</strong> — Guests confirm or decline with a simple text reply</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 mt-1 shrink-0">✓</span>
                  <span><strong>Dietary Preferences</strong> — Captures Veg, Non-Veg, Jain, Vegan, and allergy info</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 mt-1 shrink-0">✓</span>
                  <span><strong>Travel Details</strong> — Arrival dates, flight/train info, and pickup requests</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 mt-1 shrink-0">✓</span>
                  <span><strong>Accommodation Needs</strong> — Automatically asks if they need a hotel room</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 mt-1 shrink-0">✓</span>
                  <span><strong>Real-Time Dashboard Sync</strong> — Every reply instantly appears on your dashboard</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Feature 2: Vendor */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12 mb-24">
            <div className="md:w-1/2 relative">
              <div className="relative h-[420px] w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-100">
                <Image src="/images/feature-vendor.png" alt="Vendor planning materials" fill className="object-cover" />
              </div>
            </div>
            <div className="md:w-1/2 space-y-6">
              <div className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">📊 Financial Control</div>
              <h3 className="text-3xl font-bold text-slate-900 font-serif">Vendor Management</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                No more sticky notes and forgotten invoices. Track every vendor from first quote to final payment, with complete financial visibility across all categories.
              </p>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-3">
                  <span className="text-amber-600 mt-1 shrink-0">✓</span>
                  <span><strong>Category Organization</strong> — Caterers, Decorators, Photographers, Venues, DJs & more</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-600 mt-1 shrink-0">✓</span>
                  <span><strong>Payment Tracker</strong> — See Total, Paid, and Balance Due for every vendor at a glance</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-600 mt-1 shrink-0">✓</span>
                  <span><strong>Contract Status</strong> — Mark vendors as Negotiating, Hired, or Paid in Full</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-600 mt-1 shrink-0">✓</span>
                  <span><strong>WhatsApp Messaging</strong> — Send updates or reminders to vendors directly from the app</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-600 mt-1 shrink-0">✓</span>
                  <span><strong>Budget Overview</strong> — See your total spend vs. remaining budget across all vendors</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Feature 3: Logistics */}
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 relative">
              <div className="relative h-[420px] w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-100">
                <Image src="/images/wedding-celebration.png" alt="Wedding venue logistics" fill className="object-cover" />
              </div>
            </div>
            <div className="md:w-1/2 space-y-6">
              <div className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">✈️ Guest Experience</div>
              <h3 className="text-3xl font-bold text-slate-900 font-serif">Travel &amp; Logistics</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                Indian weddings often involve guests flying in from across the country and world. We make sure nobody is stranded at the airport or left without a room.
              </p>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-3">
                  <span className="text-indigo-500 mt-1 shrink-0">✓</span>
                  <span><strong>Arrival Dashboard</strong> — View all incoming guests sorted by date and time</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-500 mt-1 shrink-0">✓</span>
                  <span><strong>Transport Mode Tracking</strong> — Know who&apos;s arriving by flight, train, or car</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-500 mt-1 shrink-0">✓</span>
                  <span><strong>Hotel Allocations</strong> — Track room requirements and assignments by guest</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-500 mt-1 shrink-0">✓</span>
                  <span><strong>Departure Planning</strong> — Organize return logistics and checkout schedules</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-indigo-500 mt-1 shrink-0">✓</span>
                  <span><strong>Auto-Collected Data</strong> — Travel info flows in directly from the WhatsApp bot</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-slate-900 text-white relative overflow-hidden">

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-serif mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-slate-400">Choose the plan that fits your event scale.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Starter */}
            <div className="p-8 rounded-3xl border border-slate-800 bg-slate-800/50 hover:bg-slate-800 transition-all">
              <h3 className="text-xl font-bold text-white mb-2">Essential</h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-white">Free</span>
                <span className="text-slate-400 font-medium">/ forever</span>
              </div>
              <p className="text-slate-400 mb-8 border-b border-slate-700 pb-8">
                Ideal for intimate weddings or personal planning.
              </p>

              <ul className="space-y-4 text-slate-300 mb-8">
                <li className="flex items-center gap-3"><span className="text-emerald-400">✓</span> Unlimited Guest List (Manual)</li>
                <li className="flex items-center gap-3"><span className="text-emerald-400">✓</span> Vendor Payment Tracking</li>
                <li className="flex items-center gap-3"><span className="text-emerald-400">✓</span> Basic Reporting</li>
              </ul>

              <Link
                href="/signup"
                className="block w-full py-3.5 px-6 rounded-xl border border-slate-600 text-center font-semibold text-white hover:bg-slate-700 transition-all"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro */}
            <div className="relative p-8 rounded-3xl border border-rose-500/30 bg-gradient-to-b from-slate-800 to-slate-900 hover:border-rose-500/50 transition-all shadow-2xl">
              <div className="absolute top-4 right-4 py-1 px-3 bg-rose-600 text-xs font-bold text-white rounded-full uppercase tracking-wider">
                Most Popular
              </div>
              <h3 className="text-xl font-bold text-rose-400 mb-2">Premium</h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-white">₹2,499</span>
                <span className="text-slate-400 font-medium">/ wedding</span>
              </div>
              <p className="text-slate-400 mb-8 border-b border-slate-700 pb-8">
                Full automation for the Big Fat Indian Wedding.
              </p>

              <ul className="space-y-4 text-slate-300 mb-8">
                <li className="flex items-center gap-3">
                  <span className="text-rose-400 text-lg">✨</span>
                  <span className="text-white font-medium">WhatsApp Guest Assistant</span>
                </li>
                <li className="flex items-center gap-3"><span className="text-emerald-400">✓</span> Automated Payment Reminders</li>
                <li className="flex items-center gap-3"><span className="text-emerald-400">✓</span> Advanced Logistics Tools</li>
                <li className="flex items-center gap-3"><span className="text-emerald-400">✓</span> Dedicated Support</li>
              </ul>

              <Link
                href="/signup"
                className="block w-full py-3.5 px-6 rounded-xl bg-rose-600 text-white text-center font-semibold hover:bg-rose-500 hover:shadow-lg hover:shadow-rose-900/50 transition-all"
              >
                Start 14-Day Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-100 bg-slate-50 text-center">
        <div className="flex flex-col items-center gap-4">
          <span className="text-2xl">💍</span>
          <p className="text-slate-500 text-sm">© 2024 EasyWeddings India. Making celebrations simpler.</p>
        </div>
      </footer>
    </div>
  );
}
