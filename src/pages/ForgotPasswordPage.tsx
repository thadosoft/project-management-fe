import { ThemeProvider } from "@/components/theme-provider.tsx";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyUsername, resetPassword } from "@/services/authService.ts";

export default function ForgotPasswordPage() {
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUsernameVerified, setIsUsernameVerified] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const navigate = useNavigate();

  const handleVerifyUsername = async () => {
    try {
      const response = await verifyUsername(username);
      if (response?.usernameExists) {
        setIsUsernameVerified(true);
        setStatusMessage("");
      } else {
        setStatusMessage("Username does not exist");
      }
    } catch (err: unknown) {
      setStatusMessage("Something went wrong. Please try again.");
      console.error("Username verification error:", err);
    }
  };

  const handleResetPassword = async () => {
    try {
      await resetPassword(username, newPassword, confirmPassword);
      setStatusMessage("Password reset successfully");
      setTimeout(() => navigate("/"), 2000); // Redirect to login after 2 seconds
    } catch (err: unknown) {
      setStatusMessage("Something went wrong. Please try again.");
      console.error("Password reset error:", err);
    }
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex min-h-svh w-full justify-center items-center p-1">
        <div className="w-full max-w-sm">
          <Card>
            <CardHeader className="flex items-center justify-center">
              <CardTitle>Forgot Password</CardTitle>
              <CardDescription>
                {isUsernameVerified ? "Enter your new password" : "Enter your username to reset your password"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isUsernameVerified ? (
                <div>
                  <Label htmlFor="username">Username <span className="text-red-500">*</span></Label>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    id="username"
                    placeholder="Ex: ntdung"
                  />
                  <span className="text-red-500 text-[12px]">
                    {statusMessage || "\u00A0"}
                  </span>
                </div>
              ) : (
                <>
                  <div>
                    <Label htmlFor="newPassword">New Password <span className="text-red-500">*</span></Label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      id="newPassword"
                      placeholder="Ex: Dungdt1234#"
                    />
                    <span className="text-red-500 text-[12px]">
                      {newPassword === ""
                        ? "Password is required"
                        : !/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/.test(newPassword)
                        ? "Password must include uppercase letters, numbers, special characters and be at least 6 characters long"
                        : "\u00A0"}
                    </span>
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password <span className="text-red-500">*</span></Label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      id="confirmPassword"
                      placeholder="Ex: Dungdt1234#"
                    />
                    <span className="text-red-500 text-[12px]">
                      {confirmPassword === ""
                        ? "Confirm password is required"
                        : newPassword !== confirmPassword
                        ? "Confirm password does not match password"
                        : "\u00A0"}
                    </span>
                  </div>
                  <span className="text-red-500 text-[12px]">
                    {statusMessage || "\u00A0"}
                  </span>
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-center pb-2 pt-1">
              {!isUsernameVerified ? (
                <Button
                  onClick={handleVerifyUsername}
                  disabled={username === ""}
                  className={username === "" ? "opacity-50 hover:bg-white cursor-auto" : ""}
                >
                  Verify Username
                </Button>
              ) : (
                <Button
                  onClick={handleResetPassword}
                  disabled={
                    newPassword === "" ||
                    confirmPassword === "" ||
                    !/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/.test(newPassword) ||
                    newPassword !== confirmPassword
                  }
                  className={
                    newPassword === "" ||
                    confirmPassword === "" ||
                    !/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/.test(newPassword) ||
                    newPassword !== confirmPassword
                      ? "opacity-50 hover:bg-white cursor-auto"
                      : ""
                  }
                >
                  Reset Password
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </ThemeProvider>
  );
}