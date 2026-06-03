import React, { useState } from 'react';
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

export interface OfficeLocation {
  city: string;
  address: string[];
  email: string;
  phone?: string;
}

export interface ContactSectionProps {
  tagline?: string;
  title: string;
  subtitle: string;
  locations?: OfficeLocation[];
  onSubmitSuccess?: (data: Record<string, string>) => void;
  background?: 'primary' | 'light';
  className?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  tagline,
  title,
  subtitle,
  locations = [],
  onSubmitSuccess,
  background = 'primary',
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

  const serviceOptions = [
    { value: 'design', label: 'Product & Experience Design' },
    { value: 'engineering', label: 'Systems & App Engineering' },
    { value: 'strategy', label: 'Product Strategy & Consulting' },
    { value: 'ai', label: 'Artificial Intelligence' },
  ];

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate API Submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      if (onSubmitSuccess) {
        onSubmitSuccess({ ...formData, privacy: String(formData.privacy) });
      }
    }, 1500);
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

            {/* Offices details list */}
            {locations.length > 0 && (
              <div className="space-y-8 w-full">
                {locations.map((loc, idx) => (
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
          <div className="lg:col-span-7 bg-surface-light border border-border-primary rounded-xl p-6 md:p-10 shadow-elegant">
            {isSubmitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 animate-fade-in">
                <div className="w-12 h-12 bg-neutral-900 text-white rounded-full flex items-center justify-center mb-6">
                  <svg
                    className="w-6 h-6 stroke-[2]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
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
                description="Share details about your upcoming project and our engineering architects will prepare a proposal."
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    name="name"
                    label="Your Name"
                    required
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    error={errors.name}
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
                  />
                </div>

                <Select
                  name="service"
                  label="Area of Interest"
                  required
                  options={serviceOptions}
                  value={formData.service}
                  onChange={handleInputChange}
                />

                <TextArea
                  name="message"
                  label="Project Brief"
                  required
                  placeholder="Tell us about the product goals, target timeline, and technology needs..."
                  value={formData.message}
                  onChange={handleInputChange}
                  error={errors.message}
                />

                <Checkbox
                  name="privacy"
                  label="I consent to the privacy policy and agree that InfinytTech can reach out regarding project options."
                  checked={formData.privacy}
                  onChange={handleCheckboxChange}
                  error={errors.privacy}
                />

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
