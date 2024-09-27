import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function ErrorPage() {
  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
      <div className="max-w-md w-full px-6 py-8 bg-gray-800 rounded-lg shadow-xl">
        <div className="flex flex-col items-center text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mb-6" />
          <h1 className="text-3xl font-bold mb-2">Backend Error</h1>
          <p className="text-gray-400 mb-6">
            We're sorry, but an error occurred in our backend. Our team has been notified and is working on resolving the issue.
          </p>
          <Button onClick={handleRefresh} variant="secondary" className="w-full max-w-xs">
            Refresh Page
          </Button>
        </div>
      </div>
    </div>
  )
}