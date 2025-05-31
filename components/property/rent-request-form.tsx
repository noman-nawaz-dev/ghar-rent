"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
  price: z.string().min(1, {
    message: "Proposed price is required.",
  }),
  duration: z.string().min(1, {
    message: "Rental duration is required.",
  }),
  message: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function RentRequestForm({ propertyId }: { propertyId: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  
  // Create form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: "",
      duration: "6",
      message: "",
    },
  })

  // Form submission handler
  const onSubmit = (values: FormValues) => {
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      console.log("Rent request submitted:", { propertyId, ...values })
      
      toast({
        title: "Request Submitted",
        description: "Your rental request has been sent to the property owner.",
      })
      
      setIsSubmitting(false)
      form.reset()
    }, 1500)
  }

  return (
    <div>
      <h3 className="font-semibold text-lg mb-4">Request to Rent</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proposed Price (PKR/month)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">PKR</span>
                    <Input 
                      type="number" 
                      className="pl-12" 
                      placeholder="50,000" 
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rental Duration</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="3">3 Months</SelectItem>
                    <SelectItem value="6">6 Months</SelectItem>
                    <SelectItem value="12">12 Months</SelectItem>
                    <SelectItem value="24">24 Months</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message to Owner (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="I'm interested in renting this property..." 
                    className="resize-none" 
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending Request..." : "Send Rental Request"}
          </Button>
        </form>
      </Form>
    </div>
  )
}