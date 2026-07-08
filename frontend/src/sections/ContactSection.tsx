import React, { useState } from 'react';
import { Check, Mail, Phone, MapPin, MessageSquare, Map } from 'lucide-react';
import { Container } from '../components/layout/Container';
import { Section } from '../components/layout/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import { Input } from '../components/ui/Input';
import { TextArea } from '../components/ui/TextArea';
import { Select } from '../components/ui/Select';
import { Checkbox } from '../components/ui/Checkbox';
import { Button } from '../components/ui/Button';
import { FormWrapper } from '../components/ui/FormWrapper';
import { cn } from '../utils/cn';
import { submitLead } from '../services/leads.service';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { SITE_INFO } from '../constants';

export interface OfficeLocation {
  city: string;
  address: readonly string[];
  email: string;
  phone?: string;
}

export interface ContactSectionProps {
  id?: string;
  tagline?: string;
  title: string;
  subtitle: string;
  locations?: readonly OfficeLocation[];
  onSubmitSuccess?: (data: Record<string, string>) => void;
  background?: 'primary' | 'light';
  premiumDark?: boolean;
  className?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  id,
  tagline,
  title,
  subtitle,
  locations = [],
  onSubmitSuccess,
  background = 'primary',
  premiumDark = false,
  className,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'design',
    message: '',
    privacy: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const serviceOptions = [
    { value: 'design', label: 'Product & Experience Design' },
    { value: 'engineering', label: 'Systems & App Engineering' },
    { value: 'strategy', label: 'Product Strategy & Consulting' },
    { value: 'ai', label: 'Artificial Intelligence' },
  ];

  const { data: settings, isLoading } = useSiteSettings();

  const finalLocations = locations.length > 0 
    ? locations 
    : (settings?.office_locations?.length 
        ? settings.office_locations.map(loc => ({
            city: loc.city,
            address: loc.address.split('\n'),
            email: loc.email,
            phone: loc.phone,
          }))
        : (SITE_INFO.locations as readonly OfficeLocation[]));

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.message.trim()) newErrors.message = 'Please describe your request';
    if (!formData.privacy) newErrors.privacy = 'You must accept the privacy policy to proceed';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const nameParts = formData.name.trim().split(/\s+/);
    const first_name = nameParts[0] || 'Anonymous';
    const last_name = nameParts.slice(1).join(' ') || 'Lead';
    const project_type = serviceOptions.find(o => o.value === formData.service)?.label || formData.service;

    try {
      await submitLead({
        first_name,
        last_name,
        email: formData.email,
        message: formData.message,
        project_type,
        source: 'Contact Form'
      });
      setIsSubmitted(true);
      if (onSubmitSuccess) {
        onSubmitSuccess({ ...formData, privacy: String(formData.privacy) });
      }
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 429) {
        setSubmitError('Too many submissions. Please try again in an hour.');
      } else {
        setSubmitError(
          err.response?.data?.message ||
          'Failed to send inquiry. Please check your connection and try again.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <Section
      id={id}
      background={background}
      padding="lg"
      className={className}
    >
      <Container size="lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Info Column */}
          <div className="lg:col-span-5 flex flex-col items-start space-y-12">
            <div>
              {tagline && (
                <span className="text-caption text-accent-primary font-semibold tracking-wider uppercase mb-3 block">
                  {tagline}
                </span>
              )}
              <Heading
                variant="h2"
                className="mb-4 text-3xl md:text-4xl font-medium tracking-tight text-primary-text"
              >
                {title}
              </Heading>
              <Text
                variant="body"
                className="text-secondary-text leading-relaxed text-base"
              >
                {subtitle}
              </Text>
            </div>

            {/* Global Contact Info Block */}
            {isLoading ? (
              <div className="w-full space-y-6 animate-pulse">
                <div className="h-24 bg-surface-light rounded-xl w-full" />
                <div className="h-24 bg-surface-light rounded-xl w-full" />
              </div>
            ) : (
              <div className="space-y-8 w-full border-t border-border-primary pt-8">
                {/* Support & Sales Emails */}
                {(settings?.support_email || settings?.sales_email) && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-primary-text font-semibold tracking-wide">
                      <Mail className="w-5 h-5 text-accent-primary" />
                      Email
                    </div>
                    <div className="pl-8 space-y-2">
                      {settings.support_email && (
                        <div>
                          <span className="text-caption text-secondary-text block mb-0.5">Support</span>
                          <a href={`mailto:${settings.support_email}`} className="text-small hover:text-accent-primary transition-colors">{settings.support_email}</a>
                        </div>
                      )}
                      {settings.sales_email && (
                        <div>
                          <span className="text-caption text-secondary-text block mb-0.5">Sales</span>
                          <a href={`mailto:${settings.sales_email}`} className="text-small hover:text-accent-primary transition-colors">{settings.sales_email}</a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Phone & WhatsApp */}
                {(settings?.phone || settings?.whatsapp) && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-primary-text font-semibold tracking-wide">
                      <Phone className="w-5 h-5 text-accent-primary" />
                      Phone & WhatsApp
                    </div>
                    <div className="pl-8 space-y-2">
                      {settings.phone && (
                        <div>
                          <span className="text-caption text-secondary-text block mb-0.5">Direct Line</span>
                          <a href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`} className="text-small hover:text-accent-primary transition-colors">{settings.phone}</a>
                        </div>
                      )}
                      {settings.whatsapp && (
                        <div>
                          <span className="text-caption text-secondary-text block mb-0.5">WhatsApp</span>
                          <a 
                            href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-small flex items-center gap-1.5 hover:text-green-500 transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            {settings.whatsapp}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Main Office Address & Google Maps */}
                {settings?.office_address && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-primary-text font-semibold tracking-wide">
                      <MapPin className="w-5 h-5 text-accent-primary" />
                      Headquarters
                    </div>
                    <div className="pl-8 space-y-3">
                      <p className="text-small text-secondary-text whitespace-pre-line leading-relaxed">
                        {settings.office_address}
                      </p>
                      {settings.google_maps_url && (
                        <a 
                          href={settings.google_maps_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-medium text-accent-primary hover:text-brand-gold transition-colors"
                        >
                          <Map className="w-4 h-4" />
                          View on Map
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Offices details list (Secondary Locations) */}
            {!isLoading && finalLocations.length > 0 && (
              <div className="space-y-8 w-full mt-12">
                <span className="text-caption font-semibold tracking-wider text-secondary-text uppercase block mb-4">
                  Global Offices
                </span>
                {finalLocations.map((loc, idx) => (
                  <div key={idx} className="space-y-3 border-t border-border-primary pt-6">
                    <span className="block text-small font-semibold text-primary-text uppercase tracking-wider font-sans">
                      {loc.city}
                    </span>
                    <div className="text-small text-secondary-text space-y-1">
                      {loc.address.map((line, lIdx) => (
                        <span key={lIdx} className="block">{line}</span>
                      ))}
                    </div>
                    <div className="space-y-1 pt-1">
                      <a
                        href={`mailto:${loc.email}`}
                        className="block text-small text-primary-text font-medium hover:text-accent-primary transition-colors"
                      >
                        {loc.email}
                      </a>
                      {loc.phone && (
                        <span className="block text-small text-secondary-text">{loc.phone}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Column */}
          <div
            className={cn(
              'lg:col-span-7 bg-surface-light border border-border-primary rounded-xl p-6 md:p-10 shadow-elegant',
              premiumDark && 'bg-primary-bg rounded-2xl shadow-none'
            )}
          >
            {isSubmitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 animate-fade-in">
                <div className="w-12 h-12 bg-primary-text text-primary-bg rounded-full flex items-center justify-center mb-6">
                  <Check className="w-6 h-6" aria-hidden="true" />
                </div>
                <Heading
                  variant="h3"
                  className="text-xl font-medium tracking-tight mb-2 text-primary-text"
                >
                  Thank You
                </Heading>
                <Text
                  variant="body"
                  className="max-w-md text-secondary-text text-small"
                >
                  We have received your message. One of our lead advisors will contact you within one business day.
                </Text>
              </div>
            ) : (
              <FormWrapper
                onSubmit={handleSubmit}
                title="Start a Conversation"
                description="Share details about your upcoming project and our engineering team will prepare a proposal."
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    name="name"
                    label="Name"
                    required
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    error={errors.name}
                    className={premiumDark ? 'bg-primary-bg focus:border-accent-primary focus:bg-primary-bg' : undefined}
                  />
                  <Input
                    name="email"
                    label="Email Address"
                    type="email"
                    required
                    placeholder="jane@company.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={errors.email}
                    className={premiumDark ? 'bg-primary-bg focus:border-accent-primary focus:bg-primary-bg' : undefined}
                  />
                </div>

                <Select
                  name="service"
                  label="Area of Interest"
                  required
                  options={serviceOptions}
                  value={formData.service}
                  onChange={handleInputChange}
                  className={premiumDark ? 'bg-primary-bg focus:border-accent-primary focus:bg-primary-bg' : undefined}
                />

                <TextArea
                  name="message"
                  label="Project Brief"
                  required
                  placeholder="Tell us about the product goals, target timeline, and technology needs..."
                  value={formData.message}
                  onChange={handleInputChange}
                  error={errors.message}
                  className={premiumDark ? 'bg-primary-bg focus:border-accent-primary focus:bg-primary-bg' : undefined}
                />

                <Checkbox
                  name="privacy"
                  label="I consent to the privacy policy and agree that InfinityTech can reach out regarding project options."
                  checked={formData.privacy}
                  onChange={handleCheckboxChange}
                  error={errors.privacy}
                />

                {submitError && (
                  <div className="p-3.5 rounded-lg border border-red-500/20 bg-red-500/05 text-red-500 text-xs font-medium text-center">
                    {submitError}
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full mt-4"
                  isLoading={isSubmitting}
                >
                  Send Inquiry
                </Button>
              </FormWrapper>
            )}
          </div>

        </div>
      </Container>
    </Section>
  );
};
export default ContactSection;
