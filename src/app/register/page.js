"use client";

import FormInput from "../custom_components/FormInput";
import Image from "next/image";
import { useId } from 'react';
import { Poppins } from 'next/font/google';
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { useState } from "react";


const poppins = Poppins({
    subsets: ['latin'],
    weight: ['600'],
    variable: '--font-poppins',
  });

  
  
  

function Register(){
    const inputId = useId();
    const router = useRouter();
    const [email,setMail] = useState("");
    const [password,setPassword] = useState("");
    
    const handleChange = (e)=>{
      // e.preventDefault();
      const { name, value } = e.target;
      // console.log(e.target);
      if(name==="Email")
      setMail(value);
      else
      setPassword(value);
    }

    const handleSignup = async (e) => {
    
    e.preventDefault();
    const formData = new FormData(e.target);

    const email = formData.get("Email");
    const password = formData.get("Password");
  
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  
    const data = await res.json();
  
    if (data.success) {
      // auto login after signup
    //   await signIn("credentials", { email, password });
      
     
      router.push('/onboarding');

    } else {
      console.error(data.error);
    }
  };
    return(
        <div className="flex justify-center items-center h-screen ">
            <div className="bg-green-200 w-120 h-160 px-10 py-5 flex-col gap-6 shadow-2xl ">
                <p className={`text-green-900 text-5xl text-center ${poppins.className} m-5`}>Surplus Share</p>
                
                <p className="text-amber-950 text-2xl mb-5">Join our mission to reduce waste and spread kindness — create an account to donate or receive food effortlessly.</p>
                <Image src="/food-donation.png" width="800" height="800" alt="food donation image"></Image>
            </div>
            <div className="bg-white w-120 h-160 px-10 py-5 shadow-2xl">
                <div className="pt-24">
                    <p className="text-4xl text-center mb-3">Register</p>
                    <form className="" onSubmit={handleSignup}>
                    <FormInput name="Email" type="email" value={email} onChange={handleChange}></FormInput>
                    
                    <FormInput name="Password" type="password" value={password} onChange={handleChange}></FormInput>
                        <button size="50" name="submit"  className="bg-blue-500 w-full text-white rounded text-lg" >Create Account</button>
                        
                    </form>
                </div>
                
            </div>
        </div>
    );
}

export default Register;

 
                  