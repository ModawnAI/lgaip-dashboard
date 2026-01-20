'use client';

import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// Shopee - Orange shopping bag icon
export function ShopeeIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="8" fill="#EE4D2D" />
      <path
        d="M24 10C20.134 10 17 13.134 17 17V19H14L12 38H36L34 19H31V17C31 13.134 27.866 10 24 10ZM24 13C26.206 13 28 14.794 28 17V19H20V17C20 14.794 21.794 13 24 13ZM24 24C26.206 24 28 25.794 28 28C28 30.206 26.206 32 24 32C21.794 32 20 30.206 20 28C20 25.794 21.794 24 24 24Z"
        fill="white"
      />
    </svg>
  );
}

// Lazada - Blue/Purple gradient heart-box icon
export function LazadaIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="lazada-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0F146D" />
          <stop offset="50%" stopColor="#F36F21" />
          <stop offset="100%" stopColor="#E31B6D" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="8" fill="url(#lazada-gradient)" />
      <path
        d="M24 36L14 26C12 24 12 21 14 19C16 17 19 17 21 19L24 22L27 19C29 17 32 17 34 19C36 21 36 24 34 26L24 36Z"
        fill="white"
      />
      <path
        d="M18 14H30L32 18H16L18 14Z"
        fill="white"
        opacity="0.8"
      />
    </svg>
  );
}

// eBay - Multi-colored wordmark style icon
export function EbayIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="8" fill="#FFFFFF" />
      <rect x="1" y="1" width="46" height="46" rx="7" stroke="#E5E5E5" strokeWidth="2" fill="none" />
      <text x="4" y="32" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="16">
        <tspan fill="#E53238">e</tspan>
        <tspan fill="#0064D3">b</tspan>
        <tspan fill="#F5AF02">a</tspan>
        <tspan fill="#86B817">y</tspan>
      </text>
    </svg>
  );
}

// Amazon - Black with orange smile arrow
export function AmazonIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="8" fill="#232F3E" />
      <path
        d="M12 28C12 28 18 32 26 32C30 32 34 31 36 30"
        stroke="#FF9900"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M33 27L36 30L33 33"
        stroke="#FF9900"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <text x="10" y="24" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="12" fill="white">
        amazon
      </text>
    </svg>
  );
}

// TikTok - Music note with glitch effect
export function TiktokIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="8" fill="#010101" />
      {/* Cyan shadow */}
      <path
        d="M27 12V30C27 33.314 24.314 36 21 36C17.686 36 15 33.314 15 30C15 26.686 17.686 24 21 24V20C15.477 20 11 24.477 11 30C11 35.523 15.477 40 21 40C26.523 40 31 35.523 31 30V20C33 22 35.5 23 38 23V19C35 19 32 17 31 14V12H27Z"
        fill="#00F2EA"
        transform="translate(-1, 1)"
      />
      {/* Pink shadow */}
      <path
        d="M27 12V30C27 33.314 24.314 36 21 36C17.686 36 15 33.314 15 30C15 26.686 17.686 24 21 24V20C15.477 20 11 24.477 11 30C11 35.523 15.477 40 21 40C26.523 40 31 35.523 31 30V20C33 22 35.5 23 38 23V19C35 19 32 17 31 14V12H27Z"
        fill="#FF0050"
        transform="translate(1, -1)"
      />
      {/* Main white */}
      <path
        d="M27 12V30C27 33.314 24.314 36 21 36C17.686 36 15 33.314 15 30C15 26.686 17.686 24 21 24V20C15.477 20 11 24.477 11 30C11 35.523 15.477 40 21 40C26.523 40 31 35.523 31 30V20C33 22 35.5 23 38 23V19C35 19 32 17 31 14V12H27Z"
        fill="white"
      />
    </svg>
  );
}

// MediaMarkt - Red with stylized M
export function MediamarktIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="8" fill="#DF0000" />
      <path
        d="M10 34V14H16L24 26L32 14H38V34H32V22L24 34L16 22V34H10Z"
        fill="white"
      />
    </svg>
  );
}

// Saturn - Orange planet with ring
export function SaturnIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="8" fill="#F7941D" />
      {/* Planet */}
      <circle cx="24" cy="24" r="10" fill="#FFFFFF" />
      {/* Ring - back */}
      <ellipse
        cx="24"
        cy="24"
        rx="18"
        ry="6"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        fill="none"
        transform="rotate(-20 24 24)"
        strokeDasharray="0 28 100"
      />
      {/* Ring - front */}
      <ellipse
        cx="24"
        cy="24"
        rx="18"
        ry="6"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        fill="none"
        transform="rotate(-20 24 24)"
        strokeDasharray="28 0 0"
        strokeDashoffset="-28"
      />
    </svg>
  );
}

// Otto - Orange/Red with OTTO text
export function OttoIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="8" fill="#D60A24" />
      <text
        x="24"
        y="30"
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
        fontSize="14"
        fill="white"
        textAnchor="middle"
      >
        OTTO
      </text>
    </svg>
  );
}

// Galaxus - Blue/Purple gradient with G
export function GalaxusIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="galaxus-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1B4B8A" />
          <stop offset="100%" stopColor="#00A0B0" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="8" fill="url(#galaxus-gradient)" />
      <path
        d="M34 24H26V28H30C29 31 27 33 24 33C20 33 17 30 17 26C17 22 20 19 24 19C26.5 19 28.5 20 30 22L33 19C31 16 28 14 24 14C17 14 12 19 12 26C12 33 17 38 24 38C31 38 36 33 36 26C36 25 36 24 34 24Z"
        fill="white"
      />
    </svg>
  );
}

// Kaufland - Red K in white square
export function KauflandIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="8" fill="#E10915" />
      <rect x="8" y="8" width="32" height="32" rx="2" fill="white" />
      <path
        d="M16 12V36H22V27L30 36H38L28 25L37 12H30L22 23V12H16Z"
        fill="#E10915"
      />
    </svg>
  );
}

// Platform icon mapping
export const platformIcons: Record<string, React.ComponentType<IconProps>> = {
  shopee: ShopeeIcon,
  lazada: LazadaIcon,
  ebay: EbayIcon,
  amazon: AmazonIcon,
  tiktok: TiktokIcon,
  mediamarkt: MediamarktIcon,
  saturn: SaturnIcon,
  otto: OttoIcon,
  galaxus: GalaxusIcon,
  kaufland: KauflandIcon,
};

// Helper component to render platform icon by name
export function PlatformIcon({
  platform,
  className = '',
  size = 24,
}: {
  platform: string;
  className?: string;
  size?: number;
}) {
  const Icon = platformIcons[platform.toLowerCase()];
  if (!Icon) {
    // Fallback for unknown platforms
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-gray-500 text-white font-bold ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.4 }}
      >
        {platform.substring(0, 2).toUpperCase()}
      </div>
    );
  }
  return <Icon className={className} size={size} />;
}

export default PlatformIcon;
