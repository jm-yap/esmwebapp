export interface QuestionCardProps {
  Question: {
    id: string;
    AccessCode: string;
    data: {
      Question: string;
      Required: boolean;
      surveyID: string;
      Type: string;
    };
  };
}

export default function QuestionCard({ Question }: QuestionCardProps) {
  const requirement = Question.data.Required ? "True" : "False";

  return (
    <div className="Question">
      <h1>Question ID: {Question.id}</h1>
      <h1>Question: {Question.data.Question}</h1>
      <h2>Required: {requirement}</h2>
      <h2>Type: {Question.data.Type}</h2>
      <h3>Survey ID: {Question.data.surveyID}</h3>
      <h3>Access Key: {Question.AccessCode}</h3>
    </div>
  );
}
