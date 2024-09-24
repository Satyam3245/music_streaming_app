"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {  useEffect } from "react";
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ThumbsUp, ThumbsDown, Trash2 } from "lucide-react";
import { Youtube } from "lucide-react";
import axios from 'axios';
import Image from "next/image";
import { Loader } from "../components/loader";
import { VideoPlayer } from "../components/videopalyer";
import { string } from "zod";
interface Video {
    id: string
    votes: number
    title: string
    smallImg : string
    bigImg : string
    extractId : string
}

export default function Dashboard() {
    const {data:session,status} = useSession();
    const router = useRouter();
    useEffect(()=>{
        if(status==='unauthenticated'){
            router.push('/');
        }
        async function getUserVideo(userId: string) {
          try {
            const res = await axios.get('http://localhost:3000/api/streams',{
              params:{
                userId : userId
              }
            })
            return res.data;
          } catch (error) {
            return error;
          }
        }
        //@ts-ignore
        // add a call redefine all function
    },[status,router]);
    if(status==='loading'){
        return <div>
            Loading ... 
        </div>
    }
    return <div>
        {session?.user?<Content/>:null}
    </div>;
}

const Content = ()=>{
    const session = useSession();
    const router = useRouter();
    const [videos, setVideos] = useState<Video[]>([])
    const [url, setInputUrl] = useState('');
    const [loader , setLoader] = useState<boolean>(false);
    const [error , setError] = useState<boolean>(false);
    const [videoId , setVideoId] = useState<null|string>(null);
    //@ts-ignore
    const creatorId = session.data?.user?.id;
    const addVideo = async (e: React.FormEvent) => {
      e.preventDefault();
      
      try {
        setLoader(true); // Start loader
        const user = await axios.post('http://localhost:3000/api/streams', {
          creatorId,
          url,
        });
        setInputUrl(''); 
        setVideos(user.data)
        console.log(user);
      } catch (error) {
        console.log(error)
        setError(true); 
      } finally {
        setLoader(false); 
      }
    };

    const deleteVideo = async (e: React.FormEvent)=>{
      e.preventDefault();
      try {
        setLoader(true);
        const user = await axios.delete('http://localhost:3000/api/streams',{
          data:{
            creatorId
          }
        });
        router.push('/');
      } catch (error) {
          setLoader(false);
          setError(true);
          console.log(error);
      }finally{
        setLoader(false);
      }
    }

    const delUniqueStream = async (id:string) => {
      try {
          const data  = await axios.delete('api/streams/delete',{
              data:{
                  userId : creatorId,
                  id : id
              }
          })
          console.log(data);
          return data;
      } catch (error) {
          return error;
      }
  }

  const vote = (id: string, amount: number) => {
    setVideos(videos.map(video => 
      video.id === id ? { ...video, votes: video.votes + amount } : video
    ).sort((a, b) => b.votes - a.votes))
  }

  const removeVideo = (id: string) => {
    setVideos(videos.filter(video => video.id !== id))
  }

  if(error){
    return <div>
      Error is Occurred..
    </div>
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-gray-100">Music Stream Dashboard</h1>
        <div className="flex gap-2 mb-4">
          <Input 
            type="text" 
            placeholder="Paste YouTube URL here" 
            value={url}
            onChange={(e) => setInputUrl(e.target.value)}
            className="bg-gray-800 text-gray-100 border-gray-700"
          />
          <Button onClick={addVideo} className="bg-purple-600 hover:bg-purple-700 text-white"> <Youtube/>Add to Queue</Button>
          <Button onClick={deleteVideo} className="bg-purple-600 hover:bg-purple-700 text-white">Delete Stream</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="col-span-1 md:col-span-2 bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-2 text-gray-100">Now Playing</h2>
              {videos.length > 0 && (
                <div className="space-y-2">
                  <div className="aspect-video">
                    <iframe 
                      src={`https://www.youtube.com/embed/${videos[0].extractId}`}
                      title={videos[0].title}
                      frameBorder={0}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      height={}
                      width={}
                    ></iframe>
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-200">{videos[0].title}</h3>
                    <span className="text-sm font-semibold text-gray-300">Votes: {videos[0].votes}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              {loader?<div className="flex items-center justify-center"><Loader/></div>:<div>
                <h2 className="text-xl font-semibold mb-2 text-gray-100">Playlist</h2>
                <ul className="space-y-2">
                  {videos.map((video, index) => (
                    <button key={video.id} className="flex items-center justify-between bg-gray-700 p-2 rounded-xl hover:bg-gray-600" onClick={()=>{}}>
                      <div className="flex items-center space-x-2">
                        <Image
                          src={`${video.smallImg}`}
                          alt={`Thumbnail for ${video.title}`}
                          className="rounded"
                          width={138}
                          height={246}
                        />
                        <div>
                          <span className="font-medium text-gray-200 block">{video.title}</span>
                          <span className="text-sm text-gray-400">Votes: {video.votes}</span>
                          
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="outline" onClick={()=>{}}
                                className="bg-gray-600 hover:bg-blue-500 border-gray-500">
                          <ThumbsUp className="h-4 w-4 text-gray-200" />
                        </Button>
                        <Button size="icon" variant="outline" onClick={() =>{}}
                                className="bg-gray-600 hover:bg-blue-500 border-gray-500">
                          <ThumbsDown className="h-4 w-4 text-gray-200" />
                        </Button>
                        <Button size="icon" variant="outline" onClick={() =>{delUniqueStream(video.id)}}
                                className="bg-red-500 hover:bg-gray-500 border-gray-500">
                          <Trash2 className="h-4 w-4 text-white" />
                        </Button>
                      </div>
                    </button>
                  ))}
                </ul>
              </div>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
