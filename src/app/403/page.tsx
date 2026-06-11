import React from "react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-[#070b14] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Premium subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#c5a059]/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-md w-full text-center relative z-10 space-y-8 p-8 border border-white/5 rounded-2xl bg-white/[0.02] backdrop-blur-md">
        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-red-950/30 border border-red-500/20 flex items-center justify-center text-red-400 text-lg font-bold">
            !
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight" style={{ fontFamily: "Playfair Display, Georgia, serif" }}>
            Access Restricted
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            You do not have permission to access the Invitara Template Preview. This environment is reserved for internal team members.
          </p>
        </div>
        
        <div className="pt-4">
          <a
            href="https://invitara.in/dashboard"
            className="inline-block w-full py-3 px-6 bg-[#c5a059] text-black font-semibold rounded-lg text-sm transition-all duration-300 hover:bg-[#e8c37d] active:scale-[0.98] shadow-lg shadow-[#c5a059]/10 text-center"
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
