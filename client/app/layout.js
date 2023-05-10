import './globals.css'
import { Roboto } from 'next/font/google'
import Nav from './nav'
import Footer from './footer'
import Providers from './provider'
import GoogleAnalytic from './ga'




export const metadata = {
  title: 'Doctorphonez | LDN',
  description: 'Mobile phones and accessories',
}

const roboto = Roboto({
  weight: ['100','300', '400'],
  style: 'normal',
  display: 'swap',
  subsets: ['latin'] 
})



export default async function RootLayout({ children }) {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + 'api/v1/products', { next: { revalidate: 10 }})
  const data = await res.json();
  const productlist = data.products
  
  return (
    
    <html lang="en">
      
      <head />
      <GoogleAnalytic />
        <Providers>
        <body className={roboto.className}>
          <Nav products={productlist}/>
              {children}
          <Footer />
        </body>
        </Providers>
    </html>
  )
}

