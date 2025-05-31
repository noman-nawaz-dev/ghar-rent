import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Building, Home, DollarSign, Users, Shield, Star } from 'lucide-react';
import FeaturesSection from '@/components/landing/features-section';
import TestimonialsSection from '@/components/landing/testimonials-section';
import HowItWorksSection from '@/components/landing/how-it-works-section';

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-blue-600/20 dark:from-emerald-900/30 dark:to-blue-900/30 -z-10" />
        <div 
          className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center opacity-10 dark:opacity-5 -z-20"
          aria-hidden="true"
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-poppins text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Find Your Perfect <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-blue-600">Rental Home</span> in Pakistan
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              GharRent connects property owners with potential tenants, providing a seamless rental experience with AI-powered price suggestions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto">
                <Link href="/home">
                  Explore Properties
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href="/price-suggestion">
                  Get Price Suggestion
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">5000+</p>
              <p className="text-muted-foreground">Properties Listed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">3200+</p>
              <p className="text-muted-foreground">Happy Tenants</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">1800+</p>
              <p className="text-muted-foreground">Property Owners</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">12+</p>
              <p className="text-muted-foreground">Cities Covered</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-poppins text-3xl md:text-4xl font-bold mb-6">
            Ready to Find Your Perfect Rental Home?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied users who have found their ideal rental properties through GharRent.
          </p>
          <Button asChild size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
            <Link href="/home">
              Let&apos;s Get Started
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}