export interface ResponseCardProps {
  response: {
    responseID: string;
    data: {
      SurveyID: string;
      AccessCode: string;
      Timestamp: string;
      UserID: string;
    };
    list: any[]; //List of all PerResponse na objects. ito yung mga documents na nakapaloob sa SurveyResponse (firebase)
  };
}
// dapat ang data, fields, same ordering and same exact names as with doon sa firebase.
interface PerResponseProps {
  perresponse: {
    id: string;
    data: {
      QuestionID: string;
      Response: string; //i am not doing good
      ResponseID: string;
    };
  };
}

function PerResponse({ perresponse }: PerResponseProps) {
  return (
    <div className="perresponse p-6 max-w-4.5xl mx-auto bg-gray-200 rounded-xl shadow-md flex flex-col items-center space-x-4 mb-2.5">
      <h1 className="text-xl font-bold text-gray-700 text-center">
        Question ID: {perresponse.data.QuestionID}
      </h1>
      <h1 className="text-xl font-bold text-gray-700 text-center">
        Response: {perresponse.data.Response}
      </h1>
    </div>
  );
}

export default function ResponseCard({ response }: ResponseCardProps) {
  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-100 rounded-xl shadow-md flex flex-col items-center space-x-4 mb-4">
      <h1 className="text-xl font-bold text-gray-600 text-center">
        Response ID: {response.responseID} by User {response.data.UserID}
      </h1>

      {response.list.map((perResponse: any) => (
        <PerResponse key={perResponse.id} perresponse={perResponse} />
      ))}
    </div>
  );
}
