import MisinformationDetector from "./components/MisinformationDetector"
import BackgroundAnimation from "./components/BackgroundAnimation"

/**
 * Home component that serves as the main entry point for the application.
 * 
 * @returns {JSX.Element} The rendered home component.
 */
export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gray-900">
      <BackgroundAnimation />
      <div className="z-20 text-center px-4">
        <h1 className="text-6xl font-bold mb-8 text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Truth Seeker
        </h1>
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Navigate the information landscape with confidence. Our AI-powered tool helps you detect misinformation in
          text, links, images, and videos.
        </p>
        <MisinformationDetector />
      </div>
    </main>
  )
}
