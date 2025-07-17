import { Musicnote, Profile2User } from "iconsax-react";

const HeaderStates = () => {
    return (
        <div className="flex items-center w-full gap-6 mb-8">
            <div className="bg-white w-full rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#7367F01F] rounded-full flex items-center justify-center">
                        <Profile2User variant="Bold" size={24} className=" " color="#7367F0" />
                    </div>
                    <div>
                        <p className="text-[24px] font-PeydaExtraBold text-black">178+</p>
                        <p className="text-sm text-[#030229]">کاربر فعال پلیر</p>
                    </div>
                </div>
            </div>

            <div className="bg-white w-full rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#80F0671F] rounded-full flex items-center justify-center">
                        <Musicnote variant="Bold" size={24} className=" " color="#4FE12F" />
                    </div>
                    <div>
                        <p className="text-[24px] font-PeydaExtraBold text-black">178+</p>
                        <p className="text-sm text-[#030229]">کل مدیاهای آپلودشده</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeaderStates;