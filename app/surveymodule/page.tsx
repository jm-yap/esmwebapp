"use client";
import React, { useState, useEffect } from "react";
import {
  getSurveyModules,
  countSurveys,
  addSurveyModule,
  deleteSurveyModule
} from "@/actions/surveymodule";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function SurveyModule() {
  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  const builderEmail = session.data?.user?.email;
  const [surveyModules, setSurveyModules] = useState([]); // Get the list of survey modules
  const [surveyCount, setSurveyCount] = useState<Record<string, number>>({});
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (builderEmail) {
        try {
          const modules = await getSurveyModules();
          setSurveyModules(modules);
        } catch (error: any) {
          console.error("Error fetching survey modules:", error.message);
        }
      }
    };

    fetchData();
  }, [session]);

  useEffect(() => {
    const fetchSurveyCounts = async () => {
      const counts = await Promise.all(
        surveyModules.map(async (surveyModule) => {
          const count = await countSurveys(surveyModule.id);
          return { id: surveyModule.id, count };
        })
      );
  
      const countMap = counts.reduce((map, { id, count }) => {
        map[id] = count;
        return map;
      }, {});
  
      setSurveyCount(countMap);
    };
  
    fetchSurveyCounts();
  }, [surveyModules]);
  
  const handleCheckboxChange = (e: any) => {
    setIsAnonymous(e.target.checked);
  };

  const handleAddSurveyModule = async (e: any) => {
    e.preventDefault();
    try {
      const title = e.target.elements.title.value;

      await addSurveyModule(builderEmail, title, 0, isAnonymous);
      const updatedModules = await getSurveyModules();
      setSurveyModules(updatedModules);
    } catch (error: any) {
      console.error("Error adding survey module:", error.message);
    }
    e.target.elements.title.value = "";
  };

  const handleDeleteSurveyModule = async (surveyModuleID: string) => {
    try {
      await deleteSurveyModule(surveyModuleID);
      const updatedModules = await getSurveyModules();
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
            data: { BuilderID: string; Title: string; IsAnonymous: boolean };
          }) => (
            <div
              className="border border-black rounded-md p-4"
              key={surveyModule.id}
            >
              <div>
                <strong>Access Code:</strong> {surveyModule.id}
              </div>
              <div>
                <strong>Title:</strong> {surveyModule.data.Title}
              </div>
              <div>
                <strong>Builder ID:</strong> {surveyModule.data.BuilderID}
              </div>
              <div>
                <strong>Surveys:</strong> {surveyCount ? surveyCount[surveyModule.id] : 'Loading...'}
              </div>
              <div>
                <strong>Is Anonymous:</strong>{" "}
                {surveyModule.data.IsAnonymous ? "Yes" : "No"}
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
    <form onSubmit={handleAddSurveyModule} className="border border-black rounded-md p-4 mt-8">
      <div>
        <strong>Title:</strong>
        <input
          type="text"
          name="title"
          placeholder="Title"
          className="ml-2"
        />
      </div>
      <div className="mt-4">
        <strong>Is Anonymous:</strong>
        <label className="ml-4">
          <input
            type="checkbox"
            onChange={handleCheckboxChange}
            className="mr-2"
          />
          Yes
        </label>
      </div>
      <button
        type="submit"
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
      >
        Create Survey Module
      </button>
    </form>
  </div>
  );
}