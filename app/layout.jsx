export const metadata = {
  title: "Ecotrans Cotizador",
  description: "Cotizador web Ecotrans"
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, fontFamily: "Arial" }}>
        {children}
      </body>
    </html>
  );
}
