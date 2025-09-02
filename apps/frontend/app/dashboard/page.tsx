import { Collaborate } from "../components/Collaborate";
import { Navbar } from "../components/Navbar";
import RoomCard from "../components/RoomCard";

export default function Dashboard(){


    return <div className="w-screen h-screen font-mono">
        <Navbar/>
        <div className="flex">
            <RoomCard />
            <Collaborate />
        </div>
        
    </div>
}