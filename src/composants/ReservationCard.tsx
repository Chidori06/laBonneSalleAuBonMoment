import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router";
import type { Reservation } from "../context/ReservationContext";
import { ReservationContext } from "../context/ReservationContext";

interface ReservationCardProps {
    reservation: Reservation;
    onChange: () => void;
}

function ReservationCard({ reservation, onChange }: ReservationCardProps) {
    const navigate = useNavigate();

    const { deleteReservation } = useContext(ReservationContext);

    function handleModifier() {
        navigate(`/reservations/${reservation.id}`);
    }

    function handleSupprimer() {
        deleteReservation(reservation.id);
        onChange();
    }

    function formatDate(date: string) {
        return new Date(date).toLocaleString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }


    return (

        <div className="w-full max-w-sm rounded-xl border border-[#51452E] bg-[#1B1B19] p-5 shadow-lg transition duration-300 hover:border-[#B69A65]/70">

            {/* Informations de réservation */}
            <div className="space-y-3">

                <p className="text-sm text-[#A99B7C]">
                    Salle :
                    <span className="ml-2 font-medium text-[#E4D5B5]">
                        {reservation.room.name}
                    </span>
                </p>

                <p className="text-sm text-[#A99B7C]">
                    Date de début :
                    <span className="ml-2 font-medium text-[#E4D5B5]">
                        {formatDate(reservation.dateDebut)}
                    </span>
                </p>

                <p className="text-sm text-[#A99B7C]">
                    Date de fin :
                    <span className="ml-2 font-medium text-[#E4D5B5]">
                        {formatDate(reservation.dateFin)}
                    </span>
                </p>

            </div>

            {/* Séparateur */}
            <div className="my-4 h-px bg-[#51452E]" />

            {/* Boutons */}
            <div className="flex gap-3">

                <button
                    onClick={handleModifier}
                    className="flex-1 rounded-lg bg-[#B69A65] px-3 py-2.5 text-sm font-semibold text-[#171612] transition duration-300 hover:bg-[#D0B982] hover:shadow-[0_0_12px_rgba(182,154,101,0.15)]"
                >
                    Modifier
                </button>

                <button
                    onClick={handleSupprimer}
                    className="flex-1 rounded-lg border border-[#754B43] bg-transparent px-3 py-2.5 text-sm font-semibold text-[#C98D7E] transition duration-300 hover:border-[#C98D7E] hover:bg-[#291B18]"
                >
                    Supprimer
                </button>

            </div>

        </div>

    );
}

export default ReservationCard;
