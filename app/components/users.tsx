export interface UserCardProps{
    user: {
        id: string;
        data: {
            Birthdate: string;
            Email: string;
            FirstName: string;
            LastName: string;
            MiddleName: string;
            Gender: string;
            Sex: string;
            Pronouns: string;
        }
    }
}


export default function UserCard({user}: UserCardProps) {
    return(
        <div className="my-px" style={{marginTop: '20px', marginBottom: '20px'}}>
            <h1>User ID: {user.id}</h1>
            <h2>{user.data.LastName}, {user.data.FirstName} {user.data.MiddleName}</h2>
        </div>
    )
}