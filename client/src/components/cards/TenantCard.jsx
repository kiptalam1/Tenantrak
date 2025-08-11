import {
	Trash2,
	Edit,
	DollarSign,
	Calendar,
	Phone,
	Mail,
	House,
} from "lucide-react";

const TenantCard = ({
	fullName,
	buildingName,
	roomName,
	status,
	phone,
	email,
	price,
	leaseEnd,
	leaseStart,
	onDelete,
}) => {
	const statusColorMap = {
		active:
			"bg-green-50 text-green-600 dark:bg-inherit dark:border dark:border-gray-700 dark:text-green-200",
		pending:
			"bg-yellow-50 text-yellow-600 dark:bg-inherit dark:border dark:border-gray-700 dark:text-yellow-200",
		expired:
			"bg-red-50 text-red-400 dark:bg-inherit dark:border dark:border-gray-700 dark:text-red-200",
	};
	return (
		<div className="text-sm bg-gray-50 dark:bg-neutral-900 text-gray-900 dark:text-gray-100 flex flex-col justify-between gap-3 w-full sm:w-64 md:w-72 max-w-md border border-gray-300 dark:border-gray-700 rounded-xl p-5 shadow-sm">
			<div className="flex items-center justify-between">
				<p className="text-lg font-semibold">{fullName}</p>
				<div className={`${statusColorMap[status]} py-0.5 px-2 rounded-lg`}>
					{status}
				</div>
			</div>
			<p className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 ">
				<Mail size={16} />
				{email || "N/A"}
			</p>
			<p className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
				<Phone size={16} /> {phone}
			</p>
			<hr className="text-gray-300 dark:text-gray-500 my-1" />
			<p className="flex items-center gap-2 text-base ">
				<House size={16} /> {buildingName}-{roomName}
			</p>
			<div className="flex items-center justify-between gap-3">
				<div>
					<p className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 mt-1">
						<Calendar size={16} />
						{leaseStart} - {leaseEnd}
					</p>
					<p className="flex items-center gap-2 mt-2 text-xs text-gray-600 dark:text-gray-300">
						<DollarSign size={16} />
						Ksh {price}/month
					</p>
				</div>
				<div className="flex items-center justify-between gap-3">
					<Edit
						size={16}
						className="text-indigo-400 cursor-pointer	dark:text-indigo-300 hover:text-indigo-800	dark:hover:text-indigo-700 transition"
					/>
					<Trash2
						size={16}
						className="text-red-400 dark:text-red-300 cursor-pointer hover:text-red-800 transition"
						onClick={onDelete}
					/>
				</div>
			</div>
		</div>
	);
};

export default TenantCard;
