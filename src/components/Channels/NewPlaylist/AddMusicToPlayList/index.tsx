import AddMediaIcon from "@/components/MediaArchive/AddMedia/Add/AddMediaIcon"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { DialogTitle, DialogTrigger } from "@radix-ui/react-dialog"
import { Add } from "iconsax-react"
import { useRef } from "react"
import MediaContent from "./MediaContent"

const AddMusicToPlayList = ({ playlistName, playlistId }: { playlistName: string, playlistId: number }) => {
    const dialogRef = useRef<HTMLButtonElement>(null)





    return (
        <>
            <Dialog>
                <DialogTrigger ref={dialogRef}></DialogTrigger>
                <DialogContent className="sm:max-w-[425px] px-8 py-6 max-h-[80vh] overflow-y-auto">
                    <DialogHeader className=" flex justify-start w-full text-right border-b! border-[#EDEDED] pb-4">
                        <DialogTitle>افزودن موزیک به پلی‌لیست {playlistName}</DialogTitle>
                    </DialogHeader>
                    <MediaContent ref={dialogRef} playlistId={playlistId} />
                </DialogContent>
            </Dialog>

            <div className={cn("flex w-full pt-18 h-full items-center justify-center")}>
                <div className={cn("border-dashed w-full border flex pt-11 flex-col gap-5 items-center justify-center rounded-xl border-[#8261E6] bg-[#DFDCF11F] min-h-[290px] ")}>
                    <AddMediaIcon />
                    <div className="px-16 flex items-center justify-center flex-col space-y-4">

                        <Button
                            className="bg-primary-main cursor-pointer flex items-center"
                            onClick={() => dialogRef.current?.click()}
                        >
                            <span className="bg-white w-4 h-4 flex items-center justify-center rounded-sm ">
                                <Add color="#7367F0" />
                            </span>
                            <span>انتخاب موزیک</span>
                        </Button>
                    </div>

                </div>
            </div>
        </>

    )
}

export default AddMusicToPlayList