import { useEffect, useState } from 'react'
import './App.css'

const landingCategories = [
  { label: 'Burger', target: 'menu-burger' },
  { label: 'Wrap', target: 'menu-wrap' },
  { label: 'Wings', target: 'menu-wings' },
  { label: 'Fries', target: 'menu-fries' },
  { label: 'Rice Bowls', target: 'menu-rice' },
  { label: 'Quick Bites', target: 'menu-quick' },
  { label: 'Shakes', target: 'menu-shakes' },
  { label: 'Desert', target: 'menu-dessert' },
  { label: 'Beverages', target: 'menu-beverages' },
]

const posters = [
  { id: 1, image: null },
  { id: 2, image: null },
  { id: 3, image: null },
  { id: 4, image: null },
  { id: 5, image: null },
]

function App() {
  const [posterIndex, setPosterIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPosterIndex((current) => (current + 1) % posters.length)
    }, 3000)

    return () => window.clearInterval(timer)
  }, [])

  const previousPoster = () => {
    setPosterIndex((current) => (current - 1 + posters.length) % posters.length)
  }

  const nextPoster = () => {
    setPosterIndex((current) => (current + 1) % posters.length)
  }

  const activePoster = posters[posterIndex]

  return (
    <div className="landing-page">
      <header className="landing-header">
        <img
          className="landing-logo"
          src={`${import.meta.env.BASE_URL}logo.svg`}
          alt="Biggies Burger"
        />
      </header>

      <nav className="landing-nav" aria-label="Menu categories">
        {landingCategories.map((category) => (
          <a key={category.target} href={`#${category.target}`}>
            <span className={`category-icon category-icon-${category.target}`} aria-hidden="true" />
            <span>{category.label}</span>
          </a>
        ))}
      </nav>

      <section className="poster-section" aria-label="Promotional posters">
        <button
          className="poster-arrow poster-arrow-left"
          onClick={previousPoster}
          aria-label="Previous poster"
        >
          ‹
        </button>

        <div className="poster-box">
          {activePoster.image ? (
            <img src={activePoster.image} alt={`Biggies promotion ${activePoster.id}`} />
          ) : null}
        </div>

        <button
          className="poster-arrow poster-arrow-right"
          onClick={nextPoster}
          aria-label="Next poster"
        >
          ›
        </button>
      </section>
    </div>
  )
}

export default App
