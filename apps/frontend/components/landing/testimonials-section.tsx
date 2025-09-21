"use client"

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

const testimonials = [
  {
    name: "Ahmed Khan",
    role: "Property Owner, Lahore",
    image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100",
    quote: "GharRent has transformed how I manage my rental properties. The platform is intuitive, and I've found reliable tenants quickly. The AI price suggestion tool helped me set competitive rates."
  },
  {
    name: "Fatima Aziz",
    role: "Tenant, Karachi",
    image: "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=100",
    quote: "Finding a rental home used to be stressful until I discovered GharRent. The process was seamless from browsing listings to finalizing the agreement. Highly recommended for anyone looking to rent."
  },
  {
    name: "Usman Malik",
    role: "Property Owner, Islamabad",
    image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100",
    quote: "As someone with multiple properties, GharRent has simplified my rental management process. The dashboard gives me clear visibility into all pending requests and current tenants."
  },
  {
    name: "Ayesha Siddiqui",
    role: "Tenant, Rawalpindi",
    image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100",
    quote: "The direct communication with property owners made the rental process transparent and efficient. GharRent's interface is user-friendly and helped me find my dream apartment."
  }
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const testimonialsPerView = typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 2
  
  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + testimonialsPerView >= testimonials.length ? 0 : prevIndex + testimonialsPerView
    )
  }
  
  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex - testimonialsPerView < 0 ? Math.max(0, testimonials.length - testimonialsPerView) : prevIndex - testimonialsPerView
    )
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-poppins text-3xl md:text-4xl font-bold mb-4">
            What Our Users Say
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join thousands of satisfied property owners and tenants who use GharRent
          </p>
        </div>

        <div className="relative">
          <div className="flex overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out" 
              style={{ transform: `translateX(-${currentIndex * (100 / testimonialsPerView)}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full md:w-1/2 flex-shrink-0 px-4">
                  <Card className="h-full bg-card border border-border transition-all duration-300 hover:border-emerald-200 dark:hover:border-emerald-900">
                    <CardContent className="p-8">
                      <div className="flex items-center mb-6">
                        <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                          <img 
                            src={testimonial.image} 
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                      <div className="flex mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-muted-foreground italic">&ldquo;{testimonial.quote}&rdquo;</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center mt-8 space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={prevTestimonial}
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={nextTestimonial}
              className="rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}