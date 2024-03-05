import { Timestamp } from "firebase/firestore";

export interface NewSurveyProps {
  survey: {
    AccessCode: string;
    BuilderID: string;
    Title: string;
    Description: string;
    SchedType: string;
    LaunchStart: Date;
    LaunchEnd: Date;
    Deadline: Date;
    TotalQuestions: number;
  };
}

export interface SurveyCardProps {
  survey: {
    id: string;
    data: {
      AccessCode: string;
      BuilderID: string;
      Title: string;
      Description: string;
      SchedType: string;
      LaunchStart: {
        seconds: number;
        nanoseconds: number;
      };
      LaunchEnd: {
        seconds: number;
        nanoseconds: number;
      };
      Deadline: {
        seconds: number;
        nanoseconds: number;
      };
      TotalQuestions: number;
    };
  };
}

export default function SurveyCard({ survey }: SurveyCardProps) {
  return (
    <div className="survey">
      <h1>Access Code: {survey.data.AccessCode}</h1>
      <h1>Survey ID: {survey.id}</h1>
      <h1>Client ID: {survey.data.BuilderID}</h1>
      <h1>Title: {survey.data.Title}</h1>
      <h1>Description: {survey.data.Description}</h1>
      <h1>
        Access from:{" "}
        {new Date(
          new Timestamp(
            survey.data.LaunchStart.seconds,
            survey.data.LaunchStart.nanoseconds
          ).toDate()
        ).toDateString()}
      </h1>
      <h1>
        Access to:{" "}
        {new Date(
          new Timestamp(
            survey.data.LaunchEnd.seconds,
            survey.data.LaunchEnd.nanoseconds
          ).toDate()
        ).toDateString()}
      </h1>
      <h1>
        Deadline:{" "}
        {new Date(
          new Timestamp(
            survey.data.Deadline.seconds,
            survey.data.Deadline.nanoseconds
          ).toDate()
        ).toDateString()}
      </h1>
      <h1>Total Questions: {survey.data.TotalQuestions}</h1>
    </div>
  );
}
