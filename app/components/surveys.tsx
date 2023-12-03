import { Timestamp } from "firebase/firestore";

export interface SurveyCardProps {
  survey: {
    id: string;
    AccessCode: string;
    data: {
      ClientID: string;
      Description: string;
      EndDate: {
        seconds: number;
        nanoseconds: number;
      };
      StartDate: {
        seconds: number;
        nanoseconds: number;
      };
      Title: string;
    };
  };
}

export default function SurveyCard({ survey }: SurveyCardProps) {
  return (
    <div className="survey">
      <h1>Access Code: {survey.AccessCode}</h1>
      <h1>Survey ID: {survey.id}</h1>
      <h1>Client ID: {survey.data.ClientID}</h1>
      <h1>Title: {survey.data.Title}</h1>
      <h1>Description: {survey.data.Description}</h1>
      <h1>
        Start Date:{" "}
        {new Date(
          new Timestamp(
            survey.data.StartDate.seconds,
            survey.data.StartDate.nanoseconds
          ).toDate()
        ).toDateString()}
      </h1>
      <h1>
        End Date:{" "}
        {new Date(
          new Timestamp(
            survey.data.EndDate.seconds,
            survey.data.EndDate.nanoseconds
          ).toDate()
        ).toDateString()}
      </h1>
    </div>
  );
}
