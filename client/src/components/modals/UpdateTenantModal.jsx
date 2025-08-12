import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const UpdateTenantModal = ({ tenant, onClose, onTenantUpdated }) => {
	const [formData, setFormData] = useState({
		fullName: tenant.fullName || "",
		email: tenant.email || "",
		phone: tenant.phone || "",
		status: tenant.status || "pending",
		roomName: tenant.room?.roomName || "",
		leaseStart: tenant.leaseStart ? tenant.leaseStart.split("T")[0] : "",
		leaseEnd: tenant.leaseEnd ? tenant.leaseEnd.split("T")[0] : "",
	});
	const [rooms, setRooms] = useState([]);
	const [loadingRooms, setLoadingRooms] = useState(true);

	// fetch available rooms
	useEffect(() => {
		const fetchRooms = async () => {
			try {
				const res = await fetch("/api/rooms/all", { credentials: "include" });
				const data = await res.json();
				if (res.ok) {
					setRooms(data.rooms || []);
				}
				// console.log("rooms :", data);
			} catch (err) {
				console.error(err);
			} finally {
				setLoadingRooms(false);
			}
		};
		fetchRooms();
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const res = await fetch(`/api/tenants/update-tenant/${tenant._id}`, {
				method: "PATCH",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			if (!res.ok) return toast.error(data?.error || "Failed to update tenant");

			// console.log("updated :", data.tenant);

			onTenantUpdated(data.tenant);
			toast.success(data.message || "Tenant updated successfully");
			onClose();
		} catch (error) {
			console.error(error);
			toast.error("Something went wrong");
		}
	};

	// console.log("tenant :", tenant);
	return (
		<div className="fixed inset-0 bg-gray-50 dark:bg-neutral-900 bg-opacity-50 text-gray-900 dark:text-gray-100 z-50 flex justify-center items-center p-4">
			<div className="bg-white dark:bg-neutral-800 p-6 rounded-lg w-full max-w-md shadow-lg">
				<h2 className="text-xl font-semibold mb-4">Update Tenant</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<input
						name="fullName"
						placeholder="Full Name"
						value={formData.fullName}
						onChange={handleChange}
						className="w-full p-2 rounded bg-gray-100 dark:bg-neutral-700 outline-none"
					/>
					<input
						name="email"
						placeholder="Email"
						type="email"
						value={formData.email}
						onChange={handleChange}
						className="w-full p-2 rounded bg-gray-100 dark:bg-neutral-700 outline-none"
					/>
					<input
						name="phone"
						placeholder="Phone Number"
						value={formData.phone}
						onChange={handleChange}
						className="w-full p-2 rounded bg-gray-100 dark:bg-neutral-700 outline-none"
					/>

					<select
						name="status"
						value={formData.status}
						onChange={handleChange}
						className="w-full p-2 rounded bg-gray-100 dark:bg-neutral-700 outline-none">
						<option value="pending">Pending</option>
						<option value="active">Active</option>
						<option value="expired">Expired</option>
					</select>

					{loadingRooms ? (
						<p>Loading rooms...</p>
					) : (
						<select
							name="roomName"
							value={formData.roomName}
							onChange={handleChange}
							className="w-full p-2 rounded bg-gray-100 dark:bg-neutral-700 outline-none">
							{/* Current room prefilled */}
							<option value={tenant.roomName}>
								Current: {tenant.roomName} - {tenant.buildingName}
							</option>

							{/* Change option */}
							<option value="">-- Select Different Room --</option>

							{/* List rooms (could filter to vacant only) */}
							{rooms.map((r) => (
								<option key={r._id} value={r.roomName}>
									{r.roomName} - {r.buildingName}
								</option>
							))}
						</select>
					)}

					<div className="flex gap-2">
						<input
							name="leaseStart"
							type="date"
							value={formData.leaseStart}
							onChange={handleChange}
							className="w-full p-2 rounded bg-gray-100 dark:bg-neutral-700 outline-none"
						/>
						<input
							name="leaseEnd"
							type="date"
							value={formData.leaseEnd}
							onChange={handleChange}
							className="w-full p-2 rounded bg-gray-100 dark:bg-neutral-700 outline-none"
						/>
					</div>

					<div className="flex justify-end gap-2">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 bg-gray-300 dark:text-gray-700 rounded hover:bg-gray-400 cursor-pointer">
							Cancel
						</button>
						<button
							type="submit"
							className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 cursor-pointer">
							Update
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default UpdateTenantModal;
