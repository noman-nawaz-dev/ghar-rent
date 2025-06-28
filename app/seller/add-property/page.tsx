"use client";

import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Home, MapPin, Phone, User, Camera, Banknote, Ruler, Building, Bed, TreePine } from "lucide-react";
import { PropertyService } from "@/lib/database/properties";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ImageUpload } from "@/components/ui/image-upload";

const propertyTypes = ["House", "Apartment", "Villa", "Penthouse"];
const areaUnits = ["Marla", "Kanal"];
const cities = ["Islamabad", "Lahore", "Karachi"];
const statusOptions = ["Available", "Pending", "Rented"];

const formSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Description is required"),
  price: z.coerce.number().min(1, "Price is required"),
  area: z.coerce.number().min(1, "Area is required"),
  areaUnit: z.enum(["Marla", "Kanal"]),
  bedrooms: z.coerce.number().min(0),
  floors: z.coerce.number().min(0),
  kitchens: z.coerce.number().min(0),
  hasLawn: z.boolean().optional(),
  additionalInfo: z.string().optional(),
  address: z.string().min(3, "Address is required"),
  city: z.enum(["Islamabad", "Lahore", "Karachi"]),
  images: z.array(z.string()).optional(),
  sellerPhone: z.string().min(6, "Phone is required"),
  sellerName: z.string().min(2, "Name is required"),
  status: z.enum(["Available", "Pending", "Rented"]),
  propertyType: z.enum(["House", "Apartment", "Villa", "Penthouse"]),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddPropertyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const { toast } = useToast();
  const { isLoggedIn, currentUser } = useAuth()
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      area: 0,
      areaUnit: "Marla",
      bedrooms: 0,
      floors: 0,
      kitchens: 0,
      hasLawn: false,
      additionalInfo: "",
      address: "",
      city: "Islamabad",
      images: [],
      sellerPhone: "",
      sellerName: "",
      status: "Available",
      propertyType: "House",
    },
  });

  // Watch the images field to debug
  const watchedImages = form.watch('images');
  console.log('Watched images:', watchedImages);

  const handleImagesUploaded = (urls: string[]) => {
    console.log('Images uploaded:', urls);
    setUploadedImages(urls);
    form.setValue('images', urls);
    
    // Show feedback to user
    if (urls.length > 0) {
      toast({
        title: "Images Uploaded",
        description: `${urls.length} image(s) uploaded successfully.`,
      });
    }
  };

  const onSubmit = async (values: FormValues) => {
    console.log('Form values:', values);
    console.log('Uploaded images:', uploadedImages);
    console.log('Form images field:', values.images);
    
    if (!isLoggedIn) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add a property.",
        variant: "destructive",
      });
      return;
    }

    if (currentUser?.role !== 'seller' && currentUser?.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "Only sellers can add properties.",
        variant: "destructive",
      });
      return;
    }

    if (uploadedImages.length === 0) {
      toast({
        title: "Images Required",
        description: "Please upload at least one image of your property.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get current user ID from auth context
      const currentUser = await getCurrentUser();
      if (!currentUser || !currentUser.id) {
        throw new Error("User not authenticated");
      }

      const propertyData = {
        title: values.title,
        description: values.description,
        price: values.price,
        area: values.area,
        area_unit: values.areaUnit,
        bedrooms: values.bedrooms,
        floors: values.floors,
        kitchens: values.kitchens,
        has_lawn: values.hasLawn || false,
        additional_info: values.additionalInfo || null,
        address: values.address,
        city: values.city,
        images: uploadedImages,
        seller_id: currentUser.id,
        seller_phone: values.sellerPhone,
        seller_name: values.sellerName,
        status: values.status,
        property_type: values.propertyType,
      };

      const { data, error } = await PropertyService.insertProperty(propertyData);

      if (error) {
        throw new Error(error.message || "Failed to add property");
      }

      toast({
        title: "Property Added Successfully!",
        description: "Your property has been listed and is now visible to potential tenants.",
      });

      // Reset form
      form.reset();
      setUploadedImages([]);
      
      // Redirect to seller dashboard
      router.push("/seller/dashboard");

    } catch (error: any) {
      console.error("Error adding property:", error);
      toast({
        title: "Error Adding Property",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to get current user
  const getCurrentUser = async () => {
    return { id: currentUser?.id };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available": return "text-green-600 bg-green-50 border-green-200";
      case "Pending": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Rented": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="pt-28 pb-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-full mb-4">
            <Home className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Add New Property</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">List your property and connect with potential tenants</p>
        </div>

        <Card className="shadow-lg border bg-card max-w-4xl mx-auto">
          <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-semibold flex items-center gap-2">
              <Building className="w-6 h-6" />
              Property Details
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            <Form {...form}>
              <div className="space-y-8">
                
                {/* Basic Information Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Home className="w-4 h-4 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Basic Information</h3>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground">Property Title</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. Spacious Family Home in DHA" 
                            className="h-12 border-input focus:border-emerald-500 focus:ring-emerald-500"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground">Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your property's features, amenities, and unique selling points..." 
                            className="min-h-[120px] border-input focus:border-emerald-500 focus:ring-emerald-500"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Property Specifications */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Ruler className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Property Specifications</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground flex items-center gap-2">
                            <Banknote className="w-4 h-4 text-green-600 dark:text-green-400" />
                            Monthly Rent (PKR)
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={0} 
                              className="h-12 border-input focus:border-emerald-500 focus:ring-emerald-500"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="area"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">Area Size</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={0} 
                              className="h-12 border-input focus:border-emerald-500 focus:ring-emerald-500"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="areaUnit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">Area Unit</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 border-input focus:border-emerald-500">
                                <SelectValue placeholder="Select unit" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {areaUnits.map((unit) => (
                                <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="propertyType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">Property Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 border-input focus:border-emerald-500">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {propertyTypes.map((type) => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="bedrooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground flex items-center gap-2">
                            <Bed className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            Bedrooms
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={0} 
                              className="h-12 border-input focus:border-emerald-500 focus:ring-emerald-500"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="floors"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">Floors</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={0} 
                              className="h-12 border-input focus:border-emerald-500 focus:ring-emerald-500"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="kitchens"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">Kitchens</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={0} 
                              className="h-12 border-input focus:border-emerald-500 focus:ring-emerald-500"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="hasLawn"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                        <FormControl>
                          <Checkbox 
                            checked={field.value} 
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                          />
                        </FormControl>
                        <div className="flex items-center gap-2">
                          <TreePine className="w-4 h-4 text-green-600 dark:text-green-400" />
                          <FormLabel className="mb-0 text-sm font-medium text-foreground">Has Lawn/Garden</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="additionalInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground">Additional Information</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Parking spaces, security features, nearby amenities, etc..." 
                            className="border-input focus:border-emerald-500 focus:ring-emerald-500"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Location Details */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Location Details</h3>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground">Full Address</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. House #123, Street 5, Block C, DHA Phase 2" 
                            className="h-12 border-input focus:border-emerald-500 focus:ring-emerald-500"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground">City</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 border-input focus:border-emerald-500">
                              <SelectValue placeholder="Select city" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {cities.map((city) => (
                              <SelectItem key={city} value={city}>{city}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Media & Contact */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Camera className="w-4 h-4 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Media & Contact Information</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <FormLabel className="text-sm font-medium text-foreground">Property Images</FormLabel>
                    <ImageUpload 
                      onImagesUploaded={handleImagesUploaded}
                      maxFiles={5}
                      className="mt-2"
                    />
                    {uploadedImages.length > 0 && (
                      <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
                        ✓ {uploadedImages.length} image(s) uploaded successfully
                      </div>
                    )}
                    {uploadedImages.length === 0 && (
                      <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                        ⚠ Please upload at least one image of your property
                      </div>
                    )}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="sellerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground flex items-center gap-2">
                            <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            Your Name
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g. Ali Raza" 
                              className="h-12 border-input focus:border-emerald-500 focus:ring-emerald-500"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="sellerPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground flex items-center gap-2">
                            <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g. +92 300 1234567" 
                              className="h-12 border-input focus:border-emerald-500 focus:ring-emerald-500"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground">Property Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className={`h-12 border-2 ${getStatusColor(field.value)}`}>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {statusOptions.map((status) => (
                              <SelectItem key={status} value={status} className={getStatusColor(status)}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

              </div>
            </Form>
          </CardContent>

          <CardFooter className="bg-muted/30 rounded-b-lg p-8">
            <Button 
              type="submit" 
              onClick={form.handleSubmit(onSubmit)}
              className="w-full h-14 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding Property...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Add Property Listing
                </div>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}