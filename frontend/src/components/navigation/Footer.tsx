import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Container } from '../layout/Container';
import { Text } from '../ui/Text';
import { Logo } from '../ui/Logo';
import { FOOTER_LINKS } from '../../constants';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { SocialLinks } from '../ui/SocialLinks';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { data: settings } = useSiteSettings();

  return (
    <footer className="w-full bg-surface-light border-t border-border-primary pt-16 pb-8">
      <Container size="lg">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 pb-12 border-b border-border-primary mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              to="/"
              className="block mb-4 transition-opacity hover:opacity-80 w-fit"
            >
              <Logo className="h-10 md:h-12" />
            </Link>
            <Text
              variant="body"
              className="max-w-xs text-secondary-text text-small leading-relaxed"
            >
              {settings?.footer_description}
            </Text>
          </div>

          {/* Contact Column */}
          <div className="space-y-4 lg:col-span-1">
            <span className="block text-caption font-semibold tracking-wider text-primary-text">
              Contact
            </span>
            <ul className="space-y-2.5">
              {settings?.support_email && (
                <li>
                  <a href={`mailto:${settings.support_email}`} className="text-small text-secondary-text hover:text-brand-gold transition-colors">
                    {settings.support_email}
                  </a>
                </li>
              )}
              {settings?.phone && (
                <li>
                  <a href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`} className="text-small text-secondary-text hover:text-brand-gold transition-colors">
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings?.office_address && (
                <li className="text-small text-secondary-text whitespace-pre-line mt-2">
                  {settings.office_address}
                </li>
              )}
            </ul>
          </div>

          {/* Links Columns */}
          {FOOTER_LINKS.map((group) => (
            <div key={group.title} className="space-y-4 lg:col-span-1">
              <span className="block text-caption font-semibold tracking-wider text-primary-text">
                {group.title}
              </span>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="group flex items-center text-small text-secondary-text hover:text-brand-gold transition-colors duration-300"
                    >
                      <div className="overflow-hidden flex items-center transition-all duration-300 ease-out w-0 opacity-0 -translate-x-2 group-hover:w-3.5 group-hover:mr-1.5 group-hover:translate-x-0 group-hover:opacity-100">
                        <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                      </div>
                      <span className="transition-transform duration-300 ease-out">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <Text
            variant="caption"
            className="text-[10px] text-secondary-text tracking-wider uppercase font-semibold"
          >
            © {currentYear} {settings?.company_name}. {settings?.copyright_text}
          </Text>
          <SocialLinks socialLinks={settings?.social_links} />
        </div>
      </Container>
    </footer>
  );
};
export default Footer;
