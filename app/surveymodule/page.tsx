"use client";
import React, { useState, useEffect } from "react";
import {
  getSurveyModules,
  addSurveyModule,
  deleteSurveyModule,
} from "@/actions/surveymodule";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { auth } from "../../firebase";
import { apiBaseUrl } from "next-auth/client/_utils";
import Link from "next/link";

export default function SurveyModule() {
  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  const [surveyModules, setSurveyModules] = useState([]); // Get the list of survey modules
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const userEmail = session.data?.user?.email;
      if (userEmail) {
        try {
          await getSurveyModules(userEmail);
          const modules = await getSurveyModules(userEmail);
          setSurveyModules(modules);
        } catch (error: any) {
          console.error("Error fetching survey modules:", error.message);
        }
      }
    };

    fetchData();
  }, [session]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
  };

  const handleIsAnonymous = async () => {
    try {
      await addSurveyModule(session.data.user?.email, isChecked);
      const updatedModules = await getSurveyModules(session?.data?.user?.email);
      setSurveyModules(updatedModules);
    } catch (error: any) {
      console.error("Error adding survey module:", error.message);
    }
  };

  const handleDeleteSurveyModule = async (surveyModuleID: string) => {
    try {
      await deleteSurveyModule(surveyModuleID);
      const updatedModules = await getSurveyModules(session?.data?.user?.email);
      setSurveyModules(updatedModules);
    } catch (error: any) {
      console.error("Error deleting survey module:", error.message);
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <Link href="/dashboard">
        <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-4">
          Back
        </button>
      </Link>
      <h1 className="text-4xl font-bold mb-8">Survey Module</h1>
      <div className="grid grid-cols-3 gap-4 mt-5">
        {surveyModules.map(
          (surveyModule: {
            id: string;
            data: { ClientID: string; isAnonymous: boolean };
          }) => (
            <div
              className="border border-black rounded-md p-4"
              key={surveyModule.id}
            >
              <div>
                <strong>Access Code:</strong> {surveyModule.id}
              </div>
              <div>
                <strong>Client ID:</strong> {surveyModule.data.ClientID}
              </div>
              <div>
                <strong>Is Anonymous:</strong>{" "}
                {surveyModule.data.isAnonymous ? "Yes" : "No"}
              </div>
              <Link href={`/surveymodule/${surveyModule.id}`}>
                <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                  View
                </button>
              </Link>
              <button
                className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                onClick={() => handleDeleteSurveyModule(surveyModule.id)}
              >
                Delete
              </button>
            </div>
          )
        )}
      </div>
      <div className="mt-8">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          onClick={handleIsAnonymous}
        >
          Create Survey Module
        </button>
        <label className="ml-4">
          <input
            type="checkbox"
            onChange={handleCheckboxChange}
            className="mr-2"
          />
          Is Anonymous
        </label>
      </div>
    </div>
  );
}
