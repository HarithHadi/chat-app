import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Login({ setUser }) {
  const [username, setUsername] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    // Save username in localStorage so it persists after refresh
    localStorage.setItem("username", username);
    setUser(username);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-muted">
      <Card className="w-[350px] shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <Input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button type="submit" className="w-full">
              Join Chat
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground text-center">
          No account needed — just pick a name
        </CardFooter>
      </Card>
    </div>
  );
}
