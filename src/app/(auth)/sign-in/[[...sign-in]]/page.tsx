"use client"

import { SignIn, useUser } from "@clerk/nextjs";

export default function Page() {
  const {user} = useUser()
  const role = user?.publicMetadata?.role

  return <SignIn afterSignOutUrl={'/'} signUpFallbackRedirectUrl={role === 'admin' ? '/admin/dashboard' : '/dashboard'}/>;
}