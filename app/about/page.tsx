// app/about/page.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="font-zodiak text-5xl font-bold mb-8 text-center">About Nidix</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="font-cabinet-grotesk text-2xl">Our Story</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-satoshi mb-4">Nidix was born from a simple yet powerful idea: to create a space where thoughts and ideas could flourish in a serene digital environment. Founded in 2023, our platform has quickly become a haven for writers, thinkers, and creatives from all walks of life.</p>
          <p className="font-satoshi">We believe that in the chaos of the digital world, there's a need for a tranquil corner where ideas can be shared, discussed, and nurtured. Nidix provides that corner, offering a minimalist, distraction-free writing experience coupled with powerful community features.</p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="font-cabinet-grotesk text-2xl">Our Mission</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-satoshi">At Nidix, our mission is to empower voices, foster meaningful discussions, and create a community of lifelong learners. We strive to:</p>
          <ul className="font-satoshi list-disc list-inside mt-4 space-y-2">
            <li>Provide a platform that prioritizes content quality over quantity</li>
            <li>Foster a supportive community where ideas are respected and constructive feedback is encouraged</li>
            <li>Continuously innovate our tools to enhance the writing and reading experience</li>
            <li>Promote digital well-being by offering a calm, focused environment</li>
            <li>Champion diversity of thought and inclusivity in our community</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="font-cabinet-grotesk text-2xl">What Sets Us Apart</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="font-satoshi space-y-4">
            <li><strong>Minimalist Design:</strong> Our clutter-free interface allows writers to focus on what matters most - their content.</li>
            <li><strong>Community-Driven:</strong> Nidix is more than a blogging platform; it's a community of like-minded individuals passionate about sharing knowledge.</li>
            <li><strong>Advanced Writing Tools:</strong> From our distraction-free editor to SEO optimization features, we provide everything writers need to create impactful content.</li>
            <li><strong>Reader-Friendly Experience:</strong> We've crafted a reading experience that's easy on the eyes and rich in features like bookmarking, highlighting, and personalized recommendations.</li>
            <li><strong>Privacy-Focused:</strong> We respect our users' privacy and data, implementing strict data protection measures.</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="font-cabinet-grotesk text-2xl">Join Our Community</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-satoshi mb-4">Whether you're a seasoned writer, a curious reader, or someone with a story to tell, there's a place for you at Nidix. Join our growing community and be part of a movement that values thoughtful content and meaningful connections.</p>
          <div className="flex justify-center space-x-4">
            <Button asChild>
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/posts">Explore Posts</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}