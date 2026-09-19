import { useState, useEffect, useMemo, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '../../utils/cn';
import { submitLead } from '../../services/leads.service';
import { useSiteSettings } from '../../hooks/useSiteSettings';
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
  CalendarCheck,
  CalendarPlus,
  Download,
  AlertCircle
} from 'lucide-react';

interface BookingModalProps {
  theme: 'dark' | 'light';
}

interface SlotDefinition {
  time: string;
  hour24: number;
  minute: number;
  period: 'Morning' | 'Afternoon' | 'Evening';
}

const ALL_TIME_SLOTS: SlotDefinition[] = [
  { time: '09:00 AM', hour24: 9, minute: 0, period: 'Morning' },
  { time: '10:30 AM', hour24: 10, minute: 30, period: 'Morning' },
  { time: '01:00 PM', hour24: 13, minute: 0, period: 'Afternoon' },
  { time: '02:30 PM', hour24: 14, minute: 30, period: 'Afternoon' },
  { time: '04:00 PM', hour24: 16, minute: 0, period: 'Afternoon' },
  { time: '05:30 PM', hour24: 17, minute: 30, period: 'Evening' },
];

const TIMEZONES = [
  { label: 'Auto (Local Timezone)', value: 'auto' },
  { label: 'UTC+3 (Nairobi / East Africa / EAT)', value: 'UTC+3' },
  { label: 'UTC+4 (Dubai / GST)', value: 'UTC+4' },
  { label: 'UTC+0 (London / GMT / BST)', value: 'UTC+0' },
  { label: 'UTC+1 (Paris / Berlin / CET)', value: 'UTC+1' },
  { label: 'UTC+2 (Cairo / South Africa / SAST)', value: 'UTC+2' },
  { label: 'UTC+5:30 (India / IST)', value: 'UTC+5:30' },
  { label: 'UTC+8 (Singapore / Hong Kong / SGT)', value: 'UTC+8' },
  { label: 'UTC-5 (New York / Toronto / EST)', value: 'UTC-5' },
  { label: 'UTC-6 (Chicago / Central / CST)', value: 'UTC-6' },
  { label: 'UTC-8 (San Francisco / Los Angeles / PST)', value: 'UTC-8' },
];

const PROJECT_INTERESTS = [
  'Enterprise Software Systems & Scalability',
  'Cloud Infrastructure, DevOps & Kubernetes',
  'AI & Machine Learning Transformation',
  'Full-Stack Web & Mobile Product Engineering',
  'UI/UX Design Systems & Frontend Modernization',
  'Technical Architecture Review & Advisory',
];

// Helper: Get next business day
function getNextBusinessDay(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(0, 0, 0, 0);
  if (d.getDay() === 0) d.setDate(d.getDate() + 1); // If Sun, move to Mon
  if (d.getDay() === 6) d.setDate(d.getDate() + 2); // If Sat, move to Mon
  return d;
}

export default function BookingModal({ theme }: BookingModalProps) {
  const isDark = theme === 'dark';
  const queryClient = useQueryClient();
  const { data: settings } = useSiteSettings();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [schedulerStep, setSchedulerStep] = useState<number>(1); // 1: Date & Time, 2: Client Info, 3: Confirmed
  
  // Date & Time State
  const [currentMonth, setCurrentMonth] = useState<Date>(() => new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => getNextBusinessDay());
  const [selectedTime, setSelectedTime] = useState<string | null>('10:30 AM');
  const [selectedTimezone, setSelectedTimezone] = useState<string>('auto');
  const [detectedTzLabel, setDetectedTzLabel] = useState<string>('UTC');

  // Client Form State
  const [bookingName, setBookingName] = useState<string>('');
  const [bookingEmail, setBookingEmail] = useState<string>('');
  const [bookingCompany, setBookingCompany] = useState<string>('');
  const [projectInterest, setProjectInterest] = useState<string>(PROJECT_INTERESTS[0]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Dynamic system company name
  const companyName = settings?.company_name || 'InfinytTech';

  // Detect user local timezone label
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
      const offsetMinutes = -new Date().getTimezoneOffset();
      const offsetHours = offsetMinutes / 60;
      const offsetString = `UTC${offsetHours >= 0 ? '+' : ''}${offsetHours}`;
      setDetectedTzLabel(`${tz} (${offsetString})`);
    } catch {
      setDetectedTzLabel('UTC');
    }
  }, []);

  // Display timezone string
  const activeTimezoneString = selectedTimezone === 'auto' ? detectedTzLabel : selectedTimezone;

  // Listen to open event
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      const nextDay = getNextBusinessDay();
      setSelectedDate(nextDay);
      setCurrentMonth(new Date(nextDay.getFullYear(), nextDay.getMonth(), 1));
      setSelectedTime('10:30 AM');
      setSchedulerStep(1);
    };

    window.addEventListener('open-booking-modal', handleOpen);
    return () => {
      window.removeEventListener('open-booking-modal', handleOpen);
    };
  }, []);

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

  // Close & Reset
  const handleClose = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      setSchedulerStep(1);
      setBookingName('');
      setBookingEmail('');
      setBookingCompany('');
      setSelectedDate(getNextBusinessDay());
      setSelectedTime('10:30 AM');
    }, 300);
  }, []);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  // Check if date is today or same day
  const isSameDay = (d1: Date | null, d2: Date | null) => {
    if (!d1 || !d2) return false;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  // Determine slot availability for selectedDate
  const isSlotAvailable = useCallback((slot: SlotDefinition, date: Date | null): boolean => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Past date check
    if (date < today) return false;

    // Weekend check (Corporate Monday-Friday schedule)
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) return false;

    // Same-day time buffer check (minimum 90 min notice required)
    const isSelectedToday = isSameDay(date, new Date());
    if (isSelectedToday) {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const slotMinutes = slot.hour24 * 60 + slot.minute;
      const minimumNoticeMinutes = 90;

      if (slotMinutes <= currentMinutes + minimumNoticeMinutes) {
        return false;
      }
    }

    return true;
  }, []);

  // List of slots for the selected date with dynamic availability
  const availableTimeSlots = useMemo(() => {
    return ALL_TIME_SLOTS.map(slot => ({
      ...slot,
      isAvailable: isSlotAvailable(slot, selectedDate),
    }));
  }, [selectedDate, isSlotAvailable]);

  // Auto-adjust selected time if it becomes unavailable
  useEffect(() => {
    if (!selectedDate) return;
    const currentSlotDef = availableTimeSlots.find(s => s.time === selectedTime);
    if (!currentSlotDef || !currentSlotDef.isAvailable) {
      const firstValid = availableTimeSlots.find(s => s.isAvailable);
      setSelectedTime(firstValid ? firstValid.time : null);
    }
  }, [selectedDate, availableTimeSlots, selectedTime]);

  // Calendar calculations
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days: Array<{ date: Date; isCurrentMonth: boolean; isAvailable: boolean; isWeekend: boolean }> = [];
    
    // Previous month filler days
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sun
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      d.setHours(0, 0, 0, 0);
      days.push({ date: d, isCurrentMonth: false, isAvailable: false, isWeekend: d.getDay() === 0 || d.getDay() === 6 });
    }
    
    // Current month days
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const d = new Date(year, month, i);
      d.setHours(0, 0, 0, 0);
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;
      const isPast = d < today;

      // Check if today has at least one remaining valid time slot
      let hasRemainingSlot = true;
      if (isSameDay(d, new Date())) {
        hasRemainingSlot = ALL_TIME_SLOTS.some(slot => isSlotAvailable(slot, d));
      }

      const isAvailable = !isWeekend && !isPast && hasRemainingSlot;
      days.push({ date: d, isCurrentMonth: true, isAvailable, isWeekend });
    }
    
    // Next month filler days to complete standard 42-day (6-row) grid
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const d = new Date(year, month + 1, i);
      d.setHours(0, 0, 0, 0);
      days.push({ date: d, isCurrentMonth: false, isAvailable: false, isWeekend: d.getDay() === 0 || d.getDay() === 6 });
    }
    
    return days;
  }, [currentMonth, isSlotAvailable]);

  // Prevent navigating to past months
  const isCurrentMonthOrPast = useMemo(() => {
    const today = new Date();
    return (
      currentMonth.getFullYear() < today.getFullYear() ||
      (currentMonth.getFullYear() === today.getFullYear() && currentMonth.getMonth() <= today.getMonth())
    );
  }, [currentMonth]);

  const handlePrevMonth = () => {
    if (isCurrentMonthOrPast) return;
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const formattedSelectedDate = selectedDate
    ? new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }).format(selectedDate)
    : '';

  // Google Calendar URL Generator
  const generateGoogleCalendarUrl = () => {
    if (!selectedDate || !selectedTime) return '#';
    const slotDef = ALL_TIME_SLOTS.find(s => s.time === selectedTime) || ALL_TIME_SLOTS[0];
    
    const start = new Date(selectedDate);
    start.setHours(slotDef.hour24, slotDef.minute, 0, 0);
    const end = new Date(start.getTime() + 30 * 60 * 1000); // 30 mins

    const formatGCal = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

    const title = encodeURIComponent(`Executive Discovery Call: ${companyName} & ${bookingName || 'Client'}`);
    const details = encodeURIComponent(
      `Technical Discovery Call with ${companyName} Solutions Architecture Team.\n\n` +
      `Focus: ${projectInterest}\n` +
      `Client: ${bookingName} (${bookingCompany || 'Organization'})\n` +
      `Platform: Google Meet Video\n` +
      `Direct Support: ${settings?.primary_email || 'hello@infinyt.tech'}`
    );
    const location = encodeURIComponent('Google Meet (Link will be dispatched via email)');

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatGCal(start)}/${formatGCal(end)}&details=${details}&location=${location}`;
  };

  // iCal (.ics) Generator & Downloader
  const downloadIcsFile = () => {
    if (!selectedDate || !selectedTime) return;
    const slotDef = ALL_TIME_SLOTS.find(s => s.time === selectedTime) || ALL_TIME_SLOTS[0];
    
    const start = new Date(selectedDate);
    start.setHours(slotDef.hour24, slotDef.minute, 0, 0);
    const end = new Date(start.getTime() + 30 * 60 * 1000);

    const formatIcs = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//InfinytTech//Discovery Call Scheduler//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:REQUEST',
      'BEGIN:VEVENT',
      `UID:${Date.now()}@infinyt.tech`,
      `DTSTAMP:${formatIcs(new Date())}`,
      `DTSTART:${formatIcs(start)}`,
      `DTEND:${formatIcs(end)}`,
      `SUMMARY:Executive Discovery Call with ${companyName}`,
      `DESCRIPTION:Technical Architecture & Discovery Call. Focus: ${projectInterest}. Client: ${bookingName}.`,
      'LOCATION:Google Meet Video Conference',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `discovery-call-${companyName.toLowerCase().replace(/\s+/g, '-')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Calendar .ics file downloaded.');
  };

  if (!isOpen) return null;

  // Design Tokens
  const bgPanel = isDark 
    ? 'bg-[#0B0D0F] border-[#23262D] text-[#F8FAFC]' 
    : 'bg-white border-slate-200 text-[#0F172A]';
  const textSecondary = isDark ? 'text-[#94A3B8]' : 'text-[#475569]';
  const accentColor = isDark ? '#D4A017' : '#B8860B';
  const inputBg = isDark 
    ? 'bg-[#121417] border-[#23262D] text-slate-100 focus:border-[#D4A017]' 
    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#B8860B]';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-md bg-black/75 animate-fade-in overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
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

        {/* Progress Step Bar */}
        <div className="flex items-center gap-2 pr-10">
          <div className="flex items-center gap-1.5 flex-1">
            <div className={cn('h-1.5 rounded-full flex-1 transition-all', schedulerStep >= 1 ? 'bg-amber-500' : 'bg-slate-200 dark:bg-slate-800')} />
            <div className={cn('h-1.5 rounded-full flex-1 transition-all', schedulerStep >= 2 ? 'bg-amber-500' : 'bg-slate-200 dark:bg-slate-800')} />
            <div className={cn('h-1.5 rounded-full flex-1 transition-all', schedulerStep >= 3 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800')} />
          </div>
          <span className="text-[10px] font-mono font-semibold opacity-60 uppercase">
            Step {schedulerStep} of 3
          </span>
        </div>

        {/* Header & Badges */}
        <div className="flex flex-col gap-2 pr-4">
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
              Direct Solutions Architecture
            </span>
            <span className={cn('text-[11px] font-medium px-2.5 py-1 rounded-full border flex items-center gap-1.5', isDark ? 'border-[#23262D] text-slate-400' : 'border-slate-200 text-slate-500')}>
              <Video className="w-3 h-3 text-emerald-500" />
              30 Min • Google Meet Video
            </span>
          </div>

          <h3 id="booking-modal-title" className="text-xl sm:text-2xl font-bold tracking-tight">
            {schedulerStep === 3 ? 'Discovery Call Confirmed!' : `Schedule a Technical Discovery Call with ${companyName}`}
          </h3>
          <p className={cn('text-xs leading-relaxed', textSecondary)}>
            {schedulerStep === 1 && 'Select an available date and verified engineering time slot.'}
            {schedulerStep === 2 && 'Tell us about your organization and project vision to prepare technical scope.'}
            {schedulerStep === 3 && 'Your calendar invitation has been confirmed and dispatched.'}
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
                    <CalendarIcon className="w-4 h-4 text-amber-500" />
                    {currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      disabled={isCurrentMonthOrPast}
                      aria-label="Previous month"
                      className={cn(
                        'w-7 h-7 rounded-lg border flex items-center justify-center transition-colors',
                        isCurrentMonthOrPast 
                          ? 'opacity-25 cursor-not-allowed border-transparent' 
                          : isDark ? 'border-[#23262D] hover:bg-[#181B1F] cursor-pointer' : 'border-slate-200 hover:bg-slate-100 cursor-pointer'
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
                          'h-9 w-full rounded-xl text-xs font-semibold flex items-center justify-center transition-all relative',
                          !item.isCurrentMonth && 'opacity-20 pointer-events-none',
                          !item.isAvailable && item.isCurrentMonth && (
                            item.isWeekend 
                              ? 'opacity-30 cursor-not-allowed text-slate-400 bg-slate-100/40 dark:bg-slate-800/20' 
                              : 'opacity-30 cursor-not-allowed text-slate-500 line-through'
                          ),
                          item.isAvailable && !isSelected && (
                            isDark 
                              ? 'hover:bg-[#181B1F] text-slate-200 cursor-pointer' 
                              : 'hover:bg-slate-100 text-slate-700 cursor-pointer'
                          ),
                          isSelected && (
                            isDark
                              ? 'bg-[#D4A017] text-[#0B0D0F] font-bold shadow-md shadow-amber-600/20 cursor-pointer'
                              : 'bg-[#0F172A] text-white font-bold shadow-md shadow-slate-900/10 cursor-pointer'
                          )
                        )}
                        title={
                          !item.isAvailable && item.isCurrentMonth
                            ? item.isWeekend ? 'Closed on weekends' : 'No available slots on this date'
                            : `${item.date.toDateString()}`
                        }
                      >
                        <span>{item.date.getDate()}</span>
                        {isToday && !isSelected && (
                          <span className="w-1 h-1 rounded-full bg-amber-500 absolute bottom-1.5" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-4 text-[10px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Available
                  </span>
                  <span className="flex items-center gap-1 opacity-70">
                    <span className="w-2 h-2 rounded-full bg-slate-400 inline-block opacity-40" /> Closed / Past
                  </span>
                </div>
              </div>

              {/* Time Slots & Timezone Column (5 cols on desktop) */}
              <div className="md:col-span-5 flex flex-col justify-between gap-4 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 md:pl-6 pt-4 md:pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs uppercase tracking-wider font-bold opacity-70 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      Available Slots
                    </label>
                  </div>

                  {/* Time Slots Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    {availableTimeSlots.map(({ time, isAvailable, period }) => {
                      const isSelected = selectedTime === time;

                      return (
                        <button
                          key={time}
                          type="button"
                          disabled={!isAvailable}
                          onClick={() => setSelectedTime(time)}
                          className={cn(
                            'py-2 px-2.5 rounded-xl border text-center text-xs font-semibold transition-all duration-150 flex flex-col items-center justify-center',
                            !isAvailable && 'opacity-30 cursor-not-allowed line-through bg-slate-100/50 dark:bg-slate-800/30 border-transparent',
                            isAvailable && !isSelected && (
                              isDark ? 'bg-[#121417] border-[#23262D] hover:bg-[#181B1F] cursor-pointer' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 cursor-pointer'
                            ),
                            isSelected && isAvailable && (
                              isDark 
                                ? 'bg-[#D4A017] text-[#0B0D0F] font-bold border-[#D4A017] shadow-sm cursor-pointer' 
                                : 'bg-[#0F172A] text-white font-bold border-[#0F172A] shadow-sm cursor-pointer'
                            )
                          )}
                        >
                          <span>{time}</span>
                          <span className={cn('text-[9px] font-normal opacity-60', isSelected && 'text-current')}>
                            {period}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {!availableTimeSlots.some(s => s.isAvailable) && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600 dark:text-amber-400 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>All slots for today have passed. Please select an upcoming business day.</span>
                    </div>
                  )}
                </div>

                {/* Timezone Selector */}
                <div className="space-y-1.5 pt-2">
                  <label className="text-[10px] uppercase tracking-wider font-bold opacity-60 flex items-center gap-1">
                    <Globe className="w-3 h-3 text-amber-500" />
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
                        {tz.value === 'auto' ? `Auto: ${detectedTzLabel}` : tz.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Selected Date Summary & Next Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="text-xs">
                <span className="opacity-60">Selected Slot: </span>
                <strong className="text-amber-600 dark:text-amber-400 font-bold">
                  {formattedSelectedDate && selectedTime ? `${formattedSelectedDate} at ${selectedTime}` : 'Please select an available slot'}
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
              if (!bookingName.trim() || !bookingEmail.trim()) {
                toast.error('Please provide your name and business email.');
                return;
              }

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
                  project_type: projectInterest,
                  budget_range: 'Discovery Call',
                  source: 'Discovery Call Booking',
                  message: `[Scheduled Discovery Call] Date: ${formattedSelectedDate} at ${selectedTime} (${activeTimezoneString}). Primary Focus: ${projectInterest}. Organization: ${bookingCompany || 'Not Specified'}.`,
                });
                queryClient.invalidateQueries({ queryKey: ['leads'] });
                queryClient.invalidateQueries({ queryKey: ['dashboard'] });
                setSchedulerStep(3);
              } catch (err: unknown) {
                const errorObj = err as { response?: { data?: { message?: string; detail?: string } } };
                toast.error(errorObj.response?.data?.message || errorObj.response?.data?.detail || 'Unable to schedule discovery call. Please try again.');
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
                <CalendarCheck className="w-4 h-4 text-amber-500 shrink-0" />
                <div>
                  <span className="font-bold block">{formattedSelectedDate} at {selectedTime}</span>
                  <span className="text-[10px] opacity-60">30 Min Video Call ({activeTimezoneString})</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSchedulerStep(1)}
                className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
              >
                Change Slot
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider font-bold opacity-60 flex items-center gap-1">
                  <User className="w-3 h-3 text-amber-500" /> Full Name *
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
                  <Mail className="w-3 h-3 text-amber-500" /> Business Email *
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
                  <Building2 className="w-3 h-3 text-amber-500" /> Company / Organization
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
                <label className="text-[10px] uppercase tracking-wider font-bold opacity-60">Primary Project Focus</label>
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
            <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
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
          <div className="flex flex-col items-center justify-center text-center gap-4 py-3 animate-fade-in">
            {/* Animated Green Checkmark Bubble */}
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center relative shadow-lg shadow-emerald-500/5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5 animate-pulse" />
              <Check className="w-8 h-8 text-emerald-500" />
            </div>
            
            <h4 className="text-xl font-bold tracking-tight text-emerald-500 mt-1">
              Discovery Call Confirmed!
            </h4>

            <div 
              className={cn(
                'p-4 sm:p-5 rounded-2xl border text-xs max-w-md leading-relaxed space-y-2.5 text-left w-full',
                isDark ? 'bg-[#121417] border-[#23262D]' : 'bg-slate-50 border-slate-200'
              )}
            >
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="opacity-60">Client:</span>
                <span className="font-bold">{bookingName} {bookingCompany && `(${bookingCompany})`}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="opacity-60">Date & Time:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">{formattedSelectedDate} at {selectedTime}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="opacity-60">Timezone:</span>
                <span className="font-medium font-mono text-[11px]">{activeTimezoneString}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="opacity-60">Meeting Medium:</span>
                <span className="font-bold flex items-center gap-1"><Video className="w-3.5 h-3.5 text-emerald-500" /> Google Meet Video</span>
              </div>
              <p className="opacity-70 text-[11px] pt-1">
                A calendar invitation with meeting links and room details has been dispatched to <strong className="text-primary-text">{bookingEmail}</strong>.
              </p>
            </div>

            {/* Quick Calendar Links */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md pt-1">
              <a
                href={generateGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'flex-1 w-full py-2.5 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-colors',
                  isDark ? 'bg-[#181B1F] border-[#23262D] hover:bg-[#23262D] text-slate-200' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                )}
              >
                <CalendarPlus className="w-3.5 h-3.5 text-amber-500" />
                Add to Google Calendar
              </a>
              <button
                type="button"
                onClick={downloadIcsFile}
                className={cn(
                  'flex-1 w-full py-2.5 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-colors cursor-pointer',
                  isDark ? 'bg-[#181B1F] border-[#23262D] hover:bg-[#23262D] text-slate-200' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                )}
              >
                <Download className="w-3.5 h-3.5 text-emerald-500" />
                Download iCal (.ics)
              </button>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className={cn(
                'w-full max-w-md py-3.5 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer mt-1 select-none',
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
