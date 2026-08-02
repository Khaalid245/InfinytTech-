import { Check, ShieldCheck } from 'lucide-react';

interface PasswordChecklistProps {
  value: string;
}

export function PasswordChecklist({ value = '' }: PasswordChecklistProps) {
  const rules = [
    { label: 'At least 12 characters', test: (val: string) => val.length >= 12 },
    { label: 'One uppercase letter (A–Z)', test: (val: string) => /[A-Z]/.test(val) },
    { label: 'One lowercase letter (a–z)', test: (val: string) => /[a-z]/.test(val) },
    { label: 'One number (0–9)', test: (val: string) => /\d/.test(val) },
    { label: 'One special character (! @ # $ % ^ & *)', test: (val: string) => /[^A-Za-z0-9]/.test(val) },
  ];

  if (!value) return null;

  const satisfiedCount = rules.filter(rule => rule.test(value)).length;
  const allMet = satisfiedCount === rules.length;

  let strengthLabel = 'Weak';
  let strengthColor = 'bg-red-500 text-red-500';
  let strengthTextColor = 'text-red-500';
  let barsFilled = 1;

  if (satisfiedCount >= 5) {
    strengthLabel = 'Excellent';
    strengthColor = 'bg-emerald-500';
    strengthTextColor = 'text-emerald-500';
    barsFilled = 4;
  } else if (satisfiedCount === 4) {
    strengthLabel = 'Strong';
    strengthColor = 'bg-indigo-500';
    strengthTextColor = 'text-indigo-500';
    barsFilled = 3;
  } else if (satisfiedCount === 3) {
    strengthLabel = 'Medium';
    strengthColor = 'bg-amber-500';
    strengthTextColor = 'text-amber-500';
    barsFilled = 2;
  } else {
    strengthLabel = 'Weak';
    strengthColor = 'bg-red-500';
    strengthTextColor = 'text-red-500';
    barsFilled = 1;
  }

  return (
    <div className="mt-3 p-4 bg-black/5 dark:bg-white/5 border border-border-primary rounded-xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold text-primary-text">
          <span className="text-base">🔒</span> Create a Strong Password
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold ${strengthTextColor}`}>{strengthLabel}</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((bar) => (
              <div 
                key={bar} 
                className={`w-3.5 h-1 rounded-full transition-all duration-300 ${
                  bar <= barsFilled ? strengthColor : 'bg-secondary-text/25'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      
      {!allMet ? (
        <p className="text-xs text-secondary-text">To protect your account, your password should include:</p>
      ) : (
        <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold animate-fade-in">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          ✓ Your password meets all security requirements.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
        {rules.map((rule, idx) => {
          const isSatisfied = rule.test(value);
          return (
            <div key={idx} className="flex items-center gap-2 text-xs">
              {isSatisfied ? (
                <>
                  <span className="flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-500 shrink-0">
                    <Check className="w-3 h-3" />
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium transition-colors duration-200">
                    {rule.label}
                  </span>
                </>
              ) : (
                <>
                  <span className="flex items-center justify-center w-4 h-4 rounded-full border border-secondary-text/20 text-transparent shrink-0">
                    {/* Empty checkbox/circle */}
                  </span>
                  <span className="text-secondary-text/75 transition-colors duration-200">
                    {rule.label}
                  </span>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PasswordChecklist;
