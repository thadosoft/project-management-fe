import { ThemeProvider } from "@/components/theme-provider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { resetPassword } from "@/services/authService"
import { Eye, EyeOff, CheckCircle2, AlertCircle, User, Lock, KeyRound, ArrowLeft, Shield, Sparkles } from "lucide-react"

export default function ForgotPasswordPage() {
  const [username, setUsername] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [statusMessage, setStatusMessage] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleResetPassword = async () => {
    setIsLoading(true)
    try {
      await resetPassword(username, newPassword, confirmPassword)
      setStatusMessage("Đặt lại mật khẩu thành công!")
      setTimeout(() => navigate("/"), 2000)
    } catch {
      setStatusMessage("Tên đăng nhập không tồn tại")
      console.error("Password reset error:")
    } finally {
      setIsLoading(false)
    }
  }

  const getFieldStatus = (field: string, value: string) => {
    switch (field) {
      case "username":
        return value !== "" ? "valid" : "invalid"
      case "newPassword":
        return value !== "" && /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/.test(value) ? "valid" : "invalid"
      case "confirmPassword":
        return newPassword === value && value !== "" ? "valid" : "invalid"
      default:
        return "invalid"
    }
  }

  const isFormValid =
    username !== "" &&
    newPassword !== "" &&
    confirmPassword !== "" &&
    /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/.test(newPassword) &&
    newPassword === confirmPassword

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-blue-500/5 rounded-full blur-3xl animate-spin-slow pointer-events-none" />

        {/* Back Button */}
        <Button
          onClick={() => navigate("/")}
          variant="ghost"
          size="sm"
          className="absolute top-8 left-8 text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 transition-all duration-300 hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại đăng nhập
        </Button>

        {/* Main Container */}
        <div className="relative w-full max-w-md">
          <Card className="border-0 bg-gradient-to-br from-white/95 to-white/85 dark:from-slate-900/95 dark:to-slate-800/85 backdrop-blur-xl shadow-2xl overflow-hidden">
            {/* Background Image for the card */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
              style={{
                backgroundImage: "url('/images/logo-bg.png')",
              }}
            />

            {/* Header with enhanced styling */}
            <CardHeader className="relative z-10 text-center space-y-4 pb-8 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent border-b border-border/50">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 text-white shadow-lg mx-auto">
                <Shield className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Đặt lại mật khẩu
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Nhập tên đăng nhập và mật khẩu mới để đặt lại
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="relative z-10 p-8 space-y-6">
              {/* Username Field */}
              <div className="space-y-3">
                <Label htmlFor="username" className="text-sm font-semibold flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-500" />
                  Tên đăng nhập
                  <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    id="username"
                    placeholder="Nhập tên đăng nhập"
                    className={`pl-12 pr-12 h-12 bg-background/50 border-2 hover:border-purple-500/30 focus:border-purple-500/50 transition-all duration-300 rounded-xl ${
                      username !== ""
                        ? getFieldStatus("username", username) === "valid"
                          ? "border-emerald-500 focus:border-emerald-500"
                          : "border-red-500 focus:border-red-500"
                        : ""
                    }`}
                  />
                  {username !== "" && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      {getFieldStatus("username", username) === "valid" ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                <span className="text-red-500 text-xs flex items-center gap-1 min-h-[16px]">
                  {username === "" && <AlertCircle className="w-3 h-3" />}
                  {username === "" ? "Tên đăng nhập là bắt buộc" : ""}
                </span>
              </div>

              {/* New Password Field */}
              <div className="space-y-3">
                <Label htmlFor="newPassword" className="text-sm font-semibold flex items-center gap-2">
                  <Lock className="w-4 h-4 text-purple-500" />
                  Mật khẩu mới
                  <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    id="newPassword"
                    placeholder="Nhập mật khẩu mới"
                    className={`pl-12 pr-16 h-12 bg-background/50 border-2 hover:border-purple-500/30 focus:border-purple-500/50 transition-all duration-300 rounded-xl ${
                      newPassword !== ""
                        ? getFieldStatus("newPassword", newPassword) === "valid"
                          ? "border-emerald-500 focus:border-emerald-500"
                          : "border-red-500 focus:border-red-500"
                        : ""
                    }`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {newPassword !== "" && (
                      <div className="pointer-events-none">
                        {getFieldStatus("newPassword", newPassword) === "valid" ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="text-gray-400 hover:text-gray-600 ml-1 z-10 p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <span className="text-red-500 text-xs flex items-start gap-1 min-h-[32px] leading-4">
                  {newPassword === "" ? (
                    <div className="flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      Mật khẩu là bắt buộc
                    </div>
                  ) : !/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/.test(newPassword) ? (
                    <div className="flex items-start gap-1">
                      <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>Mật khẩu phải có chữ hoa, số, ký tự đặc biệt và ít nhất 6 ký tự</span>
                    </div>
                  ) : (
                    ""
                  )}
                </span>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-3">
                <Label htmlFor="confirmPassword" className="text-sm font-semibold flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-purple-500" />
                  Xác nhận mật khẩu
                  <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    id="confirmPassword"
                    placeholder="Xác nhận mật khẩu mới"
                    className={`pl-12 pr-16 h-12 bg-background/50 border-2 hover:border-purple-500/30 focus:border-purple-500/50 transition-all duration-300 rounded-xl ${
                      confirmPassword !== ""
                        ? getFieldStatus("confirmPassword", confirmPassword) === "valid"
                          ? "border-emerald-500 focus:border-emerald-500"
                          : "border-red-500 focus:border-red-500"
                        : ""
                    }`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {confirmPassword !== "" && (
                      <div className="pointer-events-none">
                        {getFieldStatus("confirmPassword", confirmPassword) === "valid" ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-gray-400 hover:text-gray-600 ml-1 z-10 p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <span className="text-red-500 text-xs flex items-center gap-1 min-h-[16px]">
                  {confirmPassword === "" ? (
                    <div className="flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Xác nhận mật khẩu là bắt buộc
                    </div>
                  ) : newPassword !== confirmPassword ? (
                    <div className="flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Xác nhận mật khẩu không khớp
                    </div>
                  ) : (
                    ""
                  )}
                </span>
              </div>

              {/* Status Message */}
              {statusMessage && (
                <div
                  className={`flex items-center gap-2 p-3 rounded-lg ${
                    statusMessage.includes("thành công")
                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                      : "bg-red-500/10 text-red-600 border border-red-500/20"
                  }`}
                >
                  {statusMessage.includes("thành công") ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">{statusMessage}</span>
                </div>
              )}
            </CardContent>

            <CardFooter className="relative z-10 flex justify-center pb-8 pt-2">
              <Button
                onClick={handleResetPassword}
                disabled={!isFormValid || isLoading}
                className={`group relative overflow-hidden min-w-[200px] h-12 px-8 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl ${
                  isFormValid && !isLoading
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white hover:shadow-purple-500/25"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang xử lý...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    Đặt lại mật khẩu
                    <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </ThemeProvider>
  )
}
