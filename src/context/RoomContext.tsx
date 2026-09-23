import { createContext } from "react";
import type { Reservation } from "./ReservationContext";

export type Room = {
    id: string,
    name: string,
    capacity: number,
    reservations: Reservation
}

export interface RoomContextType extends Room {
    getRoom: (id: string) => void;
    postRoom: (room: Room) => void;
    putRoom: (id: string, room: Room) => void;
    deleteRoom: (id: string) => void;
    getRoomList: () => void;
    roomList: Room[];
}

export const RoomContext = createContext<RoomContextType>(
    {} as RoomContextType
);