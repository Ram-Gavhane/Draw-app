import axios from "axios"
import { useEffect } from "react"

export default async function Dashboard(){

    useEffect(()=>{
        axios.get('http://localhost:3001/rooms',{headers: { 'Authorization':localStorage.getItem('token')}})
    },[])

    return <div className="">
        
    </div>
}