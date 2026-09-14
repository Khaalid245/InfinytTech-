import { useState, useEffect, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '../../utils/cn';
import { submitLead } from '../../services/leads.service';
import toast from 'react-hot-toast';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  X, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Globe, 
  Video, 
  Sparkles,
  Building2,
  Mail,
  User,
  CalendarCheck
} from 'lucide-react';

interface BookingModalProps {
  theme: 'dark' | 'light';
}

const TIME_SLOTS = [
  { time: '09:00 AM', period: 'Morning' },
  { time: '10:30 AM', period: 'Morning' },
  { time: '01:00 PM', period: 'Afternoon' },
  { time: '02:30 PM', period: 'Afternoon' },
  { time: '04:00 PM', period: 'Afternoon' },
  { time: '05:30 PM', period: 'Evening' },
];

const TIMEZONES = [
  { label: 'UTC+3 (Nairobi / East Africa)', value: 'UTC+3' },
  { label: 'UTC+0 (London / GMT)', value: 'UTC+0' },
  { label: 'UTC+1 (Paris / CET)', value: 'UTC+1' },
  { label: 'UTC+4 (Dubai / GST)', value: 'UTC+4' },
  { label: 'UTC-5 (New York / EST)', value: 'UTC-5' },
  { label: 'UTC-8 (San Francisco / PST)', value: 'UTC-8' },
  { label: 'UTC+5:30 (India / IST)', value: 'UTC+5:30' },
];

const PROJECT_INTERESTS = [
  'Enterprise Software Systems',
  'Cloud Architecture & DevOps',
  'AI & Data Intelligence',
  'Mobile & Web Product Engineering',
  'UI/UX & Design Systems',
  'General Technical Consultation',
];

export default function BookingModal({ theme }: BookingModalProps) {
  const isDark = theme === 'dark';
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [schedulerStep, setSchedulerStep] = useState<number>(1); // 1: Date & Time, 2: Client Info, 3: Confirmed
  
  // Date Picker State
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedTimezone, setSelectedTimezone] = useState<string>('UTC+3');
  
  // Client Form State
  const [bookingName, setBookingName] = useState<string>('');
  const [bookingEmail, setBookingEmail] = useState<string>('');
  const [bookingCompany, setBookingCompany] = useState<string>('');
  const [projectInterest, setProjectInterest] = useState<string>(PROJECT_INTERESTS[0]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Listen to the custom window event to open this modal
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      // Default to next business day
      const nextDay = new Date();
      nextDay.setDate(nextDay.getDate() + 1);
      if (nextDay.getDay() === 0) nextDay.setDate(nextDay.getDate() + 1);
      if (nextDay.getDay() === 6) nextDay.setDate(nextDay.getDate() + 2);
      setSelectedDate(nextDay);
      setSelectedTime('10:30 AM');
    };
    window.addEventListener('open-booking-modal', handleOpen);
    return () => {
      window.removeEventListener('open-booking-modal', handleOpen);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setSchedulerStep(1);
      setBookingName('');
      setBookingEmail('');
      setBookingCompany('');
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

  // Calendar calculations
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days: Array<{ date: Date; isCurrentMonth: boolean; isAvailable: boolean }> = [];
    
    // Previous month filler days
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sun, 1 = Mon ...
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      days.push({ date: d, isCurrentMonth: false, isAvailable: false });
    }
    
    // Current month days
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const d = new Date(year, month, i);
      const dayOfWeek = d.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isPast = d < today;
      const isAvailable = !isWeekend && !isPast;
      days.push({ date: d, isCurrentMonth: true, isAvailable });
    }
    
    // Next month filler days to complete grid
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const d = new Date(year, month + 1, i);
      days.push({ date: d, isCurrentMonth: false, isAvailable: false });
    }
    
    return days;
  }, [currentMonth]);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isSameDay = (d1: Date | null, d2: Date | null) => {
    if (!d1 || !d2) return false;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const formattedSelectedDate = selectedDate
    ? new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }).format(selectedDate)
    : '';

  if (!isOpen) return null;

  // Design Tokens
  const bgPanel = isDark ? 'bg-[#0B0D0F] border-[#23262D] text-[#F8FAFC]' : 'bg-white border-slate-200 text-[#0F172A]';
  const textSecondary = isDark ? 'text-[#94A3B8]' : 'text-[#475569]';
  const accentColor = isDark ? '#D4A017' : '#B8860B';
  const inputBg = isDark ? 'bg-[#121417] border-[#23262D] focus:border-[#D4A017]' : 'bg-slate-50 border-slate-200 focus:border-[#B8860B]';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-md bg-black/70 animate-fade-in overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className={cn(
          'relative w-full max-w-2xl rounded-3xl border p-5 sm:p-8 flex flex-col gap-6 shadow-2xl transition-all my-auto',
          bgPanel
        )}
      >
        {/* Close Button */}
        <button 
          type="button" 
          onClick={handleClose}
          aria-label="Close scheduler"
          className={cn(
            'absolute top-5 right-5 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer z-10',
            isDark ? 'border-[#23262D] hover:bg-[#181B1F] text-zinc-400' : 'border-slate-200 hover:bg-slate-50 text-slate-500'
          )}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header & Badges */}
        <div className="flex flex-col gap-2 pr-8">
          <div className="flex flex-wrap items-center gap-2">
            <span 
              className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border select-none inline-flex items-center gap-1.5"
              style={{
                borderColor: isDark ? '#23262D' : '#E2E8F0',
                color: accentColor,
                background: isDark ? '#121417' : '#F8FAFC'
              }}
            >
              <Sparkles className="w-3 h-3" />
              Executive Discovery Call
            </span>
            <span className={cn('text-[11px] font-medium px-2.5 py-1 rounded-full border flex items-center gap-1.5', isDark ? 'border-[#23262D] text-slate-400' : 'border-slate-200 text-slate-500')}>
              <Video className="w-3 h-3 text-emerald-500" />
              30 Min • Google Meet Video
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
            {schedulerStep === 3 ? 'Discovery Call Confirmed!' : 'Schedule a Technical Discovery Call'}
          </h3>
          <p className={cn('text-xs leading-relaxed', textSecondary)}>
            {schedulerStep === 1 && 'Pick a date and convenient time slot with our lead solutions architecture team.'}
            {schedulerStep === 2 && 'Tell us about your organization and project vision to prepare for the call.'}
            {schedulerStep === 3 && 'Your calendar invitation has been generated and dispatched.'}
          </p>
        </div>

        {/* STEP 1: Interactive Date & Time Picker */}
        {schedulerStep === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Calendar Grid (7 cols on desktop) */}
              <div className="md:col-span-7 flex flex-col gap-3">
                {/* Month Navigator Header */}
                <div className="flex items-center justify-between pb-1">
                  <span className="text-sm font-bold tracking-tight flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-accent-primary" />
                    {currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      aria-label="Previous month"
                      className={cn(
                        'w-7 h-7 rounded-lg border flex items-center justify-center transition-colors cursor-pointer',
                        isDark ? 'border-[#23262D] hover:bg-[#181B1F]' : 'border-slate-200 hover:bg-slate-100'
                      )}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      aria-label="Next month"
                      className={cn(
                        'w-7 h-7 rounded-lg border flex items-center justify-center transition-colors cursor-pointer',
                        isDark ? 'border-[#23262D] hover:bg-[#181B1F]' : 'border-slate-200 hover:bg-slate-100'
                      )}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Day of week labels */}
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400 py-1">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                    <span key={d}>{d}</span>
                  ))}
                </div>

                {/* Calendar Days Matrix */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((item, idx) => {
                    const isSelected = isSameDay(selectedDate, item.date);
                    const isToday = isSameDay(new Date(), item.date);

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={!item.isAvailable}
                        onClick={() => setSelectedDate(item.date)}
                        className={cn(
                          'h-9 w-full rounded-xl text-xs font-semibold flex items-center justify-center transition-all relative cursor-pointer',
                          !item.isCurrentMonth && 'opacity-20 pointer-events-none',
                          !item.isAvailable && item.isCurrentMonth && 'opacity-30 cursor-not-allowed text-slate-500',
                          item.isAvailable && !isSelected && (
                            isDark 
                              ? 'hover:bg-[#181B1F] text-slate-200' 
                              : 'hover:bg-slate-100 text-slate-700'
                          ),
                          isSelected && (
                            isDark
                              ? 'bg-[#D4A017] text-[#0B0D0F] font-bold shadow-md shadow-amber-600/20'
                              : 'bg-[#0F172A] text-white font-bold shadow-md shadow-slate-900/10'
                          )
                        )}
                      >
                        <span>{item.date.getDate()}</span>
                        {isToday && !isSelected && (
                          <span className="w-1 h-1 rounded-full bg-accent-primary absolute bottom-1.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots & Timezone Column (5 cols on desktop) */}
              <div className="md:col-span-5 flex flex-col justify-between gap-4 border-t md:border-t-0 md:border-l border-border-primary md:pl-6 pt-4 md:pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs uppercase tracking-wider font-bold opacity-70 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-accent-primary" />
                      Select Time
                    </label>
                  </div>

                  {/* Time Slots Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    {TIME_SLOTS.map(({ time }) => {
                      const isSelected = selectedTime === time;
                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={cn(
                            'py-2 px-3 rounded-xl border text-center text-xs font-semibold transition-all duration-150 active:scale-95 cursor-pointer',
                            isSelected
                              ? (isDark ? 'bg-[#D4A017] text-[#0B0D0F] font-bold border-[#D4A017]' : 'bg-[#0F172A] text-white font-bold border-[#0F172A]')
                              : (isDark ? 'bg-[#121417] border-[#23262D] hover:bg-[#181B1F]' : 'bg-slate-50 border-slate-200 hover:bg-slate-100')
                          )}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Timezone Selector */}
                <div className="space-y-1.5 pt-2">
                  <label className="text-[10px] uppercase tracking-wider font-bold opacity-60 flex items-center gap-1">
                    <Globe className="w-3 h-3 text-accent-primary" />
                    Timezone
                  </label>
                  <select
                    value={selectedTimezone}
                    onChange={(e) => setSelectedTimezone(e.target.value)}
                    className={cn(
                      'w-full px-3 py-2 rounded-xl text-xs border outline-none cursor-pointer',
                      inputBg
                    )}
                  >
                    {TIMEZONES.map((tz) => (
                      <option key={tz.value} value={tz.value} className={isDark ? 'bg-[#121417]' : 'bg-white'}>
                        {tz.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Selected Date Summary & Next Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border-primary">
              <div className="text-xs">
                <span className="opacity-50">Selected Slot: </span>
                <strong className="text-accent-primary font-bold">
                  {formattedSelectedDate ? `${formattedSelectedDate} at ${selectedTime}` : 'Please choose date & time'}
                </strong>
              </div>

              <button
                type="button"
                disabled={!selectedDate || !selectedTime}
                onClick={() => setSchedulerStep(2)}
                className={cn(
                  'w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none',
                  isDark 
                    ? 'bg-[#D4A017] text-[#0B0D0F] hover:bg-[#E6B325]' 
                    : 'bg-[#0F172A] text-white hover:bg-slate-800'
                )}
              >
                Continue to Details &rarr;
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Name, Email & Project Info */}
        {schedulerStep === 2 && (
          <form 
            onSubmit={async (e) => {
              e.preventDefault();
              if (!bookingName.trim() || !bookingEmail.trim()) return;

              setIsSubmitting(true);
              try {
                const nameParts = bookingName.trim().split(' ');
                const first_name = nameParts[0] || 'Client';
                const last_name = nameParts.slice(1).join(' ') || '';

                await submitLead({
                  first_name,
                  last_name,
                  email: bookingEmail.trim(),
                  company: bookingCompany.trim() || 'N/A',
                  project_type: 'Discovery Call',
                  budget_range: 'N/A',
                  message: `[Scheduled Discovery Call] Date: ${formattedSelectedDate} at ${selectedTime} (${selectedTimezone}). Focus: ${projectInterest}. Company: ${bookingCompany || 'Not Specified'}.`,
                });
                queryClient.invalidateQueries({ queryKey: ['leads'] });
                queryClient.invalidateQueries({ queryKey: ['dashboard'] });
                setSchedulerStep(3);
              } catch (err: any) {
                toast.error(err.response?.data?.message || err.response?.data?.detail || 'Unable to schedule discovery call. Please try again.');
              } finally {
                setIsSubmitting(false);
              }
            }}
            className="space-y-4"
          >
            {/* Slot Banner */}
            <div 
              className={cn(
                'p-3.5 rounded-2xl border text-xs leading-normal flex items-center justify-between',
                isDark ? 'bg-[#121417] border-[#23262D]' : 'bg-slate-50 border-slate-200'
              )}
            >
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-accent-primary shrink-0" />
                <div>
                  <span className="font-bold block">{formattedSelectedDate} at {selectedTime}</span>
                  <span className="text-[10px] opacity-60">30 Min Video Call ({selectedTimezone})</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSchedulerStep(1)}
                className="text-xs font-semibold text-accent-primary hover:underline cursor-pointer"
              >
                Change Slot
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider font-bold opacity-60 flex items-center gap-1">
                  <User className="w-3 h-3 text-accent-primary" /> Full Name *
                </label>
                <input
                  type="text"
                  required
                  disabled={isSubmitting}
                  value={bookingName}
                  onChange={(e) => setBookingName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className={cn(
                    'w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none transition-all disabled:opacity-50',
                    inputBg
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider font-bold opacity-60 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-accent-primary" /> Business Email *
                </label>
                <input
                  type="email"
                  required
                  disabled={isSubmitting}
                  value={bookingEmail}
                  onChange={(e) => setBookingEmail(e.target.value)}
                  placeholder="sarah@enterprise.com"
                  className={cn(
                    'w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none transition-all disabled:opacity-50',
                    inputBg
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider font-bold opacity-60 flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-accent-primary" /> Company / Organization
                </label>
                <input
                  type="text"
                  disabled={isSubmitting}
                  value={bookingCompany}
                  onChange={(e) => setBookingCompany(e.target.value)}
                  placeholder="e.g. Acme Innovations LLC"
                  className={cn(
                    'w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none transition-all disabled:opacity-50',
                    inputBg
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider font-bold opacity-60">Primary Project Area</label>
                <select
                  value={projectInterest}
                  onChange={(e) => setProjectInterest(e.target.value)}
                  className={cn(
                    'w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none cursor-pointer',
                    inputBg
                  )}
                >
                  {PROJECT_INTERESTS.map((item) => (
                    <option key={item} value={item} className={isDark ? 'bg-[#121417]' : 'bg-white'}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-4 border-t border-border-primary">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setSchedulerStep(1)}
                className={cn(
                  'w-1/3 py-3 rounded-xl text-xs font-semibold border transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-50',
                  isDark ? 'bg-transparent border-[#23262D] hover:bg-[#181B1F]' : 'bg-white border-slate-200 hover:bg-slate-50'
                )}
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  'w-2/3 py-3 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2',
                  isDark 
                    ? 'bg-[#D4A017] text-[#0B0D0F] hover:bg-[#E6B325]' 
                    : 'bg-[#0F172A] text-white hover:bg-slate-800'
                )}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Securing Calendar Slot...</span>
                  </>
                ) : (
                  'Confirm & Dispatch Invite'
                )}
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
              <Check className="w-8 h-8 text-emerald-500" />
            </div>
            
            <h4 className="text-xl font-bold tracking-tight text-emerald-500 mt-2">
              Discovery Call Confirmed!
            </h4>

            <div 
              className={cn(
                'p-5 rounded-2xl border text-xs max-w-md leading-relaxed space-y-3 text-left w-full',
                isDark ? 'bg-[#121417] border-[#23262D]' : 'bg-slate-50 border-slate-200'
              )}
            >
              <div className="flex justify-between border-b border-border-primary pb-2">
                <span className="opacity-60">Client:</span>
                <span className="font-bold">{bookingName} {bookingCompany && `(${bookingCompany})`}</span>
              </div>
              <div className="flex justify-between border-b border-border-primary pb-2">
                <span className="opacity-60">Date & Time:</span>
                <span className="font-bold text-accent-primary">{formattedSelectedDate} at {selectedTime}</span>
              </div>
              <div className="flex justify-between border-b border-border-primary pb-2">
                <span className="opacity-60">Medium:</span>
                <span className="font-bold flex items-center gap-1"><Video className="w-3.5 h-3.5 text-emerald-500" /> Google Meet Video</span>
              </div>
              <p className="opacity-70 text-[11px] pt-1">
                A calendar invitation with meeting links has been dispatched to <strong className="text-primary-text">{bookingEmail}</strong>.
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className={cn(
                'w-full max-w-md py-3.5 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer mt-2 select-none',
                isDark ? 'bg-[#181B1F] hover:bg-[#23262D] border border-[#23262D] text-white' : 'bg-[#0F172A] hover:bg-slate-800 text-white'
              )}
            >
              Done & Return to Site
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
