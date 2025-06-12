export type MusicType = {
 id: number;
 genre_id: number;
 title: string;
 artist: string;
 cover: string;
 music: string;
 duration: number;
 is_ads: boolean;
 guest_like: number;
 playlists: [
  {
   id: number;
   name: string;
   pivot: {
    music_id: number;
    playlist_id: number;
   };
  }
 ];
 genre: {
  id: number;
  name: string;
 };
};

export type MediaArchiveType = MusicType[];
