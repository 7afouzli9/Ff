import { Authenticated, Unauthenticated } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Game } from "./Game";
import { Toaster } from "./components/ui/toaster";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm p-4 flex justify-between items-center border-b">
        <h2 className="text-xl font-semibold accent-text">Ba3ts</h2>
        <SignOutButton />
      </header>
      <main className="flex-1">
        <Authenticated>
          <Game />
        </Authenticated>
        <Unauthenticated>
          <div className="flex items-center justify-center h-full">
            <div className="w-full max-w-md p-8">
              <div className="text-center mb-8">
                <h1 className="text-5xl font-bold accent-text mb-4">Ba3ts</h1>
                <p className="text-xl text-slate-600">Sign in to play</p>
              </div>
              <SignInForm />
            </div>
          </div>
        </Unauthenticated>
      </main>
      <Toaster />
    </div>
  );
}
