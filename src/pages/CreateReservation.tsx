import { useContext, useEffect, useState } from "react";
import { ReservationContext } from "../context/ReservationContext";
import type { Reservation } from "../context/ReservationContext";
import { UserContext } from "../context/UserContext";
import { useForm } from "react-hook-form";
import { RoomContext } from "../context/RoomContext";
import type { User } from "../context/UserContext";
import { useNavigate, Link } from "react-router";

function CreateReservation() {
  const {
    postReservation,
    getReservationList,
    reservationList,
  } = useContext(ReservationContext);

  const {
    getRoomList,
    roomList,
  } = useContext(RoomContext);

  const {
    user,
    userList,
    getUserList,
  } = useContext(UserContext);

  const navigate = useNavigate();

  const [success, setSuccess] = useState(false);
  const [errorForm, setErrorForm] = useState("");

  useEffect(() => { getRoomList(); getReservationList(); }, []);

  useEffect(() => {
    if (Number(user?.role?.id) === 1) {
      getUserList();
    }
  }, [user]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Reservation>();

  async function onSubmit(data: Reservation) {
    setErrorForm("");
    setSuccess(false);

    if (Number(user?.role?.id) === 2) {
      data.userId = Number(user.id);
    }

    const newStart = new Date(data.dateDebut).getTime();
    const newEnd = new Date(data.dateFin).getTime();

    if (newStart >= newEnd) {
      setErrorForm("La date de fin doit être après la date de début");
      return;
    }

    const isRoomAvailable = reservationList.every((resa) => {
      if (Number(data.roomId) !== Number(resa.roomId)) {
        return true;
      }
      const existingStart = new Date(resa.dateDebut).getTime();
      const existingEnd = new Date(resa.dateFin).getTime();

      return (
        newEnd <= existingStart ||
        newStart >= existingEnd
      );
    });

    if (!isRoomAvailable) {
      setErrorForm("Salle indisponible sur ce créneau");
      return;
    }
    try {
      await postReservation(data);

      setSuccess(true);

      navigate("/viewreservation");
    } catch (error: any) {
      console.error("Erreur lors de la réservation :", error);

      setErrorForm(
        error?.message || "Impossible de créer la réservation"
      );
    }
  }


  return (
    <main className="min-h-screen bg-[#BCCCDB] flex flex-col items-center">
      <Link to={`/dashboard/${user.role.label}`} >
        <button className="rounded-md bg-black px-3 py-2 text-sm border-[#FFFFFF] border-2 font-semibold text-white">Retour</button>
      </Link>

      <h2 className="mt-14 text-center text-4xl font-extrabold uppercase text-white">
        Réserver un créneau
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        onClick={() => setErrorForm("")}
        className="mt-9 flex w-full max-w-[295px] flex-col"
      >

        <div>
          <label>Salle</label>

          <select
            defaultValue=""
            {...register("roomId", {
              required: "Salle obligatoire",
              valueAsNumber: true
            })}
            className="h-[30px] w-full rounded-md border-2 border-[#A0AAAB] mb-5 bg-white"
          >
            <option value="" disabled>
              Sélectionner une salle
            </option>

            {roomList.map((room) => (
              <option
                key={room.id}
                value={room.id}
              >
                {room.name} / capacité : {room.capacity}
              </option>
            ))}
          </select>

          {errors.roomId && (
            <p className="text-black font-bold text-sm">
              {errors.roomId.message}
            </p>
          )}
        </div>

        <div>
          <label>Utilisateur</label>

          {Number(user?.role?.id) === 1 && (
            <select
              defaultValue=""
              {...register("userId", {
                required: "Utilisateur obligatoire",
                valueAsNumber: true
              })}
              className="h-[30px] w-full rounded-md border-2 border-[#A0AAAB] mb-5 bg-white"
            >
              <option value="" disabled>
                Sélectionner un utilisateur
              </option>

              {userList.map((userItem: User) => (
                <option
                  key={userItem.id}
                  value={userItem.id}
                >
                  {userItem.firstname} {userItem.lastname}
                </option>
              ))}
            </select>
          )}

          {Number(user?.role?.id) === 2 && (
            <input
              type="text"
              value={`${user.firstname} ${user.lastname}`}
              disabled
              className="h-[30px] w-full rounded-md border-2 border-[#A0AAAB] mb-5 bg-gray-200"
            />
          )}

          {errors.userId && (
            <p className="text-black font-bold text-sm">
              {errors.userId.message}
            </p>
          )}
        </div>

        <div>
          <label>Date début</label>

          <input
            type="datetime-local"
            step="3600"
            {...register("dateDebut", {
              required: "Date début obligatoire",
            })}
            className="h-[30px] w-full rounded-md border-2 border-[#A0AAAB] mb-5 bg-white"
          />

          {errors.dateDebut && (
            <p className="text-black font-bold text-sm">
              {errors.dateDebut.message}
            </p>
          )}
        </div>

        <div>
          <label>Date fin</label>

          <input
            type="datetime-local"
            step="3600"
            {...register("dateFin", {
              required: "Date fin obligatoire",
            })}
            className="h-[30px] w-full rounded-md border-2 border-[#A0AAAB] mb-5 bg-white"
          />

          {errors.dateFin && (
            <p className="text-black font-bold text-sm">
              {errors.dateFin.message}
            </p>
          )}
        </div>

        {errorForm && (
          <p className="text-black font-bold text-sm mb-3">
            {errorForm}
          </p>
        )}

        <button
          type="submit"
          className="rounded-md bg-black px-3 py-2 text-sm border-2 border-white font-semibold text-white"
        >
          Réserver un créneau
        </button>

        {success && (
          <div className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-white shadow-lg mt-3">
            <span>
              ✓ Créneau réservé avec succès !
            </span>
          </div>
        )}
      </form>
    </main>
  );
}

export default CreateReservation;
