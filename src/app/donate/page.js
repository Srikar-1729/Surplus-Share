'use client'
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import {supabase} from "../lib/supabaseClient"
import { useForm } from "react-hook-form";
import { useSession } from 'next-auth/react';
import { useState } from "react"
import { useRouter } from 'next/navigation';

export default function Donate(){
    const [isClicked,setClicked] = useState(false);
    const router = new useRouter();
    const { data: session,status } = useSession();
    // console.log(data);
    const { register, handleSubmit, setValue } = useForm();
    const handleClick = ()=>{
        setClicked(true);
        setTimeout(() => setClicked(false), 100);
    }
    const handleDonation = async(d) =>{
        console.log(d);
        if (status === "loading") {
        return <p>Loading...</p>;
        }

        if (!session) {
        return <p>Not logged in</p>;
        }
        
        const { data,error } = await supabase.from("donations").insert([{
            donor_id : session.user.id,
            food_type : d.food_type,
            food_description : d.food_description,
            can_deliver : d.can_deliver==="yes"?true:false,
            expiry : d.expiry,
            quantity : d.quantity,
            location : d.location,
            additional_info : d.additional_info,
            status : "active"
    }]);
           
            if (error) {
            console.log(error.message)
            }
            else{
                router.push("../search")
            }
        
    }
    return(
        <div className="w-full h-full flex justify-center pt-14">
            <form className="h-fit  p-6 bg-white w-1/2 shadow-lg flex flex-col gap-6" onSubmit={handleSubmit(handleDonation)}>
                <h1 className="text-center text-5xl font-semibold">Donate Food</h1>
                {/* <p className="text-3xl font-medium">Details</p> */}
                <div className="flex justify-between">
                    <div>
                        <p className="text-2xl mb-2">Food type</p>
                    <RadioGroup defaultValue="none"  onValueChange={(value) => setValue("food_type", value)}>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Veg" id="option-one" />
                        <Label htmlFor="option-one">Veg</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Non-Veg" id="option-two" />
                        <Label htmlFor="option-two">Non-Veg

                        </Label>
                    </div>
                    </RadioGroup>
                    
                    </div>

                    
                     <div>
                    <p className="text-2xl mb-2">No.of Servings</p>
                    <div className="flex flex-col space-y-2">
                    <Input
                        id="quantity"
                        type="number"
                        min={1}
                        step={1}
                        defaultValue={1}
                        className="w-39"
                        {...register("quantity")}
                    />
                    </div>
                    
                </div>
                <div>
                    <p className="text-2xl mb-2">Can you deliver?</p>
                    <RadioGroup defaultValue="none"  onValueChange={(value) => setValue("can_deliver", value)}>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="option-1" />
                        <Label htmlFor="option-one">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="option-2" />
                        <Label htmlFor="option-two">No
                        </Label>
                    </div>
                    <input type="hidden" {...register("can_deliver")} />

                    </RadioGroup>
                </div>
                </div>
                <div> 
                    <p className="text-2xl mb-2">Food Items</p>
                    <Textarea name="food_items" {...register("food_description")}/>
                </div>
               
                <div>
                    <p className="text-2xl mb-2">Safe To Consume Within</p>
                    <Input
                        id="expiry"
                        type="datetime-local"
                        name="expiry"
                        className="w-fit"
                        {...register("expiry")}
                    />
                </div>
                 <div> 
                    <p className="text-2xl mb-2">Pickup Address</p>
                    <Input id="address" type="text" name="address" {...register("location")}/>
                </div>
                <div> 
                    <p className="text-2xl mb-2">Additional Info (Optional)</p>
                    <Textarea name="add_info" {...register("additional_info")}/>
                </div>
                <div className="flex justify-center">
                    
                <button onClick={handleClick} className={`border-2 border-black text-white rounded bg-green-500 text-2xl px-7 py-2 ${isClicked?'translate-y-1':''}`}>Submit</button>
                </div>
            </form>
        </div>
    );
}