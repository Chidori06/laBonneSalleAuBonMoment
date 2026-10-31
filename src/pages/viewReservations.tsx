import { useContext, useEffect, useState } from "react";
import { ReservationContext } from "../context/ReservationContext";
import { UserContext } from "../context/UserContext";
import type { Reservation } from "../context/ReservationContext";
import ReservationCard from "../composants/ReservationCard";
import { Link } from "react-router";


function ViewReservation() {
    const { user } = useContext(UserContext);
    const { getReservation, postReservation, putReservation, deleteReservation, getReservationList, reservationList, ...reservation } = useContext(ReservationContext);
    useEffect(() => { getReservationList() }, []);
    const [userReservationList, setUserReservationList] = useState<Reservation[]>([]);
    useEffect(() => {
        if (!user) {
            return;
        }

        const userReservations = reservationList.filter(
            (res) => Number(res.userId) === Number(user.id)
        );

        setUserReservationList(userReservations);
    }, [reservationList, user]);


    return (
        <>
            <div className="min-h-screen bg-[#111110] px-5 py-10">
                {/* Navigation */}
                <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-4">
                    <Link to={`/dashboard/${user.role.label}`}>
                        <button className="rounded-lg border border-[#39362E] bg-[#1B1B19] px-5 py-2.5 text-sm font-medium text-[#C5AC7B] transition duration-300 hover:border-[#B69A65] hover:bg-[#24221D]">
                            ← Retour
                        </button>
                    </Link>
                    <Link to="/createreservation">
                        <button className="rounded-lg bg-[#B69A65] px-5 py-2.5 text-sm font-semibold text-[#171612] transition duration-300 hover:bg-[#D0B982] hover:shadow-[0_0_18px_rgba(182,154,101,0.2)]">
                            + Réserver une salle
                        </button>
                    </Link>
                </div>
                {/* Titre */}
                <div className="mx-auto mb-10 mt-14 max-w-4xl text-center">
                    <h2 className="text-3xl font-medium tracking-wide text-[#E4D5B5]">
                        Mes réservations
                    </h2>

                    <div className="mx-auto mt-4 h-px w-12 bg-[#B69A65]" />
                </div>
                {/* Liste des réservations */}
                <div className="mx-auto grid w-full max-w-5xl grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {reservationList.length > 0 ? (
                        reservationList.map((reservation) => (
                            <ReservationCard
                                key={reservation.id}
                                reservation={reservation}
                                onChange={getReservationList}
                            />
                        ))
                    ) : (
                        <div className="rounded-lg border border-[#39362E] bg-[#1B1B19] p-8 text-center">
                            <p className="text-sm text-[#C5AC7B]">
                                Aucune réservation pour le moment.
                            </p>
                        </div>
                    )}
                </div>
            </div>

        </>
    );
}

export default ViewReservation
