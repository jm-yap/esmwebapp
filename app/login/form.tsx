"use client";
import { FormEvent, useState } from "react";
import { signIn } from 'next-auth/react'
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default function Form() {
    const { data: session } = useSession();
    if (session) {
        redirect('/dashboard');
    }

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const response = await signIn('credentials', {
            email: email,
            password: password,
            redirect: false,
        });

        console.log("this is the error");
        console.log(response);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 mx-auto max-w-md mt-10">
            <h1>Login</h1>
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
            <button className='border border-black rounded-md' type="submit">Login</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <Link className='text-sky-500' href="/register">Dont have an account? Register here</Link>
        </form>
    );
}