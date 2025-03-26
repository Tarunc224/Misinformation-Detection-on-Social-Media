import "./globals.css"
import { Inter } from "next/font/google"
import type React from "react" // Import React

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Misinformation Detector",
  description: "Detect misinformation in text, links, images, and videos",
}

/**
 * RootLayout component that wraps the application in a standard HTML structure.
 * 
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to render within the layout.
 * @returns {JSX.Element} The rendered layout component.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-white`}>{children}</body>
    </html>
  )
}
