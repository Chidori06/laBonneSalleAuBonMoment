import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link } from "react-router";

type RoomFormData = {
    name: string;
    capacity: number;
};

function NewRoom() {
    const { register, handleSubmit, formState: { errors, isValid }, reset } = useForm<RoomFormData>({ mode: "onChange" });
    const [success, setSuccess] = useState(false);

    async function onSubmit(data: RoomFormData) {
        try {
            const response = await fetch("http://localhost:3000/api/rooms", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log(result);

            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                reset();
            }, 10000);

        } catch (error) {
            console.error("Erreur dans la création de salle:", error);
        }
    };

    return (
        <main className="min-h-screen bg-[#111110] px-5 py-12">
            {/* Bouton retour */}
            <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-4">
                <Link
                    to="/roomlist"
                    className="inline-flex items-center gap-2 rounded-lg border border-[#51452E] bg-[#1B1B19] px-4 py-2 text-sm font-medium text-[#C5AC7B] transition duration-300 hover:border-[#B69A65] hover:bg-[#24221D] hover:text-[#E4D5B5]"
                >
                    <span>←</span>
                    Retour
                </Link>
            </div>

            <div className="mx-auto mt-10 w-full max-w-md">

                {/* Titre */}
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-medium tracking-wide text-[#E4D5B5]">
                        Création de salle
                    </h1>

                    <div className="mx-auto mt-4 h-px w-12 bg-[#B69A65]" />

                    <p className="mt-4 text-sm text-[#92866F]">
                        Informations de la nouvelle salle
                    </p>
                </div>

                {/* Formulaire */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-6 rounded-xl border border-[#39362E] bg-[#1B1B19] p-6 shadow-lg"
                >

                    {/* Nom */}
                    <div>
                        <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-[#C5AC7B]">
                            Nom de la salle
                        </label>

                        <input
                            type="text"
                            placeholder="5 caractères minimum"
                            className="h-12 w-full rounded-lg border border-[#51452E] bg-[#111110] px-4 text-sm text-[#E4D5B5] placeholder:text-[#777267] outline-none transition focus:border-[#B69A65] focus:ring-1 focus:ring-[#B69A65]/30"
                            {...register("name", {
                                required: "Le nom de la salle est obligatoire",
                                minLength: {
                                    value: 5,
                                    message: "Le nom doit comporter au moins 5 caractères"
                                }
                            })}
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
                            Capacité de la salle
                        </label>

                        <input
                            type="number"
                            min="1"
                            placeholder="Nombre de personnes"
                            className="h-12 w-full rounded-lg border border-[#51452E] bg-[#111110] px-4 text-sm text-[#E4D5B5] placeholder:text-[#777267] outline-none transition focus:border-[#B69A65] focus:ring-1 focus:ring-[#B69A65]/30"
                            {...register("capacity", {
                                required: "La capacité est obligatoire",
                                valueAsNumber: true,
                                min: {
                                    value: 1,
                                    message: "La capacité doit être supérieure à 0"
                                }
                            })}
                        />

                        {errors.capacity && (
                            <p className="mt-2 text-xs text-[#D99585]">
                                {errors.capacity.message}
                            </p>
                        )}
                    </div>

                    {/* Bouton */}
                    <button
                        disabled={!isValid}
                        type="submit"
                        className="mt-2 h-12 rounded-lg bg-[#B69A65] text-sm font-semibold tracking-wide text-[#171612] transition duration-300 hover:bg-[#D0B982] hover:shadow-[0_0_18px_rgba(182,154,101,0.15)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Ajouter la salle
                    </button>

                    {/* Message de succès */}
                    {success && (
                        <div className="rounded-lg border border-[#657B55] bg-[#20291D] px-4 py-3 text-center text-sm text-[#B7CEA0]">
                            ✓ Salle créée avec succès !
                        </div>
                    )}

                </form>
            </div>
        </main>
    );

}

export default NewRoom;