import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-4 bg-[var(--error)]/10 rounded-full">
            <ShieldAlert className="w-16 h-16 text-[var(--error)]" />
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-glow">403</h1>
        <h2 className="text-2xl font-semibold">Access Denied</h2>
        <p className="text-[var(--text-secondary)]">
          You do not have the required permissions to access this area. If you believe this is an error, please contact the administrator.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild variant="default">
            <Link href="/">Return Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/login">Switch Account</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
