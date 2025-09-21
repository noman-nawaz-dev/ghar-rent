import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

interface PageNotFoundProps {
  message?: string;
}

export default function PageNotFound({ message = "Page not found" }: PageNotFoundProps) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4">
      <h1 className="font-poppins text-6xl font-bold text-muted-foreground">404</h1>
      <div className="bg-gradient-to-r from-emerald-600 to-blue-600 h-1 w-20 my-6"></div>
      <h2 className="text-2xl font-semibold mb-4">{message}</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        Sorry, we couldn't find what you're looking for. Please check the URL or go back to the homepage.
      </p>
      <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
        <Link href="/">
          <Home className="mr-2 h-4 w-4" /> Return to Home
        </Link>
      </Button>
    </div>
  )
}