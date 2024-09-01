import prisma from "@/lib/db";
import { streamSchema } from "@/lib/zodvalidator";
//@ts-ignore
import youtubesearchapi from "youtube-search-api";
import { NextRequest, NextResponse } from "next/server";
const YT_REGEX = /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;
export async function POST(req:NextRequest){
    const body = await req.json();
    try {
        const data = streamSchema.safeParse(body);  
        const isYT = data.data?.url.match(YT_REGEX);
        if(!data.success){
            return NextResponse.json({
                message:'Check Your Credentials'
            },{
                status:411
            })
        }
        if(!isYT){
            return NextResponse.json({
                message:'Check Your Url'
            },{
                status:411
            })
        }
        const extractId = data.data?.url.split("?v=")[1];
        const res = await youtubesearchapi.GetVideoDetails(extractId);
        console.log(res.title);
        console.log(JSON.stringify(res.thumbnail.thumbnails));
        const thumbnail = res.thumbnail.thumbnails;
        const stream = await prisma.stream.create({
            data:{
                url:data.data?.url,
                userId : data.data?.creatorId,
                extractId : extractId,
                type : "Youtube",
                title : res.title
            }
        })
        return NextResponse.json({
            message:'Stream is Added',
            id :  stream.id
        })
    } catch (e) {
        return NextResponse.json({
            message:'Error while adding Streams'
        },{
            status:411
        })
    }
}