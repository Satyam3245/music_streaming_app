"use client"
import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Music } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
export const AppBar = () => {
    const session = useSession();
    const router = useRouter();
    return <header className="px-4 lg:px-6 h-14 flex items-center bg-black text-white">
        <Link className="flex items-center justify-center" href="/">
            <Music className="h-6 w-6 text-purple-400" />
            <span className="ml-2 text-lg font-bold">Music Stream</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
                Features
            </Link>
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
                {session.data?.user && <Button onClick={()=>{signOut()}}>Logout</Button>}
                {!session.data?.user && <Button onClick={()=>{signIn()}}>Signin</Button>}
            </Link>
        </nav>
    </header>
}
