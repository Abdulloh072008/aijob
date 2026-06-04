import { Link, useNavigate } from "react-router-dom"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { useToast } from "../../components/ui/use-toast"
import heroImage from "../../assets/hero.png" 
import { axiosRequest, saveToken } from "../../utils/token"

const Login = () => {
  const { toast } = useToast()
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axiosRequest.post("/api/Auth/login", values)
        const token = response.data.data?.token || response.data.token
        saveToken(token)

        let role = ""
        try {
          const payload = JSON.parse(atob(token.split('.')[1]))
          role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || payload.role
        } catch (e) {
          console.error("Token decoding failed", e)
        }

        toast({
          title: "Login Successful",
          description: `Welcome back!`,
        })

        if (role === "Organization") {
          navigate("/dashboard")
        } else {
          navigate("/home")
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: error.response?.data?.message || "Something went wrong",
        })
      }
    },
  })

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="z-10">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded-md" />
            <span className="text-xl font-bold">AIJob</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Welcome back to AIJob</h1>
          <p className="text-slate-400">Services digital talent, powering in...</p>
        </div>
        <div className="z-10 text-sm text-slate-500">
          Analyze, Testing, Documentation
        </div>
        <img 
          src={heroImage} 
          alt="Hero" 
          className="absolute right-0 bottom-0 opacity-20 w-3/4 object-contain translate-x-1/4 translate-y-1/4"
        />
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-[400px] space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Login</h2>
            <p className="text-muted-foreground">Welcome back! Please enter your details.</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-sm text-destructive">{formik.errors.email}</div>
              ) : null}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forget-password"
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...formik.getFieldProps("password")}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="text-sm text-destructive">{formik.errors.password}</div>
              ) : null}
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-11" disabled={formik.isSubmitting}>
              Login
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="w-full">
              Google
            </Button>
            <Button variant="outline" className="w-full">
              LinkedIn
            </Button>
          </div>

          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-blue-600 hover:underline">
              Sign up for free
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
