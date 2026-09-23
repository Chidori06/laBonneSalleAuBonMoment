import { useContext, useState } from "react";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import type { ChangeEvent } from "react";
import { UserContext } from "../context/UserContext";
import { ReservationContext } from "../context/ReservationContext";
import { RoomContext } from "../context/RoomContext";

function UpdateReservation() {

    const context = useContext(UserContext);
    const user = context?.user;
    const navigate = useNavigate();
    const { getReservation, postReservation, deleteReservation, getReservationList, reservationList } = useContext(ReservationContext);
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
            const response = await fetch(`http://localhost:3000/api/reservations/${id}`)
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

    async function putReservation(id: string, donnees: Reservation) {
        const response = await fetch(`http://localhost:3000/api/reservations/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(donnees),
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        return response.json();
    }

    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {

        event.preventDefault();

        if (reservation === null) {
            return;
        }

        if (reservation.userId !== user?.id && user?.roleId !== "1") {
            navigate(`/dashboard/${user?.role?.label}`);
            return;
        }

        const confirmed = window.confirm("Voulez-vous vraiment modifier cette réservation ?");
        if (!confirmed) {
            return;
        }

        const newReservation = {
            roomId: form.roomId,
            dateDebut: form.dateDebut,
            dateFin: form.dateFin,
            userId: reservation.userId
        };

        if (typeof id === "string") {
            await putReservation(id, newReservation);
            window.alert("Modifications effectuées avec succès.");
        }
    }



    return <div>
        <form onSubmit={handleSubmit}>

            <div>
                <label>Salle</label>
                <select name="roomId" value={form.roomId} onChange={e => { setForm({ ...form, roomId: e.target.value }) }} required>
                    {roomList.map((room) => (
                        <option key={room.id} value={room.id}>{room.name} / capacité : {room.capacity}</option>
                    ))}
                </select>

            </div>

            <div>
                <label>Date de début</label>
                <input type="datetime-local" step="3600" name="dateDebut" value={form.dateDebut} onChange={handleChange} required />
            </div>

            <div>
                <label>Date de fin</label>
                <input type="datetime-local" step="3600" name="dateFin" value={form.dateFin} onChange={handleChange} required />
            </div>

            <button type="submit">Modifier</button>
            <button>Annuler</button>

        </form>

    </div>

};

export default UpdateReservation;