import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import React, {useState} from "react";
import {login} from "@/services/authService.ts";
import { useNavigate } from "react-router-dom";

export function LoginForm({
                            className,
                            ...props
                          }: React.ComponentPropsWithoutRef<"div">) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await login(username, password);

      const { accessToken, refreshToken } = response;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      navigate("/project")
    } catch (err: unknown) {
      const errorMessage = (err as Error).message || "Something went wrong. Please try again.";
      console.error("Login error:", errorMessage);
    }
  };

  return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your username below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                      id="username"
                      type="text"
                      placeholder="user123"
                      required
                      onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    {/*<a*/}
                    {/*  href="#"*/}
                    {/*  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"*/}
                    {/*>*/}
                    {/*  Forgot your password?*/}
                    {/*</a>*/}
                  </div>
                  <Input
                      id="password"
                      type="password"
                      required
                      onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
                {/*<Button variant="outline" className="w-full">*/}
                {/*  Login with Google*/}
                {/*</Button>*/}
              </div>
              {/*<div className="mt-4 text-center text-sm">*/}
              {/*  Don&apos;t have an account?{" "}*/}
              {/*  <a href="#" className="underline underline-offset-4">*/}
              {/*    Sign up*/}
              {/*  </a>*/}
              {/*</div>*/}
            </form>
          </CardContent>
        </Card>
      </div>
  )
}
