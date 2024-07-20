import styles from "@/app/surveymodule/[accessKey]/styles.module.css";

export interface NewSurveyProps {
  survey: {
    AccessCode: string;
    BuilderID: string;
    Title: string;
    Description: string;
    StartDate: Date;
    EndDate: Date;
    Sessions: number;
    Interval: number;
    TotalQuestions: number;
    QuestionOrder: string[];
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
      StartDate: {
        seconds: number;
        nanoseconds: number;
      };
      EndDate: {
        seconds: number;
        nanoseconds: number;
      };
      Sessions: number;
      Interval: number;
      TotalQuestions: number;
    };
  };
}

export default function SurveyCard({ survey }: SurveyCardProps) {
  return (
    <div className={styles.SurveyContainer}>
      {/* <h1>Access Code: {survey.data.AccessCode}</h1> */}
      {/* <h1>Survey ID: {survey.id}</h1> */}
      <h1 className={styles.SurveyTitle}>{survey.data.Title}</h1>
      <h1 className={styles.SurveyDescription}>{survey.data.Description}</h1>
      <h1 className={styles.BuilderInfo}>
        Prepared by: {survey.data.BuilderID}
      </h1>
      {/* <h1>
        Opens on:{" "}
        {new Date(
          new Timestamp(
            survey.data.StartDate.seconds,
            survey.data.StartDate.nanoseconds
          ).toDate()
        ).toDateString()}
      </h1>
      <h1>
        Closes on:{" "}
        {new Date(
          new Timestamp(
            survey.data.EndDate.seconds,
            survey.data.EndDate.nanoseconds
          ).toDate()
        ).toDateString()}
      </h1>
      <h1>Total Questions: {survey.data.TotalQuestions}</h1> */}
    </div>
  );
}
