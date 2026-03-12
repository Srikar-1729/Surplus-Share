'use client'
import { useState } from "react";
import FormInput from "../../custom_components/FormInput";
import { useRouter } from 'next/navigation'
import { signIn } from "next-auth/react";

function Login() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        const email = e.target.email.value;
        const password = e.target.password.value;
      
        try {
            const result = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (result.error) {
                setError("Invalid email or password");
                console.error(result.error);
            } else {
                router.push("/dashboard");
                router.refresh(); // Refresh to update auth state throughout the app
            }
        } catch (err) {
            setError("An unexpected error occurred");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen ">
            <div className="bg-white w-120 h-80 px-10 py-5 shadow-2xl " >
                <p className="text-4xl text-center mb-3">Login</p>
                <form onSubmit={handleLogin}>
                   <FormInput name="email" col="email" type="text" ></FormInput>
                   <FormInput name="password" col="password" type="password" ></FormInput>
                    <button size="50" name="submit" className="bg-blue-500 w-full text-white rounded text-lg" >{isLoading ? "Logging in..." : "Login"}</button>
                     
                </form>
            </div>
        </div>
    );
}

export default Login;