"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { isTokenValidate, login, register } from "@/services/authService"
import { getUserById } from "@/services/userService"
import tokenService from "@/services/tokenService"
import { Eye, EyeOff, CheckCircle2, AlertCircle, User, Mail, Phone, Lock, LogIn, UserPlus } from "lucide-react"

export default function LoginPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loginUsername, setLoginUsername] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginStatus, setLoginStatus] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUpMode, setIsSignUpMode] = useState(false)
  const navigate = useNavigate()

  const handleToggleMode = () => {
    setIsSignUpMode(!isSignUpMode)
    setLoginStatus("")
  }

  const handleRegister = async () => {
    setIsLoading(true)
    try {
      const response = await register(name, email, username, phoneNumber, password)
      if (!response) {
        throw new Error("Register failed, response is null")
      }
      const { accessToken, id } = response
      localStorage.setItem("accessToken", accessToken)
      localStorage.setItem("id", id)
      const user = await getUserById(id)
      const role = user?.role || "USER"
      localStorage.setItem("role", role.toUpperCase())
      navigate("/project")
    } catch (err: unknown) {
      const errorMessage = (err as Error).message || "Something went wrong. Please try again."
      console.error("Register error:", errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async () => {
    setIsLoading(true)
    try {
      const response = await login(loginUsername, loginPassword)
      if (!response) {
        setLoginStatus("Sai tên đăng nhập hoặc mật khẩu")
        throw new Error("Login failed, response is null")
      }
      const { accessToken, id } = response
      tokenService.accessToken = accessToken
      localStorage.setItem("id", id)
      const user = await getUserById(id)
      const role = user?.role || "USER"
      localStorage.setItem("role", role.toUpperCase())
      navigate("/home")
    } catch (err: unknown) {
      setLoginStatus("Sai tên đăng nhập hoặc mật khẩu")
      const errorMessage = (err as Error).message || "Something went wrong. Please try again."
      console.error("Login error:", errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const userId = localStorage.getItem("id")
    const accessToken = localStorage.getItem("accessToken")
    if (!userId || !accessToken) {
      return
    }
    isTokenValidate(accessToken).then((response) => {
      if (response) {
        navigate("/home")
      }
    })
  }, [])

  const isRegisterValid =
    name !== "" &&
    email !== "" &&
    /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email) &&
    username !== "" &&
    username.length >= 4 &&
    phoneNumber.length === 10 &&
    password !== "" &&
    /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/.test(password) &&
    password === confirmPassword

  const getFieldStatus = (field: string, value: string) => {
    switch (field) {
      case "name":
        return value !== "" ? "valid" : "invalid"
      case "email":
        return value !== "" && /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(value) ? "valid" : "invalid"
      case "username":
        return value !== "" && value.length >= 4 ? "valid" : "invalid"
      case "phoneNumber":
        return value.length === 10 ? "valid" : "invalid"
      case "password":
        return value !== "" && /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/.test(value) ? "valid" : "invalid"
      case "confirmPassword":
        return password === value && value !== "" ? "valid" : "invalid"
      default:
        return "invalid"
    }
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-700 to-gray-500 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gray-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gray-500 rounded-full blur-3xl animate-pulse delay-1000" />

        {/* Main Container */}
        <div className="relative w-full max-w-4xl h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Sign In Form */}
          <div
            className={`absolute top-0 left-0 w-1/2 h-full flex items-center justify-center transition-all duration-700 ${
              isSignUpMode ? "translate-x-full opacity-0 pointer-events-none" : "translate-x-0 opacity-100"
            }`}
            style={{ zIndex: isSignUpMode ? 1 : 100 }}
          >
            <form className="w-full max-w-sm px-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Đăng nhập</h2>
                <p className="text-gray-600">Chào mừng bạn trở lại!</p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <Input
                    type="text"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="Tên đăng nhập"
                    className="pl-12 h-12 bg-gray-50 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-purple-500/20 text-black"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <Input
                    type={showLoginPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Mật khẩu"
                    className="pl-12 pr-12 h-12 bg-gray-50 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-purple-500/20 text-black"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
                  >
                    {showLoginPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {loginStatus && (
                <div className="flex items-center gap-2 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{loginStatus}</span>
                </div>
              )}

              <div className="text-center">
                <a href="/forgot-password" className="text-sm text-gray-400 hover:text-black transition-colors">
                  Quên mật khẩu?
                </a>
              </div>

              <Button
                type="button"
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-black-600 to-blue-600 hover:from-black-700 hover:to-blue-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang đăng nhập...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="w-5 h-5" />
                    Đăng nhập
                  </div>
                )}
              </Button>
            </form>
          </div>

          {/* Sign Up Form */}
          <div
            className={`absolute top-0 right-0 w-1/2 h-full flex items-center justify-center transition-all duration-700 ${
              isSignUpMode ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"
            }`}
            style={{ zIndex: isSignUpMode ? 100 : 1 }}
          >
            <form
              className="w-full max-w-sm px-8 space-y-4 overflow-y-auto max-h-full py-8"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Đăng ký</h2>
                <p className="text-gray-600">Tạo tài khoản mới</p>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Họ và tên"
                    className={`pl-10 pr-10 h-10 bg-gray-50 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-purple-500/20 text-sm text-black${
                      name !== ""
                        ? getFieldStatus("name", name) === "valid"
                          ? "border-emerald-500 focus:border-emerald-500 text-black"
                          : "border-red-500 focus:border-red-500 text-black"
                        : ""
                    }`}
                  />
                  {name !== "" && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      {getFieldStatus("name", name) === "valid" ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className={`pl-10 pr-10 h-10 bg-gray-50 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-purple-500/20 text-sm text-black${
                      email !== ""
                        ? getFieldStatus("email", email) === "valid"
                          ? "border-emerald-500 focus:border-emerald-500 text-black"
                          : "border-red-500 focus:border-red-500 text-black"
                        : ""
                    }`}
                  />
                  {email !== "" && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      {getFieldStatus("email", email) === "valid" ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Tên đăng nhập"
                    className={`pl-10 pr-10 h-10 bg-gray-50 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-purple-500/20 text-sm text-black${
                      username !== ""
                        ? getFieldStatus("username", username) === "valid"
                          ? "border-emerald-500 focus:border-emerald-500 text-black"
                          : "border-red-500 focus:border-red-500 text-black"
                        : ""
                    }`}
                  />
                  {username !== "" && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      {getFieldStatus("username", username) === "valid" ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <Input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Số điện thoại"
                    className={`pl-10 pr-10 h-10 bg-gray-50 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-purple-500/20 text-sm text-black${
                      phoneNumber !== ""
                        ? getFieldStatus("phoneNumber", phoneNumber) === "valid"
                          ? "border-emerald-500 focus:border-emerald-500 text-black"
                          : "border-red-500 focus:border-red-500 text-black"
                        : ""
                    }`}
                  />
                  {phoneNumber !== "" && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      {getFieldStatus("phoneNumber", phoneNumber) === "valid" ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mật khẩu"
                    className={`pl-10 pr-16 h-10 bg-gray-50 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-purple-500/20 text-sm text-black${
                      password !== ""
                        ? getFieldStatus("password", password) === "valid"
                          ? "border-emerald-500 focus:border-emerald-500 text-black"
                          : "border-red-500 focus:border-red-500 text-black"
                        : ""
                    }`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {password !== "" && (
                      <div className="pointer-events-none">
                        {getFieldStatus("password", password) === "valid" ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 ml-1 z-10"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Xác nhận mật khẩu"
                    className={`pl-10 pr-16 h-10 bg-gray-50 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-purple-500/20 text-sm text-black${
                      confirmPassword !== ""
                        ? getFieldStatus("confirmPassword", confirmPassword) === "valid"
                          ? "border-emerald-500 focus:border-emerald-500 text-black"
                          : "border-red-500 focus:border-red-500 text-black"
                        : ""
                    }`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {confirmPassword !== "" && (
                      <div className="pointer-events-none">
                        {getFieldStatus("confirmPassword", confirmPassword) === "valid" ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-gray-400 hover:text-gray-600 ml-1 z-10"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleRegister}
                disabled={!isRegisterValid || isLoading}
                className={`w-full h-10 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-sm ${
                  isRegisterValid
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang đăng ký...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Đăng ký
                  </div>
                )}
              </Button>
            </form>
          </div>

          {/* Overlay Panel */}
          <div
            className={`absolute top-0 w-1/2 h-full bg-gradient-to-br from-gray via-gray-600 to-gray-300 transition-all duration-700 ${
              isSignUpMode ? "left-0" : "left-1/2"
            }`}
            style={{ zIndex: 50 }}
          >
            <div className="relative w-full h-full flex items-center justify-center text-white">
              {/* Sign In Panel */}
              <div
                className={`absolute inset-0 flex flex-col items-center justify-center px-8 text-center transition-all duration-700 ${
                  isSignUpMode ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
                }`}
              >
                <div className="w-20 h-20 rounded-full overflow-hidden bg-white p-1 mb-4">
                  <img
                    src="/img/logo-bg.png"
                    alt="ThaDo Logo"
                    className="object-cover"
                  />
                </div>
                <h2 className="text-3xl font-bold mb-4">Chào mừng trở lại!</h2>
                <p className="text-white/80 mb-8 leading-relaxed">
                  Để duy trì kết nối với chúng tôi, vui lòng đăng nhập bằng thông tin cá nhân của bạn
                </p>
                <Button
                  onClick={handleToggleMode}
                  variant="outline"
                  className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-black px-8 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105"
                >
                  Đăng nhập
                </Button>
              </div>

              {/* Sign Up Panel */}
              <div
                className={`absolute inset-0 flex flex-col items-center justify-center px-8 text-center transition-all duration-700 ${
                  isSignUpMode ? "opacity-0 -translate-x-full" : "opacity-100 translate-x-0"
                }`}
              >
                <div className="w-20 h-20 rounded-full overflow-hidden bg-white p-1 mb-4">
                  <img
                    src="/img/logo-bg.png"
                    alt="ThaDo Logo"
                    className=" object-cover"
                  />
                </div>
                <h2 className="text-3xl font-bold mb-4">Xin chào!</h2>
                <p className="text-white/80 mb-8 leading-relaxed">
                  Nhập thông tin cá nhân của bạn và bắt đầu hành trình cùng chúng tôi
                </p>
                <Button
                  onClick={handleToggleMode}
                  variant="outline"
                  className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-blue-600 px-8 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105"
                >
                  Đăng ký
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
