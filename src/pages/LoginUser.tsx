import { useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { UserContext } from "../context/UserContext";

type LoginFormData = {
    email: string;
    password: string;
};

function LoginUser() {

    const context = useContext(UserContext);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>();

    const { login } = context;

    async function onSubmit(data: LoginFormData) {
        try {
            const response = await fetch("http://localhost:3000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        email: data.email,
                        password: data.password,
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    alert("Identifiants incorrects");
                    return;
                }

                throw new Error(
                    result.message || "Erreur lors de la connexion"
                );
            }

            const user = result.user;

            login(user);

            navigate(`/dashboard/${user.role.label}`);

        } catch (error) {
            console.error(error);
            alert("Une erreur est survenue");
        }
    }

    return (
        <>
            <main className="min-h-screen bg-[#111110] flex flex-col items-center px-5">
                <div className="mt-28 w-full max-w-[340px]">
                    <h2 className="text-center text-3xl font-medium tracking-wide text-[#E4D5B5]">
                        Connexion
                    </h2>
                    <div className="mx-auto mt-4 mb-10 h-px w-12 bg-[#B69A65]" />
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                        <div>
                            <label className="mb-2 block text-xs uppercase tracking-widest text-[#C5AC7B]">
                                Adresse mail
                            </label>

                            <input
                                type="email"
                                placeholder="Votre adresse mail"
                                className="h-12 w-full rounded-lg border border-[#39362E] bg-[#1B1B19] px-4 text-sm text-[#E4D5B5] placeholder:text-[#777267] outline-none transition focus:border-[#B69A65] focus:ring-1 focus:ring-[#B69A65]/30"
                                {...register("email", {
                                    required: "L'email est obligatoire",
                                })}
                            />

                            {errors.email && (
                                <p className="mt-2 text-xs text-red-400">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-xs uppercase tracking-widest text-[#C5AC7B]">
                                Mot de passe
                            </label>

                            <input
                                type="password"
                                placeholder="Votre mot de passe"
                                className="h-12 w-full rounded-lg border border-[#39362E] bg-[#1B1B19] px-4 text-sm text-[#E4D5B5] placeholder:text-[#777267] outline-none transition focus:border-[#B69A65] focus:ring-1 focus:ring-[#B69A65]/30"
                                {...register("password", {
                                    required: "Le mot de passe est obligatoire",
                                })}
                            />

                            {errors.password && (
                                <p className="mt-2 text-xs text-red-400">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <button type="submit" className="mt-3 h-12 rounded-lg bg-[#B69A65] text-sm font-semibold tracking-wide text-[#171612] transition duration-300 hover:bg-[#D0B982] hover:shadow-[0_0_18px_rgba(182,154,101,0.15)] active:scale-[0.98]"
                        >Se connecter</button>

                    </form>
                </div>
            </main>
        </>
    )
}
export default LoginUser
