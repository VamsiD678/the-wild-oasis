import '../app/_styles/globals.css'

import { Josefin_Sans } from 'next/font/google'
import Header from "@/starter/components/Header";
import { ReservationProvider } from './_components/ReservationContext';

const josefin = Josefin_Sans({
  subsets:['latin'],
  display:'swap'
})
 
export const metadata = {
  title: {
    template: "%s | The Wild Oasis",
    default: "Welcome | The Wild Oasis"
  },
  description: "Luxurious cabin hotel, located in the heart of the Italian Dolomites, surrounded by beautifull mountains and dark forest"
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${josefin.className} bg-primary-950 antialiased min-h-screen text-primary-100 flex flex-col relative`}>
        
        <Header/>
  
        <div className='flex-1 px-8 py-12 grid'>
          <main className='max-w-7xl mx-auto w-full'>
            <ReservationProvider>
              {children}
            </ReservationProvider>
          </main>
        </div>

        <footer>
          @2024 copyright wild oasis
        </footer>
      </body>
    </html>
  )
}
