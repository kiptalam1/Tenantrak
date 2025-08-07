import React, { useState } from "react";
import {
	Home,
	Users,
	ChartColumn,
	Bell,
	Building2,
	CreditCard,
	Wrench,
	Menu,
	X,
	LogOut,
	LogOutIcon,
	LucideLogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Sidebar = () => {
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	const { logout } = useAuth();

	return (
		<>
			{/* Hamburger Toggle - Mobile only */}
			<div className="sm:hidden absolute top-4 right-4 z-50">
				<button
					onClick={() => setOpen(!open)}
					className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer">
					{open ? (
						<X
							size={24}
							className="stroke-current text-red-600 dark:text-red-500"
						/>
					) : (
						<Menu size={24} className="stroke-current" />
					)}
				</button>
			</div>

			{/* Sidebar */}
			<div
				className={`
					fixed sm:static top-0 left-0 z-50 
					h-screen flex flex-col gap-2 p-6 
					bg-white dark:bg-neutral-800 
					text-sm text-gray-900 dark:text-gray-100 
					w-64 sm:w-48 
					transition-all duration-300 
					${open ? "translate-x-0" : "-translate-x-full"} 
					sm:translate-x-0
				`}>
				<div
					onClick={() => {
						navigate("/dashboard");
					}}
					className="flex items-center gap-1 mb-3 cursor-pointer">
					<img
						className="w-8 h-8 object-contain rounded-full mr-0"
						src="/tenantrak-icon.png"
						alt="Tenantrak logo"
					/>
					<h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-400">
						Tenantrak
					</h3>
				</div>

				{/* Nav Items */}
				<div
					onClick={() => {
						navigate("/dashboard");
						setOpen(false);
					}}
					className="flex items-center gap-2 py-3 px-2 rounded-sm hover:shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-900">
					<Home size={16} absoluteStrokeWidth />
					<p>Dashboard</p>
				</div>
				<div
					onClick={() => {
						navigate("/properties");
						setOpen(false);
					}}
					className="flex items-center gap-2 py-3 px-2 rounded-sm hover:shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-900">
					<Building2 size={16} absoluteStrokeWidth />
					<p>Properties</p>
				</div>
				<div
					onClick={() => {
						navigate("/tenants");
						setOpen(false);
					}}
					className="flex items-center gap-2 py-3 px-2 rounded-sm hover:shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-900">
					<Users size={16} absoluteStrokeWidth />
					<p>Tenants</p>
				</div>
				<div
					onClick={() => {
						navigate("/rent");
						setOpen(false);
					}}
					className="flex items-center gap-2 py-3 px-2 rounded-sm hover:shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-900">
					<CreditCard size={16} absoluteStrokeWidth />
					<p>Rent & Billing</p>
				</div>
				<div
					onClick={() => {
						navigate("/reports");
						setOpen(false);
					}}
					className="flex items-center gap-2 py-3 px-2 rounded-sm hover:shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-900">
					<ChartColumn size={16} absoluteStrokeWidth />
					<p>Reports</p>
				</div>
				<div
					onClick={() => {
						navigate("/maintenance");
						setOpen(false);
					}}
					className="flex items-center gap-2 py-3 px-2 rounded-sm hover:shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-900">
					<Wrench size={16} absoluteStrokeWidth />
					<p>Maintenance</p>
				</div>
				<div
					onClick={() => {
						navigate("/notifications");
						setOpen(false);
					}}
					className="flex items-center gap-2 py-3 px-2 rounded-sm hover:shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-900">
					<Bell size={16} absoluteStrokeWidth />
					<p>Notifications</p>
				</div>
				<div
					onClick={() => {
						logout();
						setOpen(false);
					}}
					className="flex items-center gap-2 py-3 px-2 rounded-sm hover:shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-900">
					<LogOut size={16} className="text-red-600" absoluteStrokeWidth />
					<p>Logout</p>
				</div>
			</div>
		</>
	);
};

export default Sidebar;
