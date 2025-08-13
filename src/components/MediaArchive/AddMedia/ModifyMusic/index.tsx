import { FilterOptionsType } from "@/app/(protected)/media-archive/api/api.types";
import Item from "./Item";
import { useAtom } from "jotai";
import { ADD_MEDIA_STATE } from "@/states/add-media";
import { toast } from "sonner";
import { ModifyMusicSchemaType } from "@/schema/media.schema";
import { useUpdateMusicMutation } from "@/app/(protected)/media-archive/add-media/api";
import { useError } from "@/hooks/use-error";
import { useEffect } from "react";

export interface EditableAudioType {
    artist: string;
    title: string;
    duration: number;
    cover: string | null;
    id: string;
    genreId?: number | undefined;
    is_ads: boolean;
}

type EditMusicsProps = {
    filterOptions: FilterOptionsType | undefined;

};

const EditMusics = ({ filterOptions }: EditMusicsProps) => {
    const [addMediaState, setAddMediaState] = useAtom(ADD_MEDIA_STATE);

    const { mutate, isPending } = useUpdateMusicMutation()
    const { errorHandler } = useError()

    const onSubmitHandler = (musicId: number, data: ModifyMusicSchemaType) => {
        if (!musicId) return;
        mutate({
            ...data,
            musicId: musicId,
        }, {
            onSuccess: () => {
                toast.success("موزیک با موفقیت ویرایش شد")
                const filteredAudios = addMediaState.editableAudios.filter((music) => music.musicId !== musicId)
                setAddMediaState((prev) => {
                    return {
                        ...prev,
                        editableAudios: filteredAudios
                    }
                })


            },
            onError: (error) => {
                errorHandler(error)
            }
        })
    };

    useEffect(() => {
        if (addMediaState.editableAudios.length === 0) {
            window.location.reload()
        }
    }, [addMediaState])


    return (
        <div className="flex flex-col py-11  gap-6 w-full">
            {addMediaState.editableAudios.length > 0 ? addMediaState.editableAudios.map((music) => {
                return <Item isPending={isPending} onSubmitHandler={onSubmitHandler} key={music.id} music={music} musicId={music.musicId} filterOptions={filterOptions} genreId={music.genreId} />;
            }) : <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">موزیکی برای ویرایش وجود ندارد</p>
            </div>}
        </div>
    );
};

export default EditMusics;
