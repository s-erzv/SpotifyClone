'use client';

import { useEffect, useState } from "react";
import { TbPlaylist } from "react-icons/tb";
import { AiOutlinePlus } from "react-icons/ai";

import useAuthModal from "@/hooks/useAuthModal";
import useUploadModal from "@/hooks/useUploadModal";
import { useUser } from "@/hooks/useUser";
import { Song } from "@/types";
import MediaItem from "./MediaItem";
import useOnPlay from "@/hooks/useOnPlay";
import useSubscribeModal from "@/hooks/useSubscribeModal";

const Library = () => {
  const authModal = useAuthModal();
  const uploadModal = useUploadModal();
  const subscribeModal = useSubscribeModal();
  const { user, subscription } = useUser();
  const [songs, setSongs] = useState<Song[]>([]);
  const onPlay = useOnPlay(songs);


  const onClick = () => {
    if (!user) return authModal.onOpen();
    
    if(!subscription){
      return subscribeModal.onOpen();
    }
    
    return uploadModal.onOpen();
  };

    useEffect(() => {
    const fetchSongs = async () => {
        const res = await fetch('/api/user-songs');
        const data = await res.json();
        setSongs(data);
    };

    fetchSongs(); 
    }, [user, uploadModal.isOpen]);


  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-5 pt-4">
        <div className="inline-flex items-center gap-x-2">
          <TbPlaylist className="text-neutral-400" size={26} />
          <p className="text-neutral-400 font-medium text-md">Your Library</p>
        </div>
        <AiOutlinePlus
          onClick={onClick}
          size={20}
          className="text-neutral-400 cursor-pointer hover:text-white transition"
        />
      </div>
      <div className="flex flex-col gap-y-2 mt-4 px-3">
        {songs.map((item) => (
          <MediaItem key={item.id} onClick={(id: string) => onPlay(id)} data={item} />
        ))}
      </div>
    </div>
  );
};

export default Library;
