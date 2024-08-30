"use client"
import { signIn, signOut, useSession } from "next-auth/react"
export const AppBar = () => {
    const session = useSession();
    return <div className="flex justify-between">
        <div>Muzzle</div>
        {
            session.data?.user ? <button onClick={()=>{signOut()}} className="border bg-blue-500 p-2 rounded-lg">Logout</button> : <button onClick={()=>{signIn()}} className="border bg-blue-500 p-2 rounded-lg">Signin</button>
        }
    </div>
}
