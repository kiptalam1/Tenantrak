import React, { useEffect, useState } from "react";
import DashboardCard from "../cards/DashboardCard";
import { ChartLine, DollarSign, Home, Users } from "lucide-react";
// import { useAuth } from "../../contexts/AuthContext";
import LoaderSpinner from "../common/LoaderSpinner";
import toast from "react-hot-toast";

const DashboardContainer = () => {
	const [rooms, setRooms] = useState([]);
	const [loading, setLoading] = useState(true);
	const [tenants, setTenants] = useState([]);

	// fetch all tenants;
	useEffect(() => {
		const fetchProperties = async () => {
			try {
				setLoading(true);
				const res = await fetch("/api/tenants/all", { credentials: "include" });
				const data = await res.json();
				if (!res.ok) {
					toast.error(data?.error || "Failed to load tenants");
					return;
				}
				// console.log("data :", data);

				setTenants(data.tenants);
			} catch (error) {
				console.error(error);
				toast.error("Something went wrong");
			} finally {
				setLoading(false);
			}
		};
		fetchProperties();
	}, []);

	// fetch all rooms;
	useEffect(() => {
		const fetchProperties = async () => {
			try {
				setLoading(true);
				const res = await fetch("/api/rooms/all", { credentials: "include" });
				const data = await res.json();
				if (!res.ok) {
					toast.error(data?.error || "Failed to load properties");
					return;
				}
				// console.log("data :", data);

				setRooms(data.rooms);
			} catch (error) {
				console.error(error);
				toast.error("Something went wrong");
			} finally {
				setLoading(false);
			}
		};
		fetchProperties();
	}, []);

	// Example: calculate current and last month occupancy rates
	const currentRateNum = rooms.length
		? (tenants.filter(
				(t) => new Date(t.createdAt).getMonth() === new Date().getMonth()
		  ).length /
				rooms.length) *
		  100
		: 0;

	const lastMonth = new Date();
	lastMonth.setMonth(lastMonth.getMonth() - 1);
	const lastMonthRateNum = rooms.length
		? (tenants.filter(
				(t) => new Date(t.createdAt).getMonth() === lastMonth.getMonth()
		  ).length /
				rooms.length) *
		  100
		: 0;

	const rateChange = (currentRateNum - lastMonthRateNum).toFixed(2);

	let changeText = "";
	if (rateChange > 0) {
		changeText = `+${rateChange}% increase from last month`;
	} else if (rateChange < 0) {
		changeText = `${rateChange}% decrease from last month`;
	} else {
		changeText = "No change from last month";
	}

	const currentOccupancyRate = `${currentRateNum.toFixed(2)}%`;

	// Calculate revenue (all rooms' total price, regardless of occupancy)
	const revenue = rooms.reduce((sum, room) => sum + room.price, 0);

	// Calculate net income (only occupied rooms' total price)
	const netIncome = rooms
		.filter((room) => room.status === "occupied")
		.reduce((sum, room) => sum + room.price, 0);

	if (loading) {
		return (
			<div className="flex justify-center min-h-screen w-full">
				<LoaderSpinner />
			</div>
		);
	}

	return (
		<div className="w-full px-4 py-16 sm:py-4">
			<div className="flex items-center justify-between p-4 mt-2">
				<p className="text-gray-900	dark:text-gray-100">Dashboard & Reports</p>
			</div>

			<div className="flex items-center flex-wrap gap-4 ">
				<DashboardCard
					what={"Total properties"}
					icon={<Home size={14} />}
					number={rooms.length || 0}
					details={"Across all property types"}
				/>
				<DashboardCard
					what={"Total tenants"}
					icon={<Users size={14} />}
					number={tenants.length || 0}
					details={"Currently active leases"}
				/>
				<DashboardCard
					what="Occupancy rate"
					icon={<ChartLine size={14} />}
					number={currentOccupancyRate}
					details={changeText}
				/>

				<DashboardCard
					what={"Monthly net income"}
					icon={<DollarSign size={14} />}
					number={`Ksh ${netIncome}`}
					details={`Revenue: Ksh ${revenue}`}
				/>
			</div>
		</div>
	);
};

export default DashboardContainer;
