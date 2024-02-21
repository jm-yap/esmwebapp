export interface QuestionCardProps {
  Question: {
    id: string;
    data: {
      SurveyID: string;
      QuestionText: string;
      QuestionType: string;
      Required: boolean;
    };
  };
}

export default function QuestionCard({ Question }: QuestionCardProps) {
  const requirement = Question.data.Required ? "True" : "False";

  return (
    <div className="Question">
      <h1>Question ID: {Question.id}</h1>
      <h1>Question: {Question.data.QuestionText}</h1>
      <h2>Required: {requirement}</h2>
      <h2>Type: {Question.data.QuestionType}</h2>
      <h3>Survey ID: {Question.data.SurveyID}</h3>
    </div>
  );
}
