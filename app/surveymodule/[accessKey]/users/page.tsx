"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
// import from components and actions.
import { getUsers } from "@/actions/users";
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
      getUsers(params.accessKey).then((userList: any) => {
        setUserList(userList);
      });
    };
    fetchUserList();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-md flex flex-col items-center space-x-4">
      <h1 className="text-xl font-bold text-purple-600 text-center">
        The Users for Survey Module {params.accessKey}
      </h1>
      <Link
        href={`/surveymodule/${params.accessKey}`}
        className="mt-4 inline-block px-6 py-2 text-xs font-medium leading-6 text-center text-white uppercase transition bg-purple-500 rounded shadow ripple hover:shadow-lg hover:bg-purple-600 focus:outline-none"
      >
        Back to Survey Module
      </Link>

      {userList.map((user: any) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
