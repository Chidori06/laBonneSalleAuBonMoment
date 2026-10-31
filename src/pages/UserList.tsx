import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import UserCard from "../composants/UserCard";
import { Link } from "react-router";

function UserList() {
    const { user, getUserList, userList } = useContext(UserContext);
    useEffect(() => { getUserList() }, [])

    return (


        <>
            <div className="min-h-screen bg-[#111110] px-5 py-12">
                {/* Bouton retour */}
                <div className="mx-auto w-full max-w-5xl">
                    <Link
                        to={`/dashboard/${user.role.label}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-[#51452E] bg-[#1B1B19] px-4 py-2 text-sm font-medium text-[#C5AC7B] transition duration-300 hover:border-[#B69A65] hover:bg-[#24221D] hover:text-[#E4D5B5]"
                    >
                        <span>←</span>
                        Retour
                    </Link>
                </div>
                {/* En-tête */}
                <div className="mb-12 mt-10 text-center">
                    <h1 className="text-3xl font-medium tracking-wide text-[#E4D5B5]">
                        Liste des utilisateurs
                    </h1>

                    <div className="mx-auto mt-4 h-px w-12 bg-[#B69A65]" />

                    <p className="mt-4 text-sm text-[#92866F]">
                        Retrouvez les comptes utilisateurs
                    </p>
                </div>
                {/* Liste des utilisateurs */}
                <ul className="mx-auto grid w-full max-w-5xl grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3">

                    {userList.map((user) => (
                        <li key={user.id} className="flex w-full justify-center">
                            <UserCard user={user} />
                        </li>
                    ))}

                </ul>
                {/* Liste vide */}
                {userList.length === 0 && (
                    <p className="mt-10 text-center text-sm text-[#A99B7C]">
                        Aucun utilisateur disponible pour le moment.
                    </p>
                )}

            </div>
        </>

    )
}

export default UserList