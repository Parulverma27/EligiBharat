import type { Metadata } from "next";
import {
  Playfair_Display,
  Plus_Jakarta_Sans,
} from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-playfair",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EligiBharat — Open-Source Indian Welfare Scheme Eligibility Assistant",
  description:
    "Deterministic rule checking and local LLM extraction for Indian government welfare schemes in English and Hindi.",
};

// Strips `fdprocessedid` attributes injected by browser password/form extensions
// (Dashlane, McAfee, LastPass) before React 19 hydrates the DOM.
const STRIP_EXTENSION_ATTRS_SCRIPT = `
(function() {
  function clean() {
    document.querySelectorAll('[fdprocessedid]').forEach(function(el) {
      el.removeAttribute('fdprocessedid');
    });
  }
  clean();
  if (typeof MutationObserver !== 'undefined') {
    var obs = new MutationObserver(function(mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var m = mutations[i];
        if (m.type === 'attributes' && m.attributeName === 'fdprocessedid' && m.target) {
          m.target.removeAttribute('fdprocessedid');
        }
      }
    });
    obs.observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: ['fdprocessedid'] });
    window.addEventListener('load', function() { setTimeout(function() { obs.disconnect(); }, 2500); });
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${jakarta.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: STRIP_EXTENSION_ATTRS_SCRIPT }}
        />
      </head>
      <body
        className="min-h-screen font-sans antialiased"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
