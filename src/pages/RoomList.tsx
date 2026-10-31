import { useContext, useEffect } from "react";
import { RoomContext } from "../context/RoomContext";
import RoomCard from "../composants/RoomCard";
import { Link } from "react-router";
import { UserContext } from "../context/UserContext";

function RoomList() {
  const { roomList, getRoomList } = useContext(RoomContext);
  const { user } = useContext(UserContext);
  useEffect(() => {
    getRoomList();
  }, []);

  return (

    <>
      <div className="min-h-screen bg-[#111110] px-5 py-12">
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
        {/* En-tête */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-medium tracking-wide text-[#E4D5B5]">
            Liste des salles
          </h1>
          <div className="mx-auto mt-4 h-px w-12 bg-[#B69A65]" />
          <p className="mt-4 text-sm text-[#92866F]">
            Découvrez les salles disponibles
          </p>
        </div>

        {/* Liste des salles */}
        <ul className="mx-auto grid w-full max-w-5xl grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {roomList.map((room) => (
            <li key={room.id} className="w-full flex justify-center">
              <RoomCard room={room} />
            </li>
          ))}

        </ul>
        {/* Liste vide */}
        {roomList.length === 0 && (
          <p className="mt-10 text-center text-sm text-[#A99B7C]">
            Aucune salle disponible pour le moment.
          </p>
        )}
      </div>
    </>

  );
}

export default RoomList;
