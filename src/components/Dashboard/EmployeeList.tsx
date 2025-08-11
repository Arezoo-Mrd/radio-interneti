import { DashboardInfo } from "@/app/(protected)/dashboard/api";
import { Heart } from "iconsax-react";

const EmployeeList = ({ dashboardInfo }: { dashboardInfo: DashboardInfo | undefined }) => {
    const totalLikes = dashboardInfo?.most_liked_musics.reduce((acc, curr) => acc + curr.likes, 0) || 0;


    return (
        <div className="bg-white rounded-lg w-full shadow-sm overflow-y-auto md:h-[354px]">
            <div className="p-6 ">
                <h2 className="text-lg font-PeydaBold text-black">۵ موزیک برتر از دید کاربران</h2>
            </div>
            <div className="p-6">
                <div className="space-y-7">
                    {dashboardInfo && dashboardInfo?.most_liked_musics.length > 0 ? dashboardInfo?.most_liked_musics.map((music, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm font-medium w-[136px] text-[#030229]">{music.title}</p>
                            </div>
                            <div className="flex-1">
                                <div className="w-full bg-transparent rounded-full h-3">
                                    <div
                                        className="bg-[#7367F0] h-2 rounded-l-full"
                                        style={{ width: `${(music.likes / totalLikes) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <p className="text-sm font-medium text-[#030229]">{music.likes}</p>
                                <Heart color="#F04248" variant="Bold" size={24} className="w-5 h-5 " />
                            </div>

                        </div>
                    )) : <div className="flex items-center justify-center h-full">
                        <p className="text-sm font-medium text-[#030229]">هیچ موزیک موجود نیست</p>
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default EmployeeList