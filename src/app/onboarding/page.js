'use client'
import {supabase} from "../lib/supabaseClient.js"
import FormInput from "../custom_components/FormInput.js";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

export default function onboard(){
    const router = useRouter();
    const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const res = await fetch('api/get_user_id');
        const data = await res.json();
        setUserId(data.userId);
        // console.log("User ID:", data.userId);
      } catch (error) {
        console.error("Failed to fetch user ID:", error);
      }
    };

    fetchUserId();
  }, []);

    const handleNewAcc = async(e) =>{
        e.preventDefault();
        const formData = new FormData(e.target);
        const name = formData.get("Name");
        const cap = parseInt(formData.get("Serving Capacity"));
        const n = formData.get("Mobile Number");
        const type = formData.get("userType");
        const ad = formData.get("Address");
       

        
        // console.log({userId});
        const obj = {userId};
        const id = obj.userId;
        
        // Geocode the address before storing
        let latitude = null;
        let longitude = null;
        
        if (ad) {
            try {
                const geocodeRes = await fetch('/api/geocode', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ address: ad }),
                });
                const geocodeData = await geocodeRes.json();
                if (geocodeData.success) {
                    latitude = geocodeData.latitude;
                    longitude = geocodeData.longitude;
                } else {
                    console.warn('Geocoding failed for address:', geocodeData.error);
                }
            } catch (error) {
                console.error('Error geocoding address:', error);
            }
        }
        
         const { error } = await supabase.from("user_profiles").insert([
              {
                user_id : id,
                name : name,
                address : ad,
                phone : n,
                serving_cap : cap,
                account_type : type,
                latitude : latitude,
                longitude : longitude
              },
            ]);
        
            if (error) {
              console.log(error.message)
            }
        
        router.push('/dashboard');
    }

    
    return(
        <div className="w-screen h-screen flex justify-center items-center">
            <div className="bg-white w-120 h-150 px-10 py-10 shadow-2xl flex flex-col gap-7">
                <h1 className="text-3xl text-center">Welcome! Let's complete setting up your profile</h1>
                <form onSubmit={handleNewAcc}>
                    <FormInput name="Name" type="text" ></FormInput>
                    <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Account Type
                        </label>
                        <select
                            
                            name="userType"
                            className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            defaultValue="def"
                        >
                            <option value="def" disabled >Select your role</option>
                            <option value="donor">Donor</option>
                            <option value="receiver">Receiver</option>
                        </select>
                    </div>
                    <FormInput name="Serving Capacity" type="text" placeholder="No.of people" ></FormInput>
                    <FormInput name="Mobile Number" type="text" ></FormInput>
                    <FormInput name="Address" type="text" ></FormInput>
                    <button size="50" name="submit"  className="bg-blue-500 w-full text-white rounded text-lg" >Submit</button>
                </form>
            </div>
        </div>
        
    );
}