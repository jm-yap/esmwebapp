export interface ResponseCardProps {
    response: {
      id: string;
      data: {
        SurveyID: string;
        AccessCode: string;
        Timestamp: string;
        UserID: string;
      }
      list: any[];
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
        }
    };
}

function PerResponse({perresponse}: PerResponseProps) {
    console.log(perresponse);
    return (
        <div className = "perresponse">
            <h1>Question ID: {perresponse.data.QuestionID}</h1>
            <h1>Response: {perresponse.data.Response}</h1>
        </div>
    
    );
}

export default function ResponseCard({response}: ResponseCardProps) {
    return (
        <div className = "response">
            <h1>Response ID: {response.id} by User {response.data.UserID}</h1>
            {response.list.map((perResponse: any) => (
                <PerResponse key={perResponse.id} perresponse = {perResponse}/>             
                
            ))};

        </div>
    ); 
}

// return {
//     responseID: resp.id,
//     data: resp.data,
//     list: list,
// };
// }));
// return oneResponse;
// }

// async function getResponse(accessKey: string, responseID: string): Promise<any> {
// const response = collection(
// db, 
// `ResearchModule/${accessKey}/SurveyData/${responseID}/SurveyResponses`
// );
// const docSnapshot = await getDocs(response);
// const userResponsesArray = docSnapshot.docs.map((doc) => {
// return {
//     surveyresponsesDocID: doc.id, // docID
//     data: doc.data(), //hopefully, qID, response, rID
// }
// });
// return userResponsesArray;
// }