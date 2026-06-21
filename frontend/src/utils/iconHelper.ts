// ─── iconHelper.ts ────────────────────────────────────────────────────────────
// Dynamic resolver for Lucide React icons.
// Converts string identifiers from Django CMS models into React components.
// ─────────────────────────────────────────────────────────────────────────────
import * as Lucide from 'lucide-react';

/**
 * Resolves a Lucide icon component by name string.
 * Supports kebab-case ("heart-pulse"), snake_case ("heart_pulse"), 
 * space-separated ("heart pulse"), or PascalCase ("HeartPulse").
 */
export function getLucideIcon(
  iconName: string | null | undefined,
  defaultIcon: Lucide.LucideIcon = Lucide.Layers
): Lucide.LucideIcon {
  if (!iconName) return defaultIcon;

  // Normalize string to PascalCase
  const pascalName = iconName
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  // Attempt lookup by normalized name, exact name, or fallback
  const IconComponent =
    (Lucide as any)[pascalName] ||
    (Lucide as any)[iconName] ||
    defaultIcon;

  return IconComponent;
}
