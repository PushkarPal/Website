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

function App() {
  const [posterIndex, setPosterIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPosterIndex((current) => (current + 1) % 5)
    }, 3000)

    return () => window.clearInterval(timer)
  }, [])

  const previousPoster = () => setPosterIndex((current) => (current + 4) % 5)
  const nextPoster = () => setPosterIndex((current) => (current + 1) % 5)

  return (
    <div className="landing-page">
      <header className="landing-header">
        <img className="landing-logo" src="/logo.svg" alt="Biggies Burger" />
      </header>

      <nav className="landing-nav" aria-label="Menu categories">
        {landingCategories.map((category) => (
          <a key={category.target} href={`#${category.target}`}>
            {category.label}
          </a>
        ))}
      </nav>

      <section className="poster-section" aria-label="Posters">
        <button className="poster-arrow poster-arrow-left" onClick={previousPoster} aria-label="Previous poster">
          ‹
        </button>
        <div className="poster-box">
          <span>POSTERS</span>
        </div>
        <button className="poster-arrow poster-arrow-right" onClick={nextPoster} aria-label="Next poster">
          ›
        </button>
      </section>

      <div className="poster-dots" aria-label={`Poster ${posterIndex + 1} of 5`}>
        {[0, 1, 2, 3, 4].map((index) => (
          <button
            key={index}
            className={index === posterIndex ? 'active' : ''}
            onClick={() => setPosterIndex(index)}
            aria-label={`Show poster ${index + 1}`}
          />
        ))}
      </div>

      <main className="landing-content">
        <div id="menu-burger" className="landing-anchor" />
        <div id="menu-wrap" className="landing-anchor" />
        <div id="menu-wings" className="landing-anchor" />
        <div id="menu-fries" className="landing-anchor" />
        <div id="menu-rice" className="landing-anchor" />
        <div id="menu-quick" className="landing-anchor" />
        <div id="menu-shakes" className="landing-anchor" />
        <div id="menu-dessert" className="landing-anchor" />
        <div id="menu-beverages" className="landing-anchor" />
      </main>
    </div>
  )
}

export default App
