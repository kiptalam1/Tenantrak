import React from "react";
import DashboardCard from "./cards/DashboardCard";
import { ChartLine, DollarSign, Home, Users } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import LoaderSpinner from "./common/LoaderSpinner";

const DashboardContainer = () => {
	const { loading } = useAuth();

	if (loading) return <LoaderSpinner />;

	return (
		<div className="w-full px-4 py-16 sm:py-4">
			<div className="flex items-center justify-between p-4 mt-2">
				<p className="text-gray-900	dark:text-gray-100">Dashboard & Reports</p>
			</div>

			<div className="flex items-center flex-wrap gap-4 ">
				<DashboardCard
					what={"Total properties"}
					icon={
						<Home
							size={14}
							// className="stroke-current text-gray-600	dark:text-gray-400"
						/>
					}
					number={24}
					details={"Across all property types"}
				/>
				<DashboardCard
					what={"Total tenants"}
					icon={
						<Users
							size={14}
							// className="stroke-current text-gray-600 dark:text-gray-400"
						/>
					}
					number={7}
					details={"Currently active leases"}
				/>
				<DashboardCard
					what={"Occupancy rate"}
					icon={
						<ChartLine
							size={14}
							// className="stroke-current text-gray-600 dark:text-gray-400"
						/>
					}
					number={"92.3%"}
					details={"+2.1% increase from last month"}
				/>

				<DashboardCard
					what={"Monthly net income"}
					icon={
						<DollarSign
							size={14}
							// className="stroke-current text-gray-600 dark:text-gray-400"
						/>
					}
					number={"Ksh 10,000"}
					details={"Revenue: Ksh 14,500"}
				/>
			</div>
		</div>
	);
};

export default DashboardContainer;
