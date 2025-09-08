import { AnimationContainer } from "@/components";
import React from 'react'

const WelcomePage =() =>{
    return (
        <div className="flex flex-col items-center justify-center py-20">
            <AnimationContainer delay={0} className="max-w-3xl px-4">
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-semibold font-heading text-center mt-6 !leading-tight">
                    Welcome to SkillSWap
                </h1>
                <p className="text-base md:text-lg mt-6 text-center text-muted-foreground">
                    Connect, learn, and grow with our community of skilled professionals.
                </p>
            </AnimationContainer>
        </div>
    )
}

export default WelcomePage