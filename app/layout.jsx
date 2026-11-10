
import "./globals.css";
import "./christmas.css";

export const metadata = {
  title: "Snowcem Dream Wish Contest | Christmas Edition",
  description:
    "Share your Christmas wish, upload a festive photograph and be part of the Snowcem Dream Wish Contest.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#071b17",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />

        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>

      <body>{children}</body>
    </html>
  );
}
