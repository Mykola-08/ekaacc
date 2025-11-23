export const metadata = {
  title: 'EKA Balance API',
  description: 'API Service for EKA Balance Integrations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
