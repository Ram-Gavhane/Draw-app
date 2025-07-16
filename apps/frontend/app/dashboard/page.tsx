"use client";

import { useEffect } from "react";
import Rooms from "../components/Rooms";
import { useRooms } from "../hooks/useRooms";

export default function Dashboard(){

    const {content, getcontents} = useRooms();
    
    useEffect(() => {
        getcontents();
    }, [])

    return <div className="w-screen h-screen">
        Welcome
        <div className="h-64 w-60 p-4 ml-8 mt-14 text-md rounded-xl shadow shadow-gray-400">
            {content.map(({slug}) => <Rooms 
            slug={slug}
            />)}
        </div>
    </div>
}