import { About } from './components/About'
import { Contact } from './components/Contact'
import { Facilities } from './components/Facilities'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Rooms } from './components/Rooms'

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Rooms />
        <Facilities />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
