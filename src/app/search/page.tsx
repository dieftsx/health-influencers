
"use client"

import { useState } from 'react'
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Loader2 } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import Image from 'next/image'
import { Badge } from "@/components/ui/badge"

interface Influencer {
  id: number;
  name: string;
  username: string;
  profilePicture: string;
  followers: number;
  trustScore: number;
  verifiedClaims: number;
  questionableClaims: number;
  recentClaims: {
    claim: string;
    verifications: {
      service: string;
      isVerified: boolean;
      confidence: number;
      explanation: string;
    }[];
    aggregateScore: number;
  }[];
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<Influencer[]>([])
  const { toast } = useToast()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)
    setSearchResults([])

    try {
      const response = await fetch(`/api/search-influencers?query=${encodeURIComponent(searchTerm)}`)
      const data = await response.json()

      if (data.success) {
        setSearchResults(data.influencers)
        if (data.influencers.length === 0) {
          toast({
            title: "No Results",
            description: "No influencers found matching your search term.",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Search Complete",
            description: `Found ${data.influencers.length} influencer(s) matching your search.`,
          })
        }
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "There was an error searching for influencers.",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-6">Search Influencers</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Find Health Influencers</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
            <Input 
              type="text" 
              placeholder="Enter influencer name or username" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button type="submit" disabled={isSearching}>
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" /> Search
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {searchResults.length > 0 && (
        <div className="space-y-6">
          {searchResults.map((influencer) => (
            <Card key={influencer.id}>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Image
                    src={influencer.profilePicture}
                    alt={influencer.name}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                  <div>
                    <CardTitle>{influencer.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{influencer.username}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                  <div>
                    <p className="text-sm font-medium">Followers</p>
                    <p className="text-2xl font-bold">{influencer.followers.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Trust Score</p>
                    <Badge
                      variant={
                        influencer.trustScore >= 80
                          ? "success"
                          : influencer.trustScore >= 60
                          ? "warning"
                          : "destructive"
                      }
                    >
                      {influencer.trustScore}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Verified Claims</p>
                    <p className="text-2xl font-bold">{influencer.verifiedClaims}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Questionable Claims</p>
                    <p className="text-2xl font-bold">{influencer.questionableClaims}</p>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-4">Recent Claims</h3>
                {influencer.recentClaims.map((claim, index) => (
                  <Card key={index} className="mb-4">
                    <CardHeader>
                      <CardTitle className="text-lg">{claim.claim}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {claim.verifications.map((verification, vIndex) => (
                        <div key={vIndex} className="mb-2">
                          <p>
                            <strong>{verification.service}:</strong>{' '}
                            <Badge
                              variant={verification.isVerified ? "success" : "destructive"}
                            >
                              {verification.isVerified ? 'Verified' : 'Not Verified'}
                            </Badge>
                          </p>
                          <p>Confidence: {verification.confidence.toFixed(2)}%</p>
                          <p className="text-sm text-muted-foreground">{verification.explanation}</p>
                        </div>
                      ))}
                      <p className="mt-2">
                        <strong>Aggregate Score:</strong>{' '}
                        <Badge variant={claim.aggregateScore >= 70 ? "success" : "warning"}>
                          {claim.aggregateScore.toFixed(2)}%
                        </Badge>
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </MainLayout>
  )
}

