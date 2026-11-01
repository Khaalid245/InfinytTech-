import React, { useEffect } from 'react';
import { useSiteSettings } from '../../hooks/useSiteSettings';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface SchemaOrgProps {
  schema?: Record<string, any> | Array<Record<string, any>>;
  breadcrumbs?: BreadcrumbItem[];
}

/**
 * Injects Google & Schema.org compliant JSON-LD structured data into the document head.
 * Automatically cleans up upon route unmount and prevents duplicate script injection.
 */
export const SchemaOrg: React.FC<SchemaOrgProps> = ({ schema, breadcrumbs }) => {
  const { data: settings } = useSiteSettings();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const origin = window.location.origin;
    const schemasToInject: Array<Record<string, any>> = [];

    // 1. Always inject core Organization schema
    const socialLinks = settings?.social_links?.filter(l => l.is_active && l.url).map(l => l.url) || [
      'https://linkedin.com',
      'https://twitter.com',
      'https://github.com',
    ];

    const orgSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${origin}/#organization`,
      name: settings?.company_name || 'Infinity Technologies',
      url: origin,
      logo: {
        '@type': 'ImageObject',
        url: settings?.primary_logo || `${origin}/favicon.svg`,
      },
      description: settings?.company_description || settings?.default_meta_description || 'Enterprise Software Engineering, Cloud Architecture, and AI Transformation.',
      email: settings?.primary_email || settings?.sales_email || 'contact@infinyttech.com',
      telephone: settings?.phone || undefined,
      sameAs: socialLinks,
    };
    schemasToInject.push(orgSchema);

    // 2. Inject BreadcrumbList schema if provided
    if (breadcrumbs && breadcrumbs.length > 0) {
      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url.startsWith('http') ? item.url : `${origin}${item.url}`,
        })),
      };
      schemasToInject.push(breadcrumbSchema);
    }

    // 3. Inject custom schema(s) if provided
    if (schema) {
      if (Array.isArray(schema)) {
        schemasToInject.push(...schema);
      } else {
        schemasToInject.push(schema);
      }
    }

    // Inject into head
    const scriptId = 'infinyttech-schema-ldjson';
    let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = scriptId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }

    scriptEl.textContent = JSON.stringify(
      schemasToInject.length === 1 ? schemasToInject[0] : { '@context': 'https://schema.org', '@graph': schemasToInject }
    );

    return () => {
      // Optional cleanup on unmount
      const el = document.getElementById(scriptId);
      if (el) {
        el.textContent = '';
      }
    };
  }, [schema, breadcrumbs, settings]);

  return null;
};

export default SchemaOrg;
