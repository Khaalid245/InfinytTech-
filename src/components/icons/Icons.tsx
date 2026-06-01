import {
  Code2, Smartphone, ServerCog, BrainCircuit, PenTool, Palette,
  TrendingUp, ChartNoAxesCombined, HeartPulse, Car,
  BriefcaseBusiness, ShieldCheck, ArrowRight, ChevronRight, ChevronDown,
  Mail, Phone, MapPin, Users, Star, Zap, Rocket, Search, Clock,
  Building2, User, Globe, Database, Cpu, Settings, BarChart3, Check,
  Send, BookOpen, MessageSquare, Headphones, Infinity,
} from "lucide-react";
import type { LucideProps } from "lucide-react";
import { ReactElement, ComponentType } from "react";

const SIZE = 24;
const SW = 1.7;

export type IconComponent = (() => ReactElement) & { displayName?: string };

function wrap(Ico: ComponentType<LucideProps>): IconComponent {
  const WrappedIcon: IconComponent = () => <Ico size={SIZE} strokeWidth={SW} />;
  WrappedIcon.displayName = `Icon(${Ico.displayName ?? Ico.name ?? "Lucide"})`;
  return WrappedIcon;
}

export const Icons = {
  // Service icons — intentional picks
  code:         wrap(Code2),               // Web Development
  smartphone:   wrap(Smartphone),          // Mobile App Development
  serverCog:    wrap(ServerCog),           // Custom Software & APIs
  penTool:      wrap(PenTool),             // UI/UX Design
  palette:      wrap(Palette),             // Branding & Graphic Design
  brainCircuit: wrap(BrainCircuit),        // AI Automation

  // Project tag icons
  trending:     wrap(TrendingUp),          // Fintech
  heartPulse:   wrap(HeartPulse),          // Healthcare
  chartCombo:   wrap(ChartNoAxesCombined), // SaaS / Analytics
  brain:        wrap(BrainCircuit),        // AI projects
  car:          wrap(Car),                 // Mobility
  briefcase:    wrap(BriefcaseBusiness),   // Enterprise / Work

  // Navigation & UI chrome
  arrowRight:   wrap(ArrowRight),
  chevronRight: wrap(ChevronRight),
  chevronDown:  wrap(ChevronDown),

  // Contact
  mail:         wrap(Mail),
  phone:        wrap(Phone),
  pin:          wrap(MapPin),

  // Backward-compat aliases (other pages / future sections)
  graph:        wrap(TrendingUp),
  layout:       wrap(PenTool),
  cube:         wrap(Smartphone),
  shieldCheck:  wrap(ShieldCheck),
  shield:       wrap(ShieldCheck),
  heart:        wrap(HeartPulse),
  users:        wrap(Users),
  star:         wrap(Star),
  zap:          wrap(Zap),
  rocket:       wrap(Rocket),
  search:       wrap(Search),
  clock:        wrap(Clock),
  building:     wrap(Building2),
  user:         wrap(User),
  globe:        wrap(Globe),
  database:     wrap(Database),
  cpu:          wrap(Cpu),
  settings:     wrap(Settings),
  barChart:     wrap(BarChart3),
  check:        wrap(Check),
  cloud:        wrap(ServerCog),
  pen:          wrap(Palette),
  send:         wrap(Send),
  bookOpen:     wrap(BookOpen),
  message:      wrap(MessageSquare),
  headset:      wrap(Headphones),
  bag:          wrap(BriefcaseBusiness),
  infinity:     wrap(Infinity),
};

export type IconName = keyof typeof Icons;
