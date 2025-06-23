import Item from "./Item";

const mockData = [
 {
  artist: "شادمهر عقیلی",
  title: "bi ehsas",
  duration: "1000",
  genre_id: 1,
  play_list_id: 1,
  is_ads: 0,
  id: 1,
 },
];

const EditMusics = () => {
 return (
  <div className="flex flex-col py-11  gap-6 w-full">
   {mockData.map((music) => {
    return <Item key={music.id} music={music} />;
   })}
  </div>
 );
};

export default EditMusics;
