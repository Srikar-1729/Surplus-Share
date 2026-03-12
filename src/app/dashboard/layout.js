'use client'
import  Image from "next/image";
import { useState } from "react";
import { House, History,UserRoundPen,Gift,MessagesSquare } from 'lucide-react';
import Profile from "../custom_components/Profile";
import Overview from "../custom_components/Overview";
import DHistory from "../custom_components/DHistory";
import Feedback from "../custom_components/Feedback";
import { useRouter } from 'next/navigation';
// import Navbar from "../components/Navbar";

export default function DashboardLayout({children}){
    const [selected, setSelected] = useState("overview");
    const router = new useRouter();
    let content = <Overview />;
    if (selected === 'profile') content = <Profile />;
    if (selected === 'history') content = <DHistory />;
    if (selected === 'overview') content = <Overview />;
    if (selected === 'feedback') content = <Feedback />;
    const [isClicked,setClicked] = useState(false);
    const handleClick = ()=>{
        setClicked(true);
        setTimeout(() => setClicked(false), 90);
    }

    return(
         <div className="w-full h-full bg-amber pt-14">
            <Image src="/dc.png" width="1800" height="200" alt="Cover photo with the text Every Meal Matters" className="shadow-md border-gray-200"></Image>
            <div className="h-full w-full  grid grid-cols-12 grid-rows-12 gap-6 p-8 ">
                <div className="col-span-3 row-span-5 bg-white rounded shadow-md border-2 border-gray-200 flex flex-col gap-5 p-8">
                    <div className="text-center">Name</div>
                    <ul className="flex flex-col gap-5 items-start  text-2xl ">
                        <li onClick={() => setSelected("overview")} data-select={selected==="overview"}className={" flex gap-2 hover:bg-gray-100 w-full p-2  data-[select=true]:bg-gray-100"}><House className="mt-1"/>Overview</li>
                        <li onClick={() => setSelected("history")} data-select={selected==="history"}className="flex gap-2 hover:bg-gray-100 w-full p-2 data-[select=true]:bg-gray-100"><History className="mt-1"/>Donation History</li>
                        <li onClick={() => setSelected("profile")} className="flex gap-2 hover:bg-gray-100 w-full p-2 data-[select=true]:bg-gray-100" data-select={selected==="profile"}><UserRoundPen className="mt-1"/>Profile</li>
                        
                        <li onClick={() => setSelected("feedback")} className="flex gap-2 hover:bg-gray-100 w-full p-2 data-[select=true]:bg-gray-100" data-select={selected==="feedback"}><MessagesSquare className="mt-1"/>Feedback</li>
                    </ul>
                </div>
                <div className="col-span-9 flex justify-between ">
                    <p className="text-5xl text-blue-500 font-bold ">Donor Dashboard</p>
                    <button className={`flex gap-2 bg-green-500 px-10 text-2xl py-3 rounded text-white shadow-md border-2 border-black ${isClicked?'translate-y-1':''}`} onClick={()=>(handleClick(),router.push("../donate"))}><Gift className="mt-1"/>Donate Now</button>
                </div>
                {content}
               
            </div>
        </div>
    );
}