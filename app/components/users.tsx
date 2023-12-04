export interface UserCardProps {
  user: {
    id: string;
    Email: string;
    Pronouns: string;
    Gender: string;
    Sex: string;
    FirstName: string;
    MiddleName: string;
    LastName: string;
    //PasswordHash: string; // should be removed for security reasons
    //Birthdate: any;
    ContactNumber: string;
  };
}

export default function UserCard({ user }: UserCardProps) {
  return (
    <div className="my-px" style={{ marginTop: "10px", marginBottom: "10px" }}>
      {/* <h1>User ID: {user.id}</h1> */}
      <h2>
        {user.LastName}, {user.FirstName} {user.MiddleName}
      </h2>
    </div>
  );
}
