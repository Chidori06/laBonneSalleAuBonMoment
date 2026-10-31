import { useContext } from "react";
import {
    Link,
    Navigate,
    useParams,
} from "react-router";

import { UserContext } from "../context/UserContext";

function Dashboard() {
    const { role } = useParams();

    const context = useContext(UserContext);

    const {
        user,
        logout,
    } = context;

    // Vérification de sécurité :
    // le rôle de l'URL doit correspondre
    // au rôle de l'utilisateur.
    if (role !== user?.role.label) {
        return (
            <Navigate
                to={`/dashboard/${user?.role?.label}`}
                replace
            />
        );
    }

    return (

        <div className="min-h-screen bg-[#111110] flex flex-col items-center px-5">

            {/* Titre */}
            <div className="mt-20 mb-14 text-center">
                <h2 className="text-3xl font-medium tracking-wide text-[#E4D5B5]">
                    Espace {role}
                </h2>

                <div className="mx-auto mt-4 h-px w-12 bg-[#B69A65]" />
            </div>

            {/* Administrateur */}
            {user.role.label === "Administrateur" && (
                <div className="grid w-full max-w-[400px] grid-cols-2 gap-4">

                    <Link to="/userlist" className="w-full">
                        <button className="h-20 w-full rounded-lg border border-[#39362E] bg-[#1B1B19] px-3 text-sm font-medium text-[#E4D5B5] transition duration-300 hover:border-[#B69A65] hover:bg-[#24221D] hover:text-[#D0B982]">
                            Liste des comptes
                        </button>
                    </Link>

                    <Link to="/signin" className="w-full">
                        <button className="h-20 w-full rounded-lg border border-[#39362E] bg-[#1B1B19] px-3 text-sm font-medium text-[#E4D5B5] transition duration-300 hover:border-[#B69A65] hover:bg-[#24221D] hover:text-[#D0B982]">
                            Créer un compte
                        </button>
                    </Link>

                    <Link to="/roomlist" className="w-full">
                        <button className="h-20 w-full rounded-lg border border-[#39362E] bg-[#1B1B19] px-3 text-sm font-medium text-[#E4D5B5] transition duration-300 hover:border-[#B69A65] hover:bg-[#24221D] hover:text-[#D0B982]">
                            Liste des salles
                        </button>
                    </Link>

                    <Link to="/NewRoom" className="w-full">
                        <button className="h-20 w-full rounded-lg border border-[#39362E] bg-[#1B1B19] px-3 text-sm font-medium text-[#E4D5B5] transition duration-300 hover:border-[#B69A65] hover:bg-[#24221D] hover:text-[#D0B982]">
                            Créer une salle
                        </button>
                    </Link>

                    <Link to="/viewreservation" className="col-span-2 w-full">
                        <button className="h-14 w-full rounded-lg border border-[#B69A65]/50 bg-[#24221D] px-3 text-sm font-medium text-[#D0B982] transition duration-300 hover:border-[#B69A65] hover:bg-[#302B20]">
                            Mes réservations
                        </button>
                    </Link>

                </div>
            )}

            {/* Formateur */}
            {user.role.label === "Formateur" && (
                <div className="w-full max-w-[400px]">
                    <Link to="/viewreservation">
                        <button className="h-14 w-full rounded-lg border border-[#39362E] bg-[#1B1B19] text-sm font-medium text-[#E4D5B5] transition duration-300 hover:border-[#B69A65] hover:bg-[#24221D] hover:text-[#D0B982]">
                            Mes réservations
                        </button>
                    </Link>
                </div>
            )}

            {/* Apprenant */}
            {user.role.label === "Apprenant" && (
                <div className="w-full max-w-[400px] rounded-lg border border-[#39362E] bg-[#1B1B19] p-6 text-center">
                    <p className="text-sm leading-7 text-[#C5AC7B]">
                        Mes formations,
                        <br />
                        mes réservations...
                    </p>
                </div>
            )}

            {/* Déconnexion */}
            <button
                onClick={logout}
                className="mt-16 rounded-lg border border-[#754B43] bg-transparent px-8 py-3 text-sm font-medium tracking-wide text-[#C98D7E] transition duration-300 hover:border-[#C98D7E] hover:bg-[#291B18] hover:text-[#E5A99A]"
            >
                Se déconnecter
            </button>

        </div>
    )
}

export default Dashboard;