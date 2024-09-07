// components/Hero.tsx
'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { motion, useAnimation } from 'framer-motion'
import { ArrowRight, Pen, BookOpen, Users } from 'lucide-react'
import { useEffect } from 'react'

export default function Hero() {
    const { data: session } = useSession()
    const communitySize = 5000;
    const controls = useAnimation()

    useEffect(() => {
        controls.start("visible")
    }, [controls])

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    }

    return (
        <motion.section 
            className="text-center py-16 bg-background"
            variants={containerVariants}
            initial="hidden"
            animate={controls}
        >
            <motion.h1 
                className="font-zodiak text-5xl md:text-7xl font-bold mb-6 text-primary"
                variants={itemVariants}
            >
                Welcome to Nidix
            </motion.h1>
            <motion.p 
                className="font-satoshi text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
                variants={itemVariants}
            >
                A serene space for thoughts and ideas to flourish
            </motion.p>
            
            <motion.div 
                className="flex justify-center space-x-12 mb-12"
                variants={itemVariants}
            >
                {[
                    { Icon: Pen, label: "Write" },
                    { Icon: BookOpen, label: "Read" },
                    { Icon: Users, label: "Connect" }
                ].map(({ Icon, label }) => (
                    <motion.div 
                        key={label}
                        className="flex flex-col items-center"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Icon className="w-8 h-8 mb-2 text-primary" />
                        <span className="text-sm font-medium">{label}</span>
                    </motion.div>
                ))}
            </motion.div>

            <motion.div variants={itemVariants}>
                {session ? (
                    <Button asChild size="lg" className="group">
                        <Link href="/create-post">
                            Create a New Post
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                ) : (
                    <div className="space-x-6">
                        {["Sign In", "Sign Up"].map((label) => (
                            <Button 
                                key={label}
                                asChild 
                                size="lg" 
                                variant={label === "Sign In" ? "default" : "outline"} 
                                className="group"
                            >
                                <Link href={`/auth/${label.toLowerCase().replace(' ', '')}`}>
                                    {label}
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                        ))}
                    </div>
                )}
            </motion.div>

            <motion.p 
                className="mt-8 text-sm text-muted-foreground"
                variants={itemVariants}
            >
                Join our community of {communitySize.toLocaleString()} writers and thinkers
            </motion.p>
        </motion.section>
    )
}