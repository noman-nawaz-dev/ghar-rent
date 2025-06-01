"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, X, Home, User, LogIn, Building, Users as UsersIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  const navLinks = [
    { name: "Home", href: "/home", icon: <Home className="w-4 h-4 mr-2" /> },
    { name: "Price Suggestion", href: "/price-suggestion", icon: null },
    { name: "Buyer Dashboard", href: "/buyer/dashboard", icon: <Home className="w-4 h-4 mr-2" /> },
    { name: "Seller Dashboard", href: "/seller/dashboard", icon: <Building className="w-4 h-4 mr-2" /> },
    { name: "Admin Dashboard", href: "/admin/dashboard", icon: <UsersIcon className="w-4 h-4 mr-2" /> },
    { name: "Login", href: "/auth/login", icon: <LogIn className="w-4 h-4 mr-2" /> },
    { name: "Register", href: "/auth/register", icon: <User className="w-4 h-4 mr-2" /> },
  ]
  
  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-background/95 backdrop-blur-md border-b shadow-sm" 
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <span className="font-poppins text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            GharRent
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary flex items-center",
                isScrolled ? "text-foreground" : "text-foreground/90"
              )}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
          <ModeToggle />
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
            <Link href="/home">Explore Properties</Link>
          </Button>
        </nav>
        
        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden space-x-4">
          <ModeToggle />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMobileMenu}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-b pb-4">
          <nav className="container mx-auto px-4 flex flex-col space-y-3 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-foreground py-2 flex items-center font-medium"
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            <Button asChild className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700">
              <Link href="/home" onClick={() => setIsMobileMenuOpen(false)}>
                Explore Properties
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header