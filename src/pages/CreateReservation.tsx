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
      <div className="mx-auto mt-10 w-full max-w-md">
        {/* En-tête */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-medium tracking-wide text-[#E4D5B5]">
            Réserver un créneau
          </h2>

          <div className="mx-auto mt-4 h-px w-12 bg-[#B69A65]" />

          <p className="mt-4 text-sm text-[#92866F]">
            Informations de votre réservation
          </p>
        </div>
        {/* Formulaire */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          onClick={() => setErrorForm("")}
          className="flex w-full flex-col gap-5 rounded-xl border border-[#39362E] bg-[#1B1B19] p-6 shadow-lg"
        >
          {/* Salle */}
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-[#C5AC7B]">
              Salle
            </label>

            <select
              defaultValue=""
              {...register("roomId", {
                required: "Salle obligatoire",
                valueAsNumber: true
              })}
              className="h-12 w-full rounded-lg border border-[#51452E] bg-[#111110] px-4 text-sm text-[#E4D5B5] outline-none transition focus:border-[#B69A65] focus:ring-1 focus:ring-[#B69A65]/30"
            >
              <option value="" disabled>
                Sélectionner une salle
              </option>

              {roomList.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name} / capacité : {room.capacity}
                </option>
              ))}
            </select>

            {errors.roomId && (
              <p className="mt-2 text-xs text-[#D99585]">
                {errors.roomId.message}
              </p>
            )}
          </div>
          {/* Utilisateur */}
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-[#C5AC7B]">
              Utilisateur
            </label>
            {Number(user?.role?.id) === 1 && (
              <select
                defaultValue=""
                {...register("userId", {
                  required: "Utilisateur obligatoire",
                  valueAsNumber: true
                })}
                className="h-12 w-full rounded-lg border border-[#51452E] bg-[#111110] px-4 text-sm text-[#E4D5B5] outline-none transition focus:border-[#B69A65] focus:ring-1 focus:ring-[#B69A65]/30"
              >
                <option value="" disabled>
                  Sélectionner un utilisateur
                </option>
                {userList.map((userItem: User) => (
                  <option key={userItem.id} value={userItem.id}>
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
                className="h-12 w-full rounded-lg border border-[#51452E] bg-[#292721] px-4 text-sm text-[#92866F] outline-none"
              />
            )}

            {errors.userId && (
              <p className="mt-2 text-xs text-[#D99585]">
                {errors.userId.message}
              </p>
            )}
          </div>
          {/* Date début */}
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-[#C5AC7B]">
              Date de début
            </label>

            <input
              type="datetime-local"
              step="3600"
              {...register("dateDebut", {
                required: "Date début obligatoire",
              })}
              className="h-12 w-full rounded-lg border border-[#51452E] bg-[#111110] px-4 text-sm text-[#E4D5B5] outline-none transition focus:border-[#B69A65] focus:ring-1 focus:ring-[#B69A65]/30"
            />
            {errors.dateDebut && (
              <p className="mt-2 text-xs text-[#D99585]">
                {errors.dateDebut.message}
              </p>
            )}
          </div>
          {/* Date fin */}
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-[#C5AC7B]">
              Date de fin
            </label>
            <input
              type="datetime-local"
              step="3600"
              {...register("dateFin", {
                required: "Date fin obligatoire",
              })}
              className="h-12 w-full rounded-lg border border-[#51452E] bg-[#111110] px-4 text-sm text-[#E4D5B5] outline-none transition focus:border-[#B69A65] focus:ring-1 focus:ring-[#B69A65]/30"
            />
            {errors.dateFin && (
              <p className="mt-2 text-xs text-[#D99585]">
                {errors.dateFin.message}
              </p>
            )}
          </div>
          {/* Erreur formulaire */}
          {errorForm && (
            <p className="rounded-lg border border-[#754B43]/50 bg-[#291B18] p-3 text-sm text-[#D99585]">
              {errorForm}
            </p>
          )}
          {/* Bouton réservation */}
          <button
            type="submit"
            className="mt-2 h-12 rounded-lg bg-[#B69A65] text-sm font-semibold tracking-wide text-[#171612] transition duration-300 hover:bg-[#D0B982] hover:shadow-[0_0_18px_rgba(182,154,101,0.15)] active:scale-[0.98]"
          >
            Réserver un créneau
          </button>
          {/* Succès */}
          {success && (
            <div className="rounded-lg border border-[#657B55] bg-[#20291D] px-5 py-3 text-center text-sm text-[#B7CEA0]">
              ✓ Créneau réservé avec succès !
            </div>
          )}
        </form>
      </div>
    </main>

  );
}

export default CreateReservation;
