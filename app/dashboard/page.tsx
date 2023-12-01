import React from 'react';
import Link from 'next/link';

export default function dashboard() {
    return (
        <div>
            <h1>Dashboard</h1>
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