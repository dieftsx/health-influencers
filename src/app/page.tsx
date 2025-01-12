
"use client"

import { useState } from 'react'
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import Link from 'next/link'

export default function Dashboard() {
  const [influencerName, setInfluencerName] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const { toast } = useToast()

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAnalyzing(true)

    try {
      const response = await fetch('/api/analyze-influencer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ influencerName }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Analysis Complete",
          description: `Analyzed ${data.claims.length} claims for ${influencerName}`,
        })
        // Here you would typically update your app state with the new data
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing the influencer.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Influencers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Claims Analyzed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45,678</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Verified Claims
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23,456</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Questionable Claims
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,345</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>View Influencer Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/1" className="text-blue-500 hover:underline">
              Go to Dr. Health Guru's Dashboard
            </Link>
          </CardContent>
        </Card>
      </div>
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Analyze New Influencer</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAnalyze} className="flex w-full max-w-sm items-center space-x-2">
              <Input 
                type="text" 
                placeholder="Enter influencer name" 
                value={influencerName}
                onChange={(e) => setInfluencerName(e.target.value)}
              />
              <Button type="submit" disabled={isAnalyzing}>
                {isAnalyzing ? (
                  "Analyzing..."
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" /> Analyze
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}

