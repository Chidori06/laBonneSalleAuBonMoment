import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router";
import { RoomContext } from "../context/RoomContext";
import type { Room } from "../context/RoomContext";
import { UserContext } from "../context/UserContext";

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

    const { user } = useContext(UserContext);

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

        <main className="min-h-screen bg-[#111110] px-5 py-12">
            {/* Bouton retour */}
            <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-4">
                <Link
                    to={`/dashboard/${user.role.label}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#51452E] bg-[#1B1B19] px-4 py-2 text-sm font-medium text-[#C5AC7B] transition duration-300 hover:border-[#B69A65] hover:bg-[#24221D] hover:text-[#E4D5B5]"
                >
                    <span>←</span>
                    Retour
                </Link>
            </div>
            <div className="mx-auto mt-10 w-full max-w-md">
                {/* En-tête */}
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-medium tracking-wide text-[#E4D5B5]">
                        Modifier une salle
                    </h1>

                    <div className="mx-auto mt-4 h-px w-12 bg-[#B69A65]" />

                    <p className="mt-4 text-sm text-[#92866F]">
                        Modifier les informations de la salle
                    </p>
                </div>
                {/* Formulaire */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex w-full flex-col gap-5 rounded-xl border border-[#39362E] bg-[#1B1B19] p-6 shadow-lg"
                >
                    {/* Nom */}
                    <div>
                        <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-[#C5AC7B]">
                            Nom de la salle
                        </label>

                        <input
                            type="text"
                            placeholder="Nom de la salle"
                            {...register("name", {
                                required: "Nom de la salle obligatoire",
                            })}
                            className="h-12 w-full rounded-lg border border-[#51452E] bg-[#111110] px-4 text-sm text-[#E4D5B5] placeholder:text-[#777267] outline-none transition focus:border-[#B69A65] focus:ring-1 focus:ring-[#B69A65]/30"
                        />

                        {errors.name && (
                            <p className="mt-2 text-xs text-[#D99585]">
                                {errors.name.message}
                            </p>
                        )}
                    </div>
                    {/* Capacité */}
                    <div>
                        <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-[#C5AC7B]">
                            Capacité
                        </label>

                        <input
                            type="number"
                            min="1"
                            placeholder="Nombre de personnes"
                            {...register("capacity", {
                                required: "Capacité obligatoire",
                                valueAsNumber: true,
                                min: {
                                    value: 1,
                                    message: "La capacité doit être supérieure à 0",
                                },
                            })}
                            className="h-12 w-full rounded-lg border border-[#51452E] bg-[#111110] px-4 text-sm text-[#E4D5B5] placeholder:text-[#777267] outline-none transition focus:border-[#B69A65] focus:ring-1 focus:ring-[#B69A65]/30"
                        />

                        {errors.capacity && (
                            <p className="mt-2 text-xs text-[#D99585]">
                                {errors.capacity.message}
                            </p>
                        )}
                    </div>
                    {/* Bouton */}
                    <button
                        type="submit"
                        className="mt-2 h-12 rounded-lg bg-[#B69A65] text-sm font-semibold tracking-wide text-[#171612] transition duration-300 hover:bg-[#D0B982] hover:shadow-[0_0_18px_rgba(182,154,101,0.15)] active:scale-[0.98]"
                    >
                        Enregistrer les modifications
                    </button>

                </form>
            </div>
        </main>

    );
}
export default EditRoom;
