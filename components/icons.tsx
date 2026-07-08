import * as React from "react";

type P = React.SVGProps<SVGSVGElement>;

export const SearchIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx={11} cy={11} r={7} />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export const SlidersIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" {...p}>
    <line x1={4} y1={21} x2={4} y2={14} />
    <line x1={4} y1={10} x2={4} y2={3} />
    <line x1={12} y1={21} x2={12} y2={12} />
    <line x1={12} y1={8} x2={12} y2={3} />
    <line x1={20} y1={21} x2={20} y2={16} />
    <line x1={20} y1={12} x2={20} y2={3} />
    <line x1={1} y1={14} x2={7} y2={14} />
    <line x1={9} y1={8} x2={15} y2={8} />
    <line x1={17} y1={16} x2={23} y2={16} />
  </svg>
);

export const GridIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x={3} y={3} width={7} height={7} rx={1.5} />
    <rect x={14} y={3} width={7} height={7} rx={1.5} />
    <rect x={3} y={14} width={7} height={7} rx={1.5} />
    <rect x={14} y={14} width={7} height={7} rx={1.5} />
  </svg>
);

export const ChevronDown = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const ChevronRight = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);

export const ClockIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx={12} cy={12} r={9} />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const EyeIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx={12} cy={12} r={3} />
  </svg>
);

export const UsersIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx={9} cy={7} r={4} />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const HomeIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="m3 10 9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
    <path d="M9 21v-6h6v6" />
  </svg>
);

export const ChatIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
  </svg>
);

export const UserIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx={12} cy={8} r={4} />
    <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
  </svg>
);

export const MoreIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx={12} cy={5} r={1} />
    <circle cx={12} cy={12} r={1} />
    <circle cx={12} cy={19} r={1} />
  </svg>
);

export const CloseIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export const TikTokIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M16.5 3c.3 2.1 1.5 3.5 3.5 3.7v2.5c-1.2.1-2.4-.2-3.5-.8v5.9c0 3.2-2.4 5.7-5.6 5.7A5.5 5.5 0 0 1 5.4 14c0-3 2.4-5.4 5.6-5.4.3 0 .6 0 .9.1v2.7a2.9 2.9 0 0 0-1-.2 2.8 2.8 0 1 0 2.8 2.8V3h2.8Z" />
  </svg>
);

export const CodeIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 4l-4 16" />
  </svg>
);

export const DesignIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx={12} cy={12} r={9} />
    <circle cx={12} cy={12} r={3} />
    <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
  </svg>
);

export const TextIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M4 6h16M4 12h16M4 18h10" />
  </svg>
);

export const VideoIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x={2} y={5} width={14} height={14} rx={2} />
    <path d="m22 8-6 4 6 4V8Z" />
  </svg>
);

export const CryptoIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx={12} cy={12} r={9} />
    <path d="M9.5 8h4a2.5 2.5 0 0 1 0 5h-4Zm0 5h4.5a2.5 2.5 0 0 1 0 5H9.5Zm1.5-7v12" />
  </svg>
);

export const BellIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

export const PlusIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const StarIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.6 1.1 6.45L12 17.9l-5.8 3.05 1.1-6.45-4.7-4.6 6.5-.95z" />
  </svg>
);

export const WalletIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v2" />
    <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H5" />
    <circle cx={16.5} cy={12.5} r={1.2} fill="currentColor" stroke="none" />
  </svg>
);

export const SettingsIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx={12} cy={12} r={3} />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
  </svg>
);

export const LogoutIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="m16 17 5-5-5-5M21 12H9" />
  </svg>
);

export const CheckIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const SunIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx={12} cy={12} r={4} />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

export const GiftIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M20 12v9H4v-9M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
  </svg>
);

export const MoonIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
  </svg>
);

export const SendIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M22 2 11 13" />
    <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
  </svg>
);

export const ChevronLeft = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export const BriefcaseIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x={2} y={7} width={20} height={14} rx={2} />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);