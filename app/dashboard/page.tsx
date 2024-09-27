"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {  useEffect } from "react";
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ThumbsUp, ThumbsDown, Trash2, Fullscreen } from "lucide-react";
import { Youtube } from "lucide-react";
import axios from 'axios';
import Image from "next/image";
import { Loader } from "../components/loader";
import { PlayIcon, PauseIcon, SkipBackIcon, SkipForwardIcon } from "lucide-react"
import ErrorPage from "../components/error";
import { getVideoByID } from "@/lib/videoService";
interface Video {
    id: string
    votes: number
    title: string
    smallImg : string
    bigImg : string
    extractId : string
}

// Set the title and decription with the help of the useState Hook because you set the extractId in the getVideoByID function

export default function Dashboard() {
    const {data:session,status} = useSession();
    const router = useRouter();
    const [videos, setVideos] = useState<Video[]>([])
    const [url, setInputUrl] = useState('');
    const [loader , setLoader] = useState<boolean>(false);
    const [error , setError] = useState<boolean>(false);
    const [videoId , setVideoId] = useState<null|string>(null);
    const [title , setTitle] = useState<string>('');
    const [votes,setVotes] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState(false);
    //@ts-ignore
    const creatorId = session?.user.id;


    useEffect(()=>{
      if(status==='unauthenticated'){
          router.push('/');
      }
      setLoader(true);
      getVideoByID(creatorId).then((data)=>{
        setVideos(data);
        setVideoId(data[0].extractId);
        setTitle(data[0].title);
        setVotes(data[0].votes);
        setLoader(false);
      }) 

    },[status,router]);

    const togglePlayPause = () => {
      setIsPlaying(!isPlaying)
    }
    
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
        setVideoId(user.data[0].extractId);
        setTitle(user.data[0].title);
        setVotes(user.data[0].votes);
        console.log(user);
      } catch (error) {
        console.log(error)
        setError(true); 
      } finally {
        setLoader(false); 
      }
    };

    const deleteStream = async (e: React.FormEvent)=>{
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
        setLoader(true);
          await axios.delete('api/streams/delete',{
              data:{
                  userId : creatorId,
                  id : id
              }
          })
          const videos = await getVideoByID(creatorId);
          setVideos(videos);
          setLoader(false);
      } catch (error) {
          setError(true);
      }
    }

    if(error){
      return <div>
        <ErrorPage/>
      </div>
    }

    if(status==='loading'){
        return <div className="bg-gray-900 flex justify-center items-center">
            <Loader/>
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
          <Button onClick={deleteStream} className="bg-purple-600 hover:bg-purple-700 text-white">Delete Stream</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="col-span-1 md:col-span-2 bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-2 text-gray-100">Now Playing</h2>
              {videos.length > 0 && (
                <div className="space-y-2">
                  <div className="aspect-video">
                    <iframe 
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title={title}
                      frameBorder={0}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      height={'100%'}
                      width={'100%'}
                      className="rounded-xl"
                    ></iframe>
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-200">{title}</h3>
                    <span className="text-sm font-semibold text-gray-300">Votes: {votes}</span>
                  </div>
                  <div className="flex items-center space-x-4 justify-center bg-gray-900 p-6 rounded-lg">
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-gray-800 hover:bg-gray-700 text-gray-300"
                    >
                      <SkipBackIcon className="h-4 w-4" />
                      <span className="sr-only">Previous</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-gray-800 hover:bg-gray-700 text-gray-300"
                      onClick={togglePlayPause}
                    >
                      {isPlaying ? (
                        <PauseIcon className="h-4 w-4" />
                      ) : (
                        <PlayIcon className="h-4 w-4" />
                      )}
                      <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-gray-800 hover:bg-gray-700 text-gray-300"
                    >
                      <SkipForwardIcon className="h-4 w-4" />
                      <span className="sr-only">Next</span>
                    </Button>
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
                    <button key={video.id} className="flex items-center justify-between bg-gray-700 p-2 rounded-xl hover:bg-gray-600" onClick={()=>{
                      setVideoId(video.extractId);
                      setTitle(video.title);
                      setVotes(video.votes);
                      }}>
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

