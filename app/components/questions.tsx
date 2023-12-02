export interface QuestionCardProps {
  question: {
    id: string;
    accessKey: string;
    data: {
      question: string;
      required: boolean;
      surveyID: string;
      type: string;
    };
  };
}

export default function QuestionCard({ question }: QuestionCardProps) {
  const requirement = question.data.required ? "True" : "False";

  return (
    <div className="question">
      <h1>Question ID: {question.id}</h1>
      <h1>Question: {question.data.question}</h1>
      <h2>Required: {requirement}</h2>
      <h2>Type: {question.data.type}</h2>
      <h3>Survey ID: {question.data.surveyID}</h3>
      <h3>Access Key: {question.accessKey}</h3>
    </div>
  );
}
