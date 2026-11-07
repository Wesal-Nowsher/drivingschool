import "./globals.css";

export const metadata = {
  title: "Bahrain Driving Licence Guide",
  description: "Step-by-step guide to getting your Bahrain driving licence — costs, documents, driving lessons and registration in 6 languages.",
  openGraph: { title: "Bahrain Driving Licence Guide", description: "English · العربية · اردو · हिन्दी · മലയാളം · فارسی" },
};
export const viewport = { themeColor: "#ce1126", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
