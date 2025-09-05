import { LoginForm } from "@/components/ui/login/login-form"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Shield, User } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  return (
    <>
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <MapPin className="h-6 w-6" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Sign In to FRA Atlas</h1>
              <p className="text-sm text-muted-foreground mt-2">Access your government portal account</p>
            </div>
          </div>

          {/* Login Options */}
          <div className="grid grid-cols-1 gap-4">
            <Link href="/claims" className="group">
              <Card className="border-border hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground group-hover:bg-accent/80 transition-colors">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Citizen Login</CardTitle>
                      <CardDescription className="text-sm">Access your FRA claims and dashboard</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/verification" className="group">
              <Card className="border-border hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground group-hover:bg-primary/80 transition-colors">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Government Official</CardTitle>
                      <CardDescription className="text-sm">Access verification and admin tools</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          </div>

          {/* Login Form */}
          <LoginForm />

          {/* Footer Links */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <a href="/register" className="text-primary hover:underline font-medium">
                Register here
              </a>
            </p>
            <p className="text-xs text-muted-foreground">
              For technical support, contact:{" "}
              <a href="mailto:support@fraatlas.gov.in" className="text-primary hover:underline">
                support@fraatlas.gov.in
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
