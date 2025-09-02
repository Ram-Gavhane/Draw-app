import { Collaborate } from "../components/Collaborate";
import RoomCard from "../components/RoomCard";

export default function Dashboard(){


    return <div className="w-screen h-screen font-mono">
        <div className="text-3xl pt-9 pl-7">
            Welcome !
        </div>
        <div className="flex">
            <RoomCard />
            <Collaborate />
        </div>
        
    </div>
}