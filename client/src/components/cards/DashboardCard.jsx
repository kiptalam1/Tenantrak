import React from "react";
import { Home } from "lucide-react";

const DashboardCard = ({ what, icon, number, details }) => {
	return (
		<div className="text-sm bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-gray-100 flex flex-col justify-between gap-3 w-full sm:w-64 md:w-72 max-w-md border border-gray-300 dark:border-gray-700 rounded-xl p-5 shadow-sm">
			<div className="flex items-center justify-between">
				<p>{what}</p>
				<div className="text-indigo-500">{icon}</div>
			</div>
			<div>
				<p className="font-semibold mt-3 text-base">{number}</p>
				<p className="text-xs text-gray-600	dark:text-gray-400 mt-2">
					{details}
				</p>
			</div>
		</div>
	);
};

export default DashboardCard;
