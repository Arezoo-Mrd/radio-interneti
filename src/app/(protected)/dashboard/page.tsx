import Dashboard from "@/components/Dashboard";
import { getDashboardInfo, getLogs } from "@/app/(protected)/dashboard/api";
import { cookies } from "next/headers";

export default async function Home() {
    const token = (await cookies()).get("token")?.value;
    const dashboardInfo = await getDashboardInfo({
        token,
    });


    const logs = await getLogs({
        token,
    });

    return <Dashboard dashboardInfo={dashboardInfo} logs={logs?.logs || []} />
}
