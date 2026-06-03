import { useState, useEffect } from 'react';
import { cn } from '../../utils/cn';

// ─── Standard, thin-stroke (2px) inline SVGs ─────────────────────────────
const Icon = {
  Check: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Calendar: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Clock: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  X: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

interface BookingModalProps {
  theme: 'dark' | 'light';
}

const TIME_SLOTS = ['09:00 AM', '10:30 AM', '01:00 PM', '03:30 PM', '05:00 PM'];

export default function BookingModal({ theme }: BookingModalProps) {
  const isDark = theme === 'dark';
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [schedulerStep, setSchedulerStep] = useState<number>(1); // 1: Date/Time, 2: Form, 3: Success
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingName, setBookingName] = useState<string>('');
  const [bookingEmail, setBookingEmail] = useState<string>('');

  // Listen to the custom window event to open this modal
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
    };
    window.addEventListener('open-booking-modal', handleOpen);
    return () => {
      window.removeEventListener('open-booking-modal', handleOpen);
    };
  }, []);

  // Helper to generate the next 5 business days
  const getNextBusinessDays = () => {
    const list = [];
    const current = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    
    while (list.length < 5) {
      current.setDate(current.getDate() + 1);
      if (current.getDay() !== 0 && current.getDay() !== 6) {
        list.push({
          raw: current.toDateString(),
          formatted: formatter.format(current),
        });
      }
    }
    return list;
  };

  const businessDays = getNextBusinessDays();

  const handleClose = () => {
    setIsOpen(false);
    // Reset state after transition
    setTimeout(() => {
      setSchedulerStep(1);
      setSelectedDate(null);
      setSelectedTime(null);
      setBookingName('');
      setBookingEmail('');
    }, 300);
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Design Tokens
  const bgPanel = isDark ? 'bg-[#0F0F10] border-[#2A2A2A] text-white' : 'bg-white border-slate-200 text-[#0F172A]';
  const textSecondary = isDark ? 'text-[#D4D4D4]' : 'text-[#475569]';
  const accentColor = isDark ? '#FACC15' : '#CA8A04';
  const inputBg = isDark ? 'bg-[#171717] border-[#2A2A2A] focus:border-[#EAB308]' : 'bg-slate-50 border-slate-200 focus:border-[#CA8A04]';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/60 animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className={cn(
          'relative w-full max-w-lg rounded-2xl border p-6 md:p-8 flex flex-col gap-6 shadow-2xl transition-all duration-300 transform scale-100',
          bgPanel
        )}
      >
        {/* Close Button */}
        <button 
          type="button" 
          onClick={handleClose}
          aria-label="Close scheduler"
          className={cn(
            'absolute top-5 right-5 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer',
            isDark ? 'border-[#2A2A2A] hover:bg-[#1F1F1F] text-zinc-400' : 'border-slate-200 hover:bg-slate-50 text-slate-500'
          )}
        >
          <Icon.X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div>
          <span 
            className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border select-none inline-block mb-2"
            style={{
              borderColor: isDark ? '#2A2A2A' : '#E2E8F0',
              color: accentColor,
              background: isDark ? '#171717' : '#F8FAFC'
            }}
          >
            Onboarding Scheduler
          </span>
          <h3 className="text-xl font-black tracking-tight">
            {schedulerStep === 3 ? 'Discovery Booked' : 'Book a Discovery Call'}
          </h3>
          <p className={cn('text-xs opacity-50 mt-1 select-none', textSecondary)}>
            {schedulerStep === 1 && 'Step 1 of 2: Select Date & Time Slot'}
            {schedulerStep === 2 && 'Step 2 of 2: Confirm Contact Details'}
            {schedulerStep === 3 && 'Calendar invitation dispatched.'}
          </p>
        </div>

        {/* STEP 1: Date & Time Picker */}
        {schedulerStep === 1 && (
          <div className="space-y-6">
            {/* Date Grid */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider font-semibold opacity-60 block flex items-center gap-1.5 select-none">
                <Icon.Calendar className="w-3.5 h-3.5" />
                Select Business Day
              </label>
              <div className="grid grid-cols-5 gap-2">
                {businessDays.map((day) => {
                  const isSelected = selectedDate === day.raw;
                  const [weekday, monthDay] = day.formatted.split(', ');
                  return (
                    <button
                      key={day.raw}
                      type="button"
                      onClick={() => setSelectedDate(day.raw)}
                      className={cn(
                        'flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all duration-200 active:scale-95 cursor-pointer',
                        isSelected
                          ? isDark ? 'bg-[#EAB308]/10 border-[#EAB308]' : 'bg-[#CA8A04]/10 border-[#CA8A04]'
                          : isDark ? 'bg-[#171717] border-[#2A2A2A] hover:bg-[#1F1F1F]' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      )}
                    >
                      <span 
                        className="text-[9px] uppercase tracking-wider font-bold"
                        style={{ color: isSelected ? accentColor : undefined }}
                      >
                        {weekday}
                      </span>
                      <span className="text-xs font-black tracking-tight mt-0.5">
                        {monthDay}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slots Grid */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider font-semibold opacity-60 block flex items-center gap-1.5 select-none">
                <Icon.Clock className="w-3.5 h-3.5" />
                Available slots (UTC+3)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map((time) => {
                  const isSelected = selectedTime === time;
                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={cn(
                        'py-2 px-3 rounded-lg border text-center text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer',
                        isSelected
                          ? isDark ? 'bg-[#EAB308]/10 border-[#EAB308]' : 'bg-[#CA8A04]/10 border-[#CA8A04]'
                          : isDark ? 'bg-[#171717] border-[#2A2A2A] hover:bg-[#1F1F1F]' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      )}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action button */}
            <button
              type="button"
              disabled={!selectedDate || !selectedTime}
              onClick={() => setSchedulerStep(2)}
              className={cn(
                'w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none mt-2',
                isDark 
                  ? 'bg-[#FACC15] text-[#0F0F10] hover:bg-[#EAB308]' 
                  : 'bg-[#0F172A] text-white hover:bg-slate-800'
              )}
            >
              Continue to Details
            </button>
          </div>
        )}

        {/* STEP 2: Name & Email Form */}
        {schedulerStep === 2 && (
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (bookingName.trim() && bookingEmail.trim()) {
                setSchedulerStep(3);
              }
            }}
            className="space-y-4"
          >
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider font-bold opacity-60">Full Name</label>
              <input
                type="text"
                required
                value={bookingName}
                onChange={(e) => setBookingName(e.target.value)}
                placeholder="Enter your name"
                className={cn(
                  'w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200',
                  inputBg
                )}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider font-bold opacity-60">Business Email</label>
              <input
                type="email"
                required
                value={bookingEmail}
                onChange={(e) => setBookingEmail(e.target.value)}
                placeholder="Enter your business email"
                className={cn(
                  'w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200',
                  inputBg
                )}
              />
            </div>

            {/* Summary Info */}
            <div 
              className={cn(
                'p-3 rounded-lg border text-xs leading-normal select-none flex flex-col gap-1',
                isDark ? 'bg-[#171717]/60 border-[#2A2A2A]' : 'bg-slate-50 border-slate-100'
              )}
            >
              <div className="flex justify-between">
                <span className="opacity-50">Date:</span>
                <span className="font-bold">{businessDays.find(d => d.raw === selectedDate)?.formatted}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-50">Time:</span>
                <span className="font-bold">{selectedTime}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSchedulerStep(1)}
                className={cn(
                  'flex-1 py-3.5 rounded-xl text-sm font-semibold border transition-all duration-200 active:scale-95 cursor-pointer',
                  isDark ? 'bg-transparent border-[#2A2A2A] hover:bg-[#1F1F1F]' : 'bg-white border-slate-200 hover:bg-slate-50'
                )}
              >
                Back
              </button>
              <button
                type="submit"
                className={cn(
                  'flex-1 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95 cursor-pointer',
                  isDark 
                    ? 'bg-[#FACC15] text-[#0F0F10] hover:bg-[#EAB308]' 
                    : 'bg-[#0F172A] text-white hover:bg-slate-800'
                )}
              >
                Confirm Booking
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Success Confirmation */}
        {schedulerStep === 3 && (
          <div className="flex flex-col items-center justify-center text-center gap-4 py-4 animate-fade-in">
            {/* Animated Green Checkmark Bubble */}
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center relative shadow-lg shadow-emerald-500/5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5 animate-pulse" />
              <Icon.Check className="w-8 h-8 text-emerald-500" />
            </div>
            
            <h4 className="text-lg font-bold tracking-tight text-emerald-500 mt-2">
              Discovery Call Confirmed!
            </h4>

            <div 
              className={cn(
                'p-4 rounded-xl border text-xs max-w-sm leading-relaxed space-y-2',
                isDark ? 'bg-[#171717]/60 border-[#2A2A2A]' : 'bg-slate-50 border-slate-100'
              )}
            >
              <p>
                Hello <span className="font-bold">{bookingName}</span>, your call has been scheduled for{' '}
                <span className="font-bold text-emerald-500">
                  {businessDays.find(d => d.raw === selectedDate)?.formatted} at {selectedTime}
                </span>.
              </p>
              <p className="opacity-60">
                A Google Meet conference link and calendar invitation have been dispatched to{' '}
                <span className="font-bold">{bookingEmail}</span>.
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className={cn(
                'w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95 cursor-pointer mt-4 select-none',
                isDark ? 'bg-[#1F1F1F] hover:bg-[#2A2A2A] border border-[#2A2A2A]' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              )}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
