import { useEffect, useState } from "react";
import { UserContext, type User } from "../context/UserContext";

function UserProvider({ children }: { children?: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userList, setUserList] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const login = (data: User) => {
        setUser(data);
    };

    const logout = async () => {
        try {
            await fetch("http://localhost:3000/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });
        } catch (error) {
            console.error("Erreur lors de la déconnexion :", error);
        } finally {
            setUser(null);
        }
    };

    async function getCurrentUser() {
        try {
            const response = await fetch(
                "http://localhost:3000/api/auth/me",
                {
                    credentials: "include",
                }
            );

            if (!response.ok) {
                setUser(null);
                return;
            }

            const data = await response.json();
            setUser(data.user);
        } catch (error) {
            console.error("Erreur lors de la récupération de la session :", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    async function getUserList() {
        try {
            const res = await fetch("http://localhost:3000/api/users", {
                credentials: "include",
            });

            if (!res.ok) {
                throw new Error("Erreur lors de la récupération");
            }

            const data = await res.json();
            setUserList(data);
        } catch (error: any) {
            console.log("Une erreur est survenue : " + error.message);
        }
    }

    useEffect(() => {
        getCurrentUser();
    }, []);

    return (
        <UserContext.Provider
            value={{
                user,
                login,
                logout,
                getUserList,
                userList,
                loading,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;
