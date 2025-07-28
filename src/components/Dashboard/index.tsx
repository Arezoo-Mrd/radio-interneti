"use client"

import { DashboardInfo } from '@/app/(protected)/dashboard/api';
import ActivityLogs from './ActivityLogs';
import Chart from './Chart';
import EmployeeList from './EmployeeList';
import HeaderStates from './HeaderStates';

const Dashboard = ({ dashboardInfo }: { dashboardInfo: DashboardInfo | undefined }) => {

    return (
        <div className="min-h-screen bg-gray-50 w-full p-6" dir="rtl">
            <div className="w-full">
                {dashboardInfo && <HeaderStates dashboardInfo={dashboardInfo} />}
                <div className="flex w-full items-center gap-6">
                    <Chart visitors={dashboardInfo?.visitors || []} />
                    <EmployeeList dashboardInfo={dashboardInfo} />
                </div>
                <div className="w-full overflow-x-auto bg-white my-6 rounded-xl flex flex-col justify-between overflow-y-hidden">
                    <ActivityLogs />
                </div>

            </div>
        </div>
    );
};

export default Dashboard;