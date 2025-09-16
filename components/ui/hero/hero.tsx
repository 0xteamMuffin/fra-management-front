"use client"
import type React from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BarChart3, FileCheck, Shield, Map, Layers, Database, MapPin, ArrowRight } from "lucide-react"
import SpotlightCard from "@/components/react-bits/SpotlightCard"


const features = [
  {
    icon: FileCheck,
    title: "AI-Powered Digitization",
    description: "For Revenue & Forest Departments",
  },
  {
    icon: Map,
    title: "Interactive FRA Atlas",
    description: "For Planning & Development Authorities",
  },
  {
    icon: Layers,
    title: "Satellite Asset Mapping",
    description: "For Tribal Welfare Departments",
  },
  {
    icon: BarChart3,
    title: "Decision Support System",
    description: "For Ministry-level Monitoring",
  },
   {
    icon: Shield,
    title: "Centralized Claim Verification",
    description: "For District & Sub-Divisional Committees",
  },
]


const stats = [
    {
        icon: Database,
        value: "100k+",
        label: "Records Digitized"
    },
    {
        icon: MapPin,
        value: "5,000+",
        label: "Villages Mapped"
    },
    {
        icon: Layers,
        value: "1M+",
        label: "Assets Identified"
    },
    {
        icon: BarChart3,
        value: "4+",
        label: "Schemes Integrated"
    }
]

const AnimatedSection = ({ children, variants, className }: { children: React.ReactNode, variants: any, className?: string }) => {
  const { ref, inView } = useInView({
    triggerOnce: true, 
    threshold: 0.1,    
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};


export function Hero() {

  
  const slideInFromTop = {
    hidden: { y: -50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } },
  };

  const slideInFromBottom = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } },
  };
  
  const slideInFromLeft = {
    hidden: { x: -50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6 } },
  };

  const slideInFromRight = {
    hidden: { x: 50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6 } },
  };

  
  const staggerContainer = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.2, 
        },
    },
  };
  
  return (
    <>
      <main>
        {/* SECTION 1: HERO VIDEO (RESTORED) */}
        <section className="relative flex justify-center items-center h-screen w-full">
          <motion.div 
            className="absolute flex flex-col justify-center items-center h-screen gap-4 z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex justify-center items-center gap-4">
              <p className="font-black text-6xl text-white">Welcome to</p>
              <p className="font-black text-6xl text-orange-400"> VanFRA </p>
            </div>
            <div>
              <p className="text-xl text-white text-center">EMPOWERING FOREST COMMUNITIES THROUGH TECHNOLOGY</p>
            </div>
          </motion.div>
          <video 
            className="h-full w-full object-cover" 
            autoPlay 
            loop 
            muted 
            playsInline 
            disablePictureInPicture
          >
            <source src="/forest1.mp4" type="video/mp4" />
          </video>
        </section>

        {/* SECTION 2: INFORMATIVE MODULES SECTION (RESTYLED WITH ORIGINAL COLORS) */}
        <section className="w-full bg-white py-20">
            <div className="container mx-auto px-4">
                {/* Stats Bar */}
                <AnimatedSection 
                    variants={staggerContainer} 
                    className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
                >
                    {stats.map((stat, index) => {
                        const Icon = stat.icon
                        return (
                            <motion.div variants={slideInFromBottom} key={index} className="flex flex-col items-center text-center p-4 rounded-lg">
                                <Icon className="w-10 h-10 text-primary mb-2"/>
                                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                            </motion.div>
                        )
                    })}
                </AnimatedSection>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left Column: Feature List */}
                    <AnimatedSection variants={slideInFromLeft}>
                        <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="px-4 py-2 bg-primary text-primary-foreground rounded-full font-semibold">
                                    Core Features
                                </div>
                                <div className="px-4 py-2 text-muted-foreground font-semibold">
                                    For Officials
                                </div>
                                <div className="px-4 py-2 text-muted-foreground font-semibold">
                                    Analytics
                                </div>
                            </div>
                            <div className="space-y-4">
                                {features.map((feature, index) => {
                                    const Icon = feature.icon;
                                    return (
                                        <div key={index} className="flex items-center bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                                                <Icon className="w-6 h-6 text-primary"/>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-foreground">{feature.title}</h4>
                                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </AnimatedSection>

                    {/* Right Column: Description */}
                    <AnimatedSection variants={slideInFromRight} className="text-left">
                        <h2 className="text-4xl font-bold text-foreground">
                           A Unified Platform for <br/> <span className="text-primary">Forest Rights.</span> 
                        </h2>
                        <p className="text-muted-foreground mt-4 max-w-xl">
                            VanFRA serves as a critical data-driven platform revolutionizing the implementation of the Forest Rights Act. By integrating legacy records, satellite imagery, and AI, we bring transparency, efficiency, and accountability to the entire lifecycle of FRA claims.
                        </p>
                        <p className="text-muted-foreground mt-4 max-w-xl">
                           Our tools empower decision-makers to verify claims accurately, map community resources, and layer developmental schemes effectively, ensuring that benefits reach the intended forest-dwelling communities.
                        </p>
                        <Button className="mt-8">
                            Explore the Atlas <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </AnimatedSection>
                </div>
            </div>
        </section>
        
        {/* SECTION 3: ROLE-BASED ACCESS (WITH LUSH FOREST BACKGROUND) */}
        <section 
            className="relative flex flex-col justify-center items-center py-20 w-full bg-cover bg-center"
            style={{ backgroundImage: "url('https://t3.ftcdn.net/jpg/03/17/76/74/360_F_317767458_nk3rKiYqwgRgIfpp0tx2CeqsAtKdHjyu.jpg')" }}
        >
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="relative z-10 container mx-auto max-w-6xl px-4">
                <AnimatedSection variants={slideInFromTop} className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Role-Based Access Control</h2>
                    <p className="text-lg text-white max-w-2xl mx-auto">
                        Tailored interfaces and permissions for different user types in the FRA ecosystem.
                    </p>
                </AnimatedSection>

                <AnimatedSection variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <motion.div variants={slideInFromBottom}>
                      <SpotlightCard spotlightColor="rgba(0, 128, 0, 0.2)" className="text-center shadow-lg bg-white/60 backdrop-blur-sm h-full flex flex-col">
                          <CardHeader>
                              <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <Users className="w-8 h-8 text-green-700" />
                              </div>
                              <CardTitle className="text-gray-900">Gram Sabha & Claimants</CardTitle>
                              <CardDescription className="text-gray-700">Interface for claim submission and status tracking.</CardDescription>
                          </CardHeader>
                          <CardContent>
                              <ul className="text-sm text-left space-y-2 text-gray-800">
                                  <li>• Submission of new IFR/CFR claims</li>
                                  <li>• Uploading of supporting documents</li>
                                  <li>• Real-time application status tracking</li>
                                  <li>• Access to digital land titles (pattas)</li>
                                  <li>• Information on eligible schemes</li>
                              </ul>
                          </CardContent>
                      </SpotlightCard>
                    </motion.div>

                    <motion.div variants={slideInFromBottom}>
                      <SpotlightCard spotlightColor="rgba(0, 128, 0, 0.2)" className="text-center shadow-lg bg-white/60 backdrop-blur-sm h-full flex flex-col">
                          <CardHeader>
                              <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <Shield className="w-8 h-8 text-green-700" />
                              </div>
                              <CardTitle className="text-gray-900">FRC & Verifying Officials</CardTitle>
                              <CardDescription className="text-gray-700">Tools for claim verification and processing.</CardDescription>
                          </CardHeader>
                          <CardContent>
                              <ul className="text-sm text-left space-y-2 text-gray-800">
                                  <li>• Review of submitted claims</li>
                                  <li>• Field verification data upload</li>
                                  <li>• Management of verification workflow</li>
                                  <li>• Generation of verification reports</li>
                                  <li>• Secure communication with claimants</li>
                              </ul>
                          </CardContent>
                      </SpotlightCard>
                    </motion.div>

                    <motion.div variants={slideInFromBottom}>
                      <SpotlightCard spotlightColor="rgba(0, 128, 0, 0.2)" className="text-center shadow-xl bg-white/60 backdrop-blur-sm h-full flex flex-col">
                          <CardHeader>
                              <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <BarChart3 className="w-8 h-8 text-green-700" />
                              </div>
                              <CardTitle className="text-gray-900">SDLC, DLC & State Nodal Agencies</CardTitle>
                              <CardDescription className="text-gray-700">Dashboards for monitoring and decision-making.</CardDescription>
                          </CardHeader>
                          <CardContent>
                              <ul className="text-sm text-left space-y-2 text-gray-800">
                                  <li>• District/State level dashboards</li>
                                  <li>• Geospatial (GIS) data analysis</li>
                                  <li>• Approval and rejection workflows</li>
                                  <li>• Digital signature integration</li>
                                  <li>• Analytics for policy monitoring</li>
                              </ul>
                          </CardContent>
                      </SpotlightCard>
                    </motion.div>
                </AnimatedSection>
            </div>
        </section>
      </main>
    </>
  )
}