import prisma from "@/lib/db";
import { uniqueDelSchema } from "@/lib/zodvalidator";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req:NextRequest){
    const body = await req.json();
    const bodyParser = uniqueDelSchema.safeParse(body);
    if(!bodyParser.success){
        return NextResponse.json({
            error : 'Invalid data format . Please send valid data'
        },{
            status : 400
        })
    }
    try {

        const delData = await prisma.stream.delete({
            where:{
                userId : bodyParser.data.userId,
                id : bodyParser.data.id
            }
        });
        console.log(delData);
        return NextResponse.json({
            message : 'Stream Deleted'
        },{
            status : 200
        });

    } catch (error:any) {

        console.log(error);

        if(error.code === 'P2025'){
            return NextResponse.json({
                msg : 'Stream not found'
            },{
                status : 404
            })
        }

        return NextResponse.json({
            error : error
        },{
            status : 500
        })

    }
}