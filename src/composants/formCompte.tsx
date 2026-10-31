import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

function FormCompte() {
    const checkEmailAvailable = async (email: string) => {
        const url = `http://localhost:3000/api/users?email=${encodeURIComponent(email)}`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    };

    const compteSchema = z.object({
        lastname: z.string()
            .min(2).max(100),
        firstname: z.string()
            .min(2)
            .max(100),
        email: z
            .string()
            .email("Veuillez entrer un email valide")
            .min(5, "Votre email doit contenir au moins 5 caractères")
            .refine(
                async (email) => {
                    const users = await checkEmailAvailable(email);
                    return users.length === 0;
                },
                {
                    message: "Cet email est déjà utilisé"
                }
            ),
        password: z
            .string()
            .min(6, "Votre mot de passe doit contenir au moins 6 caractères")
            .max(100),
        roleId: z.string()
            .refine((value) => value !== "", { message: "Please select an option" })
    });

    const { register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(compteSchema),
    });
    const { user } = useContext(UserContext);

    async function onSubmit(data) {
        try {
            const response = await fetch("http://localhost:3000/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Erreur lors de la création");
            }

        } catch (error) {
            console.error("Erreur :", error);
        }
    }

    return (
        <>
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
                <div className="mx-auto mt-6 w-full max-w-md">
                    {/* Titre */}
                    <div className="mb-10 text-center">
                        <h1 className="text-3xl font-medium tracking-wide text-[#E4D5B5]">
                            Création de compte
                        </h1>

                        <div className="mx-auto mt-4 h-px w-12 bg-[#B69A65]" />

                        <p className="mt-4 text-sm text-[#92866F]">
                            Informations du nouvel utilisateur
                        </p>
                    </div>
                    {/* Formulaire */}
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col gap-5 rounded-xl border border-[#39362E] bg-[#1B1B19] p-6 shadow-lg"
                    >
                        {/* Nom */}
                        <div>
                            <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-[#C5AC7B]">
                                Nom
                            </label>

                            <input
                                type="text"
                                placeholder="Votre nom"
                                className="h-12 w-full rounded-lg border border-[#51452E] bg-[#111110] px-4 text-sm text-[#E4D5B5] placeholder:text-[#777267] outline-none transition focus:border-[#B69A65] focus:ring-1 focus:ring-[#B69A65]/30"
                                {...register("lastname", { required: true })}
                            />

                            {errors.lastname && (
                                <p className="mt-2 text-xs text-[#D99585]">
                                    {errors.lastname.message}
                                </p>
                            )}
                        </div>
                        {/* Prénom */}
                        <div>
                            <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-[#C5AC7B]">
                                Prénom
                            </label>

                            <input
                                type="text"
                                placeholder="Votre prénom"
                                className="h-12 w-full rounded-lg border border-[#51452E] bg-[#111110] px-4 text-sm text-[#E4D5B5] placeholder:text-[#777267] outline-none transition focus:border-[#B69A65] focus:ring-1 focus:ring-[#B69A65]/30"
                                {...register("firstname")}
                            />

                            {errors.firstname && (
                                <p className="mt-2 text-xs text-[#D99585]">
                                    {errors.firstname.message}
                                </p>
                            )}
                        </div>
                        {/* Email */}
                        <div>
                            <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-[#C5AC7B]">
                                Email
                            </label>

                            <input
                                type="email"
                                placeholder="Votre adresse email"
                                className="h-12 w-full rounded-lg border border-[#51452E] bg-[#111110] px-4 text-sm text-[#E4D5B5] placeholder:text-[#777267] outline-none transition focus:border-[#B69A65] focus:ring-1 focus:ring-[#B69A65]/30"
                                {...register("email")}
                            />

                            {errors.email && (
                                <p className="mt-2 text-xs text-[#D99585]">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>
                        {/* Mot de passe */}
                        <div>
                            <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-[#C5AC7B]">
                                Mot de passe
                            </label>

                            <input
                                type="password"
                                placeholder="Votre mot de passe"
                                className="h-12 w-full rounded-lg border border-[#51452E] bg-[#111110] px-4 text-sm text-[#E4D5B5] placeholder:text-[#777267] outline-none transition focus:border-[#B69A65] focus:ring-1 focus:ring-[#B69A65]/30"
                                {...register("password")}
                            />

                            {errors.password && (
                                <p className="mt-2 text-xs text-[#D99585]">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>
                        {/* Rôle */}
                        <div>
                            <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-[#C5AC7B]">
                                Rôle
                            </label>

                            <select
                                id="roleId"
                                className="h-12 w-full rounded-lg border border-[#51452E] bg-[#111110] px-4 text-sm text-[#E4D5B5] outline-none transition focus:border-[#B69A65] focus:ring-1 focus:ring-[#B69A65]/30"
                                {...register("roleId")}
                            >
                                <option value="">Sélectionner un rôle</option>
                                <option value="2">Formateur</option>
                                <option value="1">Administrateur</option>
                                <option value="3">Apprenant</option>
                            </select>

                            {errors.roleId && (
                                <p className="mt-2 text-xs text-[#D99585]">
                                    {errors.roleId.message}
                                </p>
                            )}
                        </div>
                        {/* Bouton */}
                        <button
                            type="submit"
                            className="mt-3 h-12 rounded-lg bg-[#B69A65] text-sm font-semibold tracking-wide text-[#171612] transition duration-300 hover:bg-[#D0B982] hover:shadow-[0_0_18px_rgba(182,154,101,0.15)] active:scale-[0.98]"
                        >
                            Créer le compte
                        </button>

                    </form>
                </div>
            </main>
        </>

    );
}
export default FormCompte;