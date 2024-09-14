"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ThumbsUp, ThumbsDown, Trash2 } from "lucide-react"
import Image from "next/image";
interface Video {
    id: string
    url: string
    votes: number
    title: string
}

export default function Dashboard() {
    const {data:session,status} = useSession();
    const router = useRouter();
    useEffect(()=>{
        if(status==='unauthenticated'){
            router.push('/');
        }
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
    const [videos, setVideos] = useState<Video[]>([])
    const [inputUrl, setInputUrl] = useState('')

  const addVideo = () => {
    if (inputUrl.trim() !== '') {
      const videoId = inputUrl.split('v=')[1]
      const newVideo = {
        id: videoId,
        url: inputUrl,
        votes: 0,
        title: `Video ${videoId.substring(0, 6)}...` // Mock title, replace with actual API call in production
      }
      setVideos([...videos, newVideo])
      setInputUrl('')
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

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-gray-100">Music Stream Dashboard</h1>
        <div className="flex gap-2 mb-4">
          <Input 
            type="text" 
            placeholder="Paste YouTube URL here" 
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="bg-gray-800 text-gray-100 border-gray-700"
          />
          <Button onClick={addVideo} className="bg-purple-600 hover:bg-purple-700 text-white">Add to Queue</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="col-span-1 md:col-span-2 bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-2 text-gray-100">Now Playing</h2>
              {videos.length > 0 && (
                <div className="space-y-2">
                  <div className="aspect-video">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src={`https://www.youtube.com/embed/${videos[0].id}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
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
              <h2 className="text-xl font-semibold mb-2 text-gray-100">Queue</h2>
              <ul className="space-y-2">
                {videos.map((video, index) => (
                  <li key={video.id} className="flex items-center justify-between bg-gray-700 p-2 rounded">
                    <div className="flex items-center space-x-2">
                      <Image
                        src={`https://img.youtube.com/vi/${video.id}/default.jpg`}
                        alt={`Thumbnail for ${video.title}`}
                        width={90}
                        height={68}
                        className="rounded"
                      />
                      <div>
                        <span className="font-medium text-gray-200 block">{video.title}</span>
                        <span className="text-sm text-gray-400">Votes: {video.votes}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="icon" variant="outline" onClick={() => vote(video.id, 1)}
                              className="bg-gray-600 hover:bg-gray-500 border-gray-500">
                        <ThumbsUp className="h-4 w-4 text-gray-200" />
                      </Button>
                      <Button size="icon" variant="outline" onClick={() => vote(video.id, -1)}
                              className="bg-gray-600 hover:bg-gray-500 border-gray-500">
                        <ThumbsDown className="h-4 w-4 text-gray-200" />
                      </Button>
                      <Button size="icon" variant="outline" onClick={() => removeVideo(video.id)}
                              className="bg-gray-600 hover:bg-gray-500 border-gray-500">
                        <Trash2 className="h-4 w-4 text-gray-200" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
