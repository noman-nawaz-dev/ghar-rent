import { Search, FileCheck, Home, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: <Search className="h-10 w-10 text-white" />,
    title: "Search Properties",
    description: "Browse through our extensive list of verified rental properties across Pakistan."
  },
  {
    icon: <FileCheck className="h-10 w-10 text-white" />,
    title: "Request Rental",
    description: "Submit your rental proposal including price and duration to property owners."
  },
  {
    icon: <CheckCircle className="h-10 w-10 text-white" />,
    title: "Get Approval",
    description: "Property owners review your request and approve the rental terms."
  },
  {
    icon: <Home className="h-10 w-10 text-white" />,
    title: "Move In",
    description: "Once approved, finalize the agreement and move into your new rental home."
  }
];

export default function HowItWorksSection() {
  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-poppins text-3xl md:text-4xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            GharRent simplifies the rental process with just a few easy steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="bg-gradient-to-r from-emerald-600 to-blue-600 w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-lg transform transition-transform hover:scale-105">
                {step.icon}
              </div>
              <div className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-[-30px] left-[70px] w-[calc(100%+30px)] h-[2px] bg-gradient-to-r from-emerald-600 to-blue-600"></div>
                )}
              </div>
              <h3 className="font-poppins text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}