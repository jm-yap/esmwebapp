"use client"

import React, { useState, useEffect } from 'react';
import {
  collection,
  getDoc,
  QuerySnapshot,
  query,
  onSnapshot,
  doc,
  where,
} from 'firebase/firestore';
import {db} from '../../../../firebase';
// import { getResponses } from '@/actions/surveyresponse';
// import ResponseCard from "@/app/components/responses";
import { useRouter } from 'next/router'


// import from components and actions. 
import { getUsers } from '@/actions/users';
import UserCard from "@/app/components/users";

interface UserListPageProps {
    params: {
      accessKey: string;
    };
}
// @/app/surveymodule/[accessKey]/ModuleUsers
export default function UserList({ params }: UserListPageProps) {
    const [userList, setUserList] = useState([]);

    useEffect(() => {

        const fetchUserList = () => {
            getUsers(params.accessKey).then(
                (userList: any) => {
                    setUserList(userList); 
                }
            );
            
        }
        fetchUserList();
    }, []); 

    return (
        <div>
            <h1>The Users for Survey Module {params.accessKey}</h1>
            {userList.map((user: any) => (
                <UserCard key = {user.id} user = {user}/>
            ))}
        </div>
    );
   
}