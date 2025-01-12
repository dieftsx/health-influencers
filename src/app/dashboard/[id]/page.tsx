
"use client"

import { useEffect, useState } from 'react'
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"

interface Claim {
  id: number;
  claim: string;
  status: 'Verified' | 'Questionable' | 'Debunked';
  confidence: number;
  category: string;
}

interface Influencer {
  id: number;
  name: string;
  trustScore: number;
  followers: string;
  verifiedClaims: number;
  questionableClaims: number;
  claims: Claim[];
}

export default function InfluencerDetail({ params }: { params: { id: string } }) {
  const [influencer, setInfluencer] = useState<Influencer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchInfluencer = async () => {
      try {
        const response = await fetch(`/api/influencer/${params.id}`)
        const data = await response.json()
        if (data.success) {
          setInfluencer(data.influencer)
        } else {
          throw new Error(data.error)
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch influencer data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchInfluencer()
  }, [params.id, toast])

  if (isLoading) {
    return <MainLayout>Loading...</MainLayout>
  }

  if (!influencer) {
    return <MainLayout>Influencer not found</MainLayout>
  }

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-6">{influencer.name}</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trust Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
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
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Followers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{influencer.followers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Verified Claims
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{influencer.verifiedClaims}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Questionable Claims
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{influencer.questionableClaims}</div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Claims</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Claim</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Category</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {influencer.claims.map((claim) => (
                <TableRow key={claim.id}>
                  <TableCell className="font-medium">{claim.claim}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        claim.status === "Verified"
                          ? "success"
                          : claim.status === "Questionable"
                          ? "warning"
                          : "destructive"
                      }
                    >
                      {claim.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{claim.confidence}%</TableCell>
                  <TableCell>{claim.category}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </MainLayout>
  )
}

