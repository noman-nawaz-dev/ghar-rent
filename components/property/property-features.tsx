import { Bed, Bath, Home, Ruler, Building, Tag } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface PropertyFeaturesProps {
  bedrooms: number;
  bathrooms: number;
  area: number;
  areaUnit: string;
  propertyType: string;
}

export default function PropertyFeatures({ 
  bedrooms, 
  bathrooms, 
  area, 
  areaUnit,
  propertyType
}: PropertyFeaturesProps) {
  const features = [
    {
      icon: <Bed className="h-5 w-5 text-emerald-600" />,
      label: "Bedrooms",
      value: bedrooms.toString()
    },
    {
      icon: <Bath className="h-5 w-5 text-emerald-600" />,
      label: "Bathrooms",
      value: bathrooms.toString()
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

  return (
    <div>
      <h2 className="font-poppins text-xl font-semibold mb-4">Features</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6">
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