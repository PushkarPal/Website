import { useEffect, useRef, useState } from 'react'
import type { TouchEvent } from 'react'
import { menuItems } from './data/menu'
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

function CategoryLink({
  category,
  selected,
  onSelect,
}: {
  category: Category
  selected: boolean
  onSelect: (target: string) => void
}) {
  return (
    <button
      type="button"
      className={selected ? 'is-selected' : ''}
      aria-pressed={selected}
      onClick={() => onSelect(category.target)}
    >
      <span>{category.label}</span>
    </button>
  )
}

const categoryMenuMap: Record<string, string[]> = {
  'menu-burger': ['Value Burgers', 'Beamer', 'The Original', 'Bigg Krunch', 'Classic Burgers'],
  'menu-wrap': ['Bigg Wraps'],
  'menu-wings': ['Wings'],
  'menu-fries': ['Fries'],
  'menu-rice': ['Rice Bowls'],
  'menu-quick': ['Quick Bites'],
  'menu-shakes': ['Thick Shakes'],
  'menu-dessert': ['Desserts'],
  'menu-beverages': ['Beverages'],
}

function CategoryContent({ category }: { category: string | null }) {
  if (!category) return null

  const selected = [...firstRow, ...secondRow].find((item) => item.target === category)
  const sectionNames = categoryMenuMap[category] ?? []
  const sections = sectionNames.map((sectionName) => ({
    name: sectionName,
    items: menuItems.filter((item) => item.category === sectionName),
  })).filter((section) => section.items.length > 0)

  return (
    <section className="category-menu" aria-live="polite" aria-label={selected ? `${selected.label} menu` : 'Selected menu'}>
      {sections.map((section) => (
        <section className="menu-section" key={section.name}>
          <h2>{section.name}</h2>

          <div className="menu-list">
            {section.items.flatMap((item) =>
              item.variants.map((variant) => (
                <article className="menu-item" key={`${item.id}-${variant.name}`}>
                  <div className="menu-item-info">
                    <h3>{item.name}</h3>
                    <span className="menu-item-variant">{variant.name}</span>
                  </div>

                  <span className="menu-item-price">₹{variant.price}</span>

                  <button
                    type="button"
                    className="menu-item-add"
                    aria-label={`Add ${item.name} ${variant.name}`}
                  >
                    +
                  </button>
                </article>
              )),
            )}
          </div>
        </section>
      ))}
    </section>
  )
}

function App() {
  const [position, setPosition] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
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
            {firstRow.map((category) => (
              <CategoryLink
                key={category.target}
                category={category}
                selected={selectedCategory === category.target}
                onSelect={setSelectedCategory}
              />
            ))}
          </div>

          <div className="category-separator" aria-hidden="true" />

          <div className="category-row category-row-four">
            {secondRow.map((category) => (
              <CategoryLink
                key={category.target}
                category={category}
                selected={selectedCategory === category.target}
                onSelect={setSelectedCategory}
              />
            ))}
          </div>
        </nav>

        <div className="category-line" aria-hidden="true" />
      </section>

      {selectedCategory ? (
        <CategoryContent category={selectedCategory} />
      ) : (
      <section className="poster-section" aria-label="Promotional posters">
        <div className="order-prompt" aria-label="Order prompt">
          <div>Place your order</div>
          <span>Destroy your hunger</span>
        </div>

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

      )}
    </div>
  )
}

export default App
