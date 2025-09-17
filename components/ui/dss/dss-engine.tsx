"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  MapPin,
  Droplets,
  Zap,
  Wifi,
  GraduationCap,
  Heart,
  TrendingUp,
  Map,
  Send,
  Bot,
  User,
  Star,
  ArrowRight,
} from "lucide-react"

export function DSSEnginePage() {
  const [selectedArea, setSelectedArea] = useState("")
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: "bot",
      message:
        "Hello! I'm your DSS AI assistant. I can help you understand government schemes, analyze resource needs, and provide implementation guidance. What would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [chatInput, setChatInput] = useState("")

  const mockSchemes = [
    {
      id: 1,
      name: "Jal Jeevan Mission",
      category: "Water Supply",
      priority: "Critical",
      attentionLevel: "Immediate",
      eligibility: "95%",
      funding: "₹2.5 Cr",
      timeline: "18 months",
      description: "Provides functional household tap connections to every rural household",
      benefits: ["Clean drinking water access", "Reduced water-borne diseases", "Women empowerment"],
      status: "Recommended",
      urgencyScore: 95,
    },
    {
      id: 2,
      name: "Digital India - BharatNet",
      category: "Connectivity",
      priority: "High",
      attentionLevel: "High",
      eligibility: "92%",
      funding: "₹3.2 Cr",
      timeline: "24 months",
      description: "High-speed broadband connectivity to rural areas",
      benefits: ["Digital literacy", "E-governance access", "Economic opportunities"],
      status: "Recommended",
      urgencyScore: 88,
    },
    {
      id: 3,
      name: "PM-KUSUM Scheme",
      category: "Solar Energy",
      priority: "Medium",
      attentionLevel: "Moderate",
      eligibility: "87%",
      funding: "₹1.8 Cr",
      timeline: "12 months",
      description: "Solar pumps and grid-connected solar power plants for farmers",
      benefits: ["Renewable energy access", "Reduced electricity costs", "Income generation"],
      status: "Under Review",
      urgencyScore: 72,
    },
    {
      id: 4,
      name: "Pradhan Mantri Gram Sadak Yojana",
      category: "Infrastructure",
      priority: "Medium",
      attentionLevel: "Moderate",
      eligibility: "78%",
      funding: "₹4.1 Cr",
      timeline: "30 months",
      description: "All-weather road connectivity to unconnected habitations",
      benefits: ["Better market access", "Emergency services", "Economic development"],
      status: "Feasible",
      urgencyScore: 65,
    },
    {
      id: 5,
      name: "Ayushman Bharat - Health & Wellness Centers",
      category: "Healthcare",
      priority: "High",
      attentionLevel: "High",
      eligibility: "89%",
      funding: "₹1.2 Cr",
      timeline: "15 months",
      description: "Comprehensive primary healthcare services at village level",
      benefits: ["Primary healthcare access", "Preventive care", "Maternal health"],
      status: "Recommended",
      urgencyScore: 82,
    },
  ]

  const handleSendMessage = () => {
    if (!chatInput.trim()) return

    const userMessage = {
      id: chatMessages.length + 1,
      type: "user" as const,
      message: chatInput,
      timestamp: new Date(),
    }

    const botResponse = {
      id: chatMessages.length + 2,
      type: "bot" as const,
      message:
        "Based on your query, I recommend focusing on water supply schemes like Jal Jeevan Mission for your selected area. The critical water scarcity levels indicate this should be the top priority. Would you like me to provide more details about the implementation process?",
      timestamp: new Date(),
    }

    setChatMessages([...chatMessages, userMessage, botResponse])
    setChatInput("")
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <>
      <div className="container max-w-8xl mx-auto py-8 px-4 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg gradient-green text-white">
              <TrendingUp className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground">Decision Support System</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            AI-powered recommendations for government schemes based on local resource analysis and community needs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* AI Chatbot Section */}
        <div className="lg:col-span-1">
            <Card className="h-[80vh] -p-6 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <div>
                <div className="flex items-center gap-2 font-semibold text-lg">
                    <Bot className="h-5 w-5 text-green-600" />
                    AI Assistant
                </div>
                <p className="text-xs text-muted-foreground">
                    Ask me about schemes, eligibility, or implementation
                </p>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto px-4 space-y-4 bg-gray-50">
                {chatMessages.map((message) => (
                <div
                    key={message.id}
                    className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                    <div
                    className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm ${
                        message.type === "bot"
                        ? "bg-white border border-gray-200 text-gray-800"
                        : "bg-blue-600 text-white"
                    }`}
                    >
                    <p className="text-sm leading-relaxed">{message.message}</p>
                    <p className="text-[10px] opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        })}
                    </p>
                    </div>
                </div>
                ))}
            </div>

            {/* Input Box */}
            <div className="p-2 border-t bg-white">
                <div className="flex items-center gap-2">
                <Input
                    placeholder="Ask me anything..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1 rounded-full"
                />
                <Button
                    onClick={handleSendMessage}
                    size="icon"
                    className="rounded-full gradient-green text-white"
                >
                    <Send className="h-4 w-4" />
                </Button>
                </div>
            </div>
            </Card>
        </div>

        {/* Map Section */}
        <div className="lg:col-span-3">
            <Card className="h-[80vh] -p-6 pb-6 flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border-b">
                <div>
                <div className="flex items-center gap-2 text-lg font-semibold">
                    <Map className="h-5 w-5" />
                    Area Selection Map
                </div>
                <p className="text-sm text-muted-foreground">
                    Select an area on the map for detailed analysis
                </p>
                </div>
                <div className="mt-3 md:mt-0 w-full md:w-1/3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                        id="area-search"
                        placeholder="Enter district, block, or village..."
                        className="pl-10 bg-white border-slate-300 w-full"
                    />
                </div>
                </div>
            </div>
            <CardContent className="flex-1">
                <div className="relative h-full">
                <div className="w-full h-full bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <div className="text-center space-y-2">
                    <Map className="h-12 w-12 text-gray-400 mx-auto" />
                    <p className="text-sm text-gray-500">Interactive Map</p>
                    <p className="text-xs text-gray-400">Click to select area</p>
                    </div>
                </div>
                </div>
            </CardContent>
            </Card>
        </div>
        </div>
        <div className="h-3"></div>

       {/* Scheme Recommender Section */}
        <div>
        {/* Header */}
        <div className="mb-4">
            <div className="flex items-center gap-2 font-semibold text-lg">
            Scheme Recommender
            </div>
            <p className="text-sm text-muted-foreground">
            Prioritized schemes based on area needs
            </p>
        </div>

        {/* Grid of Schemes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[80vh] overflow-y-auto pr-2">
            {mockSchemes
            .sort((a, b) => b.urgencyScore - a.urgencyScore)
            .map((scheme) => (
                <Card key={scheme.id} className="border-l-4 border-l-green-500 h-fit">
                <CardContent className="p-4">
                    <div className="space-y-3">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                        <h4 className="font-semibold text-sm">{scheme.name}</h4>
                        <p className="text-xs text-muted-foreground">{scheme.category}</p>
                        </div>
                        <div className="text-right space-y-1">
                        <div className="text-lg font-bold text-green-600">{scheme.urgencyScore}%</div>
                        <p className="text-xs text-muted-foreground">Match</p>
                        </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                        <Badge className={getPriorityColor(scheme.priority)} variant="outline">
                        {scheme.priority}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                        {scheme.attentionLevel} Attention
                        </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2">{scheme.description}</p>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                        <span className="text-muted-foreground">Funding: </span>
                        <span className="font-semibold">{scheme.funding}</span>
                        </div>
                        <div>
                        <span className="text-muted-foreground">Timeline: </span>
                        <span className="font-semibold">{scheme.timeline}</span>
                        </div>
                    </div>

                    <Button
                        size="sm"
                        className="w-full gradient-green text-white hover:gradient-green-hover"
                    >
                        View Details
                        <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                    </div>
                </CardContent>
                </Card>
            ))}
        </div>
        </div>

        {selectedArea && (
          <Card className="gradient-green-subtle">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Detailed Analysis - {selectedArea}
              </CardTitle>
              <CardDescription>Comprehensive resource assessment and implementation roadmap</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[
                  { name: "Water", icon: Droplets, score: 25, status: "Critical" },
                  { name: "Energy", icon: Zap, score: 40, status: "Low" },
                  { name: "Connectivity", icon: Wifi, score: 30, status: "Poor" },
                  { name: "Education", icon: GraduationCap, score: 65, status: "Moderate" },
                  { name: "Healthcare", icon: Heart, score: 35, status: "Low" },
                ].map((resource) => (
                  <Card key={resource.name} className="text-center">
                    <CardContent className="p-4">
                      <resource.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                      <h3 className="font-semibold mb-1">{resource.name}</h3>
                      <div className="text-2xl font-bold mb-1">{resource.score}%</div>
                      <Badge
                        variant={resource.score < 40 ? "destructive" : resource.score < 70 ? "secondary" : "default"}
                      >
                        {resource.status}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}
