import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import UserCard from "../composants/UserCard";
import { Link } from "react-router";

function UserList() {
    const { user, getUserList, userList } = useContext(UserContext);
    useEffect(() => { getUserList() }, [])

    return (

        <>

            <div className="grid grid-cols-4 mt-10 p-5">
                <Link to={`/dashboard/${user.role.label}`} >
                    <button className="rounded-md bg-black px-3 py-2 text-sm border-[#FFFFFF] border-2 font-semibold text-white">Retour</button>
                </Link>
                {userList.map((user) => (
                    <UserCard key={user.id} user={user} />
                ))}
            </div>
        </>
    )
}

export default UserList