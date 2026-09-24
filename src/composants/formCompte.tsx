import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
            <div className="min-h-screen bg-[#BCCCDB] flex flex-col items-center">

                <h2 className="text-center text-4xl font-bold uppercase text-black">Création de compte</h2>
                <div>
                    <form className="flex flex-col items-center justify-center p-6 space-y-8 min-h-screen p-3" onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col items-center gap-2" >
                            <div className="flex items-center gap-6">
                                <label className="text-black bg-[#D9D9D9] p-2 w-[84px]" >Nom</label>
                                <input type="text" className="h-[30px] w-full rounded-md border border-[#A0AAAB] mb-5 border-2 bg-white"
                                    {...register("lastname", { required: true })} />
                            </div>
                            {errors.lastname && <p>{errors.lastname.message}</p>}
                        </div>
                        <div><div className="flex items-center gap-6">

                            <label className="text-black bg-[#D9D9D9] p-2 w-[84px]" >Prénom</label>
                            <input type="text" className="h-[30px] w-full rounded-md border border-[#A0AAAB] mb-5 border-2 bg-white" {...register("firstname")} />
                        </div>
                            {errors.firstname && <p>{errors.firstname.message}</p>}

                        </div>

                        <div>
                            <div className="flex items-center gap-6">
                                <label className="text-black bg-[#D9D9D9] p-2 w-[84px]" >Email</label>
                                <input type="email" className="h-[30px] w-full rounded-md border border-[#A0AAAB] mb-5 border-2 bg-white"{...register("email")} />
                            </div>
                            {errors.email && (<p>{errors.email.message}</p>)}
                        </div>

                        <div>
                            <div className="flex items-center gap-6">

                                <label className="text-black bg-[#D9D9D9] p-2 w-[84px]" >Mot de passe</label>
                                <input type="password" className="h-[30px] w-full rounded-md border border-[#A0AAAB] mb-5 border-2 bg-white" {...register("password")} />
                            </div>
                            {errors.password && (<p>{errors.password.message}</p>)}
                        </div>
                        <div>
                            <div className="flex items-center gap-6">
                                <label className="text-black bg-[#D9D9D9] p-2 w-[84px]">Rôle:</label>
                                <div>

                                    <select id="roleId" className="h-[30px] w-full rounded-md border border-[#A0AAAB] mb-5 border-2 bg-white"  {...register('roleId')}>
                                        <option value="">Select...</option>
                                        <option value="2">Formateur</option>
                                        <option value="1">Administrateur</option>
                                        <option value="3">Apprenant</option>
                                    </select>
                                    {errors.roleId && (<p>{errors.roleId.message}</p>)}

                                </div>
                            </div>
                        </div>
                        <button type="submit" className="w-44 text-white bg-black border-2 border-white rounded-xl p-2" > Valider </button>
                    </form>
                </div>
            </div>
        </>
    );
}
export default FormCompte;