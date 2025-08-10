import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const AddPropertyModal = ({ onClose, onPropertyCreated }) => {
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

	// get available building names;
	useEffect(() => {
		const fetchBuildings = async () => {
			try {
				const res = await fetch(`/api/buildings`, {
					credentials: "include",
				});
				const data = await res.json();
				if (res.ok) {
					setBuildings(data.buildings || []);
				}
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
			...formData,
			buildingName:
				formData.building === "other"
					? formData.customBuilding
					: formData.building,
		};
		console.log("Submitted:", payload);
		if (
			!formData.roomType ||
			(formData.building === "other" && !formData.customBuilding) ||
			(formData.building !== "other" && !formData.building) ||
			!formData.roomName ||
			!formData.bath ||
			!formData.bed ||
			!formData.price ||
			!formData.status
		) {
			toast.error("Please fill all fields");
			return;
		}

		try {
			const res = await fetch("/api/rooms/create-room", {
				method: "POST",

				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});
			const data = await res.json();
			if (!res.ok) return toast.error(data?.error || "Failed to add property");

			// Merge buildingName into the room object so PropertyCard renders instantly
			const newRoomWithBuilding = {
				...data.room,
				buildingName: data.building?.buildingName || payload.buildingName,
			};

			onPropertyCreated(newRoomWithBuilding); // instantly updates parent state
			toast.success(data.message || "Property created successfully");
			onClose();
		} catch (error) {
			console.error(error);
			toast.error("Something went wrong");
		}
	};

	return (
		<div className="fixed inset-0 bg-gray-50 dark:bg-neutral-900 bg-opacity-50 text-gray-900 dark:text-gray-100 z-50 flex justify-center items-center p-4">
			<div className="bg-white dark:bg-neutral-800 p-6 rounded-lg w-full max-w-md shadow-lg">
				<h2 className="text-xl font-semibold mb-4">Add New Property</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<input
						name="roomName"
						placeholder="Room Name"
						onChange={handleChange}
						className="w-full p-2 rounded bg-gray-100 dark:bg-neutral-700 outline-none"
					/>

					<select
						name="roomType"
						onChange={handleChange}
						className="w-full p-2 rounded bg-gray-100 dark:bg-neutral-700 outline-none">
						<option value="">Select Room Type</option>
						<option value="single">Single</option>
						<option value="1-bedroom">1 Bedroom</option>
						<option value="2-bedroom">2 Bedroom</option>
						<option value="bed-seater">Bed-Seater</option>
					</select>

					{/* Building Select */}
					{loadingBuildings ? (
						<p>Loading buildings...</p>
					) : (
						<select
							name="building"
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

					{/* Show custom building input if 'other' selected */}
					{formData.building === "other" && (
						<input
							name="customBuilding"
							placeholder="Enter Building Name"
							onChange={handleChange}
							className="w-full p-2 rounded bg-gray-100 dark:bg-neutral-700 outline-none"
						/>
					)}

					<input
						name="bed"
						placeholder="Number of Beds"
						type="number"
						onChange={handleChange}
						className="w-full p-2 rounded bg-gray-100 dark:bg-neutral-700 outline-none"
					/>
					<input
						name="bath"
						placeholder="Number of Baths"
						type="number"
						onChange={handleChange}
						className="w-full p-2 rounded bg-gray-100 dark:bg-neutral-700 outline-none"
					/>
					<input
						name="price"
						placeholder="Price"
						type="number"
						onChange={handleChange}
						className="w-full p-2 rounded bg-gray-100 dark:bg-neutral-700 outline-none"
					/>

					<select
						name="status"
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
							className="px-4 py-2 bg-gray-300 dark:text-gray-700 rounded hover:bg-gray-400">
							Cancel
						</button>
						<button
							type="submit"
							className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
							Save
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default AddPropertyModal;
