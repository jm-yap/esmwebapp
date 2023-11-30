import { getAdditionalUserInfo } from '@/actions/clients'

interface UserPageProps {
  params: {
    clientID: string;
  };
}

export default async function ClientPage({ params }: UserPageProps) {
  const client = await getAdditionalUserInfo(params.clientID);
  return (
    <div>
      <h1 className="mt-5">{client?.LastName}, {client?.FirstName} {client?.MiddleName}</h1>
    </div>
  );
}

