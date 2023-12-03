"use client";
import { FormEvent, useState } from "react";
import { auth } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function Form() {
  const { data: session } = useSession();
  if (session) {
    redirect("/dashboard");
  }
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repassword, setRepassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== repassword) {
      setError("Passwords do not match");
      return;
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          console.log(userCredential);
          signIn("credentials", {
            email: email,
            password: password,
            redirect: false,
          });
          router.push(`/register/${userCredential.user.email}`);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 mx-auto max-w-md mt-10"
    >
      <h1 className="text-2xl font-bold text-center">Register Account</h1>
      <input
        className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="password"
        placeholder="Confirm Password"
        value={repassword}
        onChange={(e) => setRepassword(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
        type="submit"
      >
        Register
      </button>
      {error && <p className="text-red-500">{error}</p>}
      <p className="text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-500">
          Login here
        </Link>
      </p>
    </form>
  );
}
