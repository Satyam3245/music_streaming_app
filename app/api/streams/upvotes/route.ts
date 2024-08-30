import prisma from "@/lib/db";
import { voteSchema } from "@/lib/zodvalidator";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    const session = await getServerSession();
    const user = await prisma.user.findFirst({
        where:{
            email:session?.user?.email ?? ""
        }
    })
    if(!user){
        return NextResponse.json({
            message:'Unauthenticated'
        },{
            status : 403
        })
    }
    try {
        const data = voteSchema.parse(await req.json());
        await prisma.upvote.create({
            data:{
                userId:user.id,
                streamid:data.streamId
            }
        })
    } catch (e) {
        return NextResponse.json({
            message:'Error is Occurred Durning User Creation'
        },{
            status : 403
        })
    }
}

export async function GET(req:NextRequest){
    const creatorId  = await req.nextUrl.searchParams.get("creatorId");
    const streams = await prisma.stream.findMany({
        where:{
            userId: creatorId ?? ""
        }
    })
    return NextResponse.json({
        streams
    })
}