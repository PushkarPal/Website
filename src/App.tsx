import { useEffect, useRef, useState } from 'react'
import type { TouchEvent } from 'react'
import './App.css'

type Category = {
  label: string
  target: string
  icon: string
}

const firstRow: Category[] = [
  { label: 'Burger', target: 'menu-burger', icon: '🍔' },
  { label: 'Wrap', target: 'menu-wrap', icon: '🌯' },
  { label: 'Wings', target: 'menu-wings', icon: '🍗' },
  { label: 'Fries', target: 'menu-fries', icon: '🍟' },
  { label: 'Rice Bowls', target: 'menu-rice', icon: '🍚' },
]

const secondRow: Category[] = [
  { label: 'Quick Bites', target: 'menu-quick', icon: '🍽️' },
  { label: 'Shakes', target: 'menu-shakes', icon: '🥤' },
  { label: 'Desert', target: 'menu-dessert', icon: '🍰' },
  { label: 'Beverages', target: 'menu-beverages', icon: '🧃' },
]

const posters = [1, 2, 3, 4, 5]
const carouselSlides = [5, ...posters, 1]

function CategoryLink({ category }: { category: Category }) {
  return (
    <a href={`#${category.target}`}>
      <span className="category-icon" aria-hidden="true">{category.icon}</span>
      <span>{category.label}</span>
    </a>
  )
}

function App() {
  const [position, setPosition] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const touchStartX = useRef<number | null>(null)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIsTransitioning(true)
      setPosition((current) => current + 1)
    }, 3000)

    return () => window.clearInterval(timer)
  }, [])

  const nextPoster = () => {
    setIsTransitioning(true)
    setPosition((current) => current + 1)
  }

  const previousPoster = () => {
    setIsTransitioning(true)
    setPosition((current) => current - 1)
  }

  const handleTransitionEnd = () => {
    if (position === carouselSlides.length - 1) {
      setIsTransitioning(false)
      setPosition(1)
    } else if (position === 0) {
      setIsTransitioning(false)
      setPosition(posters.length)
    }
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

      <nav className="landing-nav" aria-label="Menu categories">
        <div className="category-row category-row-five">
          {firstRow.map((category) => <CategoryLink key={category.target} category={category} />)}
        </div>
        <div className="category-row category-row-four">
          {secondRow.map((category) => <CategoryLink key={category.target} category={category} />)}
        </div>
      </nav>

      <section className="poster-section" aria-label="Promotional posters">
        <button className="poster-arrow poster-arrow-left" onClick={previousPoster} aria-label="Previous poster">‹</button>

        <div className="poster-viewport" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <div
            className={`poster-track${isTransitioning ? '' : ' no-transition'}`}
            style={{ transform: `translateX(calc(-${position} * (var(--poster-width) + var(--poster-gap))))` }}
            onTransitionEnd={handleTransitionEnd}
          >
            {carouselSlides.map((posterNumber, index) => (
              <div className="poster-box" aria-hidden={index !== position} key={`${posterNumber}-${index}`} />
            ))}
          </div>
        </div>

        <button className="poster-arrow poster-arrow-right" onClick={nextPoster} aria-label="Next poster">›</button>
      </section>
    </div>
  )
}

export default App
