import axios from "axios";
import { useEffect, useState } from "react";

export function useRooms(){
    const [content, setcontent] = useState([]);
    function getcontents(){
        axios.get('http://localhost:3001/rooms',{ 
            headers: { 
                'Authorization':localStorage.getItem('token')
            }
        }).then((response)=>{
            setcontent(response.data.rooms);
        })
    }

    useEffect(() => {
        getcontents()
        let interval = setInterval(() => {
            getcontents()
        }, 10 * 1000)

        return () => {
            clearInterval(interval);
        }
    }, [])

    return {content, getcontents};
}