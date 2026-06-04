import { useNavigate, useSearchParams } from "react-router-dom"
import { useFormik } from "formik"
import * as Yup from "yup"
import { axiosRequest } from "../../utils/token"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { useToast } from "../../components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Lock } from "lucide-react"

const ResetPasswoerd = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token") || ""

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string().min(6, "Must be at least 6 characters").required("Required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        await axiosRequest.post("/api/Auth/reset-password", {
          token,
          newPassword: values.password,
        })
        toast({
          title: "Password Reset Successful",
          description: "You can now log in with your new password.",
        })
        navigate("/login")
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Reset Failed",
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
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold">Set new password</CardTitle>
            <CardDescription>
              Your new password must be different from previously used passwords.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
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
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...formik.getFieldProps("confirmPassword")}
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                <div className="text-sm text-destructive">{formik.errors.confirmPassword}</div>
              ) : null}
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={formik.isSubmitting}>
              Reset password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ResetPasswoerd
