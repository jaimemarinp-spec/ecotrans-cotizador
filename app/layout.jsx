export const metadata = {
  title: "Ecotrans Cotizador",
  description: "Cotizador web Ecotrans V2"
};

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
