import { Heart } from "iconsax-react";

const EmployeeList = () => {
    const employees = [
        { name: 'Bi Ehsas (شادمهر عقیلی)', like: '۹۲۳۴۹' },
        { name: 'Bi Ehsas (شادمهر عقیلی)', like: '۹۲۳۴۹' },
        { name: 'Bi Ehsas (شادمهر عقیلی)', like: '۹۲۳۴۹' },
        { name: 'Bi Ehsas (شادمهر عقیلی)', like: '۹۲۳۴۹' },
        { name: 'Bi Ehsas (شادمهر عقیلی)', like: '۹۲۳۴۹' },

    ];
    return (
        <div className="bg-white rounded-lg w-full shadow-sm md:h-[354px]">
            <div className="p-6 ">
                <h2 className="text-lg font-PeydaBold text-black">۵ موزیک برتر از دید کاربران</h2>
            </div>
            <div className="p-6">
                <div className="space-y-7">
                    {employees.map((employee, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm font-medium text-[#030229]">{employee.name}</p>
                            </div>
                            <div className="flex-1">
                                <div className="w-full bg-transparent rounded-full h-3">
                                    <div
                                        className="bg-[#7367F0] h-2 rounded-l-full"
                                        style={{ width: `${Math.random() * 60 + 40}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <p className="text-sm font-medium text-[#030229]">{employee.like}</p>
                                <Heart color="#F04248" variant="Bold" size={24} className="w-5 h-5 " />
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default EmployeeList