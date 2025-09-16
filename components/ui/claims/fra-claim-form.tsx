"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DocumentUpload } from "./document-upload"
import { User, MapPin, FileText, Upload, Send, ArrowLeft, ArrowRight, CheckCircle2, LogIn, Phone } from "lucide-react"
import { cn } from "@/lib/utils"

// --- Data Interfaces & Constants ---

interface ClaimFormData {
  applicantName: string
  fatherName: string
  age: string
  gender: string
  caste: string
  aadharNumber: string
  phoneNumber: string
  email: string
  address: string
  villageCode: string
  villageName: string
  tehsil: string
  district: string
  state: string
  surveyNumber: string
  landArea: string
  landType: string
  occupationSince: string
  claimType: string
  purposeOfUse: string
  familyMembers: string
  dependentMembers: string
  annualIncome: string
  witnessName1: string
  witnessAddress1: string
  witnessName2: string
  witnessAddress2: string
  additionalInfo: string
}

const steps = [
  { id: 1, name: "Personal Information", icon: User },
  { id: 2, name: "Land Details", icon: MapPin },
  { id: 3, name: "Claim Information", icon: FileText },
  { id: 4, name: "Documents & Submit", icon: Upload },
]


const StepperSidebar = ({ currentStep, isSubmitted }: { currentStep: number; isSubmitted: boolean }) => (
  <aside className="md:col-span-1">
    <div className="p-4 bg-white rounded-lg border sticky top-28 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground">FRA Application</h2>
        <p className="text-sm text-muted-foreground">Follow the steps to complete your claim.</p>
      </div>
      <nav>
        <ol className="space-y-2">
          {steps.map((step) => {
            const isCompleted = isSubmitted || currentStep > step.id
            const isActive = !isSubmitted && currentStep === step.id
            return (
              <li key={step.id}>
                <div className={cn("flex items-center p-3 rounded-md transition-all duration-200", isActive ? "bg-primary/10 border border-primary/30" : "", isCompleted ? "opacity-70" : "")}>
                  <div className={cn("flex items-center justify-center h-8 w-8 rounded-full mr-3 text-white", isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground", isCompleted ? "bg-green-600" : "")}>
                    {isCompleted ? <CheckCircle2 size={20} className="text-slate-100" /> : <step.icon size={18} />}
                  </div>
                  <div>
                    <p className={cn("text-sm font-medium", isActive ? "text-primary" : "text-foreground")}>Step {step.id}</p>
                    <p className="text-sm text-muted-foreground">{step.name}</p>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      </nav>
    </div>
  </aside>
)

const SubmissionSuccess = ({ onShowLogin }: { onShowLogin: () => void }) => (
  <div className="flex flex-col items-center justify-center text-center p-8 min-h-[30rem] animate-in fade-in duration-500">
    <CheckCircle2 className="h-16 w-16 text-green-600 mb-4" />
    <h2 className="text-2xl font-bold text-foreground mb-2">Submission Successful!</h2>
    <p className="text-muted-foreground mb-6 max-w-md">Your FRA claim application has been submitted. You can now log in to your dashboard to track its status.</p>
    <Button size="lg" onClick={onShowLogin} className="bg-green-600 hover:bg-green-700 text-white">
      <LogIn className="mr-2 h-4 w-4" /> Go to Dashboard
    </Button>
  </div>
)

interface LoginFormProps {
  phoneNumber: string
  setPhoneNumber: (value: string) => void
  otp: string
  setOtp: (value: string) => void
  otpSent: boolean
  loginMessage: string
  setLoginMessage: (value: string) => void
  handleSendOtp: (e: React.MouseEvent<HTMLButtonElement>) => void
  handleLoginSubmit: (e: React.FormEvent) => void
  handleReturnToForm: () => void
}

const LoginForm = ({ phoneNumber, setPhoneNumber, otp, setOtp, otpSent, loginMessage, setLoginMessage, handleSendOtp, handleLoginSubmit, handleReturnToForm }: LoginFormProps) => (
  <Card className="bg-white border-border shadow-sm animate-in fade-in duration-300">
    <form onSubmit={handleLoginSubmit}>
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2">
          <Phone className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl text-foreground">Login with Phone</CardTitle>
        <CardDescription>Enter your phone number to receive a one-time password (OTP).</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-8 pt-8 pb-4">
        {!otpSent ? (
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="Enter your 10-digit number"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value)
                if (loginMessage) setLoginMessage("") 
              }}
              required
              className="bg-slate-50 text-lg"
            />
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="otp">Enter OTP</Label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value)
                if (loginMessage) setLoginMessage("") 
              }}
              required
              className="bg-slate-50 text-lg tracking-widest text-center"
              maxLength={6}
            />
            <p className="text-xs text-muted-foreground text-center pt-1">An OTP was sent to {phoneNumber}.</p>
          </div>
        )}
        {loginMessage && (
          <p className={cn(
            "text-sm text-center font-medium",
            loginMessage.includes("Invalid") || loginMessage.includes("valid") ? "text-red-600" : "text-muted-foreground"
          )}>
            {loginMessage}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex-col space-y-4 px-8 pb-8">
        {!otpSent ? (
          <Button type="button" onClick={handleSendOtp} size="lg" className="w-full">
            Send OTP
          </Button>
        ) : (
          <Button type="submit" size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white">
            Verify & Login
          </Button>
        )}
        <Button type="button" variant="ghost" onClick={handleReturnToForm} className="text-muted-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Claim Form
        </Button>
      </CardFooter>
    </form>
  </Card>
)


export function FRAClaimForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [loginMessage, setLoginMessage] = useState("")

  const [formData, setFormData] = useState<ClaimFormData>({
    applicantName: "", fatherName: "", age: "", gender: "", caste: "", aadharNumber: "", phoneNumber: "", email: "", address: "", villageCode: "", villageName: "", tehsil: "", district: "", state: "", surveyNumber: "", landArea: "", landType: "", occupationSince: "", claimType: "", purposeOfUse: "", familyMembers: "", dependentMembers: "", annualIncome: "", witnessName1: "", witnessAddress1: "", witnessName2: "", witnessAddress2: "", additionalInfo: "",
  })

  const [uploadedDocuments, setUploadedDocuments] = useState<string[]>([])

  const updateFormData = (field: keyof ClaimFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const nextStep = () => currentStep < steps.length && setCurrentStep(currentStep + 1)
  const prevStep = () => currentStep > 1 && setCurrentStep(currentStep - 1)

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submitting FRA Claim:", { formData, uploadedDocuments })
    setIsSubmitted(true)
  }

  const handleReturnToForm = () => {
    setShowLogin(false)
    setLoginMessage("")
    setOtpSent(false)
  }

  const handleSendOtp = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (phoneNumber.match(/^\d{10}$/)) {
      console.log("Sending OTP to:", phoneNumber)
      setLoginMessage("An OTP has been sent. (Hint: Use 123456 for this demo)")
      setOtpSent(true)
    } else {
      setLoginMessage("Please enter a valid 10-digit phone number.")
    }
  }

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Verifying OTP:", otp)
    if (otp === "123456") {
      setLoginMessage("Login successful! Redirecting...")
      router.push("/dashboard/u")
    } else {
      setLoginMessage("Invalid OTP. Please try again.")
    }
  }

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">FRA Claim Application</h1>
            <p className="text-muted-foreground mt-1">File a new claim for Individual or Community Forest Rights.</p>
          </div>
          <Button variant="outline" onClick={() => setShowLogin(true)}>
            <LogIn className="mr-2 h-4 w-4" />
            Login
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {showLogin ? (
            <main className="md:col-span-4 md:col-start-1 max-w-md mx-auto w-full">
              <LoginForm
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                otp={otp}
                setOtp={setOtp}
                otpSent={otpSent}
                loginMessage={loginMessage}
                setLoginMessage={setLoginMessage}
                handleSendOtp={handleSendOtp}
                handleLoginSubmit={handleLoginSubmit}
                handleReturnToForm={handleReturnToForm}
              />
            </main>
          ) : (
            <>
              <StepperSidebar currentStep={currentStep} isSubmitted={isSubmitted} />
              <main className="md:col-span-3">
                <Card className="bg-white border-border shadow-sm">
                  {isSubmitted ? (
                    <SubmissionSuccess onShowLogin={() => setShowLogin(true)} />
                  ) : (
                    <>
                      <CardHeader>
                        <CardTitle className="text-2xl text-foreground">{steps[currentStep - 1].name}</CardTitle>
                        <CardDescription>Please provide all the required information for this section.</CardDescription>
                      </CardHeader>
                      <form onSubmit={handleClaimSubmit}>
                        <CardContent className="space-y-8 min-h-[25rem]">
                          {/* Step 1: Personal Information */}
                          {currentStep === 1 && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <Label htmlFor="applicantName">Full Name <span className="text-red-600">*</span></Label>
                                  <Input id="applicantName" placeholder="Enter full name" value={formData.applicantName} onChange={(e) => updateFormData("applicantName", e.target.value)} required className="bg-slate-50" />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="fatherName">Father's Name <span className="text-red-600">*</span></Label>
                                  <Input id="fatherName" placeholder="Enter father's name" value={formData.fatherName} onChange={(e) => updateFormData("fatherName", e.target.value)} required className="bg-slate-50" />
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                  <Label htmlFor="age">Age <span className="text-red-600">*</span></Label>
                                  <Input id="age" type="number" placeholder="Your age" value={formData.age} onChange={(e) => updateFormData("age", e.target.value)} required className="bg-slate-50" />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="gender">Gender <span className="text-red-600">*</span></Label>
                                  <Select value={formData.gender} onValueChange={(value) => updateFormData("gender", value)}>
                                    <SelectTrigger className="bg-slate-50"><SelectValue placeholder="Select gender" /></SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="male">Male</SelectItem>
                                      <SelectItem value="female">Female</SelectItem>
                                      <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="caste">Caste Category <span className="text-red-600">*</span></Label>
                                  <Select value={formData.caste} onValueChange={(value) => updateFormData("caste", value)}>
                                    <SelectTrigger className="bg-slate-50"><SelectValue placeholder="Select category" /></SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="st">Scheduled Tribe (ST)</SelectItem>
                                      <SelectItem value="sc">Scheduled Caste (SC)</SelectItem>
                                      <SelectItem value="obc">Other Backward Class (OBC)</SelectItem>
                                      <SelectItem value="general">General</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <Label htmlFor="aadharNumber">Aadhar Number <span className="text-red-600">*</span></Label>
                                  <Input id="aadharNumber" placeholder="XXXX XXXX XXXX" value={formData.aadharNumber} onChange={(e) => updateFormData("aadharNumber", e.target.value)} required className="bg-slate-50" />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="phoneNumber">Phone Number <span className="text-red-600">*</span></Label>
                                  <Input id="phoneNumber" type="tel" placeholder="+91 XXXXX XXXXX" value={formData.phoneNumber} onChange={(e) => updateFormData("phoneNumber", e.target.value)} required className="bg-slate-50" />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="address">Complete Address <span className="text-red-600">*</span></Label>
                                <Textarea id="address" placeholder="Enter your full residential address" value={formData.address} onChange={(e) => updateFormData("address", e.target.value)} required className="bg-slate-50" />
                              </div>
                            </div>
                          )}

                          {/* Step 2: Land Details */}
                          {currentStep === 2 && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <Label htmlFor="villageName">Village Name <span className="text-red-600">*</span></Label>
                                  <Input id="villageName" placeholder="Enter village name" value={formData.villageName} onChange={(e) => updateFormData("villageName", e.target.value)} required className="bg-slate-50" />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="tehsil">Tehsil/Block <span className="text-red-600">*</span></Label>
                                  <Input id="tehsil" placeholder="Enter tehsil or block" value={formData.tehsil} onChange={(e) => updateFormData("tehsil", e.target.value)} required className="bg-slate-50" />
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <Label htmlFor="district">District <span className="text-red-600">*</span></Label>
                                  <Input id="district" placeholder="Enter district" value={formData.district} onChange={(e) => updateFormData("district", e.target.value)} required className="bg-slate-50" />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="state">State <span className="text-red-600">*</span></Label>
                                  <Input id="state" placeholder="Enter state" value={formData.state} onChange={(e) => updateFormData("state", e.target.value)} required className="bg-slate-50" />
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                  <Label htmlFor="surveyNumber">Survey/Khasra Number <span className="text-red-600">*</span></Label>
                                  <Input id="surveyNumber" placeholder="e.g., 123/4a" value={formData.surveyNumber} onChange={(e) => updateFormData("surveyNumber", e.target.value)} required className="bg-slate-50" />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="landArea">Land Area (in acres) <span className="text-red-600">*</span></Label>
                                  <Input id="landArea" type="number" step="0.01" placeholder="e.g., 2.5" value={formData.landArea} onChange={(e) => updateFormData("landArea", e.target.value)} required className="bg-slate-50" />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="occupationSince">Occupation Since <span className="text-red-600">*</span></Label>
                                  <Input id="occupationSince" type="date" value={formData.occupationSince} onChange={(e) => updateFormData("occupationSince", e.target.value)} required className="bg-slate-50" />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="landType">Type of Land <span className="text-red-600">*</span></Label>
                                <Select value={formData.landType} onValueChange={(value) => updateFormData("landType", value)}>
                                  <SelectTrigger className="bg-slate-50"><SelectValue placeholder="Select land type" /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="forest">Forest Land</SelectItem>
                                    <SelectItem value="revenue">Revenue Land</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}

                          {/* Step 3: Claim Information */}
                          {currentStep === 3 && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <Label htmlFor="claimType">Type of Forest Right Claimed <span className="text-red-600">*</span></Label>
                                  <Select value={formData.claimType} onValueChange={(value) => updateFormData("claimType", value)}>
                                    <SelectTrigger className="bg-slate-50"><SelectValue placeholder="Select claim type" /></SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="individual">Individual Forest Rights</SelectItem>
                                      <SelectItem value="community">Community Forest Rights</SelectItem>
                                      <SelectItem value="habitat">Habitat Rights</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="purposeOfUse">Purpose of Land Use <span className="text-red-600">*</span></Label>
                                  <Select value={formData.purposeOfUse} onValueChange={(value) => updateFormData("purposeOfUse", value)}>
                                    <SelectTrigger className="bg-slate-50"><SelectValue placeholder="Select purpose" /></SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="cultivation">Cultivation</SelectItem>
                                      <SelectItem value="habitation">Habitation</SelectItem>
                                      <SelectItem value="community-use">Community Use</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <Label htmlFor="familyMembers">Total Family Members <span className="text-red-600">*</span></Label>
                                  <Input id="familyMembers" type="number" placeholder="Total members" value={formData.familyMembers} onChange={(e) => updateFormData("familyMembers", e.target.value)} required className="bg-slate-50" />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="annualIncome">Annual Income (₹)</Label>
                                  <Input id="annualIncome" type="number" placeholder="e.g., 50000" value={formData.annualIncome} onChange={(e) => updateFormData("annualIncome", e.target.value)} className="bg-slate-50" />
                                </div>
                              </div>
                              <div className="space-y-6 pt-4 border-t">
                                <h3 className="text-lg font-medium text-foreground">Witness Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                    <Label htmlFor="witnessName1">Witness 1 Full Name</Label>
                                    <Input id="witnessName1" placeholder="Enter witness name" value={formData.witnessName1} onChange={(e) => updateFormData("witnessName1", e.target.value)} className="bg-slate-50" />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="witnessAddress1">Witness 1 Address</Label>
                                    <Input id="witnessAddress1" placeholder="Enter witness address" value={formData.witnessAddress1} onChange={(e) => updateFormData("witnessAddress1", e.target.value)} className="bg-slate-50" />
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                    <Label htmlFor="witnessName2">Witness 2 Full Name</Label>
                                    <Input id="witnessName2" placeholder="Enter witness name" value={formData.witnessName2} onChange={(e) => updateFormData("witnessName2", e.target.value)} className="bg-slate-50" />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="witnessAddress2">Witness 2 Address</Label>
                                    <Input id="witnessAddress2" placeholder="Enter witness address" value={formData.witnessAddress2} onChange={(e) => updateFormData("witnessAddress2", e.target.value)} className="bg-slate-50" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Step 4: Documents & Submit */}
                          {currentStep === 4 && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                              <DocumentUpload onDocumentsChange={setUploadedDocuments} uploadedDocuments={uploadedDocuments} />
                              <div className="pt-6 border-t">
                                <div className="flex items-start space-x-3">
                                  <input id="declaration" type="checkbox" required className="h-4 w-4 mt-1 rounded border-border text-primary focus:ring-ring" />
                                  <Label htmlFor="declaration" className="text-sm font-normal leading-relaxed">
                                    I hereby declare that the information provided is true and correct to the best of my knowledge. I understand that any false information may result in the rejection of my claim.
                                  </Label>
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="flex justify-between border-t pt-6">
                          <div>
                            {currentStep > 1 && <Button type="button" variant="outline" onClick={prevStep}><ArrowLeft className="mr-2 h-4 w-4" /> Previous</Button>}
                          </div>
                          <div>
                            {currentStep < steps.length && <Button type="button" onClick={nextStep} className="bg-green-600 hover:bg-green-700 text-white">Next Step <ArrowRight className="ml-2 h-4 w-4" /></Button>}
                            {currentStep === steps.length && <Button type="submit" size="lg" className="bg-green-600 hover:bg-green-700 text-white"><Send className="mr-2 h-4 w-4" /> Submit Claim</Button>}
                          </div>
                        </CardFooter>
                      </form>
                    </>
                  )}
                </Card>
              </main>
            </>
          )}
        </div>
      </div>
    </div>
  )
}