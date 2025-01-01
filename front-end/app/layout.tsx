import './globals.css'
import { Poppins, Open_Sans } from 'next/font/google'

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
})

const openSans = Open_Sans({ 
  subsets: ['latin'],
  variable: '--font-open-sans',
})

export const metadata = {
  title: 'LearnBetter Framework',
  description: 'Transform tutorials into study-friendly guides',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${poppins.variable} ${openSans.variable} font-sans`}>{children}</body>
    </html>
  )
}

