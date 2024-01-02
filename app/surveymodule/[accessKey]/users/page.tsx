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

  if (userList.length === 0) {
    return (
      <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-md flex flex-col items-center space-x-4">
        <h1 className="text-xl font-bold text-blue-600 text-center mb-4">
          The Users for Survey Module {params.accessKey}
        </h1>
        <Link
          href={`/surveymodule/${params.accessKey}`}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-2 rounded p-4 mb-4"
        >
          Back to Survey Module
        </Link>
        <p className="text-xl font-bold text-black-200 text-center mb-4">
          Nothing to see here yet!
        </p>
      </div>
    );
  } else {
    return (
      <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-md flex flex-col items-center space-x-4">
        <h1 className="text-xl font-bold text-blue-600 text-center mb-4">
          The Users for Survey Module {params.accessKey}
        </h1>
        <Link
          href={`/surveymodule/${params.accessKey}`}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-2 rounded p-4 mb-4"
        >
          Back to Survey Module
        </Link>

        {userList.map((user: any) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    );
  }
}
