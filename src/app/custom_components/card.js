import Image from "next/image"
import { useState } from "react"
import {ChevronsRight, Star} from "lucide-react"
export default function Card({ donation, distance, rating }){
    const [isClicked,setClicked] = useState(false);
    const handleClick = ()=>{
        setClicked(true);
        setTimeout(() => setClicked(false), 90);
    }
    
    const displayName = donation?.donor_name || "Organization";
    const displayDistance = distance !== undefined ? `${distance.toFixed(1)}km away` : "Distance N/A";
    const displayRating = rating !== undefined ? rating.toFixed(1) : "N/A";
    const foodType = donation?.food_type || "";
    
    return(
        <div className="flex flex-col gap-2 bg-green-100 h-96 m-4 rounded-2xl shadow-lg">
            <Image width={400} height={70} src="/child.jpg" alt="Image of receiver's organization" />
            <div className="px-2">
                <p className="font-bold text-4xl">{displayName}</p>
                <p className="text-lg text-gray-700 mt-1">{foodType}</p>
                {donation?.food_description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{donation.food_description}</p>
                )}
            </div>
            <div className="flex justify-between items-center px-2">
                <div className="flex flex-col gap-1">
                    <p className="text-base font-semibold">{displayDistance}</p>
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <p className="text-base">{displayRating}</p>
                    </div>
                </div>
            </div>
            <div className="flex justify-center px-2 pb-2">
                <button className={`flex gap-2 bg-amber-600 px-5 text-xl py-3 rounded text-white shadow-md border-2 border-black ${isClicked?'translate-y-1':''}`} onClick={handleClick}>View Contact Details<ChevronsRight className="mt-1"/></button>
            </div>
        </div>
    )
}