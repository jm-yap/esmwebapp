"use client";

import { useQuery } from "@tanstack/react-query";
import { getClientAccountByEmail } from "@/actions/clients";

export default function ClientDetails({ email }: { email: string }) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["client", "details"],
    queryFn: async () => {
      return await getClientAccountByEmail(email);
    },
  });

  if (isLoading) {
    return "Loading...";
  }

  // if (error) {
  //   return "An error has occurred: " + error.message;
  // }

  console.log(data);

  return (
    <div>
      <h1>Client Details</h1>
      <p>Client Name: {email}</p>
    </div>
  );
}
