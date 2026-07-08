import { useEffect } from 'react';
import { useSiteSettings } from '../../hooks/useSiteSettings';

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

    // Helper to set meta tags
    const setMetaTag = (name: string, content: string | null, isProperty = false) => {
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

    // Helper to set link tags (like canonical)
    const setLinkTag = (rel: string, href: string | null) => {
      if (!href) return;
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    setMetaTag('description', settings.default_meta_description);
    setMetaTag('keywords', settings.default_keywords);
    
    // Open Graph
    setMetaTag('og:title', settings.default_meta_title || settings.company_name, true);
    setMetaTag('og:description', settings.default_meta_description, true);
    setMetaTag('og:site_name', settings.company_name, true);
    
    if (settings.open_graph_image_details?.url) {
      setMetaTag('og:image', settings.open_graph_image_details.url, true);
    }

    // Canonical
    if (settings.canonical_url) {
      setLinkTag('canonical', settings.canonical_url);
    }

    // Favicon
    if (settings.favicon_details?.url) {
      // Find both standard and shortcut icon
      const rels = ['icon', 'shortcut icon'];
      rels.forEach(rel => {
        let element = document.querySelector(`link[rel="${rel}"]`);
        if (!element) {
          element = document.createElement('link');
          element.setAttribute('rel', rel);
          document.head.appendChild(element);
        }
        element.setAttribute('href', settings.favicon_details!.url);
      });
    }

    // Robots
    const index = settings.robots_index ? 'index' : 'noindex';
    const follow = settings.robots_follow ? 'follow' : 'nofollow';
    setMetaTag('robots', `${index}, ${follow}`);

  }, [settings]);

  return null;
};
