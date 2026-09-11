import { useEffect, useRef, useState } from 'react'
import type { TouchEvent } from 'react'
import './App.css'

type CategoryIconName = 'burger' | 'wrap' | 'wings' | 'fries' | 'rice' | 'bites' | 'shake' | 'dessert' | 'beverage'

type Category = {
  label: string
  target: string
  icon: CategoryIconName
}

const firstRow: Category[] = [
  { label: 'Burger', target: 'menu-burger', icon: 'burger' },
  { label: 'Wrap', target: 'menu-wrap', icon: 'wrap' },
  { label: 'Wings', target: 'menu-wings', icon: 'wings' },
  { label: 'Fries', target: 'menu-fries', icon: 'fries' },
  { label: 'Rice Bowls', target: 'menu-rice', icon: 'rice' },
]

const secondRow: Category[] = [
  { label: 'Quick Bites', target: 'menu-quick', icon: 'bites' },
  { label: 'Shakes', target: 'menu-shakes', icon: 'shake' },
  { label: 'Desert', target: 'menu-dessert', icon: 'dessert' },
  { label: 'Beverages', target: 'menu-beverages', icon: 'beverage' },
]

const posters = [1, 2, 3, 4, 5]
const carouselSlides = [5, ...posters, 1]

function CategoryIcon({ name }: { name: CategoryIconName }) {
  const common = {
    viewBox: '0 0 48 48',
    width: '100%',
    height: '100%',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    'aria-hidden': true,
  }

  switch (name) {
    case 'burger':
      return <svg {...common}><path d="M7 21h34v3H7z" fill="#FFC400"/><path d="M9 20c.8-7 6.9-11 15-11s14.2 4 15 11H9Z" fill="#D68A32"/><path d="M9 25h30l-3 9H12l-3-9Z" fill="#D33B25"/><path d="M10 36h28c0 2-2 3-4 3H14c-2 0-4-1-4-3Z" fill="#E5A23B"/><path d="M13 27h22" stroke="#FFC400" strokeWidth="3" strokeLinecap="round"/></svg>
    case 'wrap':
      return <svg {...common}><path d="m16 7 22 22-10 10L6 17 16 7Z" fill="#F2D18B"/><path d="m11 12 22 22" stroke="#D68A32" strokeWidth="2"/><path d="m17 8 6 6-7 7-6-6 7-7Z" fill="#7FBF5B"/><path d="m27 18 6 6-7 7-6-6 7-7Z" fill="#E76F51"/><path d="m12 31 7-7" stroke="#F7F2E7" strokeWidth="3"/></svg>
    case 'wings':
      return <svg {...common}><path d="M10 12c7 0 12 4 16 9 2-7 6-10 12-10 0 8-3 14-9 17-3 2-6 5-7 10-6-1-10-5-11-10-1-5 1-11-1-16Z" fill="#D98936"/><path d="M19 18c4 2 7 5 9 9" stroke="#A95D25" strokeWidth="2" strokeLinecap="round"/><path d="M27 12c4 3 6 6 7 10" stroke="#A95D25" strokeWidth="2" strokeLinecap="round"/></svg>
    case 'fries':
      return <svg {...common}><path d="m13 8 3 17M20 6l2 19M28 6l-1 19M35 8l-3 17" stroke="#F2C94C" strokeWidth="4" strokeLinecap="round"/><path d="M10 22h28l-3 18H13l-3-18Z" fill="#E43D30"/><path d="M15 28h18M14 33h20" stroke="#FFC400" strokeWidth="2"/></svg>
    case 'rice':
      return <svg {...common}><path d="M9 25h30c0 9-6 15-15 15S9 34 9 25Z" fill="#CFE8F5"/><path d="M12 25c1-8 5-12 12-12s11 4 12 12H12Z" fill="#FFFDF7"/><path d="M18 17c2-3 5-4 7-4 3 0 5 1 7 4" stroke="#B7DCEB" strokeWidth="2" strokeLinecap="round"/><path d="M9 25h30" stroke="#5A7890" strokeWidth="2"/></svg>
    case 'bites':
      return <svg {...common}><path d="M12 10v27M18 10v27M12 19h6M36 9v28" stroke="#B8BEC5" strokeWidth="2.5" strokeLinecap="round"/><path d="M9 10v10c0 3 2 5 5 5s5-2 5-5V10" stroke="#8E969F" strokeWidth="2.5"/><path d="M32 9c0 7-2 9-5 12v16" stroke="#8E969F" strokeWidth="2.5" strokeLinecap="round"/><path d="M28 37h10" stroke="#8E969F" strokeWidth="2.5" strokeLinecap="round"/></svg>
    case 'shake':
      return <svg {...common}><path d="M16 12h16l-2 28H18l-2-28Z" fill="#D9F0F7"/><path d="M18 17h12" stroke="#77C7D8" strokeWidth="2"/><path d="M23 12 28 5" stroke="#D33B25" strokeWidth="3" strokeLinecap="round"/><path d="M21 7h10" stroke="#D33B25" strokeWidth="3" strokeLinecap="round"/><path d="M19 24h10" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round"/><path d="M19 30h10" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round"/></svg>
    case 'dessert':
      return <svg {...common}><path d="M9 35h30" stroke="#D68A32" strokeWidth="3" strokeLinecap="round"/><path d="M12 34c0-7 5-12 12-12s12 5 12 12H12Z" fill="#F28B82"/><path d="M15 25c2-6 6-9 10-9s8 3 9 9" fill="#FFF5E8"/><path d="M25 16c0-4 2-6 5-7" stroke="#E43D30" strokeWidth="3" strokeLinecap="round"/><circle cx="25" cy="22" r="2" fill="#FFC400"/></svg>
    case 'beverage':
      return <svg {...common}><path d="M14 12h21l-2 28H17l-3-28Z" fill="#7CCB91"/><path d="m29 12 5-7" stroke="#D68A32" strokeWidth="3" strokeLinecap="round"/><path d="M17 18h17" stroke="#EAF8E8" strokeWidth="3"/><path d="M19 25h13" stroke="#EAF8E8" strokeWidth="3"/><path d="M23 6h6" stroke="#E43D30" strokeWidth="3" strokeLinecap="round"/></svg>
  }
}

function CategoryLink({ category }: { category: Category }) {
  return (
    <a href={`#${category.target}`}>
      <span className="category-icon"><CategoryIcon name={category.icon} /></span>
      <span>{category.label}</span>
    </a>
  )
}

function App() {
  const [position, setPosition] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const touchStartX = useRef<number | null>(null)
  const autoplayTimer = useRef<number | null>(null)

  const scheduleAutoplay = () => {
    if (autoplayTimer.current !== null) {
      window.clearTimeout(autoplayTimer.current)
    }

    autoplayTimer.current = window.setTimeout(() => {
      setIsTransitioning(true)
      setPosition((current) => current + 1)
    }, 3000)
  }

  useEffect(() => {
    scheduleAutoplay()

    return () => {
      if (autoplayTimer.current !== null) {
        window.clearTimeout(autoplayTimer.current)
      }
    }
  }, [])

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('layout-debug') !== '1') return

    const printDiagnostic = () => {
      const selectors = [
        '#root', '.landing-page', '.landing-header', '.landing-logo', '.category-area',
        '.category-row-five', '.category-separator', '.category-row-four', '.poster-section',
        '.carousel-shell', '.poster-arrow-left', '.poster-viewport', '.poster-track',
        '.poster-box', '.poster-arrow-right',
      ]

      const round = (value: number) => Math.round(value * 100) / 100
      const layout = Object.fromEntries(selectors.map((selector) => {
        const element = document.querySelector<HTMLElement>(selector)
        if (!element) return [selector, null]
        const box = element.getBoundingClientRect()
        return [selector, {
          x: round(box.x), y: round(box.y), left: round(box.left), right: round(box.right),
          width: round(box.width), height: round(box.height), bottom: round(box.bottom),
        }]
      }))

      console.group('Biggies responsive layout diagnostic')
      console.table({
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio,
        visualViewportWidth: window.visualViewport?.width ?? null,
        visualViewportHeight: window.visualViewport?.height ?? null,
        documentClientWidth: document.documentElement.clientWidth,
        documentClientHeight: document.documentElement.clientHeight,
        bodyClientWidth: document.body.clientWidth,
        bodyClientHeight: document.body.clientHeight,
        documentScrollWidth: document.documentElement.scrollWidth,
        bodyScrollWidth: document.body.scrollWidth,
      })
      console.table(layout)
      console.groupEnd()
    }

    const frame = window.requestAnimationFrame(printDiagnostic)
    return () => window.cancelAnimationFrame(frame)
  }, [])

  const nextPoster = () => {
    setIsTransitioning(true)
    setPosition((current) => current + 1)
    scheduleAutoplay()
  }

  const previousPoster = () => {
    setIsTransitioning(true)
    setPosition((current) => current - 1)
    scheduleAutoplay()
  }

  const handleTransitionEnd = () => {
    if (position === carouselSlides.length - 1) {
      setIsTransitioning(false)
      setPosition(1)
    } else if (position === 0) {
      setIsTransitioning(false)
      setPosition(posters.length)
    }

    scheduleAutoplay()
  }

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null
  }

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return

    const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX.current
    const distance = touchEndX - touchStartX.current
    touchStartX.current = null

    if (Math.abs(distance) < 45) return
    if (distance < 0) nextPoster()
    else previousPoster()
  }

  return (
    <div className="landing-page">
      <header className="landing-header">
        <img className="landing-logo" src={`${import.meta.env.BASE_URL}logo.svg`} alt="Biggies Burger" />
      </header>

      <section className="category-area" aria-label="Menu categories">
        <div className="category-line" aria-hidden="true" />

        <nav className="landing-nav">
          <div className="category-row category-row-five">
            {firstRow.map((category) => <CategoryLink key={category.target} category={category} />)}
          </div>

          <div className="category-separator" aria-hidden="true" />

          <div className="category-row category-row-four">
            {secondRow.map((category) => <CategoryLink key={category.target} category={category} />)}
          </div>
        </nav>

        <div className="category-line" aria-hidden="true" />
      </section>

      <section className="poster-section" aria-label="Promotional posters">
        <div className="carousel-shell">
          <button className="poster-arrow poster-arrow-left" onClick={previousPoster} aria-label="Previous poster">‹</button>

          <div className="poster-viewport" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            <div
              className={`poster-track${isTransitioning ? '' : ' no-transition'}`}
              style={{ transform: `translateX(-${position * 100}%)` }}
              onTransitionEnd={handleTransitionEnd}
            >
              {carouselSlides.map((posterNumber, index) => (
                <div
                  className="poster-box"
                  data-poster-number={posterNumber}
                  aria-hidden={index !== position}
                  key={`${posterNumber}-${index}`}
                />
              ))}
            </div>
          </div>

          <button className="poster-arrow poster-arrow-right" onClick={nextPoster} aria-label="Next poster">›</button>
        </div>
      </section>
    </div>
  )
}

export default App
