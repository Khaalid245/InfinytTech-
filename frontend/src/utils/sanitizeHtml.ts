import DOMPurify, { type Config } from 'dompurify';

/**
 * Strict DOMPurify configuration for user-generated and CMS rich text content.
 * Allows common formatting and typography tags while neutralizing
 * scripts, iframes, objects, forms, and inline event handlers.
 */
const DEFAULT_ALLOWED_TAGS = [
  'a', 'abbr', 'b', 'blockquote', 'br', 'caption', 'cite', 'code', 'dd', 'del',
  'div', 'dl', 'dt', 'em', 'figcaption', 'figure', 'h1', 'h2', 'h3',
  'h4', 'h5', 'h6', 'hr', 'i', 'img', 'ins', 'kbd', 'li', 'mark',
  'ol', 'p', 'pre', 'q', 's', 'samp', 'small', 'span', 'strong',
  'sub', 'sup', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr',
  'u', 'ul', 'var'
];

const DEFAULT_ALLOWED_ATTR = [
  'href', 'target', 'rel', 'src', 'alt', 'title', 'class', 'id',
  'width', 'height', 'loading', 'align', 'valign', 'colspan', 'rowspan'
];

const SANITIZE_CONFIG: Config = {
  ALLOWED_TAGS: DEFAULT_ALLOWED_TAGS,
  ALLOWED_ATTR: DEFAULT_ALLOWED_ATTR,
  ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i,
  ADD_ATTR: ['target', 'rel'],
  FORBID_TAGS: ['script', 'style', 'iframe', 'frame', 'object', 'embed', 'form', 'input', 'button', 'textarea', 'select'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'style'],
  RETURN_TRUSTED_TYPE: false,
};

type DOMPurifyFactory = (w: unknown) => typeof DOMPurify;

let cachedPurifier: typeof DOMPurify | null = null;

/**
 * Retrieves the active DOMPurify instance, handling both browser window
 * contexts and test/mock window environments.
 */
function getPurifierInstance(): typeof DOMPurify {
  if (cachedPurifier) {
    return cachedPurifier;
  }

  let purifier: typeof DOMPurify;

  if (typeof window !== 'undefined') {
    const candidate = DOMPurify as unknown as { sanitize?: unknown };
    if (typeof candidate.sanitize === 'function') {
      purifier = DOMPurify;
    } else {
      purifier = (DOMPurify as unknown as DOMPurifyFactory)(window);
    }
  } else {
    purifier = DOMPurify;
  }

  // Enforce reverse-tabnabbing protection on external links
  if (purifier && typeof purifier.addHook === 'function') {
    purifier.addHook('afterSanitizeAttributes', (node) => {
      if ('target' in node && (node as Element).getAttribute('target') === '_blank') {
        (node as Element).setAttribute('rel', 'noopener noreferrer');
      }
    });
  }

  cachedPurifier = purifier;
  return purifier;
}

/**
 * Sanitizes an untrusted HTML string to prevent Stored & Reflected Cross-Site Scripting (XSS).
 *
 * @param dirty - Raw HTML string from CMS or user input
 * @param customConfig - Optional DOMPurify configuration overrides
 * @returns Clean, safe HTML string
 */
export function sanitizeHtml(
  dirty: string | null | undefined,
  customConfig?: Config
): string {
  if (!dirty || typeof dirty !== 'string') {
    return '';
  }

  const purifier = getPurifierInstance();
  const config = { ...SANITIZE_CONFIG, ...customConfig };

  const clean = purifier.sanitize(dirty, config);

  return typeof clean === 'string' ? clean : String(clean);
}

export default sanitizeHtml;
