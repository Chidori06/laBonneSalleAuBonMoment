export interface User {
    id: string,
    firstname: string,
    lastname: string,
    email: string,
    roleId: string
    roleLabel: string;
}

interface UserCardProps {
    user: User;
}

function UserCard({ user }: UserCardProps) {
    return (

        <>
            <div className="w-full max-w-sm rounded-xl border border-[#51452E] bg-[#1B1B19] p-5 shadow-lg transition duration-300 hover:border-[#B69A65]/70">

                {/* Informations utilisateur */}
                <div className="space-y-3">

                    <p className="text-sm text-[#A99B7C]">
                        Prénom :
                        <span className="ml-2 font-medium text-[#E4D5B5]">
                            {user.firstname}
                        </span>
                    </p>
                    <p className="text-sm text-[#A99B7C]">
                        Nom :
                        <span className="ml-2 font-medium text-[#E4D5B5]">
                            {user.lastname}
                        </span>
                    </p>

                    <p className="text-sm text-[#A99B7C]">
                        Email :
                        <span className="ml-2 font-medium text-[#E4D5B5]">
                            {user.email}
                        </span>
                    </p>

                </div>
            </div>
        </>


    );
}

export default UserCard;
