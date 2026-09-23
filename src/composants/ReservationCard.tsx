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
        <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Salle : <span className="font-medium text-gray-900">{reservation.room.name}</span></p>
            <p className="text-sm text-gray-500">Date de début : <span className="font-medium text-gray-900">{formatDate(reservation.dateDebut)}</span></p>
            <p className="text-sm text-gray-500">Date de fin : <span className="font-medium text-gray-900">{formatDate(reservation.dateFin)}</span></p>

            <div className="mt-4 flex gap-2">
                <button
                    onClick={handleModifier}
                    className="flex-1 rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700"
                >
                    Modifier
                </button>
                <button
                    onClick={handleSupprimer}
                    className="flex-1 rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
                >
                    Supprimer
                </button>
            </div>
        </div>
    );
}

export default ReservationCard;
