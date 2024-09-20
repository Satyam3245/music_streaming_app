"use client";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
export const LearnMore = () => {
    const router = useRouter();
    return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Learn More About Music Stream</h1>
        
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-purple-400">About Music Stream</CardTitle>
            <CardDescription className="text-gray-400">
              Your personal YouTube-powered music streaming experience
            </CardDescription>
          </CardHeader>
          <CardContent className="text-gray-300">
            <p>
              Music Stream is a revolutionary music streaming app that harnesses the vast library of YouTube to create 
              your perfect playlist. With Music Stream, you can easily input YouTube links and instantly create custom 
              playlists tailored to your taste. Whether you're into chart-toppers, indie gems, or classic hits, 
              Music Stream brings it all together in one seamless experience.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-purple-400">Key Features</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300">
            <ul className="list-disc pl-5 space-y-2">
              <li>Create playlists from YouTube links</li>
              <li>Seamless playback experience</li>
              <li>Easy-to-use interface</li>
              <li>Sync across devices</li>
              <li>Discover new music based on your preferences</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-purple-400">How It Works</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p>
              Getting started with Music Stream is easy:
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Sign up using your Google or GitHub account</li>
              <li>Paste YouTube links into the playlist creator</li>
              <li>Enjoy your custom playlist!</li>
            </ol>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl text-purple-400">Sign Up Now</CardTitle>
            <CardDescription className="text-gray-400">
              Join Music Stream today and start creating your perfect playlists
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full bg-red-600 hover:bg-red-700" onClick={()=>{
                router.push('/api/auth/signin');
            }}>
              Sign up
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}