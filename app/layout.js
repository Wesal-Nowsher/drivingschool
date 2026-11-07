import "./globals.css";

export const metadata = {
  title: "Bahrain Driving Licence Guide",
  description: "Step-by-step guide to getting your Bahrain driving licence, costs, documents, driving lessons and registration in 6 languages.",
  openGraph: { title: "Bahrain Driving Licence Guide", description: "English · العربية · اردو · हिन्दी · മലയാളം · 中文" },
};
export const viewport = { themeColor: "#ce1126", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&family=Noto+Naskh+Arabic:wght@400;700&family=Noto+Sans+Devanagari:wght@400;700&family=Noto+Sans+Malayalam:wght@400;700&display=swap" />
      </head>
      <body>{children}</body>
    </html>
  );
}
