"use client";

// ─── Wedding Christian — Preset Template Component ─────────────────────────────
// Desktop (≥768px): 1440px canvas with scale() transform origin top center
// Mobile (<768px): Natively designed responsive layout, no scale transform

import { useEffect, useRef, useState } from "react";
import type { InviteProps, UserData, SupportedLanguage } from "@/types/invite-schema";
import { resolveField } from "@/types/invite-schema";
import { UniversalRSVPForm, type RSVPThemeConfig, type RSVPFieldConfig } from "@/components/rsvp/UniversalRSVPForm";
import { MomentsSection } from "@/components/invite/MomentsSection";
import type { InvitationEvent } from "@/types/invitation";
import { ChevronDown, Heart, MapPin, Calendar, Clock, Navigation, Compass } from "lucide-react";

// ─── Asset Registry ───────────────────────────────────────────────────────────
const getStorageBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (envUrl) {
    return `${envUrl.replace(/\/$/, "")}/storage/v1/object/public`;
  }
  return "https://vhhlzktemdywbhsrmsmx.supabase.co/storage/v1/object/public";
};
const STORAGE_BASE = getStorageBaseUrl();
const WB = `${STORAGE_BASE}/invitation-assets/wedding-christian/default_assets`;

const A = {
  churchImg: `${WB}/7eab8c344432818aa963694080c61d8d2e87c25e.png`,
  receptionImg: `${WB}/b3ee864fc675af1ee9e102385e951f27ecad21df.png`,
  coupleImg: `${WB}/59b884afd088caa887e004830968f6ab019e9ce1.png`,
};

// ─── Colors ───────────────────────────────────────────────────────────────────
const C = {
  navy: "#0F172B",
  navyDark: "#020618",
  gold: "#FFB900",
  goldLight: "#fee685",
  goldDark: "#bb4d00",
  bgCream: "#FAFAF9",
  bgGrey: "#f5f5f4",
  textGray: "#62748e",
  textMuted: "#d6d3d1",
  white: "#ffffff",
};

// ─── Fonts ────────────────────────────────────────────────────────────────────
const F = {
  serif: "'Cormorant Garamond', Georgia, serif",
  sans: "'Lato', sans-serif",
};

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Lato:ital,wght@0,100;0,300;0,400;0,700;1,300;1,400&display=swap');
`;

const Ornament4 = ({ fill, className, style }: { fill: string; className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 812.57 131.016" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path fillRule="evenodd" clipRule="evenodd" d="M383.43 39.3456C378.639 40.3021 376.383 35.3973 379.275 31.8863C379.578 31.5208 379.976 31.2462 380.428 31.0941C382.789 30.3018 384.588 30.8892 385.82 32.8568C386.511 33.9494 386.118 35.0148 386.337 36.0942C386.422 36.5576 386.69 36.9623 387.078 37.2143C391.019 39.7378 394.169 43.0891 396.53 47.2698C398.2 50.2205 399.04 51.6961 399.045 51.6961C399.288 51.8327 399.591 51.7459 399.731 51.5024C399.775 51.5024 399.775 51.5024 399.775 51.5024ZM254.095 29.8509C276.664 25.0561 303.74 31.7638 316.085 52.3242C321.855 61.9419 324.036 72.0381 322.63 82.6123C320.384 99.5713 311.473 111.275 295.893 117.723C284.02 122.632 272.505 123.096 261.343 119.116C245.859 113.584 235.366 100.865 236.759 84.0472C237.57 74.1418 243.006 64.4694 251.607 60.0978C253.969 58.9044 255.686 57.9846 256.759 57.3379C256.953 57.2109 257.008 56.9488 256.883 56.7525C256.808 56.6355 256.68 56.5633 256.543 56.5597C245.553 56.6597 234.64 59.0596 223.803 63.759C213.319 68.3037 203.37 72.9353 193.958 77.6528C169.495 89.9215 146.912 99.6758 123.004 106.329C118.135 107.686 111.5 108.797 103.098 109.663C80.8118 111.957 55.6863 104.689 48.3703 80.8229C48.176 80.1979 47.607 79.7721 46.9639 79.7706H12.521C12.0067 79.7706 11.5127 79.9548 11.128 80.2897C8.04477 83.0085 4.08289 84.7165 1.24268 80.8365C-3.39559 74.4837 6.09763 67.0927 10.8984 73.9099C11.3487 74.552 12.0743 74.9331 12.8456 74.9346H46.1389C46.7367 74.9346 47.2208 74.4456 47.2213 73.8416L47.2208 73.8145C46.8963 62.2477 50.8587 53.0442 59.1075 46.2045C70.2775 36.9277 88.75 36.8458 98.2293 48.622C105.437 57.598 105.911 71.7921 96.2956 78.9376C82.7456 89.0062 62.5291 73.3907 74.5644 58.8823C75.3526 57.9213 76.7421 57.7476 77.7286 58.4862L78.1346 58.7864C78.8567 59.3166 79.0411 60.3258 78.5536 61.0814C76.8678 63.7504 75.9976 65.1577 75.9435 65.3033C73.7662 70.918 78.9999 76.0818 84.1793 76.9976C89.327 77.9079 93.4693 76.0226 96.6067 71.3413C100.163 66.0268 99.4056 58.8959 95.971 53.4584C89.8046 43.6906 77.3092 41.969 67.2077 46.8873C51.7239 54.4144 47.843 73.828 57.2821 88.4594C65.6392 101.411 83.7057 106.124 98.6353 105.154C119.866 103.779 139.461 97.3442 157.42 85.8502C169.32 78.2272 182.725 69.1055 197.637 58.4862C214.216 46.6824 233.675 34.1954 254.095 29.8509ZM296.504 112.258C323.713 99.1837 325.264 61.9154 302.492 44.2916C277.261 24.7418 244.872 33.7033 220.531 49.2094C202.167 60.9042 185.637 72.248 170.942 83.2409C170.91 83.273 170.898 83.3207 170.911 83.3649C170.932 83.4297 171 83.4658 171.064 83.4458C181.693 78.5365 194.08 72.5302 208.225 65.4259C219.936 59.5516 235.366 53.3766 248.699 52.0647C261.708 50.7944 276.272 54.9887 282.116 67.4612C286.55 76.9158 283.573 88.0769 273.285 91.984C263.29 95.7958 253.067 88.6512 254.068 77.5168C254.257 75.3579 254.834 73.6322 255.799 72.3384C256.527 71.3589 257.857 71.0727 258.909 71.6691L259.004 71.7379L259.014 71.7434C260.058 72.3324 260.428 73.6689 259.842 74.7298C254.203 84.8526 267.441 92.6538 275.179 85.6318C282.464 79.0059 279.502 67.4477 271.849 63.2262C265.344 59.647 256.786 61.6829 251.146 66.0815C240.545 74.3467 238.814 89.3341 245.481 100.865C255.677 118.515 280.083 120.141 296.504 112.258ZM810.535 73.3089C815.674 78.4451 810.212 85.2899 803.776 82.8312C803.368 82.6781 803.005 82.4296 802.722 82.1067L801.112 80.2762C800.819 79.9458 800.401 79.757 799.959 79.757H765.072C764.664 79.756 764.301 80.0357 764.192 80.4403C755.132 111.916 716.323 113.693 691.196 106.807C672.147 101.588 655.166 95.4041 640.256 88.2551C612.018 74.7202 597.894 67.9487 597.874 67.9397C584.69 61.8194 570.869 56.3544 557.291 56.86C557.048 56.879 556.864 57.0959 556.884 57.344C556.894 57.5086 556.993 57.6527 557.142 57.7205C580.659 67.9262 581.862 99.9077 561.257 114.116C548.082 123.188 531.235 123.638 516.559 117.668C492.829 108.023 483.307 81.4781 493.316 58.1443C498.365 46.3767 507.475 37.8841 520.644 32.6656C554.359 19.3179 587.368 38.9635 614.091 58.0212C629.119 68.741 643.725 78.5686 657.919 87.503C672.853 96.9023 689.268 102.663 707.154 104.785C729.374 107.422 757.349 100.632 760.365 73.7592C761.99 59.1966 751.549 46.3405 737.092 44.4417C726.263 43.0208 714.887 50.0428 713.764 61.601C713.207 67.2383 714.877 71.5602 718.769 74.5656C723.664 78.3367 730.428 78.049 734.756 73.3907C737.937 69.9666 737.678 65.9545 733.981 61.3545C733.28 60.4644 733.424 59.166 734.309 58.4556C734.93 57.9535 735.785 57.8636 736.501 58.2261C738.354 59.1916 739.656 60.7716 740.407 62.9667C747.846 84.8119 712.507 90.3995 709.167 66.4365C707.462 54.2371 715.593 43.5676 726.924 40.5757C735.064 38.4304 743.786 39.6052 750.967 44.3599C760.857 50.9084 765.638 60.8038 765.315 74.0464C765.3 74.5294 765.678 74.9326 766.155 74.9482H799.706C800.098 74.9487 800.476 74.8131 800.774 74.5656C804.074 71.9016 806.991 69.7567 810.535 73.3089ZM643.298 84.1426C643.382 83.9985 643.343 83.8098 643.203 83.7053C616.084 65.1527 599.649 54.0689 593.884 50.453C573.791 37.8158 551.83 29.0586 529.451 34.8511C506.148 40.89 490.448 60.4668 495.115 85.3451C496.829 94.5114 502.415 102.982 509.463 108.078C522.245 117.322 536.314 119.221 551.666 113.775C562.226 110.032 569.989 100.154 570.978 88.9515C571.922 78.4044 567.216 68.486 557.863 63.6093C547.595 58.2808 535.439 60.9724 533.317 73.7733C531.245 86.164 545.851 94.2248 553.261 83.0225C554.543 81.1006 554.394 78.2177 552.819 74.3743C552.789 74.308 552.764 74.2402 552.744 74.172C552.446 73.1512 553.022 72.0803 554.031 71.7786L554.101 71.751C555.328 71.3869 556.645 71.9453 557.252 73.09C561.784 81.7382 556.278 91.0145 547.138 92.7085C535.559 94.8534 527.314 84.7024 528.517 73.1718C529.868 60.3167 542.228 53.472 554.021 52.2836C572.762 50.3983 593.735 60.0296 610.249 68.3906C622.962 74.8252 629.045 77.571 642.92 84.2651C643.054 84.3264 643.213 84.2732 643.283 84.1426H643.298ZM448.3 43.7172C455.725 45.6662 460.68 50.216 463.159 57.3656C465.47 64.0055 464.283 72.6803 459.427 77.3938C452.678 83.9378 441.372 84.6206 435.697 76.5874C432.854 72.5889 432.63 68.1536 435.016 63.281C435.637 62.0183 436.989 61.2973 438.37 61.4916L438.818 61.5599C439.653 61.6769 440.234 62.4616 440.115 63.3131C440.085 63.535 440.005 63.7479 439.886 63.9367C431.974 76.3962 450.909 84.0332 457.911 71.1229C460.421 66.4963 460.357 61.6327 457.723 56.5321C452.137 45.7119 438.952 45.6989 429.932 52.0923C424.057 56.2545 420.256 61.9972 418.531 69.3199C418.452 69.6794 418.67 70.0379 419.018 70.1192L419.048 70.1257C426.567 71.519 426.284 82.776 418.914 83.9378C418.486 84.0046 418.193 84.4147 418.263 84.8546C418.263 84.8817 418.268 84.9083 418.278 84.9349C419.207 88.5689 421.135 91.2239 424.062 92.8993C424.455 93.1252 424.887 93.2738 425.335 93.3371L431.462 94.2248C432.436 94.3649 433.326 94.8775 433.947 95.6597C435.384 97.4626 435.856 99.5482 435.369 101.916C434.206 107.627 428.689 109.389 423.511 107.9C420.941 107.153 418.67 105.641 416.692 103.365C416.523 103.173 416.235 103.158 416.046 103.329C415.902 103.458 415.852 103.663 415.922 103.842C418.129 109.444 419.361 113.884 415.385 119.171C411.822 123.889 409.118 127.677 407.27 130.537C407.061 130.866 406.708 131.025 406.216 131.015C405.729 131.015 405.381 130.856 405.172 130.537C403.324 127.677 400.625 123.884 397.072 119.157C393.096 113.857 394.343 109.43 396.545 103.829C396.639 103.589 396.52 103.32 396.282 103.228C396.103 103.158 395.904 103.207 395.775 103.351C393.802 105.618 391.53 107.126 388.961 107.873C383.778 109.348 378.261 107.585 377.113 101.875C376.626 99.5076 377.098 97.4215 378.535 95.6185C379.161 94.8368 380.045 94.3242 381.019 94.1836L387.162 93.3095C387.609 93.2462 388.037 93.0976 388.429 92.8722C391.361 91.1963 393.295 88.5463 394.234 84.9213C394.343 84.4901 394.095 84.0513 393.677 83.9403C393.648 83.9333 393.623 83.9278 393.598 83.9242C386.228 82.7494 386.959 71.4919 393.474 70.1122C393.826 70.0474 394.06 69.7 393.995 69.337C393.995 69.3259 393.99 69.3164 393.99 69.3059C392.286 61.9741 388.494 56.2228 382.615 52.0511C373.61 45.6436 360.425 45.6436 354.829 56.4503C352.185 61.5508 352.115 66.4144 354.61 71.0405C361.603 83.9649 369.556 74.1495 361.887 62.0373C361.443 61.3332 361.641 60.399 362.331 59.951C362.509 59.8339 362.712 59.7584 362.924 59.7286L363.359 59.6618C364.705 59.4761 366.018 60.1821 366.616 61.4132C368.923 66.1451 368.696 70.4528 365.931 74.3353C360.415 82.1233 349.435 81.4465 342.886 75.0788C338.18 70.4883 337.041 62.0636 339.3 55.616C341.713 48.6817 346.53 44.2726 353.745 42.3886C370.028 38.1692 383.764 52.1927 387.19 67.0388C387.306 67.5239 387.731 67.8686 388.218 67.8745H394.536L400.839 67.8881C401.326 67.8818 401.746 67.5371 401.862 67.052C405.318 52.2059 419.077 38.2092 435.351 42.4545ZM416.611 95.8416C408.059 95.4701 403.633 89.9776 401.862 82.0701C401.78 81.7362 401.5 81.4943 401.167 81.4734C400.525 81.429 398.344 81.4022 394.613 81.3939C390.883 81.3763 388.696 81.3802 388.059 81.407C387.721 81.4217 387.432 81.6655 387.35 82.0043C385.496 89.8976 381.032 95.3506 372.485 95.6422C372.36 95.6461 372.234 95.6651 372.109 95.6997C371.274 95.9342 370.781 96.8177 371.013 97.6719C372.157 101.825 375.979 101.122 378.971 99.3974C383.962 96.5047 387.34 92.14 389.111 86.3023C389.328 85.5948 389.734 85.1218 390.318 84.8829C390.554 84.7874 390.81 84.7342 391.066 84.7284C392.171 84.7006 393.064 85.5241 393.064 86.568C393.074 93.4135 390.11 100.326 387.417 107.981C387.07 108.965 387.229 110.06 387.837 110.913L394.309 120.028C394.324 120.05 394.357 120.061 394.391 120.054H394.483C394.512 120.061 394.546 120.05 394.56 120.028L401.114 110.979C401.727 110.131 401.896 109.035 401.558 108.047C398.933 100.366 396.032 93.4266 396.109 86.5811C396.109 86.3408 396.162 86.1048 396.259 85.8854C396.674 84.9307 397.842 84.4997 398.865 84.9229C399.454 85.1706 399.854 85.6479 400.062 86.3559C401.78 92.2106 405.12 96.6066 410.081 99.5428C413.064 101.294 416.872 102.024 418.054 97.8845C418.088 97.7636 418.107 97.6383 418.112 97.512C418.151 96.6266 417.48 95.8787 416.611 95.8416ZM407.19 72.8102L382.379 72.9418C381.988 72.9438 381.669 73.6673 381.669 73.6673L381.684 76.4957C381.689 76.8941 382.007 77.2154 382.403 77.2139L407.214 77.0823C407.605 77.0803 407.924 76.7556 407.924 76.3572L407.909 73.5284C407.905 73.13 407.586 72.8082 407.19 72.8102Z" fill={fill} />
  </svg>
);

// Helper component for absolute positioning in fixed desktop canvas
function Abs({
  x,
  y,
  w,
  h,
  z = 1,
  children,
  style,
}: {
  x: number | string;
  y: number | string;
  w?: number | string;
  h?: number | string;
  z?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        zIndex: z,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Scroll Reveal Animation Component ────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setVis(true);
      }
    }, { threshold: 0.05 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, vis };
}

function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const { ref, vis } = useReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : "translateY(24px)",
        transition: `opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function WeddingChristianComponent({
  userData,
  language = "en",
  enabledAddons,
  isPreview = false,
  eventId,
}: InviteProps) {
  // ── State ────────────────────────────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(true);
  const [contentH, setContentH] = useState(0);

  // ── Dynamic user fields ──────────────────────────────────────
  const groom = resolveField(userData.groomName || userData.groom_name, language) || "James";
  const bride = resolveField(userData.brideName || userData.bride_name, language) || "Eleanor";
  const couplePhoto = (userData.couplePhoto as string) || A.coupleImg;
  const groomParents = resolveField(userData.groomParents, language) || "Mr. & Mrs. Robert Vance";
  const brideParents = resolveField(userData.brideParents, language) || "Mr. & Mrs. William Stirling";
  const blessings = resolveField(userData.blessingsLine1 || userData.blessings, language) || "Join us for the holy matrimony of";

  // Rehearsal Dinner
  const rehDate = resolveField(userData.rehearsal_date, language);
  const rehTime = resolveField(userData.rehearsal_time, language);
  const rehVenue = resolveField(userData.rehearsal_venue, language) || "The Heritage Estate, Dining Room";

  // Wedding Ceremony
  const wDate = resolveField(userData.wedding_date || userData.weddingDate, language) || "2026-10-16";
  const wTime = resolveField(userData.wedding_time || userData.weddingTime, language) || "15:00";
  const venueName = resolveField(userData.wedding_venue || userData.weddingVenue, language) || "St. Patrick's Cathedral";
  const venueAddress = resolveField(userData.wedding_address || userData.weddingAddress, language) || "123 Heritage Lane, Charleston, SC 29401";

  // Cocktail Hour
  const cockDate = resolveField(userData.cocktail_date, language);
  const cockTime = resolveField(userData.cocktail_time, language);
  const cockVenue = resolveField(userData.cocktail_venue, language) || "The Grand Pavilion";

  // Grand Reception
  const recDate = resolveField(userData.reception_date, language);
  const recTime = resolveField(userData.reception_time, language);
  const recVenue = resolveField(userData.reception_venue, language) || "The Grand Pavilion Ballroom";

  // Story text
  const story = resolveField(userData.story, language) ||
    "We first met on a rainy afternoon in a small coffee shop in Boston. What started as a shared love for poetry and warm pastries quickly blossomed into a lifelong partnership. Over the past five years, we've traveled the world, adopted a mischievous golden retriever named Barnaby, and supported each other through every twist and turn.";
  const story2 = resolveField(userData.story2, language) ||
    "Now, we are thrilled to invite our closest friends and family to witness the next chapter of our story. We can't wait to celebrate our love with you all!";

  const mapsUrl = resolveField(userData.mapsUrl, language) || "https://maps.google.com";
  const dirUrl = resolveField(userData.dirUrl, language) || "https://maps.google.com";
  const contact = resolveField(userData.contactEmail || userData.contact, language) || "hello@invitara.in";

  // Addons & RSVP Form
  const showRsvp = enabledAddons.includes("rsvp");

  const rsvpTheme: RSVPThemeConfig = {
    primaryColor: C.navy,
    textColor: C.navy,
    backgroundColor: C.white,
    fontFamily: F.sans,
    buttonShape: "rounded-md",
  };

  const rsvpFields: RSVPFieldConfig = {
    requireEmail: userData.rsvp_requireEmail as boolean ?? false,
    showPhone: userData.rsvp_showPhone as boolean ?? true,
    requirePhone: userData.rsvp_requirePhone as boolean ?? false,
    showDietary: userData.rsvp_showDietary as boolean ?? true,
    showLeaveMessage: userData.rsvp_showLeaveMessage as boolean ?? true,
    maxGuestsAllowed: (userData.rsvp_maxGuests as number) || 10,
  };

  const previewCeremonies: InvitationEvent[] = [
    { id: "rehearsal", name: "Rehearsal Dinner", event_date: rehDate || "2026-10-15", event_time: rehTime || "6:00 PM - 9:00 PM", venue_name: rehVenue },
    { id: "wedding", name: "Wedding Ceremony", event_date: wDate || "2026-10-16", event_time: wTime || "3:00 PM - 4:00 PM", venue_name: venueName },
    { id: "cocktail", name: "Cocktail Hour", event_date: cockDate || "2026-10-16", event_time: cockTime || "4:30 PM - 6:00 PM", venue_name: cockVenue },
    { id: "reception", name: "Grand Reception", event_date: recDate || "2026-10-16", event_time: recTime || "6:00 PM - 11:00 PM", venue_name: recVenue },
  ].filter(c => c.id === "wedding" || isPreview || rehDate || cockDate || recDate);

  // ── Layout Scaling Logic ────────────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      const parentWidth = containerRef.current?.parentElement?.clientWidth || window.innerWidth;
      const isMob = parentWidth < 768;
      setIsMobile(isMob);

      if (isMob) {
        setScale(parentWidth < 402 ? parentWidth / 402 : 1);
      } else {
        setScale(parentWidth < 1440 ? parentWidth / 1440 : 1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const observer = new ResizeObserver(handleResize);
    if (containerRef.current?.parentElement) {
      observer.observe(containerRef.current.parentElement);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      setContentH(contentRef.current.scrollHeight);
    }
  }, [scale, isMobile, isPreview, userData]);

  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };

  const formatEventDate = (dateStr: string, defaultVal: string) => {
    if (!dateStr) return defaultVal;
    try {
      const date = new Date(dateStr + "T00:00:00");
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const dayName = days[date.getDay()];
      const monthName = months[date.getMonth()];
      const dayNum = date.getDate();
      const suffix = getOrdinalSuffix(dayNum);
      return `${dayName}, ${monthName} ${dayNum}${suffix}`;
    } catch (e) {
      return defaultVal;
    }
  };

  const formatEventTime = (timeStr: string, defaultVal: string) => {
    if (!timeStr) return defaultVal;
    try {
      if (timeStr.includes("AM") || timeStr.includes("PM")) return timeStr;
      const parts = timeStr.split(":");
      const hour = parseInt(parts[0], 10);
      const minutes = parts[1] || "00";
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch (e) {
      return defaultVal;
    }
  };

  const formatHeroDate = (dateStr: string, defaultVal: string) => {
    if (!dateStr) return defaultVal;
    try {
      const date = new Date(dateStr + "T00:00:00");
      const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const monthName = months[date.getMonth()];
      const dayNum = date.getDate();
      const suffix = getOrdinalSuffix(dayNum);
      return `${monthName} ${dayNum}${suffix}, ${date.getFullYear()}`;
    } catch (e) {
      return defaultVal;
    }
  };

  const activeEvents = [
    { 
      key: "rehearsal", 
      title: "Rehearsal Dinner", 
      date: formatEventDate(rehDate, "Friday, October 15th"), 
      time: formatEventTime(rehTime, "6:00 PM - 9:00 PM"), 
      venue: rehVenue 
    },
    { 
      key: "wedding", 
      title: "Wedding Ceremony", 
      date: formatEventDate(wDate, "Saturday, October 16th"), 
      time: formatEventTime(wTime, "3:00 PM - 4:00 PM"), 
      venue: venueName 
    },
    { 
      key: "cocktail", 
      title: "Cocktail Hour", 
      date: formatEventDate(cockDate, "Saturday, October 16th"), 
      time: formatEventTime(cockTime, "4:30 PM - 6:00 PM"), 
      venue: cockVenue 
    },
    { 
      key: "reception", 
      title: "Reception", 
      date: formatEventDate(recDate, "Saturday, October 16th"), 
      time: formatEventTime(recTime, "6:00 PM - 11:00 PM"), 
      venue: recVenue 
    },
  ].filter(e => e.key === "wedding" || isPreview || rehDate || cockDate || recDate);

  // Render Mobile view
  if (isMobile) {
    return (
      <div ref={containerRef} style={{ fontFamily: F.sans, background: C.white, width: "100%", overflowX: "hidden" }}>
        <style>{FONTS}</style>
        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {/* ── HERO SECTION ── */}
        <div style={{ position: "relative", height: "100vh", minHeight: 650, width: "100%" }}>
          <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <img src={A.churchImg} alt="Church Exterior" style={{ width: "100%", height: "100%", objectFit: "cover" }} decoding="async" />
            <div style={{ position: "absolute", inset: 0, background: "rgba(15,23,43,0.65)" }} />
          </div>

          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 1, padding: "0 24px", textAlign: "center" }}>
            <Reveal>
              <p style={{ fontFamily: F.sans, fontSize: 13, letterSpacing: "3.5px", color: "rgba(254,230,133,0.9)", textTransform: "uppercase", margin: "0 0 16px" }}>
                {blessings}
              </p>
            </Reveal>

            <Reveal delay={150}>
              <h1 style={{ fontFamily: F.serif, color: C.white, margin: "0 0 24px" }}>
                <span style={{ display: "block", fontSize: 56, fontWeight: 400, lineHeight: 1.1 }}>{bride}</span>
                <span style={{ display: "block", fontFamily: F.serif, fontStyle: "italic", fontSize: 42, color: C.gold, margin: "4px 0", fontWeight: 300 }}>&amp;</span>
                <span style={{ display: "block", fontSize: 56, fontWeight: 400, lineHeight: 1.1 }}>{groom}</span>
              </h1>
            </Reveal>

            <Reveal delay={300}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <p style={{ fontFamily: F.sans, fontSize: 17, color: "#e7e5e4", fontWeight: 300, letterSpacing: "0.5px", margin: 0 }}>
                  {formatHeroDate(wDate, "October 16th, 2026")}
                </p>
                <div style={{ width: 48, height: "1px", background: "rgba(255,185,0,0.5)" }} />
                <p style={{ fontFamily: F.sans, fontSize: 17, color: "#e7e5e4", fontWeight: 300, letterSpacing: "0.5px", margin: 0 }}>
                  {venueAddress.split(",")[1]?.trim() || "Charleston"}, {venueAddress.split(",")[2]?.trim().split(" ")[0] || "South Carolina"}
                </p>
              </div>
            </Reveal>
          </div>

          <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 2, animation: "bounce 2s infinite" }}>
            <ChevronDown style={{ width: 28, height: 28, color: "rgba(255,255,255,0.7)" }} />
          </div>
        </div>

        {/* ── EVENTS SECTION ── */}
        <div style={{ background: C.bgGrey, padding: "80px 20px" }}>
          <div style={{ maxWidth: 450, margin: "0 auto", textAlign: "center" }}>
            <p style={{ fontFamily: F.sans, fontSize: 13, letterSpacing: "2.5px", color: C.goldDark, textTransform: "uppercase", margin: "0 0 8px" }}>
              JOIN THE CELEBRATION
            </p>
            <h2 style={{ fontFamily: F.serif, fontSize: 36, color: C.navy, margin: "0 0 16px", fontWeight: 500 }}>
              Wedding Events
            </h2>
            
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, margin: "0 auto 48px", opacity: 0.6 }}>
              <div style={{ height: "1px", width: 64, alignSelf: "center", background: "#cad5e2" }} />
              <Heart style={{ width: 14, height: 14, color: C.goldDark }} />
              <div style={{ height: "1px", width: 64, alignSelf: "center", background: "#cad5e2" }} />
            </div>

            {/* Arched Events Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              {activeEvents.map((evt, idx) => (
                <Reveal key={evt.key} delay={idx * 80}>
                  <div style={{
                    background: C.white,
                    border: `1px solid rgba(231,229,228,0.7)`,
                    borderRadius: "150px 150px 12px 12px",
                    padding: "48px 24px 36px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.03)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}>
                    {/* Circle icon header */}
                    <div style={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      background: C.bgCream,
                      border: `1px solid ${C.goldLight}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 20,
                    }}>
                      <Calendar style={{ width: 22, height: 22, color: C.goldDark }} />
                    </div>

                    <h3 style={{ fontFamily: F.serif, fontSize: 24, color: C.navy, fontWeight: 500, margin: "0 0 12px" }}>
                      {evt.title}
                    </h3>
                    <p style={{ fontFamily: F.sans, fontSize: 15, color: C.textGray, fontWeight: 300, margin: "0 0 4px" }}>
                      {evt.date}
                    </p>
                    <p style={{ fontFamily: F.sans, fontSize: 15, color: C.textGray, fontWeight: 300, margin: "0 0 16px" }}>
                      {evt.time}
                    </p>

                    <div style={{ width: 32, height: "1px", background: C.gold, marginBottom: 16 }} />

                    <p style={{ fontFamily: F.sans, fontSize: 15, color: "#314158", fontWeight: 500, margin: 0 }}>
                      {evt.venue}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* ── VENUE SECTION ── */}
        <div style={{ background: C.bgCream, padding: "50px 20px" }}>
          <div style={{ maxWidth: 450, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <h2 style={{ fontFamily: F.serif, fontSize: 36, color: C.navy, margin: 0, fontWeight: 500 }}>
                Venue &amp; Location
              </h2>
            </div>

            {/* Venue Address Card */}
            <Reveal>
              <div style={{
                background: C.white,
                border: "1px solid #e7e5e4",
                borderRadius: 16,
                padding: "32px 24px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                marginBottom: 40,
              }}>
                <h3 style={{ fontFamily: F.serif, fontSize: 26, color: C.navy, fontWeight: 500, margin: "0 0 16px" }}>
                  {venueName}
                </h3>
                
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 20 }}>
                  <MapPin style={{ width: 20, height: 20, color: C.goldDark, marginTop: 3, flexShrink: 0 }} />
                  <p style={{ fontFamily: F.sans, fontSize: 15, color: "#45556c", margin: 0, lineHeight: 1.5 }}>
                    {venueAddress}
                  </p>
                </div>

                <div style={{ borderLeft: `2.5px solid ${C.goldLight}`, paddingLeft: 16, marginBottom: 28 }}>
                  <p style={{ fontFamily: F.sans, fontSize: 14, fontStyle: "italic", color: C.textGray, margin: 0, lineHeight: 1.4 }}>
                    "A beautiful historic sanctuary where our new chapter begins. Please join us for our matrimony ceremony."
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <a href={mapsUrl} target="_blank" rel="noreferrer" style={{
                    background: C.navy,
                    color: C.white,
                    borderRadius: 8,
                    padding: "12px 20px",
                    fontFamily: F.sans,
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                    textAlign: "center",
                    textDecoration: "none",
                  }}>
                    VIEW MAP
                  </a>
                  <a href={dirUrl} target="_blank" rel="noreferrer" style={{
                    background: "transparent",
                    color: C.navy,
                    border: `1.5px solid ${C.navy}`,
                    borderRadius: 8,
                    padding: "11px 20px",
                    fontFamily: F.sans,
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                    textAlign: "center",
                    textDecoration: "none",
                  }}>
                    GET DIRECTIONS
                  </a>
                </div>
              </div>
            </Reveal>

            {/* Reception image mockup */}
            <Reveal delay={100}>
              <div style={{
                width: "100%",
                aspectRatio: "1/1",
                borderRadius: "150px 150px 0 0",
                overflow: "hidden",
                boxShadow: "0 12px 36px rgba(0,0,0,0.1)",
              }}>
                <img src={A.receptionImg} alt="Reception Venue" style={{ width: "100%", height: "100%", objectFit: "cover" }} decoding="async" />
              </div>
            </Reveal>
          </div>
        </div>

        {/* ── COUPLE SECTION ── */}
        <div style={{ background: C.navy, padding: "80px 20px", color: C.white }}>
          <div style={{ maxWidth: 450, margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ fontFamily: F.serif, fontSize: 36, color: C.bgCream, margin: "0 0 16px", fontWeight: 500 }}>
              Meet the Bride &amp; Groom
            </h2>
            
            <div style={{ width: 64, height: "1.5px", background: "rgba(254,154,0,0.5)", margin: "0 auto 32px" }} />

            <p style={{ fontFamily: F.sans, fontSize: 16, fontWeight: 300, color: C.textMuted, lineHeight: 1.7, marginBottom: 20 }}>
              {story}
            </p>
            <p style={{ fontFamily: F.sans, fontSize: 16, fontWeight: 300, color: C.textMuted, lineHeight: 1.7, marginBottom: 48 }}>
              {story2}
            </p>

            {/* Portrait Image */}
            <Reveal>
              <div style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "150px 150px 0 0",
                padding: 16,
                maxWidth: 320,
                margin: "0 auto",
              }}>
                <div style={{
                  width: "100%",
                  aspectRatio: "3/4",
                  borderRadius: "140px 140px 0 0",
                  overflow: "hidden",
                }}>
                  <img src={couplePhoto} alt="James &amp; Eleanor" style={{ width: "100%", height: "100%", objectFit: "cover" }} decoding="async" />
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* ── MOMENTS ── */}
        <MomentsSection
          userData={userData}
          language={language}
          theme={{
            variant: "radial",
            fontHeading: "'Alex Brush', cursive",
            fontBody: F.sans,
            colorHeading: C.goldLight,
            colorText: C.bgCream,
            colorBg: C.navy,
            polaroidBg: C.white,
            tapeColor: "rgba(255, 185, 0, 0.15)",
          }}
        />

        {/* ── RSVP FORM ── */}
        {showRsvp && (
          <div style={{ background: C.bgGrey, padding: "80px 12px 100px" }}>
            <div style={{ maxWidth: 450, margin: "0 auto" }}>
              <UniversalRSVPForm eventId={eventId ?? ""} theme={rsvpTheme} formConfig={rsvpFields} previewCeremonies={isPreview ? previewCeremonies : undefined} isMobile={true} />
            </div>
          </div>
        )}

        {/* ── FOOTER ── */}
        <div style={{ background: C.navyDark, padding: "48px 24px 32px", display: "flex", flexDirection: "column", alignItems: "center", width: "100%", borderTop: "1px solid rgba(255,255,255,0.1)", gap: 20, textAlign: "center" }}>
          {/* Couple Signature Block */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%" }}>
            <p style={{ fontFamily: F.sans, fontSize: 10, letterSpacing: 4, color: "rgba(255,255,255,0.5)", margin: 0, textTransform: "uppercase" }}>THE WEDDING OF</p>
            <p style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 32, color: C.gold, margin: 0, lineHeight: 1 }}>{bride} &amp; {groom}</p>
            
            {/* Horizontal Flourish Ornament */}
            <Ornament4 fill={C.gold} style={{ width: 180, height: "auto", aspectRatio: "812/131", margin: "8px 0" }} />
            
            <p style={{ fontFamily: F.serif, fontSize: 13, color: "rgba(255,255,255,0.8)", margin: 0, lineHeight: 1.3 }}>
              {formatHeroDate(wDate, "October 16th, 2026")} &bull; {venueName}
            </p>
            {contact && (
              <p style={{ fontFamily: F.sans, fontSize: 11, color: "rgba(255,255,255,0.5)", margin: 0 }}>
                Enquiries: <a href={`mailto:${contact}`} style={{ color: C.gold, textDecoration: "none" }}>{contact}</a>
              </p>
            )}
          </div>

          {/* Clean Gold-Gradient CSS Divider */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", margin: "8px 0", gap: "12px" }}>
            <div style={{ height: "1px", width: "80px", background: "linear-gradient(to right, transparent, rgba(255,255,255,0.2))" }} />
            <span style={{ color: C.gold, fontSize: "10px", opacity: 0.6 }}>✦</span>
            <div style={{ height: "1px", width: "80px", background: "linear-gradient(to left, transparent, rgba(255,255,255,0.2))" }} />
          </div>

          {/* Brand & CTA Group */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, width: "100%" }}>
            <a href="https://invitara.com" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", transition: "opacity 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.opacity = "0.8"} onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}>
              <img src="/logo/sec_two_white.svg" alt="Invitara Logo" style={{ height: "30px", display: "block" }} decoding="async" loading="lazy" />
            </a>
            
            <p style={{ fontFamily: F.sans, fontSize: "12px", color: "rgba(255,255,255,0.65)", lineHeight: "1.5", margin: "0 auto", maxWidth: "260px" }}>
              Beautiful digital invitations for every celebration. Build an experience that your guests will cherish forever.
            </p>

            <a href="https://invitara.com" target="_blank" rel="noopener noreferrer" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 20px",
              background: C.gold,
              borderRadius: "20px",
              color: C.navy,
              fontFamily: F.sans,
              fontSize: "12px",
              fontWeight: 600,
              textDecoration: "none",
              letterSpacing: "0.5px",
              transition: "transform 0.2s, background-color 0.2s",
              boxShadow: "0 3px 8px rgba(0,0,0,0.15)"
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.background = C.white; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.background = C.gold; }}
            >
              Create Your Invitation <span style={{ fontSize: "12px", fontWeight: "bold" }}>→</span>
            </a>
          </div>

          {/* Divider */}
          <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.12)", margin: "8px 0 0" }} />

          {/* Bottom bar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
            <p style={{ fontFamily: F.sans, fontSize: "11px", color: "rgba(255,255,255,0.5)", margin: 0 }}>&copy; 2026 Invitara. All rights reserved.</p>
            <p style={{ fontFamily: F.sans, fontSize: "11px", color: "rgba(255,255,255,0.5)", margin: 0 }}>
              A product by <a href="https://3pin.co.in" target="_blank" rel="noopener noreferrer" style={{ color: C.gold, textDecoration: "none", fontWeight: 500 }}>3PIN</a>
            </p>
            
            {/* Socials */}
            <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.5)", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = C.gold} onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.5)", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = C.gold} onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Desktop widescreen scaled view
  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        width: "100%",
        background: C.navyDark,
        height: contentH ? contentH * scale : "auto",
        overflow: "hidden",
      }}
    >
      <div
        ref={contentRef}
        style={{
          width: 1440,
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          flexShrink: 0,
          position: "relative",
          background: C.navyDark,
        }}
      >
      <style>{FONTS}</style>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── HERO SECTION (h:1000px) ── */}
      <Section h={1000} bg={C.navy}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <img src={A.churchImg} alt="Church Exterior" style={{ width: "100%", height: "100%", objectFit: "cover" }} decoding="async" loading="lazy" />
          <div style={{ position: "absolute", inset: 0, background: "rgba(15,23,43,0.65)" }} />
        </div>

        {/* Absolute Centered Content Frame */}
        <Abs x={270} y={150} w={900} h={600} z={1} style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <Reveal>
            <p style={{ fontFamily: F.sans, fontSize: 16, letterSpacing: "4.5px", color: "rgba(254,230,133,0.95)", textTransform: "uppercase", margin: "0 0 28px" }}>
              {blessings}
            </p>
          </Reveal>

          <Reveal delay={150}>
            <h1 style={{ fontFamily: F.serif, color: C.white, margin: "0 0 36px" }}>
              <span style={{ display: "block", fontSize: 96, fontWeight: 400, lineHeight: 1.05 }}>{bride}</span>
              <span style={{ display: "block", fontFamily: F.serif, fontStyle: "italic", fontSize: 68, color: C.gold, margin: "12px 0", fontWeight: 300 }}>&amp;</span>
              <span style={{ display: "block", fontSize: 96, fontWeight: 400, lineHeight: 1.05 }}>{groom}</span>
            </h1>
          </Reveal>

          <Reveal delay={300}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
              <p style={{ fontFamily: F.sans, fontSize: 22, color: "#e7e5e4", fontWeight: 300, letterSpacing: "0.7px", margin: 0 }}>
                {formatHeroDate(wDate, "October 16th, 2026")}
              </p>
              <div style={{ width: 64, height: "1.5px", background: "rgba(255,185,0,0.6)" }} />
              <p style={{ fontFamily: F.sans, fontSize: 22, color: "#e7e5e4", fontWeight: 300, letterSpacing: "0.7px", margin: 0 }}>
                {venueAddress}
              </p>
            </div>
          </Reveal>
        </Abs>

        <div style={{ position: "absolute", bottom: 48, left: "50%", transform: "translateX(-50%)", zIndex: 2, animation: "bounce 2s infinite" }}>
          <ChevronDown style={{ width: 36, height: 36, color: "rgba(255,255,255,0.7)" }} />
        </div>
      </Section>

      {/* ── EVENTS SECTION (h:1100px) ── */}
      <Section h={1100} bg={C.bgGrey}>
        <Abs x={160} y={100} w={1120} style={{ textAlign: "center" }}>
          <Reveal>
            <p style={{ fontFamily: F.sans, fontSize: 14, letterSpacing: "3.5px", color: C.goldDark, textTransform: "uppercase", margin: "0 0 12px" }}>
              JOIN THE CELEBRATION
            </p>
            <h2 style={{ fontFamily: F.serif, fontSize: 54, color: C.navy, margin: "0 0 24px", fontWeight: 500 }}>
              Wedding Events
            </h2>
            
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, margin: "0 auto 64px", opacity: 0.6 }}>
              <div style={{ height: "1px", width: 80, background: "#cad5e2" }} />
              <Heart style={{ width: 18, height: 18, color: C.goldDark }} />
              <div style={{ height: "1px", width: 80, background: "#cad5e2" }} />
            </div>
          </Reveal>

          {/* Cards Grid layout */}
          <div style={{ display: "grid", gridTemplateColumns: activeEvents.length === 4 ? "repeat(4, 1fr)" : "repeat(3, 1fr)", gap: 24, alignItems: "stretch" }}>
            {activeEvents.map((evt, idx) => (
              <Reveal key={evt.key} delay={idx * 100}>
                <div style={{
                  background: C.white,
                  border: `1.1px solid rgba(231,229,228,0.7)`,
                  borderRadius: "170px 170px 16px 16px",
                  padding: "64px 28px 48px",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.03)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  height: "100%",
                }}>
                  {/* Circle icon */}
                  <div style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: C.bgCream,
                    border: `1.5px solid ${C.goldLight}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 28,
                  }}>
                    <Calendar style={{ width: 26, height: 26, color: C.goldDark }} />
                  </div>

                  <h3 style={{ fontFamily: F.serif, fontSize: 28, color: C.navy, fontWeight: 500, margin: "0 0 16px", minHeight: 68, display: "flex", alignItems: "center" }}>
                    {evt.title}
                  </h3>
                  <p style={{ fontFamily: F.sans, fontSize: 16, color: C.textGray, fontWeight: 300, margin: "0 0 6px" }}>
                    {evt.date}
                  </p>
                  <p style={{ fontFamily: F.sans, fontSize: 16, color: C.textGray, fontWeight: 300, margin: "0 0 24px" }}>
                    {evt.time}
                  </p>

                  <div style={{ width: 40, height: "1px", background: C.gold, marginBottom: 20 }} />

                  <p style={{ fontFamily: F.sans, fontSize: 16, color: "#314158", fontWeight: 500, margin: 0, lineHeight: 1.4 }}>
                    {evt.venue}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Abs>
      </Section>

      {/* ── VENUE SECTION (h:780px) ── */}
      <Section h={780} bg={C.bgCream}>
        {/* Venue Title & Subtitle */}
        <Abs x={0} y={60} w={1440}>
          <Reveal>
            <div style={{ textAlign: "center" }}>
              <h2 style={{ fontFamily: F.serif, fontSize: 54, color: C.navy, margin: 0, fontWeight: 500 }}>
                Venue &amp; Location
              </h2>
            </div>
          </Reveal>
        </Abs>

        {/* Left Side: Address Details Card */}
        <Abs x={160} y={180} w={520}>
          <Reveal delay={60}>
            <div style={{
              background: C.white,
              border: "1px solid #e7e5e4",
              borderRadius: 20,
              padding: "48px 40px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.04)",
            }}>
              <h3 style={{ fontFamily: F.serif, fontSize: 32, color: C.navy, fontWeight: 500, margin: "0 0 20px" }}>
                {venueName}
              </h3>
              
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 24 }}>
                <MapPin style={{ width: 24, height: 24, color: C.goldDark, marginTop: 4, flexShrink: 0 }} />
                <p style={{ fontFamily: F.sans, fontSize: 17, color: "#45556c", margin: 0, lineHeight: 1.6 }}>
                  {venueAddress}
                </p>
              </div>

              <div style={{ borderLeft: `3px solid ${C.goldLight}`, paddingLeft: 20, marginBottom: 36 }}>
                <p style={{ fontFamily: F.sans, fontSize: 15, fontStyle: "italic", color: C.textGray, margin: 0, lineHeight: 1.5 }}>
                  "A beautiful historic sanctuary where our new chapter begins. Please join us for our matrimony ceremony."
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <a href={mapsUrl} target="_blank" rel="noreferrer" style={{
                  background: C.navy,
                  color: C.white,
                  borderRadius: 8,
                  padding: "16px 24px",
                  fontFamily: F.sans,
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: "0.5px",
                  textAlign: "center",
                  textDecoration: "none",
                  boxShadow: "0 4px 12px rgba(15,23,43,0.15)",
                }}>
                  VIEW MAP
                </a>
                <a href={dirUrl} target="_blank" rel="noreferrer" style={{
                  background: "transparent",
                  color: C.navy,
                  border: `2px solid ${C.navy}`,
                  borderRadius: 8,
                  padding: "14px 24px",
                  fontFamily: F.sans,
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: "0.5px",
                  textAlign: "center",
                  textDecoration: "none",
                }}>
                  GET DIRECTIONS
                </a>
              </div>
            </div>
          </Reveal>
        </Abs>

        {/* Right Side: High-fidelity reception image arched frame */}
        <Abs x={740} y={180} w={540} h={500}>
          <Reveal delay={120}>
            <div style={{
              width: "100%",
              height: "100%",
              borderRadius: "260px 260px 0 0",
              overflow: "hidden",
              boxShadow: "0 20px 50px rgba(0,0,0,0.12)",
            }}>
              <img src={A.receptionImg} alt="Reception Venue" style={{ width: "100%", height: "100%", objectFit: "cover" }} decoding="async" loading="lazy" />
            </div>
          </Reveal>
        </Abs>
      </Section>

      {/* ── COUPLE SECTION (h:1000px) ── */}
      <Section h={1000} bg={C.navy}>
        {/* Left Side: Arched couple portrait frame */}
        <Abs x={160} y={150} w={500} h={670}>
          <Reveal>
            <div style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "240px 240px 0 0",
              padding: 20,
              width: "100%",
              height: "100%",
            }}>
              <div style={{
                width: "100%",
                height: "100%",
                borderRadius: "220px 220px 0 0",
                overflow: "hidden",
              }}>
                <img src={couplePhoto} alt="James &amp; Eleanor" style={{ width: "100%", height: "100%", objectFit: "cover" }} decoding="async" loading="lazy" />
              </div>
            </div>
          </Reveal>
        </Abs>

        {/* Right Side: Couple story */}
        <Abs x={720} y={200} w={560}>
          <Reveal delay={120}>
            <h2 style={{ fontFamily: F.serif, fontSize: 54, color: C.bgCream, margin: "0 0 24px", fontWeight: 500 }}>
              Meet the Bride &amp; Groom
            </h2>
            
            <div style={{ width: 80, height: "1.5px", background: "rgba(254,154,0,0.5)", marginBottom: 40 }} />

            <p style={{ fontFamily: F.sans, fontSize: 18, fontWeight: 300, color: C.textMuted, lineHeight: 1.8, marginBottom: 24 }}>
              {story}
            </p>
            <p style={{ fontFamily: F.sans, fontSize: 18, fontWeight: 300, color: C.textMuted, lineHeight: 1.8, marginBottom: 0 }}>
              {story2}
            </p>
          </Reveal>
        </Abs>
      </Section>

      {/* ── MOMENTS ── */}
      <MomentsSection
        userData={userData}
        language={language}
        theme={{
          variant: "radial",
          fontHeading: "'Alex Brush', cursive",
          fontBody: F.sans,
          colorHeading: C.goldLight,
          colorText: C.bgCream,
          colorBg: C.navy,
          polaroidBg: C.white,
          tapeColor: "rgba(255, 185, 0, 0.15)",
        }}
      />

      {/* ── RSVP FORM SECTION (h:1100px) ── */}
      {showRsvp && (
        <Section h={1100} bg={C.bgGrey}>
          <Abs x={82} y={120} w={1276}>
            <div style={{ 
              width: "100%", 
              border: `4.6px solid ${C.navy}`, 
              borderRadius: 24, 
              padding: "80px 100px", 
              background: C.white, 
              boxShadow: "0 28px 138px rgba(0,0,0,0.07)" 
            }}>
              <UniversalRSVPForm eventId={eventId ?? ""} theme={rsvpTheme} formConfig={rsvpFields} previewCeremonies={isPreview ? previewCeremonies : undefined} maxWidth="max-w-3xl" />
            </div>
          </Abs>
        </Section>
      )}

      {/* ── FOOTER (h:720px) ── */}
      <Section h={720} bg={C.navyDark} style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        {/* Couple Signature Block */}
        <Abs x={220} y={60} w={1000} style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <p style={{ fontFamily: F.sans, fontSize: 13, letterSpacing: 6, color: "rgba(255,255,255,0.6)", margin: 0, textTransform: "uppercase" }}>THE WEDDING OF</p>
          <p style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 56, color: C.gold, margin: 0, lineHeight: 1 }}>{bride} &amp; {groom}</p>
          
          {/* Horizontal Flourish Ornament */}
          <Ornament4 fill={C.gold} style={{ width: 360, height: "auto", aspectRatio: "812/131", margin: "8px 0" }} />
          
          <p style={{ fontFamily: F.serif, fontSize: 20, color: "rgba(255,255,255,0.85)", margin: 0, lineHeight: 1.4 }}>
            {formatHeroDate(wDate, "October 16th, 2026")} &bull; {venueName}
          </p>
          {contact && (
            <p style={{ fontFamily: F.sans, fontSize: 14, color: "rgba(255,255,255,0.6)", margin: 0 }}>
              Enquiries: <a href={`mailto:${contact}`} style={{ color: C.gold, textDecoration: "none" }}>{contact}</a>
            </p>
          )}
        </Abs>

        {/* Clean Gold-Gradient CSS Divider */}
        <Abs x={220} y={360} w={1000} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px" }}>
          <div style={{ height: "1px", width: "180px", background: "linear-gradient(to right, transparent, rgba(255,255,255,0.25))" }} />
          <span style={{ color: C.gold, fontSize: "14px", opacity: 0.7 }}>✦</span>
          <div style={{ height: "1px", width: "180px", background: "linear-gradient(to left, transparent, rgba(255,255,255,0.25))" }} />
        </Abs>

        {/* Footer Brand highlights & details row */}
        <Abs x={160} y={410} w={1120} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "80px" }}>
          {/* Brand & CTA */}
          <div style={{ flex: "1 1 40%", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <a href="https://invitara.com" target="_blank" rel="noopener noreferrer" style={{ display: "block", marginBottom: "20px", transition: "opacity 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.opacity = "0.8"} onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}>
              <img src="/logo/sec_two_white.svg" alt="Invitara Logo" style={{ height: "40px", display: "block" }} decoding="async" loading="lazy" />
            </a>
            <p style={{ fontFamily: F.sans, fontSize: "14px", color: "rgba(255,255,255,0.7)", lineHeight: "1.7", margin: "0 0 20px", maxWidth: "420px", textAlign: "left" }}>
              Beautiful digital invitations for every celebration. Build an experience that your guests will remember.
            </p>
            <p style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: "20px", color: C.gold, margin: "0 0 20px" }}>
              Create your own Christian wedding invitation today.
            </p>
            <a href="https://invitara.com" target="_blank" rel="noopener noreferrer" style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 28px",
              background: C.gold,
              borderRadius: "30px",
              color: C.navy,
              fontFamily: F.sans,
              fontSize: "14px",
              fontWeight: 600,
              textDecoration: "none",
              letterSpacing: "0.5px",
              transition: "transform 0.2s, background-color 0.2s",
              boxShadow: "0 4px 14px rgba(0,0,0,0.15)"
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.background = C.white; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.background = C.gold; }}
            >
              Get Started Free <span style={{ fontSize: "16px", fontWeight: "bold" }}>→</span>
            </a>
          </div>

          {/* highlights */}
          <div style={{ flex: "1 1 50%", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px 32px", textAlign: "left" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <p style={{ fontFamily: F.sans, fontWeight: 600, fontSize: "13px", color: C.gold, letterSpacing: "1px", margin: 0 }}>✦ CINEMATIC DESIGN</p>
              <p style={{ fontFamily: F.sans, fontSize: "12px", color: "rgba(255,255,255,0.6)", lineHeight: "1.5", margin: 0 }}>
                Exquisite, hand-crafted layouts designed to showcase your celebrations on the finest screens.
              </p>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <p style={{ fontFamily: F.sans, fontWeight: 600, fontSize: "13px", color: C.gold, letterSpacing: "1px", margin: 0 }}>✦ SEAMLESS RSVPS</p>
              <p style={{ fontFamily: F.sans, fontSize: "12px", color: "rgba(255,255,255,0.6)", lineHeight: "1.5", margin: 0 }}>
                Track RSVPs, manage guest preferences, and receive warm wishes in real-time.
              </p>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <p style={{ fontFamily: F.sans, fontWeight: 600, fontSize: "13px", color: C.gold, letterSpacing: "1px", margin: 0 }}>✦ DYNAMIC MAPS</p>
              <p style={{ fontFamily: F.sans, fontSize: "12px", color: "rgba(255,255,255,0.6)", lineHeight: "1.5", margin: 0 }}>
                Integrated GPS navigation and detailed schedule maps ensure guests arrive smoothly.
              </p>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <p style={{ fontFamily: F.sans, fontWeight: 600, fontSize: "13px", color: C.gold, letterSpacing: "1px", margin: 0 }}>✦ SECURE GIFTING</p>
              <p style={{ fontFamily: F.sans, fontSize: "12px", color: "rgba(255,255,255,0.6)", lineHeight: "1.5", margin: 0 }}>
                Elegant, integrated registry support for seamless gift registries and direct wishes.
              </p>
            </div>
          </div>
        </Abs>

        {/* Divider */}
        <Abs x={160} y={650} w={1120}>
          <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.15)" }} />
        </Abs>

        {/* Bottom bar */}
        <Abs x={160} y={670} w={1120} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <p style={{ fontFamily: F.sans, fontSize: "13px", color: "rgba(255,255,255,0.5)", margin: 0 }}>© 2026 Invitara. All rights reserved.</p>
            <span style={{ fontFamily: F.sans, fontSize: "13px", color: "rgba(255,255,255,0.2)", margin: 0 }}>|</span>
            <p style={{ fontFamily: F.sans, fontSize: "13px", color: "rgba(255,255,255,0.5)", margin: 0 }}>
              A product by <a href="https://3pin.co.in" target="_blank" rel="noopener noreferrer" style={{ color: C.gold, textDecoration: "none", fontWeight: 500 }}>3PIN</a>
            </p>
          </div>
          
          {/* Socials */}
          <div style={{ display: "flex", gap: "20px" }}>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.5)", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = C.gold} onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}>
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.5)", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = C.gold} onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}>
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
            </a>
          </div>
        </Abs>
      </Section>
      </div>
    </div>
  );
}

// ─── Simple Helper Component for fixed canvas height layout ───────
function Section({
  h,
  bg,
  children,
  style,
}: {
  h: number;
  bg: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        position: "relative",
        width: 1440,
        height: h,
        background: bg,
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
