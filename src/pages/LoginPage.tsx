import {ThemeProvider} from "@/components/theme-provider.tsx";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {login, register} from "@/services/authService.ts";
import tokenService from "@/services/tokenService.ts";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await register(name, email, username, phoneNumber, password);

      if (!response) {
        throw new Error("Login failed, response is null");
      }

      const {accessToken, refreshToken, id} = response;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("id", id);

      navigate("/project")
    } catch (err: unknown) {
      const errorMessage = (err as Error).message || "Something went wrong. Please try again.";
      console.error("Register error:", errorMessage);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await login(loginUsername, loginPassword);

      if (!response) {
        setLoginStatus("Wrong username or password");
        throw new Error("Login failed, response is null");
      }

      const {accessToken, refreshToken, id} = response;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("id", id);

      navigate("/home")
    } catch (err: unknown) {
      setLoginStatus("Wrong username or password");
      const errorMessage = (err as Error).message || "Something went wrong. Please try again.";
      console.error("Login error:", errorMessage);
    }
  };

  useEffect(() => {
    if (tokenService.accessToken) {
      navigate("/home")
    }
  }, [tokenService.accessToken])

  return (
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="flex min-h-svh w-full justify-center items-start p-1">
          <div className="w-full max-w-sm">
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="register">Register</TabsTrigger>
                <TabsTrigger value="login">Login</TabsTrigger>
              </TabsList>
              <TabsContent value="register">
                <Card>
                  <CardHeader className="flex items-center justify-center">
                    <CardTitle>Register</CardTitle>
                    <CardDescription>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
                      <Input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          id="name"
                          placeholder="Ex: Nguyen Trung Dung"
                      />
                      <span className="text-red-500 text-[12px]">
                        {name === "" ? "Name is required" : "\u00A0"}
                      </span>
                    </div>
                    <div>
                      <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                      <Input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          id="email"
                          placeholder="Ex: dungdeptrai@gmail.com"
                      />
                      <span className="text-red-500 text-[12px]">
                        {
                          email === ""
                              ?
                              "Email is required"
                              :
                              !/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email)
                                  ?
                                  "Invalid email"
                                  :
                                  "\u00A0"
                        }
                      </span>
                    </div>
                    <div>
                      <Label htmlFor="username">Username <span className="text-red-500">*</span></Label>
                      <Input
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          id="username"
                          placeholder="Ex: ntdung"
                      />
                      <span className="text-red-500 text-[12px]">
                        {
                          username === ""
                              ?
                              "Username is required"
                              :
                              !(username.length >= 4)
                                  ?
                                  "Username must be at least 4 characters"
                                  :
                                  "\u00A0"
                        }
                      </span>
                    </div>
                    <div>
                      <Label htmlFor="phoneNumber">Phone number <span className="text-red-500">*</span></Label>
                      <Input
                          type="number"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          id="phoneNumber"
                          placeholder="Ex: 09874563xx"
                      />
                      <span className="text-red-500 text-[12px]">
                        {
                          phoneNumber === ""
                              ?
                              "Phone number is required"
                              :
                              phoneNumber.length !== 10
                                  ?
                                  "Invalid phone number"
                                  :
                                  "\u00A0"
                        }
                      </span>
                    </div>
                    <div>
                      <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                      <Input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          id="password"
                          placeholder="Ex: Dungdt1234#"
                      />
                      <span className="text-red-500 text-[12px]">
                        {
                          password === ""
                              ?
                              "Password is required"
                              :
                              !/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/.test(password)
                                  ?
                                  "Password must include uppercase letters, numbers, special characters and be at least 6 characters long"
                                  :
                                  "\u00A0"
                        }
                      </span>
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm password <span className="text-red-500">*</span> </Label>
                      <Input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          id="confirmPassword"
                      />
                      <span className="text-red-500 text-[12px]">
                        {
                          password !== confirmPassword
                              ?
                              "Confirm password does not match password"
                              :
                              "\u00A0"
                        }
                      </span>
                    </div>
                  </CardContent>
                  {
                    name !== "" &&
                    email !== "" && /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email) &&
                    username !== "" && username.length >= 4 &&
                    phoneNumber.length === 10 &&
                    password !== "" && /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/.test(password) &&
                    password === confirmPassword
                        ?
                        <CardFooter className="flex justify-center pb-2 pt-1">
                          <Button onClick={handleRegister}>Register</Button>
                        </CardFooter>
                        :
                        <CardFooter className="flex justify-center pb-2 pt-1">
                          <Button className="opacity-50 hover:bg-white cursor-auto" onClick={handleRegister}>Register</Button>
                        </CardFooter>
                  }
                </Card>
              </TabsContent>
              <TabsContent value="login">
                <Card>
                  <CardHeader className="flex items-center justify-center">
                    <CardTitle>Login</CardTitle>
                    <CardDescription>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="pb-4">
                      <Label htmlFor="username">Username</Label>
                      <Input
                          value={loginUsername}
                          onChange={(e) => setLoginUsername(e.target.value)}
                          id="username"
                          placeholder="Ex: ntdung"
                      />
                    </div>
                    <div className="pb-4">
                      <Label htmlFor="password">Password</Label>
                      <Input
                          type="password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="Ex: Dungdt1234#"
                      />
                    </div>
                    <span className="text-red-500 text-[12px]">
                        {loginStatus}
                    </span>
                  </CardContent>
                  {
                    <CardFooter className="flex justify-center py-4">
                      <Button onClick={handleLogin}>Login</Button>
                    </CardFooter>
                  }
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </ThemeProvider>
  )
}