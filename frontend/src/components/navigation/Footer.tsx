import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Container } from '../layout/Container';
import { Text } from '../ui/Text';
import { Logo } from '../ui/Logo';
import { SITE_INFO, SOCIAL_LINKS, FOOTER_LINKS } from '../../constants';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-surface-light border-t border-border-primary pt-16 pb-8">
      <Container size="lg">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 pb-12 border-b border-border-primary mb-12">
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
              {SITE_INFO.description}
            </Text>
          </div>

          {/* Links Columns */}
          {FOOTER_LINKS.map((group) => (
            <div key={group.title} className="space-y-4">
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
            © {currentYear} {SITE_INFO.name}. All rights reserved.
          </Text>
          <div className="flex items-center gap-6">
            <a
              href={SOCIAL_LINKS.twitter}
              target="_blank; noreferrer"
              rel="noopener noreferrer"
              className="text-caption text-secondary-text hover:text-brand-gold transition-colors uppercase tracking-wider font-semibold"
            >
              Twitter
            </a>
            <a
              href={SOCIAL_LINKS.linkedin}
              target="_blank; noreferrer"
              rel="noopener noreferrer"
              className="text-caption text-secondary-text hover:text-brand-gold transition-colors uppercase tracking-wider font-semibold"
            >
              LinkedIn
            </a>
            <a
              href={SOCIAL_LINKS.github}
              target="_blank; noreferrer"
              rel="noopener noreferrer"
              className="text-caption text-secondary-text hover:text-brand-gold transition-colors uppercase tracking-wider font-semibold"
            >
              GitHub
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
};
export default Footer;
