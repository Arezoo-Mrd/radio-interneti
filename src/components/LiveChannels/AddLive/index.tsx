"use client"
import { useStoreLiveMutation } from "@/app/(protected)/live-channels/add-live/api";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { PersianDatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import TimePicker from "@/components/ui/time-picker";
import { createLiveSchema, CreateLiveSchemaType } from "@/schema/live.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import Header from "./Header";
import { MultiInput } from "@/components/ui/multi-input";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


const AddLive = () => {
    const { mutate: storeLive, isPending } = useStoreLiveMutation();
    const [presenter, setPresenter] = useState<string[]>([]);
    const router = useRouter()

    const { register, formState: { errors }, setValue, watch } = useForm<CreateLiveSchemaType>({
        resolver: zodResolver(createLiveSchema),
        defaultValues: {
            presenter: [],
            name: "",
            start_date: new Date(),
            end_date: new Date(),
            start_time: "",
            end_time: "",
            description: ""
        }
    });


    const name = watch("name")
    const startDate = watch("start_date");
    const endDate = watch("end_date");
    const startTime = watch("start_time");
    const endTime = watch("end_time");



    const appendPresenter = (value: string[]) => {
        setPresenter(value)
    }

    const isValidate = presenter.length > 0 && name && startDate && startTime && endDate && endTime

    const saveChanges = () => {
        if (isValidate) {
            const validPresenter = presenter.map((item) => {
                return {
                    name: item,
                }
            })

            storeLive({
                name: name,
                presenter: validPresenter,
                start_date: startDate,
                end_date: endDate,
                start_time: startTime,
                end_time: endTime,
                activate: true,
            }, {
                onSuccess: () => {
                    toast.success("لایو با موفقیت ثبت شد")
                    router.push("/live-channels")
                },
                onError: (error) => {
                    if (error instanceof Error) {
                        toast.error(error.message)
                    } else {
                        toast.error("خطا در ثبت لایو")
                    }
                }
            })
        }
        else {
            toast.error("لطفا همه فیلدها را پر کنید")
        }
    }



    return (
        <div className="w-full h-fit px-6 py-11">
            <Header
                disabled={isPending || !isValidate}
                saveChanges={saveChanges}
            />
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger className="text-[#303030] text-[15px] font-PeydaMedium">اطلاعات لایو</AccordionTrigger>
                    <AccordionContent>
                        <form className="space-y-6">
                            <div className="flex items-center gap-4 w-full">
                                <div className="space-y-2 w-full">
                                    <label htmlFor="title" className="text-right block text-[14px] f" dir="rtl">
                                        موضوع لایو
                                    </label>
                                    <Input
                                        id="title"
                                        {...register("name")}
                                        placeholder="موضوع لایو موردنظر خود را وارد کنید."
                                        className="text-right"
                                        dir="rtl"
                                        error={errors.name?.message}
                                    />
                                </div>
                                <div className="space-y-2 w-full">
                                    <label htmlFor="title" className="text-right block text-[14px] f" dir="rtl">
                                        افراد حاضر در لایو
                                    </label>
                                    <MultiInput
                                        value={presenter}
                                        onChange={(value: string[]) => appendPresenter(value)}
                                        placeholder="افراد حاضر در لایو را وارد کنید."
                                        className="text-right"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div className="space-y-2">
                                    <label className="text-right block" dir="rtl">
                                        زمان شروع
                                    </label>
                                    <div className="flex gap-2">
                                        <PersianDatePicker
                                            value={startDate}
                                            setValue={(value) => setValue("start_date", value)}
                                            placeholder="تاریخ موردنظر خود را انتخاب کنید."

                                        />
                                        <TimePicker
                                            value={startTime || ""}
                                            onChange={(value: any) => setValue("start_time", value)}
                                            placeholder="زمان موردنظر خود را انتخاب کنید."

                                        />
                                    </div>

                                </div>
                                <div className="space-y-2">
                                    <label className="text-right block" dir="rtl">
                                        زمان پایان
                                    </label>
                                    <div className="flex gap-2">
                                        <PersianDatePicker
                                            value={endDate}
                                            setValue={(value) => setValue("end_date", value)}
                                            placeholder="تاریخ موردنظر خود را انتخاب کنید."
                                        />
                                        <TimePicker
                                            value={endTime}
                                            onChange={(value) => setValue("end_time", value)}
                                            placeholder="زمان موردنظر خود را انتخاب کنید."
                                            error={errors.end_time?.message}

                                        />
                                    </div>
                                </div>
                            </div>


                        </form>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

        </div>
    )
}

export default AddLive