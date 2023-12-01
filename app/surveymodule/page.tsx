import { getSurveyModules } from '@/actions/surveymodule'

export default async function surveyModule() {
    const surveyModules = await getSurveyModules(); // Get the list of survey modules

    return (
        <div>
            <h1>Survey Module</h1>
            <ul>
                {surveyModules.map((surveyModule) => (
                    <li key={surveyModule.id}>
                        ClientID: {surveyModule.data.ClientID} <br />
                        IsAnonymous: {surveyModule.data.IsAnonymous ? 'Yes' : 'No'} <br />
                    </li>
                ))}
            </ul>
        </div>
    );
}