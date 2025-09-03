import "./globals.css";

export const metadata = {
  title: "ChatGPT Sidebar Demo",
  description: "Clean Next.js structure with sidebar",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
