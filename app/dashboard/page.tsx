'use client';
import { signOut, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { auth } from "../../firebase";

export default function Home() {
    const session = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/login');
        },
    });


    
    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome {session?.data?.user?.email} with uid: {auth.currentUser?.uid}</p>
            <button onClick={() => signOut()}>Sign out</button>
        </div>
    );
}