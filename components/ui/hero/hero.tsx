"use client"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users,BarChart3,FileCheck, Shield, ArrowRight, UserCheck } from "lucide-react"

const features = [
  {
    icon: UserCheck,
    title: "e-Panjeeyan",
    description: "Digital land record management",
  },
  {
    icon: FileCheck,
    title: "Application for Service Certificate",
    description: "Online certificate applications",
  },
  {
    icon: Shield,
    title: "Verification of land",
    description: "Land verification services",
  },
  {
    icon: Users,
    title: "Record of Right (ROR)",
    description: "Digital land records access",
  },
  {
    icon: Shield,
    title: "Ceiling Surplus Land",
    description: "Management of surplus land records.",
  },
  {
    icon: FileCheck,
    title: "Claim Verification",
    description: "Transparent claim processing.",
  },
]

export function Hero() {
  
  return (
    <>
      {/* This style tag injects the animation keyframes into the page.
        This is necessary because we can't edit globals.css from here.
      */}
      <style jsx global>{`
        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-100%);
          }
        }
      `}</style>

      <main>
        {/* SECTION 1: HERO VIDEO */}
        <section className="relative flex justify-center items-center h-screen w-full">
          <div className="absolute flex flex-col justify-center items-center h-screen gap-4 z-10">
            <div className="flex justify-center items-center gap-4">
              <p className="font-black text-6xl text-white">Welcome to</p>
              <p className="font-black text-6xl text-orange-400"> Meow </p>
            </div>
            <div>
              <p className="text-xl text-white text-center">EMPOWERING PEOPLE TO MAKE ATLAS FOR CITIZENS</p>
            </div>
          </div>
          <video 
            className="h-full w-full object-cover" 
            autoPlay 
            loop 
            muted 
            playsInline 
            disablePictureInPicture
          >
            <source src="https://sewasetu.assam.gov.in/assets/site/theme2/assets/videos/assam.mov" type="video/mp4" />
          </video>
        </section>

        {/* SECTION 2: SCROLLING CARDS */}
        <section className="flex flex-col justify-center w-full bg-white py-24">
          <div className="container mx-auto px-4 text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">
              Empowering <span className="text-primary">Citizens</span> with 800+ Services
            </h2>
            <p className="text-muted-foreground mt-4 max-w-3xl mx-auto">
              Sewa Setu serves as a citizen-centric platform revolutionizing public service delivery across government departments.
            </p>
          </div>
          
          {/* Scrolling container */}
          <div
            className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]"
          >
            {/* The track that will be animated */}
            <div className="flex min-w-full animate-[scroll_40s_linear_infinite] hover:[animation-play-state:paused]">
              {/* Render the cards twice for a seamless loop */}
              {[...features, ...features].map((feature, index) => {
                const Icon = feature.icon;
                return (
                <Card key={index} className="w-[350px] flex-shrink-0 mx-4 border-border shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="flex items-start gap-4 p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              )})}
            </div>
          </div>
        </section>
        
        {/* SECTION 3: ANOTHER EXAMPLE */}
        <section className="flex flex-col justify-center items-center h-screen w-full bg-green-800 text-black">
          <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Role-Based Access Control</h2>
            <p className="text-lg text-white max-w-2xl mx-auto">
              Tailored interfaces and permissions for different user types in the FRA ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle>Villagers & Claimants</CardTitle>
                <CardDescription>Simple, intuitive interface for claim submission and tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-left space-y-2">
                  <li>• Submit new FRA claims</li>
                  <li>• Upload supporting documents</li>
                  <li>• Track application status</li>
                  <li>• Receive notifications</li>
                  <li>• Access digital pattas</li>
                  <li>• View eligible schemes</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle>FRC & Officials</CardTitle>
                <CardDescription>Comprehensive tools for verification and processing</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-left space-y-2">
                  <li>• Review submitted claims</li>
                  <li>• Conduct field verification</li>
                  <li>• Upload evidence & photos</li>
                  <li>• Manage verification workflow</li>
                  <li>• Generate reports</li>
                  <li>• Communicate with claimants</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center shadow-xl">
              <CardHeader>
                <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle>SDLC & DLC</CardTitle>
                <CardDescription>Advanced dashboards for decision making and monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-left space-y-2">
                  <li>• Multi-claim dashboards</li>
                  <li>• GIS overlay analysis</li>
                  <li>• Approval workflows</li>
                  <li>• Digital signatures</li>
                  <li>• Analytics & reporting</li>
                  <li>• Policy monitoring</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
        </section>
      </main>
    </>
  )
}

