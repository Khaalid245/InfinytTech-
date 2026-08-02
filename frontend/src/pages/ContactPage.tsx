import Container from '../components/layout/Container';
import Heading from '../components/ui/Heading';
import ContactSection, { type OfficeLocation } from '../sections/ContactSection';
import contactArtwork from '../../docs/contact-us image.webp';
import { useSiteSettings } from '../hooks/useSiteSettings';



export default function ContactPage() {
  const { data: settings } = useSiteSettings();

  const dynamicLocations: OfficeLocation[] = settings?.office_locations?.length 
    ? settings.office_locations.map(loc => ({
        city: loc.city,
        address: loc.address.split('\n'),
        email: loc.email,
        phone: loc.phone,
      }))
    : [];

  return (
    <div className="animate-fade-in bg-primary-bg">
      {/* HERO SECTION */}
      <section className="relative w-full overflow-hidden min-h-screen flex items-center justify-center pt-24 pb-16">
        
        {/* Background Image with Theme-Adaptive Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={contactArtwork}
            alt="Workspace Background"
            className="w-full h-full object-cover object-center"
            aria-hidden="true"
          />
          {/* Dynamic dark overlay reusing existing theme mechanism.
              Light mode -> lighter overlay, Dark mode -> darker overlay */}
          <div className="absolute inset-0 bg-black/15 dark:bg-[#0B0D0F]/60 transition-colors duration-500" />
        </div>

        <Container size="lg" className="relative z-10 w-full">
          <div className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
            <span className="text-caption font-semibold uppercase tracking-wider text-white drop-shadow-md dark:drop-shadow-none">
              CONTACT US
            </span>
            <Heading
              variant="h1"
              className="text-5xl sm:text-6xl lg:text-[5.5rem] font-serif font-light leading-[1.1] tracking-tight text-white drop-shadow-xl dark:drop-shadow-sm"
            >
              Get in Touch
            </Heading>
          </div>
        </Container>

        {/* ── Scroll Indicator ── */}
        <button
          onClick={(e) => {
            e.preventDefault();
            const element = document.getElementById('contact-form');
            if (element) {
              const elementPosition = element.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - 90;
              window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
          }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 animate-fade-in z-20 cursor-pointer text-white/60 hover:text-white transition-all duration-300 drop-shadow-md"
          style={{ animationDelay: '1000ms', animationFillMode: 'forwards' }}
          aria-label="Scroll to contact form"
        >
          <div className="h-14 flex items-start justify-center overflow-hidden pt-1 w-6">
            <svg 
              className="w-4 h-10" 
              viewBox="0 0 16 40" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth={2}
            >
              <path className="animate-scroll-line" strokeLinecap="round" d="M8 0v32" />
              <path className="animate-scroll-chevron" strokeLinecap="round" strokeLinejoin="round" d="M2 26l6 6 6-6" />
            </svg>
          </div>
        </button>
      </section>

      <ContactSection
        id="contact-form"
        tagline="Contact Us"
        title={`Partner with ${settings?.company_name || 'our team'}`}
        subtitle="Have questions about timelines or budgeting? Write to our core team."
        locations={dynamicLocations}
        background="primary"
        premiumDark
        className="pt-0"
      />
    </div>
  );
}
