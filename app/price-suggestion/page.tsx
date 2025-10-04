"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AddressAutoComplete } from "@/components/ui/address-autocomplete"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
import { Calculator, Sparkles, TrendingUp, MapPin, Home, AlertCircle, CheckCircle } from "lucide-react"

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
  coordinates: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }).optional(),
  furnishingStatus: z.string().min(1, { message: "Please select furnishing status" }),
  additionalInfo: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface PriceAnalysis {
  basePrice: number
  adjustments: Array<{
    factor: string
    impact: string
    reasoning: string
  }>
  marketInsights: string
}

interface PriceSuggestionResult {
  price: number
  priceRange?: {
    min: number
    max: number
  }
  analysis?: PriceAnalysis
  recommendations?: string[]
  error?: string
  success?: boolean
}

export default function PriceSuggestionPage() {
  const [isCalculating, setIsCalculating] = useState(false)
  const [result, setResult] = useState<PriceSuggestionResult | null>(null)
  
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
      coordinates: undefined,
      furnishingStatus: "unfurnished",
      additionalInfo: "",
    },
  })
  
  async function onSubmit(data: FormValues) {
    setIsCalculating(true)
    setResult(null)

    try {
      const res = await fetch("/api/price-suggestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      
      const suggestionResult = await res.json()
      setResult(suggestionResult)
    } catch (error) {
      setResult({
        price: 0,
        error: "Failed to get price suggestion. Please try again.",
        success: false
      })
    } finally {
      setIsCalculating(false)
    }
  }
  
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  const getPropertySummary = () => {
    const values = form.getValues()
    if (!values.propertyType || !values.area || !values.city) return null
    
    return `${values.propertyType} • ${values.area} ${values.areaUnit} • ${values.bedrooms} Bed • ${values.city}`
  }

  return (
    <div className="pt-28 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-10">
          <h1 className="font-poppins text-3xl md:text-4xl font-bold mb-4">
            AI Rental Price Analyzer
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get comprehensive market analysis and accurate rental price suggestions powered by advanced AI
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Home className="h-5 w-5 mr-2" />
                  Property Details
                </CardTitle>
                <CardDescription>
                  Provide detailed information about your property for accurate market analysis
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
                                <SelectItem value="Flat">Flat</SelectItem>
                                <SelectItem value="Studio">Studio</SelectItem>
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
                                  <SelectItem value="Sq Ft">Square Feet</SelectItem>
                                  <SelectItem value="Sq Yard">Square Yard</SelectItem>
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
                              <FormLabel>Has Lawn/Garden</FormLabel>
                              <FormDescription>
                                Property includes outdoor green space
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
                                <SelectItem value="Sialkot">Sialkot</SelectItem>
                                <SelectItem value="Gujranwala">Gujranwala</SelectItem>
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
                              <AddressAutoComplete
                                value={field.value}
                                onChange={(address, coordinates) => {
                                  field.onChange(address);
                                  if (coordinates) {
                                    form.setValue('coordinates', coordinates);
                                  }
                                }}
                                placeholder="e.g. DHA Phase 5, Bahria Town, Gulberg"
                                error={!!form.formState.errors.address}
                                inputHeight="40px"
                                inputStyle={{
                                  height: "40px",
                                  fontSize: "14px",
                                  lineHeight: "1.5"
                                }}
                              />
                            </FormControl>
                            <FormDescription>
                              Housing society, area name, or specific location
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
                              className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0"
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
                                  <RadioGroupItem value="semi-furnished" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  Semi-Furnished
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
                          <FormLabel>Additional Features & Details</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g. Swimming pool, gym, security, parking, rooftop, basement, AC, generator, etc."
                              className="resize-none"
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Include amenities, condition, nearby facilities, unique features
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                      disabled={isCalculating}
                    >
                      {isCalculating ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Analyzing Market Data...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Sparkles className="mr-2 h-5 w-5" />
                          Get AI Market Analysis
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
                  <TrendingUp className="h-5 w-5 text-emerald-600 mr-2" />
                  Market Analysis
                </CardTitle>
                <CardDescription>
                  AI-powered rental price analysis and market insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                {result && result.success && result.price ? (
                  <div className="space-y-6">
                    {/* Property Summary */}
                    {getPropertySummary() && (
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          Property Summary
                        </div>
                        <p className="font-medium">{getPropertySummary()}</p>
                      </div>
                    )}
                    
                    {/* Main Price */}
                    <div className="text-center py-4">
                      <div className="text-4xl font-bold text-emerald-600 mb-2">
                        PKR {formatPrice(result.price)}
                      </div>
                      <p className="text-muted-foreground">Suggested monthly rent</p>
                      
                      {result.priceRange && (
                        <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
                          <p className="text-sm font-medium text-emerald-800">
                            Price Range: PKR {formatPrice(result.priceRange.min)} - PKR {formatPrice(result.priceRange.max)}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* Market Insights */}
                    {result.analysis?.marketInsights && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm">Market Insights</h4>
                        <p className="text-sm text-muted-foreground">
                          {result.analysis.marketInsights}
                        </p>
                      </div>
                    )}
                    
                    {/* Price Adjustments */}
                    {result.analysis?.adjustments && result.analysis.adjustments.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm">Price Factors</h4>
                        <div className="space-y-2">
                          {result.analysis.adjustments.map((adjustment, index) => (
                            <div key={index} className="flex items-start space-x-2 text-sm">
                              <Badge variant="secondary" className="text-xs">
                                {adjustment.impact}
                              </Badge>
                              <div>
                                <p className="font-medium">{adjustment.factor}</p>
                                <p className="text-muted-foreground text-xs">
                                  {adjustment.reasoning}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Recommendations */}
                    {result.recommendations && result.recommendations.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm">Recommendations</h4>
                        <div className="space-y-2">
                          {result.recommendations.map((rec, index) => (
                            <div key={index} className="flex items-start space-x-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                              <p className="text-muted-foreground">{rec}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Disclaimer */}
                    <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-amber-800">
                          <p className="font-medium mb-1">Important Note</p>
                          <p>This AI analysis is based on current market data and property features. Final rental prices may vary based on specific conditions, negotiations, and market fluctuations.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : result && result.error ? (
                  <div className="text-center py-12">
                    <Alert className="text-left">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {result.error}
                      </AlertDescription>
                    </Alert>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-muted rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                      <Calculator className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-lg font-medium mb-2">Ready for Analysis</p>
                    <p className="text-muted-foreground text-sm">
                      Complete the property details form to get comprehensive market analysis and price suggestions
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