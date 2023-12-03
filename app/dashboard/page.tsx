"use client";
import React from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { auth } from "../../firebase";

export default function Dashboard() {
    const session = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/login');
        },
    });

    return (
        <div>
            <h1 className='align-middle'>Dashboard</h1>
            <h1 className='align-middle'>Welcome {session?.data?.user?.email} with uid: {auth.currentUser?.uid}</h1>
            <button onClick={() => signOut()}>Sign out</button>
            <div>
                <Link href="/surveymodule">
                    <button>Go to Survey Module</button>
                </Link>
            </div>
            <div>
                <Link href="/clients">
                    <button>Go to Client Account</button>
                </Link>
            </div> 
        </div>
    );
}