import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../Custom/Api_url";

function Bankhome(){
    const[bankuser,setbanker]=useState([]);
    useEffect(()=>{
        axios.get(`${API_URL}/bank/getbankdetails`)
        .then(res=>setbanker(res.data))
        .catch(error=>console.log(error));
    })
    return(
        <div>
            <h1>Bank Home</h1>
            {bankuser.map((item)=><h1>fdfd{item.Bank_Name}</h1>)}
        </div>
    )
}
export default Bankhome;