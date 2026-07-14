import { getBackups } from "./actions";
import { BackupManagerClient } from "./BackupManagerClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function BackupPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  const initialBackups = await getBackups();

  return <BackupManagerClient initialBackups={initialBackups} />;
}
