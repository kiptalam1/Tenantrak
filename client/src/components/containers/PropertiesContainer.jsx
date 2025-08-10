import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import PropertyCard from "../cards/PropertyCard";
import Button from "../common/Button";
import { Plus } from "lucide-react";
import AddPropertyModal from "../AddPropertyModal";
import LoaderSpinner from "../common/LoaderSpinner";

const PropertiesContainer = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	const [rooms, setRooms] = useState([]);

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

	// ⬅️ This is the instant update callback when a new room is added;
	const handlePropertyCreated = (newRoom) => {
		setRooms((prevRooms) => [newRoom, ...prevRooms]);
	};

	// delete a room;
	const handleDelete = async (id) => {
		if (!window.confirm("Are you sure you want to delete this property?"))
			return;

		try {
			const res = await fetch(`/api/rooms/room/${id}`, {
				method: "DELETE",
				credentials: "include",
			});
			const data = await res.json();

			if (!res.ok) {
				toast.error(data?.error || "Failed to delete property");
				return;
			}

			toast.success(data?.message || "Property deleted successfully");
			setRooms((prev) => prev.filter((room) => room._id !== id));
		} catch (err) {
			console.error(err);
			toast.error("Something went wrong");
		}
	};

	const openModal = () => setIsModalOpen(true);
	const closeModal = () => setIsModalOpen(false);

	if (loading) {
		return (
			<div className="flex justify-center min-h-screen w-full">
				<LoaderSpinner />
			</div>
		);
	}

	return (
		<div className="w-full px-4 py-16 sm:py-4">
			{isModalOpen && (
				<AddPropertyModal
					onPropertyCreated={handlePropertyCreated}
					onClose={closeModal}
				/>
			)}
			<div className="flex items-center justify-between p-4">
				<p className="text-gray-900	dark:text-gray-100">Property Management</p>
				<Button
					onClick={openModal}
					className="self-end"
					icon={<Plus />}
					label={"Add Property"}
				/>
			</div>
			<div className="flex items-center flex-wrap gap-4">
				{rooms.length === 0 && (
					<p className="w-full text-center text-sm italic text-gray-400 dark:text-gray-300">
						Add property to display
					</p>
				)}
				{rooms &&
					rooms.map((room) => (
						<PropertyCard
							key={room._id}
							buildingName={room.buildingName}
							roomName={room.roomName}
							status={room.status}
							roomType={room.roomType}
							bath={room.bath}
							bed={room.bed}
							price={room.price}
							tenant={room.tenants[0]}
							onDelete={() => handleDelete(room._id)}
						/>
					))}
			</div>
		</div>
	);
};

export default PropertiesContainer;
