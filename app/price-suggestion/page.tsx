"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Calculator, Sparkles } from "lucide-react"

const formSchema = z.object({
  propertyType: z.string().min(1, { message: "Please select property type" }),
  area: z.string().min(1, { message: "Area is required" }),
  areaUnit: z.string().min(1, { message: "Please select area unit" }),
  bedrooms: z.string().min(1, { message: "Please select number of bedrooms" }),
  floors: z.string().min(1, { message: "Please select number of floors" }),
  kitchens: z.string().min(1, { message: "Please select number of kitchens" }),
  hasLawn: z.boolean(),
  city: z.string().min(1, { message: "City is required" }),
  address: z.string().min(3, { message: "Address must be at least 3 characters" }),
  furnishingStatus: z.string().min(1, { message: "Please select furnishing status" }),
  additionalInfo: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function PriceSuggestionPage() {
  const [isCalculating, setIsCalculating] = useState(false)
  const [suggestedPrice, setSuggestedPrice] = useState<number | null>(null)
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertyType: "",
      area: "",
      areaUnit: "Marla",
      bedrooms: "",
      floors: "",
      kitchens: "",
      hasLawn: false,
      city: "",
      address: "",
      furnishingStatus: "unfurnished",
      additionalInfo: "",
    },
  })
  
  function calculateSuggestedPrice(data: FormValues) {
    // This is a simplistic algorithm for demo purposes
    // A real implementation would use a more sophisticated model
    
    // Base price by city (per Marla)
    const cityBasePrices: Record<string, number> = {
      'Lahore': 10000,
      'Karachi': 12000,
      'Islamabad': 15000,
      'Rawalpindi': 9000,
      'Faisalabad': 7000,
      'Multan': 6000,
      'Peshawar': 8000,
      'Quetta': 7500,
      'Other': 5000,
    }
    
    // Property type multipliers
    const propertyTypeMultipliers: Record<string, number> = {
      'House': 1.0,
      'Apartment': 0.9,
      'Villa': 1.4,
      'Portion': 0.7,
    }
    
    // Area calculation
    let areaValue = parseFloat(data.area)
    if (data.areaUnit === 'Kanal') {
      // 1 Kanal = 20 Marla
      areaValue = areaValue * 20
    }
    
    // Start with base price based on city and area
    let basePrice = (cityBasePrices[data.city] || cityBasePrices['Other']) * areaValue
    
    // Apply property type multiplier
    basePrice = basePrice * (propertyTypeMultipliers[data.propertyType] || 1.0)
    
    // Add for bedrooms
    const bedroomPrice = parseInt(data.bedrooms) * 5000
    
    // Add for floors
    const floorPrice = parseInt(data.floors) * 2000
    
    // Add for kitchens
    const kitchenPrice = parseInt(data.kitchens) * 1000
    
    // Add for lawn
    const lawnPrice = data.hasLawn ? 3000 : 0
    
    // Furnished status
    const furnishingMultiplier = data.furnishingStatus === 'furnished' ? 1.2 : 1.0
    
    // Calculate total
    let totalPrice = (basePrice + bedroomPrice + floorPrice + kitchenPrice + lawnPrice) * furnishingMultiplier
    
    // Add slight randomness for realism
    const randomFactor = 0.95 + (Math.random() * 0.1) // between 0.95 and 1.05
    totalPrice = totalPrice * randomFactor
    
    // Round to nearest 1000
    return Math.round(totalPrice / 1000) * 1000
  }
  
  function onSubmit(data: FormValues) {
    setIsCalculating(true)
    
    // Simulate API call or calculation time
    setTimeout(() => {
      const price = calculateSuggestedPrice(data)
      setSuggestedPrice(price)
      setIsCalculating(false)
    }, 2000)
  }
  
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <div className="pt-28 pb-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-10">
          <h1 className="font-poppins text-3xl md:text-4xl font-bold mb-4">
            AI Rental Price Suggestion
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get an accurate estimate of how much your property could rent for based on its features and location
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
                <CardDescription>
                  Fill in the details about your property to get an accurate price suggestion
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Property Type */}
                      <FormField
                        control={form.control}
                        name="propertyType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Property Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select property type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="House">House</SelectItem>
                                <SelectItem value="Apartment">Apartment</SelectItem>
                                <SelectItem value="Villa">Villa</SelectItem>
                                <SelectItem value="Portion">Portion</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Area */}
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="area"
                          render={({ field }) => (
                            <FormItem className="col-span-1">
                              <FormLabel>Area</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="e.g. 10" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="areaUnit"
                          render={({ field }) => (
                            <FormItem className="col-span-1">
                              <FormLabel>Unit</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Unit" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Marla">Marla</SelectItem>
                                  <SelectItem value="Kanal">Kanal</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      {/* Bedrooms */}
                      <FormField
                        control={form.control}
                        name="bedrooms"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bedrooms</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select number of bedrooms" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                                  <SelectItem key={num} value={num.toString()}>
                                    {num} {num === 1 ? 'Bedroom' : 'Bedrooms'}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Floors */}
                      <FormField
                        control={form.control}
                        name="floors"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Floors</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select number of floors" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {[1, 2, 3, 4, 5].map((num) => (
                                  <SelectItem key={num} value={num.toString()}>
                                    {num} {num === 1 ? 'Floor' : 'Floors'}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Kitchens */}
                      <FormField
                        control={form.control}
                        name="kitchens"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Kitchens</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select number of kitchens" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {[1, 2, 3, 4].map((num) => (
                                  <SelectItem key={num} value={num.toString()}>
                                    {num} {num === 1 ? 'Kitchen' : 'Kitchens'}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Has Lawn */}
                      <FormField
                        control={form.control}
                        name="hasLawn"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="mt-1"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Has Lawn</FormLabel>
                              <FormDescription>
                                Check if the property has a lawn or garden
                              </FormDescription>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* City */}
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select city" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Lahore">Lahore</SelectItem>
                                <SelectItem value="Karachi">Karachi</SelectItem>
                                <SelectItem value="Islamabad">Islamabad</SelectItem>
                                <SelectItem value="Rawalpindi">Rawalpindi</SelectItem>
                                <SelectItem value="Faisalabad">Faisalabad</SelectItem>
                                <SelectItem value="Multan">Multan</SelectItem>
                                <SelectItem value="Peshawar">Peshawar</SelectItem>
                                <SelectItem value="Quetta">Quetta</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Address */}
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address / Society</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. DHA Phase 5, Bahria Town" {...field} />
                            </FormControl>
                            <FormDescription>
                              Enter housing society, area name, or address
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Separator />
                    
                    {/* Furnishing Status */}
                    <FormField
                      control={form.control}
                      name="furnishingStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Furnishing Status</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex space-x-4"
                            >
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="furnished" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  Furnished
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="unfurnished" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  Unfurnished
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Additional Information */}
                    <FormField
                      control={form.control}
                      name="additionalInfo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Details (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Add any other relevant details about your property..."
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Include details like amenities, condition, nearby facilities, etc.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      disabled={isCalculating}
                    >
                      {isCalculating ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Calculating...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Calculator className="mr-2 h-5 w-5" />
                          Get Price Suggestion
                        </span>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card className="sticky top-28">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="h-5 w-5 text-emerald-600 mr-2" />
                  AI Price Suggestion
                </CardTitle>
                <CardDescription>
                  Our AI will analyze your property details to suggest an optimal rental price
                </CardDescription>
              </CardHeader>
              <CardContent>
                {suggestedPrice ? (
                  <div className="text-center py-6">
                    <div className="text-4xl font-bold text-emerald-600 mb-2">
                      PKR {formatPrice(suggestedPrice)}
                    </div>
                    <p className="text-muted-foreground">Suggested monthly rent</p>
                    
                    <div className="mt-8 space-y-4 text-left">
                      <p className="text-sm text-muted-foreground">
                        <strong>Price Range:</strong> This suggested price is based on current market trends and similar properties in your area. Consider a range between PKR {formatPrice(Math.round(suggestedPrice * 0.9))} and PKR {formatPrice(Math.round(suggestedPrice * 1.1))}.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Note:</strong> This is an AI-generated suggestion and should be used as a guideline only. Market conditions, property condition, and specific features may affect the actual rental value.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-muted rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                      <Calculator className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-lg font-medium mb-2">No price suggestion yet</p>
                    <p className="text-muted-foreground text-sm">
                      Fill in your property details and click the button to get an AI-powered price suggestion
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}