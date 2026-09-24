import { useContext, useState } from "react";
import { RoomContext, type Room } from "../context/RoomContext";
import { useNavigate } from "react-router";


interface RoomCardProps {
    room: Room;
}

function RoomCard({ room }: RoomCardProps) {
    const { deleteRoom } = useContext(RoomContext);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleDelete() {
        setError("");
        const confirmation = window.confirm(
            `Voulez-vous supprimer la salle "${room.name}" ?`
        );
        if (!confirmation) {
            return;
        }
        try {
            await deleteRoom(room.id);
        } catch (error: any) {
            setError(error.message);
        }
    }

    function handleEdit() {
        navigate(`/editroom/${room.id}`);
    }
    return (
        <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Salle : <span className="font-medium text-gray-900">{room.name}</span></p>
            <p className="text-sm text-gray-500">Capacité : <span className="font-medium text-gray-900">{room.capacity}</span></p>
            <div className="flex gap-2 mt-4">
                <button onClick={handleEdit}
                    className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white">Modifier</button>
                <button
                    onClick={handleDelete}
                    className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white">Supprimer
                </button>
            </div>
            {error && (
                <p className="mt-3 text-sm font-bold text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}

export default RoomCard;
