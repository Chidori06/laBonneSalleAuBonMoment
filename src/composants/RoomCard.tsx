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
        <div className="w-full max-w-sm rounded-xl border border-[#51452E] bg-[#1B1B19] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.25)] transition duration-300 hover:border-[#B69A65]/70">
            {/* Informations */}
            <div className="mb-4">
                <p className="text-sm text-[#A99B7C]">
                    Salle :
                    <span className="ml-2 font-medium text-[#E4D5B5]">
                        {room.name}
                    </span>
                </p>
                <p className="mt-3 text-sm text-[#A99B7C]">
                    Capacité :
                    <span className="ml-2 font-medium text-[#E4D5B5]">
                        {room.capacity}
                    </span>
                </p>
            </div>
            {/* Séparateur */}
            <div className="mb-4 h-px bg-[#51452E]" />
            {/* Actions */}
            <div className="flex gap-3">
                <button
                    onClick={handleEdit}
                    className="flex-1 rounded-lg bg-[#B69A65] px-3 py-2.5 text-sm font-semibold text-[#171612] transition duration-300 hover:bg-[#D0B982] hover:shadow-[0_0_12px_rgba(182,154,101,0.15)]"
                >
                    Modifier
                </button>
                <button
                    onClick={handleDelete}
                    className="flex-1 rounded-lg border border-[#754B43] bg-transparent px-3 py-2.5 text-sm font-semibold text-[#C98D7E] transition duration-300 hover:border-[#C98D7E] hover:bg-[#291B18]"
                >
                    Supprimer
                </button>
            </div>
            {/* Erreur */}
            {error && (
                <p className="mt-4 rounded-md border border-[#754B43]/50 bg-[#291B18] p-3 text-sm font-medium text-[#D99585]">
                    {error}
                </p>
            )}
        </div>
    )
}

export default RoomCard;
