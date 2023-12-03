"use client";
import SurveyCard from "@/app/components/surveys";
import { getSurveys, deleteSurvey } from "@/actions/survey";
import { useEffect, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase";

interface SurveyPageProps {
  params: {
    accessKey: string;
  };
}

export default function QuestionsPage({ params }: SurveyPageProps) {
  const [SurveyList, setSurveyList] = useState([]);

  // Adding
  const handleAddSurvey = async (e: any) => {
    const surveyRef = collection(
      db,
      `ResearchModule/${params.accessKey}/Survey/`
    );

    e.preventDefault();

    const AccessCode = params.accessKey;

    const Title = e.target.elements.Title.value;
    const Description = e.target.elements.Description.value;
    const StartDate = new Date(e.target.elements.StartDate.value);
    const EndDate = new Date(e.target.elements.EndDate.value);

    try {
      const docRef = await addDoc(surveyRef, {
        Description,
        EndDate,
        StartDate,
        Title,
      });

      console.log("Survey added with ID:", docRef.id);

      const updatedSurveys = await getSurveys(params.accessKey);
      setSurveyList(updatedSurveys);
    } catch (error) {
      console.error("Error adding  survey:", error);
    }
  };

  // Fetching
  useEffect(() => {
    const fetchData = () => {
      getSurveys(params.accessKey).then((surveys: any) => {
        setSurveyList(surveys);
      });
    };

    fetchData();
  }, []);

  // Deletion
  const handleDeleteSurvey = async (SurveyID: string) => {
    try {
      await deleteSurvey(params.accessKey, SurveyID);
      const updatedSurveys = await getSurveys(params.accessKey);
      setSurveyList(updatedSurveys);
    } catch (error: any) {
      console.error("Error deleting survey question:", error.message);
    }
  };

  // Rendering
  return (
    <div>
      <h1>Add Survey</h1>
      <form onSubmit={handleAddSurvey}>
        <label>
          Title:
          <input type="text" name="Title" />
        </label>
        <br />
        <label>
          Description:
          <input type="text" name="Description" />
        </label>
        <br />
        <label>
          StartDate:
          <input type="date" name="StartDate" />
        </label>
        <br />
        <label>
          EndDate:
          <input type="date" name="EndDate" />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
      <br />

      <h1>Surveys for Access Code: {params.accessKey}</h1>
      <br />
      {SurveyList.map((survey: any) => (
        <div key={survey.id}>
          <SurveyCard survey={survey} />
          <button onClick={() => handleDeleteSurvey(survey.id)}>Delete</button>
          <br />
          <br />
        </div>
      ))}
    </div>
  );
}
