const iconProps = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: 1.8,
  viewBox: "0 0 24 24"
};

const wrap = (paths) =>
  function Icon({ size = 20, className = "" }) {
    return (
      <svg {...iconProps} className={className} height={size} width={size}>
        {paths}
      </svg>
    );
  };

export const ArrowRight = wrap(<path d="M5 12h14m-6-6 6 6-6 6" />);
export const ChevronLeft = wrap(<path d="m15 18-6-6 6-6" />);
export const BadgeCheck = wrap(
  <>
    <path d="m12 3 2.4 2.1 3.2-.2.9 3 2.8 1.5-1.5 2.8 1.5 2.8-2.8 1.5-.9 3-3.2-.2L12 21l-2.4-2.1-3.2.2-.9-3-2.8-1.5L4.2 12 2.7 9.2l2.8-1.5.9-3 3.2.2z" />
    <path d="m9 12 2 2 4-4" />
  </>
);
export const Building2 = wrap(
  <>
    <path d="M6 22V6l6-3 6 3v16" />
    <path d="M4 22h16M9 9h.01M15 9h.01M9 13h.01M15 13h.01M9 17h.01M15 17h.01" />
  </>
);
export const Recycle = wrap(
  <>
    <path d="m8 8 2-4 2 3M16 8l-2-4-2 3M7 10 4 15l4 1M17 10l3 5-4 1M9 19h6l-2 3" />
  </>
);
export const Shield = wrap(<path d="M12 3 5 6v5c0 5 3.5 8.7 7 10 3.5-1.3 7-5 7-10V6z" />);
export const Menu = wrap(<path d="M4 7h16M4 12h16M4 17h16" />);
export const X = wrap(<path d="m6 6 12 12M18 6 6 18" />);
export const Camera = wrap(
  <>
    <path d="M4 8h4l2-3h4l2 3h4v11H4z" />
    <circle cx="12" cy="13.5" r="3.5" />
  </>
);
export const UploadCloud = wrap(
  <>
    <path d="M7 17a4 4 0 1 1 .9-7.9A5 5 0 0 1 18 11h1a3 3 0 0 1 0 6" />
    <path d="M12 12v8m0-8-3 3m3-3 3 3" />
  </>
);
export const Route = wrap(
  <>
    <circle cx="6" cy="19" r="2" />
    <path d="M6 17V7a2 2 0 1 1 4 0v10a2 2 0 1 0 4 0V5" />
    <circle cx="18" cy="5" r="2" />
  </>
);
export const QrCode = wrap(
  <>
    <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z" />
    <path d="M14 14h3v3h-3zM17 17h3v3h-3zM14 18h2M18 14h2" />
  </>
);
export const RefreshCcw = wrap(
  <>
    <path d="M3 12a9 9 0 0 1 15.5-6.4L21 8M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-15.5 6.4L3 16m0 5v-5h5" />
  </>
);
export const ShieldAlert = wrap(
  <>
    <path d="M12 3 5 6v5c0 5 3.5 8.7 7 10 3.5-1.3 7-5 7-10V6z" />
    <path d="M12 8v4m0 4h.01" />
  </>
);
export const TrendingUp = wrap(<path d="m3 17 6-6 4 4 7-8M14 7h6v6" />);
export const Trophy = wrap(
  <>
    <path d="M8 4h8v3a4 4 0 0 1-8 0zM6 4H4v2a4 4 0 0 0 4 4M18 4h2v2a4 4 0 0 1-4 4M12 11v4M8 21h8M10 15h4" />
  </>
);
export const Bell = wrap(<path d="M6 9a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9m6 12a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2" />);
export const Moon = wrap(<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />);
export const Sun = wrap(
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </>
);
export const Home = wrap(<path d="m3 11 9-7 9 7M5 10v10h14V10M9 20v-6h6v6" />);
export const LayoutDashboard = wrap(
  <>
    <rect x="3" y="3" width="8" height="8" rx="2" />
    <rect x="13" y="3" width="8" height="5" rx="2" />
    <rect x="13" y="10" width="8" height="11" rx="2" />
    <rect x="3" y="13" width="8" height="8" rx="2" />
  </>
);
export const LogOut = wrap(<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />);
export const ShieldCheck = wrap(
  <>
    <path d="M12 3 5 6v5c0 5 3.5 8.7 7 10 3.5-1.3 7-5 7-10V6z" />
    <path d="m9 12 2 2 4-4" />
  </>
);
export const CheckCircle2 = wrap(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="m9 12 2 2 4-4" />
  </>
);
export const Clock3 = wrap(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v6l4 2" />
  </>
);
export const MapPin = wrap(<path d="M12 21s6-5.3 6-11a6 6 0 1 0-12 0c0 5.7 6 11 6 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />);
export const PlayCircle = wrap(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="m10 9 5 3-5 3z" />
  </>
);
export const Sparkles = wrap(<path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5ZM5 17l.8 2.2L8 20l-2.2.8L5 23l-.8-2.2L2 20l2.2-.8ZM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8Z" />);
export const BarChart3 = wrap(<path d="M4 20V10M10 20V4M16 20v-8M22 20V7" />);
export const Users = wrap(
  <>
    <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />
  </>
);
export const ThumbsUp = wrap(<path d="M14 9V5a3 3 0 0 0-3-3l-1 7H5v11h11l4-8V9zM5 20H3V9h2" />);
export const ThumbsDown = wrap(<path d="M10 15v4a3 3 0 0 0 3 3l1-7h5V4H8L4 12v3zM5 4h2v11H5" />);
