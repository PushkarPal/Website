import { useEffect, useState } from 'react'
import './App.css'
import { menuItems } from './data/menu'

const categories = [...new Set(menuItems.map((item) => item.category))]

const burgerCategories = [
  { label: 'Value Burgers', target: 'value-burgers' },
  { label: 'Beamer', target: 'beamer' },
  { label: 'The Original', target: 'the-original' },
  { label: 'Bigg Krunch', target: 'bigg-krunch' },
  { label: 'Classic Burgers', target: 'classic-burgers' },
]

const landingCategories = [
  { label: 'Burgers', target: 'burgers' },
  { label: 'Wraps', target: 'bigg-wraps' },
  { label: 'Wings', target: 'wings' },
  { label: 'Fries', target: 'fries' },
  { label: 'Rice Bowls', target: 'rice-bowls' },
  { label: 'Quick Bites', target: 'quick-bites' },
  { label: 'Shakes', target: 'thick-shakes' },
  { label: 'Dessert', target: 'desserts' },
  { label: 'Beverages', target: 'beverages' },
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
    <div className="app">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Biggies Burger home">
          <img src="/logo.svg" alt="Biggies Burger" />
        </a>

        <button className="cart-button" aria-label="Open cart">
          <span className="cart-icon" aria-hidden="true">🛒</span>
          <span>Cart</span>
          <span className="cart-count">0</span>
        </button>
      </header>

      <nav className="category-nav" aria-label="Menu categories">
        {landingCategories.map((category) => (
          <a key={category.target} href={`#${category.target}`}>
            {category.label}
          </a>
        ))}
      </nav>

      <main id="top">
        <section className="poster-section" aria-label="Promotions">
          <div className="poster-slider">
            <button className="slider-arrow previous" onClick={previousPoster} aria-label="Previous poster">‹</button>
            <div className="poster-track">
              <div className="poster-box">
                <span>POSTER {posterIndex + 1}</span>
              </div>
            </div>
            <button className="slider-arrow next" onClick={nextPoster} aria-label="Next poster">›</button>
          </div>
          <div className="poster-dots" aria-label={`Poster ${posterIndex + 1} of 5`}>
            {[0, 1, 2, 3, 4].map((index) => (
              <button key={index} className={index === posterIndex ? 'active' : ''} onClick={() => setPosterIndex(index)} aria-label={`Show poster ${index + 1}`} />
            ))}
          </div>
        </section>

        <section className="welcome-section">
          <p className="eyebrow">Freshly made on campus</p>
          <h1>Big Burgers.<br />Big Cravings.</h1>
          <p className="welcome-copy">Your campus burger fix, made fresh and ready when you are.</p>
          <a className="order-button" href="#menu">Order Now <span>→</span></a>
        </section>

        <section id="menu" className="menu-section">
          <div className="section-heading">
            <p className="eyebrow">Explore the menu</p>
            <h2>What are you craving?</h2>
          </div>

          <section id="burgers" className="burger-hub">
            <div className="burger-hub-heading">
              <h3>Burgers</h3>
              <span>5 collections</span>
            </div>
            <div className="burger-category-grid">
              {burgerCategories.map((category) => (
                <a key={category.target} href={`#${category.target}`} className="burger-category-card">
                  <span>{category.label}</span>
                  <strong>→</strong>
                </a>
              ))}
            </div>
          </section>

          {categories.map((category) => (
            <section key={category} id={category.toLowerCase().replace(/\s+/g, '-')} className="menu-category">
              <h3>{category}</h3>
              <div className="product-list">
                {menuItems.filter((item) => item.category === category).map((item) => (
                  <article key={item.id} className="product-card">
                    <div className="product-image-placeholder" aria-hidden="true"><span>Food image</span></div>
                    <div className="product-info">
                      <h4>{item.name}</h4>
                      <div className="variant-list">
                        {item.variants.map((variant) => (
                          <div key={variant.name} className="variant-row">
                            <span>{variant.name}</span>
                            <span>₹{variant.price}</span>
                            <button>Add</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </section>
      </main>
    </div>
  )
}

export default App
