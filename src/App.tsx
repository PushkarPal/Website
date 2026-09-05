import './App.css'
import { menuItems } from './data/menu'
const categories = [...new Set(menuItems.map((item) => item.category))]
function App() {
  return (
    <div>
      <header>
        <h1>BIGGIES</h1>

        <nav>
          <a href="#menu">Menu</a>
          <a href="#cart">Cart</a>
        </nav>
      </header>

      <main>
        <section>
          <h2>Big Burgers. Big Cravings.</h2>
          <p>Freshly made on campus.</p>

          <button>Order Now</button>
        </section>

        <section id="menu">
          <h2>Popular Picks</h2>

          <div>
            {categories.map((category) => (
              <section key={category}>
                <h3>{category}</h3>

                <div>
                  {menuItems
                    .filter((item) => item.category === category)
                    .map((item) => (
                      <article key={item.id}>
                        <h4>{item.name}</h4>
                        <div>
                          {item.variants.map((variant) => (
                            <div key={variant.name}>
                              <span>{variant.name}</span>
                              <span>₹{variant.price}</span>
                              <button>Add to Cart</button>
                            </div>
                          ))}
                        </div>
                      </article>
                    ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App