import { LoginButton } from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
    <main className="flex h-full flex-col items-center justify-center bg-blue-600">
      <div className="space-y-6">
        <h1 className="text-4xl font-semibold text-white drop-shadow-md">
          Authentication
        </h1>
        <p className="text-white text-lg font-bold">
            Authentication Service
        </p>
        <div>
          <LoginButton>
            <Button className="bg-white text-blue-600 hover:bg-gray-200">
              Login
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
    </>
  );
}
