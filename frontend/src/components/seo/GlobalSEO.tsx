import { useEffect } from 'react';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { resolveImageUrl } from '../../utils/imageHelper';

export const GlobalSEO = () => {
  const { data: settings } = useSiteSettings();

  useEffect(() => {
    if (!settings) return;

    // Title
    if (settings.default_meta_title) {
      document.title = settings.default_meta_title;
    } else if (settings.company_name) {
      document.title = settings.company_name;
    }

    // Helper to set/update meta tags
    const setMetaTag = (name: string, content: string | null | undefined, isProperty = false) => {
      if (!content) return;
      const attr = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to set/update link tags (like canonical, favicon)
    const setLinkTag = (rel: string, href: string | null | undefined) => {
      if (!href) return;
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // ── Base Meta ────────────────────────────────────────────────────────────
    setMetaTag('description', settings.default_meta_description);
    setMetaTag('keywords', settings.default_keywords);

    // ── Canonical URL ─────────────────────────────────────────────────────────
    if (settings.canonical_url) {
      setLinkTag('canonical', settings.canonical_url);
    }

    // ── Robots ────────────────────────────────────────────────────────────────
    const index = settings.robots_index ? 'index' : 'noindex';
    const follow = settings.robots_follow ? 'follow' : 'nofollow';
    setMetaTag('robots', `${index}, ${follow}`);

    // ── Open Graph ────────────────────────────────────────────────────────────
    // Use dedicated OG title override, then fall back to default_meta_title, then company_name
    const ogTitle = settings.open_graph_title || settings.default_meta_title || settings.company_name;
    const ogDescription = settings.open_graph_description || settings.default_meta_description;

    setMetaTag('og:type', 'website', true);
    setMetaTag('og:site_name', settings.company_name, true);
    setMetaTag('og:title', ogTitle, true);
    setMetaTag('og:description', ogDescription, true);

    if (settings.canonical_url) {
      setMetaTag('og:url', settings.canonical_url, true);
    }

    if (settings.open_graph_image_details?.url) {
      setMetaTag('og:image', resolveImageUrl(settings.open_graph_image_details.url) || undefined, true);
    }

    // ── Twitter Card ──────────────────────────────────────────────────────────
    setMetaTag('twitter:card', settings.twitter_card_type || 'summary_large_image');
    setMetaTag('twitter:title', ogTitle);
    setMetaTag('twitter:description', ogDescription);
    if (settings.open_graph_image_details?.url) {
      setMetaTag('twitter:image', resolveImageUrl(settings.open_graph_image_details.url) || undefined);
    }

    // ── Favicon ───────────────────────────────────────────────────────────────
    if (settings.favicon_details?.url) {
      const faviconUrl = resolveImageUrl(settings.favicon_details.url) || '';
      ['icon', 'shortcut icon'].forEach(rel => {
        let element = document.querySelector(`link[rel="${rel}"]`);
        if (!element) {
          element = document.createElement('link');
          element.setAttribute('rel', rel);
          document.head.appendChild(element);
        }
        element.setAttribute('href', faviconUrl);
      });
    }

    // ── Apple Touch Icon ──────────────────────────────────────────────────────
    if (settings.apple_touch_icon_details?.url) {
      let element = document.querySelector('link[rel="apple-touch-icon"]');
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', 'apple-touch-icon');
        document.head.appendChild(element);
      }
      element.setAttribute('href', resolveImageUrl(settings.apple_touch_icon_details.url) || '');
    }

  }, [settings]);

  return null;
};

