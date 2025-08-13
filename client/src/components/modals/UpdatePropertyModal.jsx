import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const UpdatePropertyModal = ({ property, onClose, onPropertyUpdated }) => {
	const [formData, setFormData] = useState({
		roomName: "",
		roomType: "",
		building: "",
		customBuilding: "",
		bed: "",
		bath: "",
		price: "",
		status: "",
	});

	const [buildings, setBuildings] = useState([]);
	const [loadingBuildings, setLoadingBuildings] = useState(true);

	// console.log("property:", property);
	// ✅ Sync form data with property prop
	useEffect(() => {
		if (property) {
			setFormData({
				roomName: property.roomName || "",
				roomType: property.roomType || "",
				building: property.buildingName || "", // backend uses buildingName
				customBuilding: "",
				bed: property.bed || "",
				bath: property.bath || "",
				price: property.price || "",
				status: property.status || "",
			});
		}
	}, [property]);

	// ✅ Fetch building list
	useEffect(() => {
		const fetchBuildings = async () => {
			try {
				const res = await fetch(`/api/buildings`, { credentials: "include" });
				const data = await res.json();
				if (res.ok) setBuildings(data.buildings || []);
			} catch (err) {
				console.error(err);
			} finally {
				setLoadingBuildings(false);
			}
		};
		fetchBuildings();
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const payload = {
			roomName: formData.roomName.trim(),
			roomType: formData.roomType,
			bed: formData.bed,
			bath: formData.bath,
			price: formData.price,
			status: formData.status,
			buildingName:
				formData.building === "other"
					? formData.customBuilding.trim()
					: formData.building,
		};

		if (!payload.roomName || !payload.buildingName) {
			toast.error("Room name and building name are required");
			return;
		}

		try {
			const res = await fetch(`/api/rooms/update-room/${property._id}`, {
				method: "PATCH",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			const data = await res.json();
			if (!res.ok)
				return toast.error(data?.error || "Failed to update property");

			onPropertyUpdated(data.room); // backend already returns formatted room
			toast.success(data.message || "Property updated successfully");
			onClose();
		} catch (error) {
			console.error(error);
			toast.error("Something went wrong");
		}
	};

	return (
		<div className="fixed inset-0 bg-gray-50 dark:bg-neutral-900 bg-opacity-50 text-gray-900 dark:text-gray-100 z-50 flex justify-center items-center p-4">
			<div className="bg-white dark:bg-neutral-800 p-6 rounded-lg w-full max-w-md shadow-lg">
				<h2 className="text-xl font-semibold mb-4">Update Property</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<input
						name="roomName"
						placeholder="Room Name"
						value={formData.roomName}
						onChange={handleChange}
						className="w-full p-2 rounded bg-gray-100 dark:bg-neutral-700 outline-none"
					/>

					<select
						name="roomType"
						value={formData.roomType}
						onChange={handleChange}
						className="w-full p-2 rounded bg-gray-100 dark:bg-neutral-700 outline-none">
						<option value="">Select Room Type</option>
						<option value="single">Single</option>
						<option value="1-bedroom">1 Bedroom</option>
						<option value="2-bedroom">2 Bedroom</option>
						<option value="bed-seater">Bed-Seater</option>
					</select>

					{loadingBuildings ? (
						<p>Loading buildings...</p>
					) : (
						<select
							name="building"
							value={formData.building}
							onChange={handleChange}
							className="w-full p-2 rounded bg-gray-100 dark:bg-neutral-700 outline-none">
							<option value="">Select Building</option>
							{buildings.map((b) => (
								<option key={b._id} value={b.buildingName}>
									{b.buildingName}
								</option>
							))}
							<option value="other">Other</option>
						</select>
					)}

					{formData.building === "other" && (
						<input
							name="customBuilding"
							placeholder="Enter Building Name"
							value={formData.customBuilding}
							onChange={handleChange}
							className="w-full p-2 rounded bg-gray-100 dark:bg-neutral-700 outline-none"
						/>
					)}

					<input
						name="bed"
						placeholder="Number of Beds"
						type="number"
						value={formData.bed}
						onChange={handleChange}
						className="w-full p-2 rounded bg-gray-100 dark:bg-neutral-700 outline-none"
					/>
					<input
						name="bath"
						placeholder="Number of Baths"
						type="number"
						value={formData.bath}
						onChange={handleChange}
						className="w-full p-2 rounded bg-gray-100 dark:bg-neutral-700 outline-none"
					/>
					<input
						name="price"
						placeholder="Price"
						type="number"
						value={formData.price}
						onChange={handleChange}
						className="w-full p-2 rounded bg-gray-100 dark:bg-neutral-700 outline-none"
					/>

					<select
						name="status"
						value={formData.status}
						onChange={handleChange}
						className="w-full p-2 rounded bg-gray-100 dark:bg-neutral-700 outline-none">
						<option value="">Select Status</option>
						<option value="vacant">Vacant</option>
						<option value="occupied">Occupied</option>
						<option value="maintenance">Maintenance</option>
					</select>

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

export default UpdatePropertyModal;
