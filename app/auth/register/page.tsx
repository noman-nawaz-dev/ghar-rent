"use client"

import { useState, useContext } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useSupabaseBrowser } from "@/lib/SupabaseClient"
import { AuthContext, AuthContextType } from "../../../context/AuthContext"

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  phone: z.string().min(11, { message: "Please enter a valid phone number" }),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  })
})

export default function RegisterPage() {
  const [activeTab, setActiveTab] = useState<string>("buyer")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = useSupabaseBrowser()
  const { isLoggedIn, userRole } = useContext(AuthContext) as AuthContextType;
  
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      termsAccepted: false
    },
  })
  
  // Redirect if already logged in (use context)
  if (isLoggedIn && userRole) {
    if (userRole === "buyer") router.replace("/home")
    else if (userRole === "seller") router.replace("/seller/dashboard")
    else if (userRole === "admin") router.replace("/admin/dashboard")
  }
  
  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    setIsLoading(true)

    const { email, password, name, phone } = values

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    console.log(authData)

    if (authError) {
      toast({
        title: "Registration Failed",
        description: authError.message,
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (!authData.user) {
      toast({
        title: "Registration Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    const { error: insertError } = await supabase.from("users").insert({
      id: authData.user.id,
      name,
      email,
      phone,
      role: activeTab as "buyer" | "seller",
    })

    if (insertError) {
      toast({
        title: "Registration Failed",
        description: `Failed to create user profile: ${insertError.message}`,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Registration Successful",
        description: "Your account has been created. Please check your email to verify.",
      })
      router.push("/auth/login")
    }

    setIsLoading(false)
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback?role=${activeTab}`,
      },
    })
  }

  return (
    <div className="min-h-screen pt-28 pb-16 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-md">
        <Card className="border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-poppins">Create an Account</CardTitle>
            <CardDescription>
              Join GharRent to start your property journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="buyer" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="buyer">Register as Buyer</TabsTrigger>
                <TabsTrigger value="seller">Register as Seller</TabsTrigger>
              </TabsList>
              <TabsContent value="buyer">
                {renderForm("buyer")}
              </TabsContent>
              <TabsContent value="seller">
                {renderForm("seller")}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-emerald-600 hover:underline">
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )

  function renderForm(userType: "buyer" | "seller") {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="your.email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+92 300 1234567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormDescription>
                  Must be at least 8 characters
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="termsAccepted"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I agree to the terms of service and privacy policy
                  </FormLabel>
                  <FormDescription>
                    You must agree to our terms to create an account
                  </FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            disabled={isLoading}
          >
            {isLoading ? `Creating ${userType} account...` : `Create ${userType} Account`}
          </Button>
          
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border"></span>
            </div>
            <div className="relative px-4 bg-background text-sm text-muted-foreground">
              OR
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full" 
            type="button"
            disabled={isLoading}
            onClick={handleGoogleSignIn}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>
        </form>
      </Form>
    )
  }
}