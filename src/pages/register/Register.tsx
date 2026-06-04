import { Link, useNavigate } from "react-router-dom"
import { useFormik } from "formik"
import * as Yup from "yup"
import { axiosRequest } from "../../utils/token"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { useToast } from "../../components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import heroImage from "@/assets/hero.png"

const Register = () => {
  const { toast } = useToast()
  const navigate = useNavigate()

  const seekerFormik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
      phoneNumber: Yup.string().required("Required"),
      password: Yup.string().min(6, "Must be at least 6 characters").required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        await axiosRequest.post("/api/Auth/register", {
          fullName: values.fullName,
          email: values.email,
          phoneNumber: values.phoneNumber,
          password: values.password,
          role: "Candidate",
        })
        toast({
          title: "Registration Successful",
          description: "Your account has been created. Please log in.",
        })
        navigate("/login")
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: error.response?.data?.message || error.response?.data?.errors?.[0] || "Something went wrong",
        })
      }
    },
  })

  const orgFormik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
      phoneNumber: Yup.string().required("Required"),
      password: Yup.string().min(6, "Must be at least 6 characters").required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        await axiosRequest.post("/api/Auth/register", {
          fullName: values.fullName,
          email: values.email,
          phoneNumber: values.phoneNumber,
          password: values.password,
          role: "Organization",
        })
        toast({
          title: "Registration Successful",
          description: "Your organization account has been created. Please log in.",
        })
        navigate("/login")
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: error.response?.data?.message || error.response?.data?.errors?.[0] || "Something went wrong",
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
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Join millions of professionals</h1>
          <p className="text-slate-400">Search for your dream job, and find your perfect role in...</p>
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
        <div className="w-full max-w-[440px] space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Create your account</h2>
            <p className="text-muted-foreground">Welcome! Please enter your details.</p>
          </div>

          <Tabs defaultValue="seeker" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="seeker">Job Seeker</TabsTrigger>
              <TabsTrigger value="org">Organization</TabsTrigger>
            </TabsList>

            <TabsContent value="seeker">
              <form onSubmit={seekerFormik.handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" placeholder="John Doe" {...seekerFormik.getFieldProps("fullName")} />
                  {seekerFormik.touched.fullName && seekerFormik.errors.fullName && (
                    <div className="text-xs text-destructive">{seekerFormik.errors.fullName}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seekerEmail">Email address</Label>
                  <Input id="seekerEmail" type="email" placeholder="john@example.com" {...seekerFormik.getFieldProps("email")} />
                  {seekerFormik.touched.email && seekerFormik.errors.email && (
                    <div className="text-xs text-destructive">{seekerFormik.errors.email}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seekerPhone">Phone Number</Label>
                  <Input id="seekerPhone" type="tel" placeholder="+1234567890" {...seekerFormik.getFieldProps("phoneNumber")} />
                  {seekerFormik.touched.phoneNumber && seekerFormik.errors.phoneNumber && (
                    <div className="text-xs text-destructive">{seekerFormik.errors.phoneNumber}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seekerPassword">Password</Label>
                  <Input id="seekerPassword" type="password" placeholder="••••••••" {...seekerFormik.getFieldProps("password")} />
                  {seekerFormik.touched.password && seekerFormik.errors.password && (
                    <div className="text-xs text-destructive">{seekerFormik.errors.password}</div>
                  )}
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-11" disabled={seekerFormik.isSubmitting}>
                  {seekerFormik.isSubmitting ? "Creating account..." : "Create account"}
                </Button>
              </form>
            </TabsContent>

            {/* ── Organization Tab ── */}
            <TabsContent value="org">
              <form onSubmit={orgFormik.handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="orgFullName">Organization Name</Label>
                  <Input id="orgFullName" placeholder="Acme Inc" {...orgFormik.getFieldProps("fullName")} />
                  {orgFormik.touched.fullName && orgFormik.errors.fullName && (
                    <div className="text-xs text-destructive">{orgFormik.errors.fullName}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgEmail">Business Email</Label>
                  <Input id="orgEmail" type="email" placeholder="hr@acme.com" {...orgFormik.getFieldProps("email")} />
                  {orgFormik.touched.email && orgFormik.errors.email && (
                    <div className="text-xs text-destructive">{orgFormik.errors.email}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgPhone">Phone Number</Label>
                  <Input id="orgPhone" type="tel" placeholder="+1234567890" {...orgFormik.getFieldProps("phoneNumber")} />
                  {orgFormik.touched.phoneNumber && orgFormik.errors.phoneNumber && (
                    <div className="text-xs text-destructive">{orgFormik.errors.phoneNumber}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgPassword">Password</Label>
                  <Input id="orgPassword" type="password" placeholder="••••••••" {...orgFormik.getFieldProps("password")} />
                  {orgFormik.touched.password && orgFormik.errors.password && (
                    <div className="text-xs text-destructive">{orgFormik.errors.password}</div>
                  )}
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-11" disabled={orgFormik.isSubmitting}>
                  {orgFormik.isSubmitting ? "Registering..." : "Register Organization"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-blue-600 hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register