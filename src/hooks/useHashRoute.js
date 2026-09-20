import { useEffect, useState } from 'react'

/**
 * Tiny hash router — the site has no React Router dependency and does not
 * need one: there is exactly one sub-page (Products) on top of the
 * single-scroll home page.
 *
 * Two kinds of hash live side by side:
 *   `#overview` / `#dataset` / `#download` → home page + scroll to section
 *   `#/products`                          → the Products sub-page
 *
 * Any link is still a plain `<a href>`, so navigation keeps working without
 * JS and the browser's back/forward buttons stay correct.
 *
 * @returns {[{page: string, anchor: string}]} [route]
 *   route.page   'home' | 'products'
 *   route.anchor '#dataset' etc. — '' when the hash is a bare page route
 */

/* '#/products' is the canonical form; '#products' is accepted so a hand-typed
   URL still lands on the page. */
const PRODUCTS_HASHES = ['#/products', '#products']

function parseHash(hash) {
  const raw = (hash || '').replace(/^#/, '')
  if (raw === '/products' || raw === 'products') return { page: 'products', anchor: '' }
  return { page: 'home', anchor: raw ? `#${raw}` : '' }
}

export default function useHashRoute() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash))

  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash))
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  /* Scroll placement after every route change:
       - sub-page  → jump straight to the top (no smooth slide)
       - home + anchor → scroll once the target section is mounted.
         The late scroll matters when coming back from a sub-page: at click
         time the section did not exist yet, so the browser could not jump
         to it on its own. */
  useEffect(() => {
    if (route.page !== 'home') {
      /* 'instant' beats html { scroll-behavior: smooth } — a page switch
         should not slide through the whole document. */
      try {
        window.scrollTo({ top: 0, behavior: 'instant' })
      } catch {
        window.scrollTo(0, 0)
      }
      return
    }

    if (!route.anchor) return

    const frame = requestAnimationFrame(() => {
      const el = document.querySelector(route.anchor)
      /* scroll-padding-top on <html> keeps the fixed navbar clear. */
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })

    return () => cancelAnimationFrame(frame)
  }, [route])

  return [route]
}

export { PRODUCTS_HASHES }
