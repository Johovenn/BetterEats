import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return <SignIn afterSignOutUrl={'/'} signUpUrl="/sign-up"/>;
}