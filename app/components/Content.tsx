"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Music, Headphones, Radio } from "lucide-react"
import { Footer } from "./footer"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
export const LandingContent = ()=>{
    const session = useSession();
    const router = useRouter();
    return <div>
        <main className="flex flex-col justify-center items-center bg-black text-white">
        <section className=" py-12 md:py-24 lg:py-32 xl:py-48 ">
          <div className="container px-4 md:px-6 w-full">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Your Music, Your Way
                </h1>
                <p className="mx-auto max-w-[600px] text-gray-400 md:text-xl">
                  Stream millions of songs and podcasts on the go.
                </p>
              </div>
              <div className="space-x-4">
                <Button className="bg-purple-600 text-white hover:bg-purple-700" onClick={()=>{
                    {session.data?.user ? router.push('/dashboard') :signIn()}
                }}>Get Started</Button>
              </div>
            </div>
          </div>
        </section>
        <section className=" py-12 md:py-24 lg:py-32 bg-gray-900 w-full flex justify-center">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <Headphones className="h-12 w-12 text-purple-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">High-Quality Audio</h3>
                <p className="text-gray-400">Crystal-clear sound in HD</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Radio className="h-12 w-12 text-purple-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">Personalized Playlists</h3>
                <p className="text-gray-400">Tailored to your taste</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Music className="h-12 w-12 text-purple-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">Offline Listening</h3>
                <p className="text-gray-400">Download and enjoy anywhere</p>
              </div>
            </div>
          </div>
        </section>
        <section className=" py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Ready to Start Listening?
                </h2>
              </div>
              <div className="max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input
                    className="max-w-lg flex-1 bg-gray-800 text-white border-gray-700"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Button className="bg-purple-600 text-white hover:bg-purple-700">
                    Join Now
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer/>
    </div>
}