
"use client"

import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export default function ResearchConfig() {
  const [dateRange, setDateRange] = useState("7")
  const [claimsToAnalyze, setClaimsToAnalyze] = useState(50)
  const [useAIAssistant, setUseAIAssistant] = useState(true)
  const [apiKey, setApiKey] = useState("")
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/research-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateRange,
          claimsToAnalyze,
          useAIAssistant,
          apiKey,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Configuration Updated",
          description: "Your research configuration has been saved.",
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save research configuration",
        variant: "destructive",
      })
    }
  }

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-6">Research Configuration</h1>
      <Card>
        <CardHeader>
          <CardTitle>Configure Research Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="date-range">Date Range</Label>
              <Select
                value={dateRange}
                onValueChange={(value) => setDateRange(value)}
              >
                <SelectTrigger id="date-range">
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="claims-to-analyze">
                Number of Claims to Analyze: {claimsToAnalyze}
              </Label>
              <Slider
                id="claims-to-analyze"
                min={10}
                max={100}
                step={10}
                value={[claimsToAnalyze]}
                onValueChange={(value) => setClaimsToAnalyze(value[0])}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="use-ai"
                checked={useAIAssistant}
                onCheckedChange={setUseAIAssistant}
              />
              <Label htmlFor="use-ai">Use AI Assistant for Analysis</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="api-key">Perplexity API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="Enter your Perplexity API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>

            <Button type="submit">Save Configuration</Button>
          </form>
        </CardContent>
      </Card>
    </MainLayout>
  )
}

