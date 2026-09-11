import { useEffect, useRef, useState } from 'react'
import type { TouchEvent } from 'react'
import './App.css'

type Category = {
  label: string
  target: string
}

const firstRow: Category[] = [
  { label: 'Burger', target: 'menu-burger' },
  { label: 'Wrap', target: 'menu-wrap' },
  { label: 'Wings', target: 'menu-wings' },
  { label: 'Fries', target: 'menu-fries' },
  { label: 'Rice Bowls', target: 'menu-rice' },
]

const secondRow: Category[] = [
  { label: 'Quick Bites', target: 'menu-quick' },
  { label: 'Shakes', target: 'menu-shakes' },
  { label: 'Desert', target: 'menu-dessert' },
  { label: 'Beverages', target: 'menu-beverages' },
]

const posters = [1, 2, 3, 4, 5]
const carouselSlides = [5, ...posters, 1]

function CategoryLink({ category }: { category: Category }) {
  return (
    <a href={`#${category.target}`}>
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
                  className={`poster-box poster-${posterNumber}`}
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
