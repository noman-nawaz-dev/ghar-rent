"use client"

import Link from "next/link"
import { useState, useEffect, useContext } from "react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, X, Home, User, LogIn, Building, Users as UsersIcon, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"
import { useSupabaseBrowser } from "@/lib/SupabaseClient"
import { AuthContext, AuthContextType } from "../../context/AuthContext"

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, userRole, loading, logout } = useContext(AuthContext) as AuthContextType;
  const supabase = useSupabaseBrowser();
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  // Define all nav links with allowed roles
  const NAV_LINKS = [
    // { name: "Landing", href: "/", icon: <></>, roles: ["all"] }, // No longer shown in nav
    { name: "Home", href: "/home", icon: <Home className="w-4 h-4 mr-2" />, roles: ["buyer", "seller", "admin", "unauth"], group: "left" },
    { name: "Price Suggestion", href: "/price-suggestion", icon: <DollarSign className="w-4 h-4 mr-2" />, roles: ["buyer", "seller", "admin", "unauth"], group: "left" },
    { name: "Buyer Dashboard", href: "/buyer/dashboard", icon: <Home className="w-4 h-4 mr-2" />, roles: ["buyer"], group: "left" },
    { name: "Seller Dashboard", href: "/seller/dashboard", icon: <Building className="w-4 h-4 mr-2" />, roles: ["seller"], group: "left" },
    { name: "Admin Dashboard", href: "/admin/dashboard", icon: <UsersIcon className="w-4 h-4 mr-2" />, roles: ["admin"], group: "left" },
    { name: "Login", href: "/auth/login", icon: <LogIn className="w-4 h-4 mr-2" />, roles: ["unauth"], group: "right" },
    { name: "Register", href: "/auth/register", icon: <User className="w-4 h-4 mr-2" />, roles: ["unauth"], group: "right" },
    { name: "Explore Properties", href: "/home", icon: null, roles: ["buyer", "seller", "admin", "unauth"], group: "right" },
    { name: "Logout", href: "#logout", icon: null, roles: ["buyer", "seller", "admin"], group: "right" },
  ];

  function getUserNavLinks(isLoggedIn: boolean, userRole: string | null) {
    // If not logged in, treat as 'unauth'
    const role = isLoggedIn && userRole ? userRole : "unauth";
    return NAV_LINKS.filter(link =>
      link.roles.includes("all") || link.roles.includes(role)
    );
  }

  let filteredNavLinks = getUserNavLinks(isLoggedIn, userRole);
  const leftNavLinks = filteredNavLinks.filter(link => link.group === "left");
  const rightNavLinks = filteredNavLinks.filter(link => link.group === "right");

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
    router.push("/");
  };

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
        <nav className="hidden md:flex items-center justify-between w-full">
          <div className="flex items-center ml-20 space-x-6">
            {leftNavLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors flex items-center px-4 py-2 rounded-md",
                  isScrolled ? "text-foreground" : "text-foreground/90",
                  pathname === link.href &&
                    (
                      link.name === "Home" ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-100 font-semibold" :
                      link.name === "Price Suggestion" ? "bg-blue-100 text-blue-900 dark:bg-blue-900/60 dark:text-blue-100 font-semibold" :
                      link.name === "Buyer Dashboard" ? "bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-100 font-semibold" :
                      link.name === "Seller Dashboard" ? "bg-purple-100 text-purple-900 dark:bg-purple-900/60 dark:text-purple-100 font-semibold" :
                      link.name === "Admin Dashboard" ? "bg-pink-100 text-pink-900 dark:bg-pink-900/60 dark:text-pink-100 font-semibold" :
                      "bg-muted font-semibold"
                    )
                )}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <ModeToggle />
            {rightNavLinks.map((link) => (
              link.name === "Logout" ? (
                <Button key={link.name} variant="outline" className="ml-2" onClick={handleLogout}>
                  Logout
                </Button>
              ) : link.name === "Explore Properties" ? (
                <Button key={link.name} asChild className="bg-emerald-600 hover:bg-emerald-700">
                  <Link href={link.href}>Explore Properties</Link>
                </Button>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors flex items-center px-4 py-2 rounded-md",
                    isScrolled ? "text-foreground" : "text-foreground/90",
                    pathname === link.href && "bg-muted font-semibold",
                    (link.name === "Login" || link.name === "Register") && "hover:bg-muted"
                  )}
                >
                  {link.icon}
                  {link.name}
                </Link>
              )
            ))}
          </div>
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
            <div className="flex flex-col space-y-2">
              {leftNavLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "text-foreground py-2 flex items-center font-medium rounded-md px-3",
                    pathname === link.href &&
                      (
                        link.name === "Home" ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-100 font-semibold" :
                        link.name === "Price Suggestion" ? "bg-blue-100 text-blue-900 dark:bg-blue-900/60 dark:text-blue-100 font-semibold" :
                        link.name === "Buyer Dashboard" ? "bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-100 font-semibold" :
                        link.name === "Seller Dashboard" ? "bg-purple-100 text-purple-900 dark:bg-purple-900/60 dark:text-purple-100 font-semibold" :
                        link.name === "Admin Dashboard" ? "bg-pink-100 text-pink-900 dark:bg-pink-900/60 dark:text-pink-100 font-semibold" :
                        "bg-muted font-semibold"
                      )
                  )}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="flex flex-col space-y-2 mt-4 border-t pt-4">
              {rightNavLinks.map((link) => (
                link.name === "Logout" ? (
                  <Button key={link.name} variant="outline" className="w-full mt-2" onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}>
                    Logout
                  </Button>
                ) : link.name === "Explore Properties" ? (
                  <Button key={link.name} asChild className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700">
                    <Link href={link.href} onClick={() => setIsMobileMenuOpen(false)}>
                      Explore Properties
                    </Link>
                  </Button>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "text-foreground py-2 flex items-center font-medium rounded-md px-3",
                      pathname === link.href && "bg-muted font-semibold",
                      (link.name === "Login" || link.name === "Register") && "hover:bg-muted"
                    )}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                )
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header