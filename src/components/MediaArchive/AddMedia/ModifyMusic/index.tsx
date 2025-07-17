import Item from "./Item";

export interface EditableAudioType {
    artist: string;
    title: string;
    duration: number;
    cover: string | null;
    id: string;
}

type EditMusicsProps = {
    editableAudios: (EditableAudioType & { musicId: number | undefined })[];
};

const EditMusics = ({ editableAudios }: EditMusicsProps) => {
    return (
        <div className="flex flex-col py-11  gap-6 w-full">
            {editableAudios.length > 0 ? editableAudios.map((music) => {
                return <Item key={music.id} music={music} musicId={music.musicId} />;
            }) : <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">موزیکی برای ویرایش وجود ندارد</p>
            </div>}
        </div>
    );
};

export default EditMusics;
