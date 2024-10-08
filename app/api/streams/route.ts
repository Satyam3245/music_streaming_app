import prisma from "@/lib/db";
import { deleteSchema, streamSchema } from "@/lib/zodvalidator";
export {YT_REGEX} from "@/lib/utils";
//@ts-ignore
import youtubesearchapi from "youtube-search-api";
import { NextRequest, NextResponse } from "next/server";
import { YT_REGEX } from "@/lib/utils";
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
        const thumbnail = res.thumbnail.thumbnails;
        const stream = await prisma.stream.create({
            data:{
                url:data.data?.url,
                userId : data.data?.creatorId,
                extractId : extractId,
                type : "Youtube",
                title : res.title,
                smallImg: res.thumbnail.thumbnails[2].url,
                bigImg : res.thumbnail.thumbnails[3].url
            },
            select:{
                title: true,
                smallImg:true,
                bigImg : true,
                url : true,
                id : true
            }
        });
        if(!stream){
            return NextResponse.json({
                message:'Error while adding Streams'
            },{
                status:500
            })
        }
        const songs = await prisma.stream.findMany({
            where:{
                userId : data.data?.creatorId
            },
            select:{
                id : true,
                title : true,
                smallImg : true,
                bigImg : true,
                extractId : true
            }
        });
        return NextResponse.json(songs)     
        
    } catch (e) {
        return NextResponse.json({
            message:'Error while adding Streams'
        },{
            status:500
        })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const body = await req.json();
        const bodyParser = deleteSchema.safeParse(body);

        if (!bodyParser.success) {
            return NextResponse.json({
                message: 'Check Your Credentials'
            }, {
                status: 411
            });
        }

        const res = await prisma.stream.deleteMany({
            where: {
                userId: bodyParser.data.creatorId 
            }
        });

        if (!res) {
            return NextResponse.json({
                message: 'Error while deleting Streams'
            }, {
                status: 500
            });
        }

        return NextResponse.json({
            message: 'Stream Deleted'
        }, {
            status: 200
        });

    } catch (error) {
        console.error('Stream deletion error:', error); 
        return NextResponse.json({
            message: 'Error while deleting Streams'
        }, {
            status: 500
        });
    }
}

export async function GET(req: NextRequest) {
    const {searchParams} = new URL(req.url); 
    const id = searchParams.get('userId')?.trim();
    console.log(id)
    if(!id){
        return NextResponse.json({
            message:'Missing userId Parameter'
        },{
            status:400
        })
    }
    try {
        const stream = await prisma.stream.findMany({
            where: {
                userId: id
            }
        });
        console.log();

        if(stream.length===0){
            return NextResponse.json({
                msg :'No Streams Found'
            },{
                status:404
            })
        }

        return NextResponse.json(stream,{status:200});
    }
    catch (e){
        return NextResponse.json({
            message:'Error while fetching Streams'
        },{
            status:500
        })  
    }

}