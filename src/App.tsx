import { useEffect, useState } from 'react'
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
  { label: 'Beverages', target: 'menu-beverages', icon: '🥤' },
]

const posters = [
  { id: 1, image: null },
  { id: 2, image: null },
  { id: 3, image: null },
  { id: 4, image: null },
  { id: 5, image: null },
]

function CategoryLink({ category }: { category: Category }) {
  return (
    <a href={`#${category.target}`}>
      <span className="category-icon" aria-hidden="true">{category.icon}</span>
      <span>{category.label}</span>
    </a>
  )
}

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
        <div className="category-row category-row-five">
          {firstRow.map((category) => (
            <CategoryLink key={category.target} category={category} />
          ))}
        </div>
        <div className="category-row category-row-four">
          {secondRow.map((category) => (
            <CategoryLink key={category.target} category={category} />
          ))}
        </div>
      </nav>

      <section className="poster-section" aria-label="Promotional posters">
        <button className="poster-arrow poster-arrow-left" onClick={previousPoster} aria-label="Previous poster">
          ‹
        </button>

        <div className="poster-box">
          {activePoster.image ? (
            <img src={activePoster.image} alt={`Biggies promotion ${activePoster.id}`} />
          ) : null}
        </div>

        <button className="poster-arrow poster-arrow-right" onClick={nextPoster} aria-label="Next poster">
          ›
        </button>
      </section>
    </div>
  )
}

export default App
