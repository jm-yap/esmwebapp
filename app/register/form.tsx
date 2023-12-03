"use client";
import { FormEvent, useState } from "react";
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link  from "next/link";

export default function Form() {
    const router = useRouter();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [repassword, setRepassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== repassword) {
            setError("Passwords do not match");
            return;
        } else {
            createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log(userCredential);
                router.push(`/register/${userCredential.user.uid}`);
            })
            .catch((error) => {
                console.log(error);
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 mx-auto max-w-md mt-10">
            <h1 className="align-middle">Register Account</h1>
            <input 
                className="border border-black rounded-md" 
                type="email" 
                placeholder="Type your email" 
                value = {email}
                onChange={(e) => setEmail(e.target.value)}   
            />
            <input 
                className="border border-black rounded-md" 
                type="password" 
                placeholder="Type your password"
                value = {password}
                onChange={(e) => setPassword(e.target.value)} 
            />
            <input 
                className="border border-black rounded-md" 
                type="password" 
                placeholder="Type your password again"
                value = {repassword}
                onChange={(e) => setRepassword(e.target.value)} 
            />
            <button className='border border-black rounded-md' type="submit">Register</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <Link href="/login" className='text-sky-500' >Already have an account? Login here</Link>
        </form>
    );
}