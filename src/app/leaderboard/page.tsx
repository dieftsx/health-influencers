
"use client"

import { useState, useEffect } from 'react'
import { MainLayout } from "@/components/main-layout"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ArrowUpDown, Search, AlertCircle, CheckCircle2, Info } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Verification {
  service: string;
  result: {
    isVerified: boolean;
    confidence: number;
    sources: string[];
    explanation: string;
  };
}

interface Claim {
  id: number;
  text: string;
  verifications: Verification[];
  aggregateScore: number;
}

interface Influencer {
  id: number;
  name: string;
  trustScore: number;
  followers: string;
  verifiedClaims: number;
  questionableClaims: number;
  recentClaims: Claim[];
}

export default function Leaderboard() {
  const [influencers, setInfluencers] = useState<Influencer[]>([])
  const [sortField, setSortField] = useState<string>('trustScore')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchInfluencers = async () => {
      try {
        const response = await fetch('/api/influencers')
        const data = await response.json()
        if (data.success) {
          setInfluencers(data.influencers)
        }
      } catch (error) {
        console.error('Error fetching influencers:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInfluencers()
  }, [])

  const sortInfluencers = (a: Influencer, b: Influencer) => {
    const multiplier = sortDirection === 'asc' ? 1 : -1
    return (
      (typeof a[sortField as keyof Influencer] === 'string'
        ? (a[sortField as keyof Influencer] as string).localeCompare(b[sortField as keyof Influencer] as string)
        : (a[sortField as keyof Influencer] as number) - (b[sortField as keyof Influencer] as number)
      ) * multiplier
    )
  }

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const filteredInfluencers = influencers
    .filter(influencer => 
      influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === 'all' || influencer.trustScore >= 
        (selectedCategory === 'high' ? 80 : selectedCategory === 'medium' ? 60 : 0) &&
       influencer.trustScore < 
        (selectedCategory === 'high' ? 101 : selectedCategory === 'medium' ? 80 : 60))
    )
    .sort(sortInfluencers)

  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Influencer Trust Leaderboard</h1>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-5 w-5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Trust scores are calculated using multiple AI services including Consensus, Perplexity, and OpenAI</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Influencers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{influencers.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Trust Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(
                  influencers.reduce((acc, inf) => acc + inf.trustScore, 0) / 
                  influencers.length
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Claims Verified
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {influencers.reduce((acc, inf) => acc + inf.verifiedClaims, 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Questionable Claims
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {influencers.reduce((acc, inf) => acc + inf.questionableClaims, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <Input
              placeholder="Search influencers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
              icon={Search}
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by trust score" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Scores</SelectItem>
              <SelectItem value="high">High Trust (80-100)</SelectItem>
              <SelectItem value="medium">Medium Trust (60-79)</SelectItem>
              <SelectItem value="low">Low Trust (0-59)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                    Name <ArrowUpDown className="inline h-4 w-4" />
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('trustScore')}>
                    Trust Score <ArrowUpDown className="inline h-4 w-4" />
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('followers')}>
                    Followers <ArrowUpDown className="inline h-4 w-4" />
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('verifiedClaims')}>
                    Verified Claims <ArrowUpDown className="inline h-4 w-4" />
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('questionableClaims')}>
                    Questionable Claims <ArrowUpDown className="inline h-4 w-4" />
                  </TableHead>
                  <TableHead>Recent Claims</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInfluencers.map((influencer) => (
                  <TableRow key={influencer.id}>
                    <TableCell className="font-medium">
                      <Link href={`/dashboard/${influencer.id}`} className="hover:underline">
                        {influencer.name}
                      </Link>
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>{influencer.followers}</TableCell>
                    <TableCell>{influencer.verifiedClaims}</TableCell>
                    <TableCell>{influencer.questionableClaims}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger className="text-blue-500 hover:underline">
                          View Latest
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Recent Claims by {influencer.name}</DialogTitle>
                            <DialogDescription>
                              Verification results from multiple AI services
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            {influencer.recentClaims.map((claim) => (
                              <Card key={claim.id}>
                                <CardHeader>
                                  <CardTitle className="text-lg">{claim.text}</CardTitle>
                                  <CardDescription>
                                    Aggregate Score: {claim.aggregateScore.toFixed(1)}%
                                  </CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-2">
                                    {claim.verifications.map((verification) => (
                                      <div
                                        key={verification.service}
                                        className="flex items-center justify-between"
                                      >
                                        <div className="flex items-center gap-2">
                                          {verification.result.isVerified ? (
                                            <CheckCircle2 className="text-green-500" />
                                          ) : (
                                            <AlertCircle className="text-red-500" />
                                          )}
                                          <span>{verification.service}</span>
                                        </div>
                                        <Badge>
                                          {verification.result.confidence.toFixed(1)}%
                                        </Badge>
                                      </div>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}

