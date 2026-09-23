import { createContext } from "react";
import type { User } from "./UserContext";
import type { Room } from "./RoomContext";

export type Reservation = {
    id: number;
    roomId: number;
    dateDebut: string;
    dateFin: string;
    userId: number;
    user: User;
    room: Room;
}


export interface ReservationContextType extends Reservation {
    getReservation: (id: number) => void;
    postReservation: (reservation: Reservation) => void;
    putReservation: (id: number, reservation: Reservation) => void;
    deleteReservation: (id: number) => void;
    getReservationList: () => void;
    reservationList: Reservation[];
}

export const ReservationContext = createContext<ReservationContextType>(
    {} as ReservationContextType
);