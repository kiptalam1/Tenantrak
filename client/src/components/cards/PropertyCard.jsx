import React from "react";
import { Bath, Bed, Trash2, Edit } from "lucide-react";

const PropertyCard = ({ name, status }) => {
	const statusColorMap = {
		occupied: "bg-green-200 text-green-800",
		vacant: "bg-yellow-200 text-yellow-800",
		maintenance: "bg-red-200 text-red-800",
	};
	return (
		<div className="text-sm bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-gray-100 flex flex-col justify-between gap-3 w-full sm:w-64 md:w-72 max-w-md border border-gray-300 dark:border-gray-700 rounded-xl p-5 shadow-sm">
			<div className="flex items-center justify-between">
				<p>{name}</p>
				<div className={`${statusColorMap[status]} py-0.5 px-2 rounded-lg`}>
					{status}
				</div>
			</div>
			<div className="flex items-center gap-4">
				<p className="flex items-center gap-1 ">
					<Bed size={16} /> 2 bed
				</p>
				<p className="flex items-center gap-1 ">
					<Bath size={16} /> 1 bath
				</p>
			</div>
			<div className="flex items-center justify-between gap-3">
				<div>
					<p className="font-bold">Ksh 7,000/month</p>
					<p className="text-xs">Tenant: John Doe</p>
				</div>
				<div className="flex items-center justify-between gap-3">
					<Edit
						size={16}
						className="text-indigo-600 cursor-pointer	dark:text-indigo-500 hover:text-indigo-700	dark:hover:text-indigo-400 transition"
					/>
					<Trash2
						size={16}
						className="text-red-600 cursor-pointer	dark:text-red-500 hover:text-red-700	dark:hover:text-red-400 transition"
					/>
				</div>
			</div>
		</div>
	);
};

export default PropertyCard;
