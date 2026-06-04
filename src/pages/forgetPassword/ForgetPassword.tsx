import { Link } from "react-router-dom"
import { useFormik } from "formik"
import * as Yup from "yup"
import { axiosRequest } from "../../utils/token"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { useToast } from "../../components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Mail } from "lucide-react"

const ForgetPassword = () => {
  const { toast } = useToast()

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        await axiosRequest.post("/api/Auth/forgot-password", values)
        toast({
          title: "Email Sent",
          description: "If an account exists for that email, we've sent reset instructions.",
        })
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.response?.data?.message || "Something went wrong",
        })
      }
    },
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-[400px]">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <Mail className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold">Forgot password?</CardTitle>
            <CardDescription>
              No worries, we'll send you reset instructions.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
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
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={formik.isSubmitting}>
              Reset password
            </Button>
            <div className="text-center">
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-blue-600">
                ← Back to log in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ForgetPassword
