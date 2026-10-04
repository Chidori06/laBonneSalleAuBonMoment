import { useState } from "react";
import { ReservationContext } from "../context/ReservationContext";
import type { Reservation, UpdateReservation } from "../context/ReservationContext";


function ReservationProvider({ children }: { children?: React.ReactNode }) {

    const [reservation, setReservation] = useState<Reservation>({} as Reservation);
    const [reservationList, setReservationList] = useState<Reservation[]>([]);
    const url = 'http://localhost:3000/api/reservations';

    async function getReservation(id: number) {
        try {
            const res = await fetch(url + "/" + id, {
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error("Erreur lors de la récupération");
            }
            setReservation(data);
        } catch (error: any) {
            error && console.log("Une erreur est survenue" + error.message);
        }
    }

    async function postReservation(reservation: Reservation) {
        const res = await fetch(url, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reservation),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(
                data?.message || "Erreur lors de la création de la réservation"
            );
        }

        return data;
    }

    async function putReservation(id: number, reservation: UpdateReservation) {

        const res = await fetch(url + "/" + id, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reservation),
        });

        console.log("STATUS :", res.status);

        const data = await res.json();

        console.log("RESPONSE :", data);

        if (!res.ok) {
            throw new Error(
                data?.message || "Erreur lors de la modification"
            );
        }

        return data;
    }

    async function deleteReservation(id: number) {
        try {
            const res = await fetch(url + "/" + id, {
                method: "DELETE",
                credentials: "include",
            });

            if (!res.ok) {
                throw new Error("Erreur lors de la suppression");
            }

            await getReservationList();

        } catch (error: any) {
            console.error(
                "Une erreur est survenue :",
                error.message
            );
        }
    }

    async function getReservationList() {
        try {
            const res = await fetch(url, {
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error("Erreur lors de la récupération");
            }
            setReservationList(data);
        } catch (error: any) {
            error && console.log("Une erreur est survenue" + error.message);
        }
    }

    return (
        <ReservationContext.Provider value={{ getReservation, postReservation, putReservation, deleteReservation, getReservationList, reservationList, ...reservation }}>
            {children}
        </ReservationContext.Provider>
    );
}
export default ReservationProvider;