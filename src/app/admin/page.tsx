import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

import prisma from "@/lib/prisma";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/admin/dashboard");
  }

  const adminCount = await prisma.user.count();
  if (adminCount === 0) {
    redirect("/setup");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[var(--background)]">
      <AdminLoginForm />
    </div>
  );
}
