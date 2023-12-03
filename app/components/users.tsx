export interface UserCardProps{
    user: {
        id: string;
        data: {
            Email: string;
            Pronouns: string;      
            Gender: string;
            Sex: string;      
            FirstName: string;
            MiddleName: string;
            LastName: string;
            // Birthdate: any;         
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