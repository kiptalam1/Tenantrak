import React from "react";
import Sidebar from "../components/common/Sidebar";
import DashboardContainer from "../components/containers/DashboardContainer";

const Dashboard = () => {
	return (
		<div className="min-h-screen w-full bg-gray-50 dark:bg-neutral-900 flex gap-4">
			<Sidebar />
			<DashboardContainer />
		</div>
	);
};

export default Dashboard;
