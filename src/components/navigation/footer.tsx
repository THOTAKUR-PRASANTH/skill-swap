import Link from 'next/link';
import Image from 'next/image';
import { AnimationContainer, Icons } from "@/components"
import { TextHoverEffect } from "@/components/ui/text-hover-effect"

const Footer = () => {
    return (
        /* MODIFICATION: Removed pt-16 and lg:pt-32 */
        <footer className="flex flex-col relative items-center justify-center border-t border-border pb-8 md:pb-0 px-6 lg:px-8 w-full max-w-6xl mx-auto bg-[radial-gradient(35%_128px_at_50%_0%,theme(backgroundColor.white/8%),transparent)]">

            <div className="absolute top-0 left-1/2 right-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-1.5 bg-foreground rounded-full"></div>

            <div className="grid gap-8 xl:grid-cols-3 xl:gap-8 w-full mt-16"> {/* Added mt-16 for spacing */ }

                <AnimationContainer delay={0.1}>
                    {/* MODIFICATION: Changed max-w to 400px and added SkillSwap text beside logo */}
                    <div className="flex flex-col items-start justify-start md:max-w-[400px]">
                        <div className="flex items-center gap-2"> {/* Added flex container */}
                            <Image
                              src={"/logo.png"}
                              width={40}  /* MODIFICATION: Set back to 40 for correct layout */
                              height={40} /* MODIFICATION: Set back to 40 for correct layout */
                              alt='SkillSwap'
                             />
                            {/* Added the brand name text */}
                            <span className="text-xl font-bold text-white">
                                SkillSwap
                            </span>
                        </div>
                        <p className="text-muted-foreground mt-4 text-sm text-start">
                            Manage your links with ease.
                        </p>
                        <span className="mt-4 text-neutral-200 text-sm flex items-center">
                            Made by <Link href="https://prashanth.app/" className="font-semibold ml-1">Prashanth_Chowdari</Link>
                        </span>
                    </div>
                </AnimationContainer>

                {/* MODIFICATION: Split the link columns into two separate grid items */}
                
                {/* Link Column 1 (Product & Integrations) */}
                <div className="md:grid md:grid-cols-2 md:gap-8 xl:col-span-1">
                    <AnimationContainer delay={0.2}>
                        <div className="">
                            <h3 className="text-base font-medium text-white">
                                Product
                            </h3>
                            <ul className="mt-4 text-sm text-muted-foreground">
                                <li className="mt-2">
                                    <Link href="" className="hover:text-foreground transition-all duration-300">
                                        Features
                                    </Link>
                                </li>
                                <li className="mt-2">
                                    <Link href="" className="hover:text-foreground transition-all duration-300">
                                        Pricing
                                    </Link>
                                </li>
                                <li className="mt-2">
                                    <Link href="" className="hover:text-foreground transition-all duration-300">
                                        Testimonials
                                    </Link>
                                </li>
                                <li className="mt-2">
                                    <Link href="" className="hover:text-foreground transition-all duration-300">
                                        Integration
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </AnimationContainer>
                    <AnimationContainer delay={0.3}>
                        <div className="mt-10 md:mt-0 flex flex-col">
                            <h3 className="text-base font-medium text-white">
                                Integrations
                            </h3>
                            <ul className="mt-4 text-sm text-muted-foreground">
                                <li className="">
                                    <Link href="" className="hover:text-foreground transition-all duration-300">
                                        Facebook
                                    </Link>
                                </li>
                                <li className="mt-2">
                                    <Link href="" className="hover:text-foreground transition-all duration-300">
                                        Instagram
                                    </Link>
                                </li>
                                <li className="mt-2">
                                    <Link href="" className="hover:text-foreground transition-all duration-300">
                                        Twitter
                                    </Link>
                                </li>
                                <li className="mt-2">
                                    <Link href="" className="hover:text-foreground transition-all duration-300">
                                        LinkedIn
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </AnimationContainer>
                </div>
                
                {/* Link Column 2 (Resources & SkillSwap) */}
                <div className="md:grid md:grid-cols-2 md:gap-8 xl:col-span-1">
                    <AnimationContainer delay={0.4}>
                        <div className="">
                            <h3 className="text-base font-medium text-white">
                                Resources
                            </h3>
                            <ul className="mt-4 text-sm text-muted-foreground">
                                <li className="mt-2">
                                    <Link href="/resources/blog" className="hover:text-foreground transition-all duration-300">
                                        Blog
                                    </Link>
                                </li>
                                <li className="mt-2">
                                    <Link href="/resources/help" className="hover:text-foreground transition-all duration-300">
                                        Support
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </AnimationContainer>
                    <AnimationContainer delay={0.5}>
                        <div className="mt-10 md:mt-0 flex flex-col">
                            <h3 className="text-base font-medium text-white">
                                SkillSwap
                            </h3>
                            <ul className="mt-4 text-sm text-muted-foreground">
                                <li className="">
                                    <Link href="" className="hover:text-foreground transition-all duration-300">
                                        About Us
                                    </Link>
                                </li>
                                <li className="mt-2">
                                    <Link href="/privacy" className="hover:text-foreground transition-all duration-300">
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li className="mt-2">
                                    <Link href="/terms" className="hover:text-foreground transition-all duration-300">
                                        Terms & Conditions
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </AnimationContainer>
                </div>

            </div>

            <div className="mt-8 border-t border-border/40 pt-4 md:pt-8 md:flex md:items-center md:justify-between w-full">
                <AnimationContainer delay={0.6}>
                    <p className="text-sm text-muted-foreground mt-8 md:mt-0">
                        &copy; {new Date().getFullYear()} SkillSwap . All rights reserved.
                    </p>
                </AnimationContainer>
            </div>

            <div className="h-[15rem] lg:h-[15rem] hidden md:flex items-center justify-center">
                <TextHoverEffect text="SkillSwap" />
            </div>
        </footer>
    )
}

export default Footer