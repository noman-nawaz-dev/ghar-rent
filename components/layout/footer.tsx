import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-card text-card-foreground pt-12 pb-8 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-poppins text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-4">
              GharRent
            </h3>
            <p className="text-muted-foreground mb-4">
              Pakistan&apos;s premier platform for finding and renting properties.
              We connect home owners with potential tenants seamlessly.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition">
                <Twitter size={20} />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition">
                <Instagram size={20} />
              </Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/home" className="text-muted-foreground hover:text-primary transition">
                  Find Properties
                </Link>
              </li>
              <li>
                <Link href="/price-suggestion" className="text-muted-foreground hover:text-primary transition">
                  Price Suggestion
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-muted-foreground hover:text-primary transition">
                  Login / Register
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition">
                  Rental Guide
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition">
                  Property Valuation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li className="text-muted-foreground">
                Email: info@gharrent.pk
              </li>
              <li className="text-muted-foreground">
                Phone: +92 300 1234567
              </li>
              <li className="text-muted-foreground">
                Address: Blue Area, Islamabad, Pakistan
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} GharRent. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="#" className="text-muted-foreground text-sm hover:text-primary transition">
                Privacy Policy
              </Link>
              <Link href="#" className="text-muted-foreground text-sm hover:text-primary transition">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer