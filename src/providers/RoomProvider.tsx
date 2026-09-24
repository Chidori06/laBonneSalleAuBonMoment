import { useState } from "react";
import { RoomContext } from "../context/RoomContext";
import type { Room } from "../context/RoomContext";

function RoomProvider({ children }: { children?: React.ReactNode }) {

    const [room, setRoom] = useState<Room>({} as Room);
    const [roomList, setRoomList] = useState<Room[]>([]);
    const url = 'http://localhost:3000/api/rooms';

    async function getRoom(id: string) {
        const res = await fetch(url + "/" + id);
        const data = await res.json();
        setRoom(data);
    }

    async function postRoom(room: Room) {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(room)
        });
        const data = await res.json()
    }

    async function putRoom(id: string, room: Room) {
        const res = await fetch((url + "/" + id), {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(room),
        });

        if (!res.ok) {
            throw new Error("Erreur lors de la modification de la salle");
        }
        const data = await res.json();
        await getRoomList();
        return data;
    }

    async function deleteRoom(id: string) {
        const res = await fetch((url + "/" + id), {
            method: "DELETE",
        });
        if (!res.ok) {
            throw new Error("Impossible de supprimer cette salle car elle possède des réservations.");
        }
        await getRoomList();
    }

    async function getRoomList() {
        const res = await fetch(url);
        const data = await res.json();
        setRoomList(data);
    }

    return (
        <RoomContext.Provider value={{ room, getRoom, postRoom, putRoom, deleteRoom, getRoomList, roomList, ...room }}>
            {children}
        </RoomContext.Provider>
    );
}
export default RoomProvider;