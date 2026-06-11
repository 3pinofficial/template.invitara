"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { getTemplateComponent, getTemplateDefinition } from "@/lib/registry";
import type { SupportedLanguage } from "@/types/invite-schema";
import AuthGuard from "@/components/AuthGuard";


export default function PreviewPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = params?.slug as string;
  
  // Viewport mode: mobile or desktop
  const initialMode = searchParams?.get("mode") === "mobile" ? "mobile" : "desktop";
  const [mode, setMode] = useState<"mobile" | "desktop">(initialMode);
  
  // Language switcher
  const [lang, setLang] = useState<SupportedLanguage>("en");

  const TemplateComponent = getTemplateComponent(slug);
  const definition = getTemplateDefinition(slug);

  useEffect(() => {
    // Sync mode state with query parameter
    const currentMode = searchParams?.get("mode");
    if (currentMode === "mobile" || currentMode === "desktop") {
      setMode(currentMode);
    }
  }, [searchParams]);

  if (!TemplateComponent) {
    return (
      <div className="min-h-screen bg-[#0d1527] text-white flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-headline font-bold mb-4 text-[#c5a059]">Template Not Found</h1>
        <p className="text-gray-400 mb-6 text-sm">The template with slug &quot;{slug}&quot; does not exist in registry.</p>
        <Link href="/" className="px-5 py-2.5 bg-[#c5a059] text-black font-bold rounded-lg text-sm transition-all hover:bg-[#e8c37d]">
          Return to Showcase
        </Link>
      </div>
    );
  }

  const toggleMode = (newMode: "mobile" | "desktop") => {
    setMode(newMode);
    // update URL query param without full reload
    const params = new URLSearchParams(window.location.search);
    params.set("mode", newMode);
    router.replace(`/preview/${slug}?${params.toString()}`);
  };

  // Mock UserData that provides rich content across templates
  const mockUserData = {
    // Names
    brideName: { en: "Madison", ta: "மெடிசன்", hi: "मैडिसन" },
    groomName: { en: "Jagadish", ta: "ஜெகதீஷ்", hi: "जगदीश" },
    brideParents: { en: "Mrs. Shalini & Mr. Aakash Mittal", ta: "திருமதி. ஷாலினி & திரு. ஆகாஷ் மிட்டல்", hi: "श्रीमती शालिनी एवं श्री आकाश मित्तल" },
    groomParents: { en: "Mrs. Reena & Mr. Rajiv Kapoor", ta: "திருமதி. ரீனா & திரு. ராஜீவ் கபூர்", hi: "श्रीमती रीना एवं श्री राजीव कपूर" },
    
    // Core timings
    wedding_date: "2026-08-28",
    wedding_time: "10:20",
    wedding_venue: { en: "The Grand Palace", ta: "தி கிராண்ட் பேலஸ்", hi: "द ग्रैंड पैलेस" },
    venueAddress1: { en: "Juhu Beach Road, Near Juhu Chowpatty", ta: "ஜூஹு பீச் ரோடு, ஜூஹு சௌபாத்தி அருகில்", hi: "जुहू बीच रोड, जुहू चौपाटी के पास" },
    venueAddress2: { en: "Mumbai, Maharashtra 400049, India", ta: "மும்பை, மகாராஷ்டிரா 400049, இந்தியா", hi: "मुंबई, महाराष्ट्र 400049, भारत" },
    venueDescription: { en: "A magnificent heritage property nestled along the shores of Juhu Beach.", ta: "ஜூஹு கடற்கரையில் அமைந்துள்ள ஒரு அழகான பாரம்பரிய சொத்து.", hi: "जुहू बीच के तट पर स्थित एक शानदार विरासत स्थल।" },
    
    // Additional events
    haldi_date: "2026-08-26",
    haldi_time: "09:00",
    haldi_venue: { en: "Grand Ballroom, The Palace", ta: "கிராண்ட் பால்ரூம், தி பேலஸ்", hi: "ग्रैंड बॉलरूम, द पैलेस" },
    
    mehendi_date: "2026-08-26",
    mehendi_time: "16:00",
    mehendi_venue: { en: "Poolside Lawn, The Palace", ta: "பூல்சைடு லான், தி பேலஸ்", hi: "पूलसाइड लॉन, द पैलेस" },
    
    reception_date: "2026-08-28",
    reception_time: "19:30",
    reception_venue: { en: "The Royal Gardens", ta: "தி ராயல் கார்டன்ஸ்", hi: "द रॉयल गार्डन" },

    // Story and blessings
    blessingsLine1: { en: "With the heavenly blessings of", ta: "பரலோக ஆசீர்வாதங்களுடன்", hi: "स्वर्गीय आशीर्वाद के साथ" },
    blessingsLine2: { en: "Smt. Lata Devi & Mr. Kamal Kapoor", ta: "திருமதி. லதா தேவி & திரு. கமல் கபூர்", hi: "श्रीमती लता देवी एवं श्री कमल कपूर" },
    coupleStory: { en: "We are both so delighted that you are able to join us in celebrating what we hope will be one of the happiest days of our lives.", ta: "எங்கள் வாழ்வின் மகிழ்ச்சியான நாட்களில் ஒன்றாக இருக்கும் என்று நாங்கள் நம்பும் இந்த நாளை எங்களுடன் கொண்டாட நீங்கள் வருவதில் நாங்கள் இருவரும் மிகவும் மகிழ்ச்சியடைகிறோம்.", hi: "हम दोनों बेहद खुश हैं कि आप हमारे जीवन के सबसे सुखद दिनों में से एक का जश्न मनाने में हमारे साथ शामिल हो रहे हैं।" },
    
    contactEmail: "hello@madisonandjagadish.in",
    mapsUrl: "https://maps.google.com",
    directionsUrl: "https://maps.google.com",

    // RSVP custom configs
    rsvp_requireEmail: false,
    rsvp_showPhone: true,
    rsvp_requirePhone: false,
    rsvp_showDietary: true,
    rsvp_showLeaveMessage: true,
    rsvp_maxGuests: 5,
  };

  const enabledAddons = ["rsvp", "moments", "maps"];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#070b14] flex flex-col">
        {/* Dynamic Viewport Controller Header */}
        <header className="sticky top-0 z-50 h-16 bg-[#0d1322]/80 backdrop-blur-md border-b border-white/10 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors py-1.5 px-3 rounded-lg hover:bg-white/5 border border-white/5"
            >
              <span>←</span> Back
            </Link>
            <div className="hidden sm:block">
              <h1 className="text-sm font-headline font-bold text-white flex items-center gap-2">
                <span>{definition?.name || slug}</span>
                <span className="text-[10px] text-gray-500 font-sans font-normal uppercase bg-white/5 px-2 py-0.5 rounded border border-white/5">
                  Preview
                </span>
              </h1>
            </div>
          </div>

          {/* Viewport Control */}
          <div className="flex items-center bg-black/40 border border-white/10 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => toggleMode("mobile")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md font-semibold transition-all ${
                mode === "mobile"
                  ? "bg-[#c5a059] text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <span>📱</span> Mobile View
            </button>
            <button
              onClick={() => toggleMode("desktop")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md font-semibold transition-all ${
                mode === "desktop"
                  ? "bg-[#c5a059] text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <span>💻</span> Desktop View
            </button>
          </div>

          {/* Language Selection */}
          <div className="flex items-center gap-2 text-xs">
            <label className="text-gray-400 hidden md:inline">Language:</label>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as SupportedLanguage)}
              className="bg-[#131d30] border border-white/10 text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#c5a059]"
            >
              <option value="en">English</option>
              <option value="hi">Hindi (हिंदी)</option>
              <option value="ta">Tamil (தமிழ்)</option>
            </select>
          </div>
        </header>

        {/* Main Workspace Frame */}
        <main className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-auto">
          {mode === "mobile" ? (
            <div className="relative w-[402px] h-[850px] border-[8px] border-[#131d30] rounded-[36px] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.6)] bg-slate-950 flex flex-col">
              {/* Speaker & Camera Notch */}
              <div className="absolute top-0 inset-x-0 h-6 bg-black flex items-center justify-center z-[100]">
                <div className="w-24 h-3.5 bg-[#131d30] rounded-full"></div>
              </div>
              
              {/* Viewport Content */}
              <div className="flex-1 overflow-auto pt-6 scrollbar-thin">
                <TemplateComponent
                  userData={mockUserData}
                  language={lang}
                  enabledAddons={enabledAddons}
                  isPreview={false}
                  eventId="preview-event-uuid"
                />
              </div>
            </div>
          ) : (
            <div className="w-full max-w-[1440px] border border-white/10 rounded-2xl overflow-hidden shadow-2xl bg-slate-950">
              <TemplateComponent
                userData={mockUserData}
                language={lang}
                enabledAddons={enabledAddons}
                isPreview={false}
                eventId="preview-event-uuid"
              />
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
