import { Building, DollarSign, Shield, Sparkles, Users, Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: <Building className="h-12 w-12 text-emerald-600" />,
    title: "Extensive Property Listings",
    description: "Browse through thousands of verified rental properties across Pakistan's major cities."
  },
  {
    icon: <Sparkles className="h-12 w-12 text-emerald-600" />,
    title: "AI Price Suggestions",
    description: "Get intelligent rental price recommendations based on property features and location data."
  },
  {
    icon: <Users className="h-12 w-12 text-emerald-600" />,
    title: "Direct Communication",
    description: "Connect directly with property owners or potential tenants without middlemen."
  },
  {
    icon: <DollarSign className="h-12 w-12 text-emerald-600" />,
    title: "Transparent Transactions",
    description: "Clear rental terms and pricing with no hidden fees or charges."
  },
  {
    icon: <Shield className="h-12 w-12 text-emerald-600" />,
    title: "Verified Listings",
    description: "All properties are verified to ensure authentic and accurate information."
  },
  {
    icon: <Lock className="h-12 w-12 text-emerald-600" />,
    title: "Secure Process",
    description: "End-to-end secure rental process from viewing to agreement finalization."
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-poppins text-3xl md:text-4xl font-bold mb-4">
            Why Choose <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-blue-600">GharRent</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our platform offers a comprehensive suite of features designed to make the rental process seamless and efficient for both property owners and tenants.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border border-border bg-card transition-all duration-300 hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-900">
              <CardHeader className="pb-2">
                <div className="mb-4">{feature.icon}</div>
                <CardTitle className="font-poppins">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}