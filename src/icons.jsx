export function CategoryIcon({ category, size = 48 }) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(13,18,13,0.75)",
    strokeWidth: 1.6,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  switch (category) {
    case "Audio":
      return (
        <svg {...props}>
          <path d="M4 13a8 8 0 0 1 16 0" />
          <rect x="2.5" y="13" width="4" height="7" rx="1.5" />
          <rect x="17.5" y="13" width="4" height="7" rx="1.5" />
        </svg>
      );
    case "Périphériques":
      return (
        <svg {...props}>
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <path d="M7 10h.01M11 10h.01M15 10h.01M9 14h6" />
        </svg>
      );
    case "Vidéo":
      return (
        <svg {...props}>
          <rect x="3" y="6" width="13" height="12" rx="2" />
          <path d="M16 10.5 21 8v8l-5-2.5Z" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <path d="M3.5 8.5 12 4l8.5 4.5-8.5 4.5-8.5-4.5Z" />
          <path d="M3.5 8.5V16l8.5 4.5 8.5-4.5V8.5" />
          <path d="M12 13v7.5" />
        </svg>
      );
  }
}

export function HeartIcon({ filled, size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M12 20.5s-7.5-4.6-10-9.3C0.3 7.8 2 4.5 5.3 4.5c2 0 3.4 1.1 4.2 2.2.3.4.9.4 1.2 0 .8-1.1 2.2-2.2 4.2-2.2 3.3 0 5 3.3 3.3 6.7-2.5 4.7-10 9.3-10 9.3Z" />
    </svg>
  );
}

export function SearchIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}