// export interface ResponseCardProps {
//   response: {
//     ResponseID: string;
//     data: {
//       SurveyID: string;
//       AccessCode: string;
//       Timestamp: string;
//       ClientEmail: string;
//     };
//     list: any[]; //List of all PerResponse na objects. ito yung mga documents na nakapaloob sa SurveyResponse (firebase)
//   };
// }
// // // dapat ang data, fields, same ordering and same exact names as with doon sa firebase.
// interface PerResponseProps {
//   perresponse: {
//     id: string;
//     data: {
//       QuestionID: string;
//       Response: string; 
//       ResponseID: string;
//     };
//   };
// }


// function PerResponse({ perresponse }: PerResponseProps) {
//   return (
//     <div className="perresponse border border-gray-200 rounded-md p-4 mb-2.5 shadow">
//       <h1>Question ID: {perresponse.data.QuestionID}</h1>
//       <h1>Response: {perresponse.data.Response}</h1>
//     </div>
//   );
// }

// export default function ResponseCard({ response }: ResponseCardProps) {
//   return (
//     <div className="flex flex-col items-center mt-10 border border-gray-150 p-4">
//       <h1 className="text-xl font-bold mb-8">
//         Response ID: {response.ResponseID} by User {response.data.ClientEmail}
//       </h1>

//       {response.list.map((perResponse: any) => (
//         <PerResponse key={perResponse.id} perresponse={perResponse} />
//       ))}
//     </div>
//   );
// }

// export default function ResponseTable(responseIDList: any[], questionsList: any[]) {
    
//   return (
//     <table className="min-w-full divide-y divide-gray-200">
//         <thead className="bg-gray-50">
//           <tr>
//             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2 border-gray-300">TimeStamp</th>
//             {
//               questionsList.map((questionJSON: any) => {
//                 return (
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2 border-gray-300">
//                     {questionJSON.data.QuestionText}
//                   </th>
//                 )
//               })
//             }
//           </tr>
//         </thead>

//       </table>  
//   )
// }
