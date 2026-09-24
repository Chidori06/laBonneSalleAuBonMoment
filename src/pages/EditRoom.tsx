import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { RoomContext } from "../context/RoomContext";
import type { Room } from "../context/RoomContext";

function EditRoom() {

    const { id } = useParams();

    const { room, getRoom, putRoom, } = useContext(RoomContext);

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Room>();

    useEffect(() => {
        if (id) {
            getRoom(id);
        }
    }, [id]);

    useEffect(() => {
        if (room) {
            reset({
                id: room.id,
                name: room.name,
                capacity: room.capacity,
            });
        }
    }, [room, reset]);

    async function onSubmit(data: Room) {

        if (!id) {
            return;
        }
        try {
            await putRoom(id, {
                id,
                name: data.name,
                capacity: Number(data.capacity),
            });
            navigate("/roomlist");
        } catch (error) {
            console.error(
                "Erreur lors de la modification :",
                error
            );
        }
    }

    return (
        <main className="min-h-screen bg-[#BCCCDB] flex flex-col items-center">

            <h2 className="mt-14 text-center text-4xl font-extrabold uppercase text-white">Modifier une salle</h2>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-9 flex w-full max-w-[295px] flex-col"
            >
                <label>Nom de la salle</label>
                <input
                    type="text"
                    {...register("name", {
                        required: "Nom de la salle obligatoire",
                    })}
                    className="h-[30px] w-full rounded-md border-2 border-[#A0AAAB] mb-5 bg-white"
                />
                {errors.name && (
                    <p className="text-black font-bold text-sm mb-3">
                        {errors.name.message}
                    </p>
                )}
                <label>Capacité</label>
                <input
                    type="number"
                    {...register("capacity", {
                        required: "Capacité obligatoire",
                        valueAsNumber: true,
                        min: {
                            value: 1,
                            message: "La capacité doit être supérieure à 0",
                        },
                    })}
                    className="h-[30px] w-full rounded-md border-2 border-[#A0AAAB] mb-5 bg-white"
                />
                {errors.capacity && (
                    <p className="text-black font-bold text-sm mb-3">
                        {errors.capacity.message}
                    </p>
                )}
                <button
                    type="submit"
                    className="rounded-md bg-black px-3 py-2 text-sm border-2 border-white font-semibold text-white"
                >
                    Enregistrer
                </button>
            </form>
        </main>
    );
}
export default EditRoom;
