import { useState } from 'react'
import { About } from './components/About'
import { BookingModal } from './components/BookingModal'
import { Contact } from './components/Contact'
import { Facilities } from './components/Facilities'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Reviews } from './components/Reviews'
import { Rooms, type BookingRequest } from './components/Rooms'
import { defaultStay, type Stay } from './lib/stay'

function App() {
  const [stay, setStay] = useState<Stay>(defaultStay)
  const [request, setRequest] = useState<BookingRequest | null>(null)

  const openRequest = (next: BookingRequest) => {
    setStay((s) => ({ ...s, room: next.roomId }))
    setRequest(next)
  }

  const useForm = () => {
    setRequest(null)
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <Header />
      <main>
        <Hero stay={stay} onStayChange={setStay} />
        <About />
        <Facilities />
        <Rooms stay={stay} onStayChange={setStay} onRequest={openRequest} />
        <Reviews />
        <Contact stay={stay} onStayChange={setStay} />
      </main>
      <Footer />
      <BookingModal request={request} stay={stay} onClose={() => setRequest(null)} onUseForm={useForm} />
    </>
  )
}

export default App
