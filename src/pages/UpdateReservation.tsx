import { useContext, useState } from "react";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Link } from "react-router";
import type { ChangeEvent } from "react";
import { UserContext } from "../context/UserContext";
import { ReservationContext } from "../context/ReservationContext";
import { RoomContext } from "../context/RoomContext";

function UpdateReservation() {

    const context = useContext(UserContext);
    const user = context?.user;
    const navigate = useNavigate();
    const { getReservation, postReservation, deleteReservation, putReservation, getReservationList, reservationList } = useContext(ReservationContext);
    const { getRoom, postRoom, putRoom, deleteRoom, getRoomList, roomList, ...room } = useContext(RoomContext);
    useEffect(() => { getRoomList() }, []);
    useEffect(() => { getReservationList() }, []);

    interface Reservation {
        id?: string,
        roomId: string,
        dateDebut: string,
        dateFin: string,
        userId: string
    }

    const { id } = useParams();

    const [reservation, setReservation] = useState<Reservation | null>(null);

    useEffect(() => {
        const fetchReservation = async () => {
            const response = await fetch(`http://localhost:3000/api/reservations/${id}`, {
                credentials: "include",
            })
            const data = await response.json();
            setReservation(data)
        };

        fetchReservation();
    }, [id]);

    const [form, setForm] = useState({
        roomId: "",
        dateDebut: "",
        dateFin: "",
    })

    function formatDateForInput(date: string) {
        const d = new Date(date);

        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const hours = String(d.getHours()).padStart(2, "0");
        const minutes = String(d.getMinutes()).padStart(2, "0");

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    useEffect(() => {
        if (reservation) {
            setForm({
                roomId: reservation.roomId,
                dateDebut: formatDateForInput(reservation.dateDebut),
                dateFin: formatDateForInput(reservation.dateFin),
            });
        }
    }, [reservation]);

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        console.log("SUBMIT");

        if (!reservation) {
            console.log("Pas de réservation");
            return;
        }
        const isAdmin = user?.role?.label === "Administrateur";
        const isOwner = Number(reservation.userId) === Number(user?.id);

        if (!isAdmin && !isOwner) {
            navigate(`/dashboard/${user?.role?.label}`);
            return;
        }

        const confirmed = window.confirm(
            "Voulez-vous vraiment modifier cette réservation ?"
        );

        if (!confirmed) {
            return;
        }

        const newReservation = {
            roomId: form.roomId,
            dateDebut: form.dateDebut,
            dateFin: form.dateFin,
            userId: reservation.userId,
        };

        console.log("Avant PATCH", newReservation);

        try {
            await putReservation(Number(id), newReservation);

            console.log("PATCH terminé");

            window.alert("Modifications effectuées avec succès.");
            navigate("/viewreservation");
        } catch (error: any) {
            console.error("Erreur PATCH :", error);
            window.alert(error.message);
        }
    }

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
                <div className="mx-auto mt-10 w-full max-w-md">
                    {/* En-tête */}
                    <div className="mb-10 text-center">
                        <h1 className="text-3xl font-medium tracking-wide text-[#E4D5B5]">
                            Modifier une réservation
                        </h1>
                        <div className="mx-auto mt-4 h-px w-12 bg-[#B69A65]" />
                        <p className="mt-4 text-sm text-[#92866F]">
                            Modifier les informations de votre réservation
                        </p>
                    </div>
                    {/* Formulaire */}
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-5 rounded-xl border border-[#39362E] bg-[#1B1B19] p-6 shadow-lg"
                    >
                        {/* Salle */}
                        <div>
                            <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-[#C5AC7B]">
                                Salle
                            </label>
                            <select
                                name="roomId"
                                value={form.roomId}
                                onChange={e => {
                                    setForm({ ...form, roomId: e.target.value });
                                }}
                                required
                                className="h-12 w-full rounded-lg border border-[#51452E] bg-[#111110] px-4 text-sm text-[#E4D5B5] outline-none transition focus:border-[#B69A65] focus:ring-1 focus:ring-[#B69A65]/30"
                            >
                                {roomList.map((room) => (
                                    <option key={room.id} value={room.id}>
                                        {room.name} / capacité : {room.capacity}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Date de début */}
                        <div>
                            <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-[#C5AC7B]">
                                Date de début
                            </label>
                            <input
                                type="datetime-local"
                                step="3600"
                                name="dateDebut"
                                value={form.dateDebut}
                                onChange={handleChange}
                                required
                                className="h-12 w-full rounded-lg border border-[#51452E] bg-[#111110] px-4 text-sm text-[#E4D5B5] outline-none transition focus:border-[#B69A65] focus:ring-1 focus:ring-[#B69A65]/30"
                            />
                        </div>
                        {/* Date de fin */}
                        <div>
                            <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-[#C5AC7B]">
                                Date de fin
                            </label>

                            <input
                                type="datetime-local"
                                step="3600"
                                name="dateFin"
                                value={form.dateFin}
                                onChange={handleChange}
                                required
                                className="h-12 w-full rounded-lg border border-[#51452E] bg-[#111110] px-4 text-sm text-[#E4D5B5] outline-none transition focus:border-[#B69A65] focus:ring-1 focus:ring-[#B69A65]/30"
                            />
                        </div>
                        {/* Boutons */}
                        <div className="mt-3 flex gap-3">
                            <button
                                type="submit"
                                className="flex-1 rounded-lg bg-[#B69A65] px-3 py-3 text-sm font-semibold text-[#171612] transition duration-300 hover:bg-[#D0B982] hover:shadow-[0_0_18px_rgba(182,154,101,0.15)] active:scale-[0.98]"
                            >
                                Enregistrer
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate("/viewreservation")}
                                className="flex-1 rounded-lg border border-[#51452E] bg-transparent px-3 py-3 text-sm font-semibold text-[#C5AC7B] transition duration-300 hover:border-[#B69A65] hover:bg-[#24221D] hover:text-[#E4D5B5]"
                            >
                                Annuler
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default UpdateReservation;