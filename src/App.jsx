import Nav from './components/layout/Nav'
import Footer from './components/layout/Footer'
import useHashRoute from './hooks/useHashRoute'

import Products from './pages/Products'

import HeroSection from './components/sections/HeroSection'
import DemoSection from './components/sections/DemoSection'
import OverviewSection from './components/sections/OverviewSection'
import MultimodalSection from './components/sections/MultimodalSection'
import RepresentativeTasksSection from './components/sections/RepresentativeTasksSection'
import ResearchSection from './components/sections/ResearchSection'
import DownloadSection from './components/sections/DownloadSection'

/**
 * App is only a composition shell.
 *
 * Routing is hash based (see hooks/useHashRoute):
 *   '#/products' → the standalone Products page
 *   anything else → the single-scroll home page
 *
 * To add a new page section later:
 *   1. create  src/components/sections/XxxSection.jsx
 *   2. add its content to src/data/site.js
 *   3. drop  <XxxSection />  into the <main> list below
 */
export default function App() {
  const [route] = useHashRoute()

  return (
    <div className="min-h-screen">
      <Nav page={route.page} />

      <main>
        {route.page === 'products' ? (
          <Products />
        ) : (
          <>
            <HeroSection />
            <DemoSection />
            <OverviewSection />
            <MultimodalSection />
            <RepresentativeTasksSection />
            <ResearchSection />
            <DownloadSection />
            {/* Future sections go here, one per line, in page order. */}
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
