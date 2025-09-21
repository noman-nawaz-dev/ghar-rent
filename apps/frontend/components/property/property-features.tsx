import { Bed, Home, Ruler, Building, ChefHat, Trees } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface PropertyFeaturesProps {
  bedrooms: number;
  floors: number;
  kitchens: number;
  area: number;
  areaUnit: 'Marla' | 'Kanal';
  propertyType: string;
  hasLawn: boolean;
}

export default function PropertyFeatures({ 
  bedrooms, 
  floors,
  kitchens,
  area, 
  areaUnit,
  propertyType,
  hasLawn
}: PropertyFeaturesProps) {
  const features = [
    {
      icon: <Bed className="h-5 w-5 text-emerald-600" />,
      label: "Bedrooms",
      value: bedrooms.toString()
    },
    {
      icon: <Home className="h-5 w-5 text-emerald-600" />,
      label: "Floors",
      value: floors.toString()
    },
    {
      icon: <ChefHat className="h-5 w-5 text-emerald-600" />,
      label: "Kitchens",
      value: kitchens.toString()
    },
    {
      icon: <Ruler className="h-5 w-5 text-emerald-600" />,
      label: "Area",
      value: `${area} ${areaUnit}`
    },
    {
      icon: <Building className="h-5 w-5 text-emerald-600" />,
      label: "Property Type",
      value: propertyType
    }
  ]

  // Add lawn feature if property has a lawn
  if (hasLawn) {
    features.push({
      icon: <Trees className="h-5 w-5 text-emerald-600" />,
      label: "Garden/Lawn",
      value: "Available"
    })
  }

  return (
    <div>
      <h2 className="font-poppins text-xl font-semibold mb-4">Features</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div className="mb-2">
              {feature.icon}
            </div>
            <p className="text-lg font-medium">{feature.value}</p>
            <p className="text-sm text-muted-foreground">{feature.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}