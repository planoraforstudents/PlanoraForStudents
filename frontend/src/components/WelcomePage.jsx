import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
    const [isVisible, setIsVisible] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const buttonRef = useRef(null);
    const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);

        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });

            // Magnetic button effect
            if (buttonRef.current && !isHovering) {
                const rect = buttonRef.current.getBoundingClientRect();
                const buttonCenterX = rect.left + rect.width / 2;
                const buttonCenterY = rect.top + rect.height / 2;

                const distanceX = e.clientX - buttonCenterX;
                const distanceY = e.clientY - buttonCenterY;
                const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

                // Magnetic pull within 200px
                if (distance < 200) {
                    const pull = (200 - distance) / 200;
                    setButtonPosition({
                        x: distanceX * pull * 0.15,
                        y: distanceY * pull * 0.15,
                    });
                } else {
                    setButtonPosition({ x: 0, y: 0 });
                }
            }
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            clearTimeout(timer);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [isHovering]);

    return (
        <div className="relative min-h-screen bg-white overflow-hidden">
            {/* Minimal corner indicators */}
            <div
                className={`absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-black transition-all duration-1000 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"
                    }`}
            />
            <div
                className={`absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-black transition-all duration-1000 delay-100 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"
                    }`}
            />
            <div
                className={`absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-black transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"
                    }`}
            />
            <div
                className={`absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-black transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"
                    }`}
            />

            {/* Subtle radial gradient following mouse */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none transition-opacity duration-300"
                style={{
                    background: `radial-gradient(circle 400px at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`,
                }}
            />

            {/* Main content - centered */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
                {/* Floating button container */}
                <div className="relative">
                    {/* Warning text above button */}
                    <div
                        className={`absolute -top-20 left-1/2 transform -translate-x-1/2 whitespace-nowrap transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
                            }`}
                    >
                        <p className="text-xs tracking-[0.5em] font-mono text-black/500 uppercase">
                            There is no way back
                        </p>
                    </div>

                    {/* Main floating button - Fixed navigation */}
                    <Link to="/home" className="block">
                        <div
                            ref={buttonRef}
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => {
                                setIsHovering(false);
                                setButtonPosition({ x: 0, y: 0 });
                            }}
                            className={`group relative px-16 py-8 bg-black text-white font-bold text-xl tracking-[0.3em] uppercase overflow-hidden cursor-pointer transition-all duration-1000 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"
                                } hover:scale-110 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] active:scale-95`}
                            style={{
                                transform: `translate(${buttonPosition.x}px, ${buttonPosition.y}px) scale(${isHovering ? 1.1 : 1})`,
                                transition: isHovering ? "all 0.3s ease-out" : "all 0.5s ease-out",
                            }}
                        >
                            {/* Animated border lines */}
                            <div className="absolute inset-0 pointer-events-none">
                                {/* Top line */}
                                <div className="absolute top-0 left-0 w-0 h-[2px] bg-white group-hover:w-full transition-all duration-500" />
                                {/* Right line */}
                                <div className="absolute top-0 right-0 w-[2px] h-0 bg-white group-hover:h-full transition-all duration-500 delay-100" />
                                {/* Bottom line */}
                                <div className="absolute bottom-0 right-0 w-0 h-[2px] bg-white group-hover:w-full transition-all duration-500 delay-200" />
                                {/* Left line */}
                                <div className="absolute bottom-0 left-0 w-[2px] h-0 bg-white group-hover:h-full transition-all duration-500 delay-300" />
                            </div>

                            {/* Expanding background effect */}
                            <div className="absolute inset-0 bg-white transform scale-0 group-hover:scale-100 transition-transform duration-700 origin-center" />

                            {/* Button text */}
                            <span className="relative z-10 flex items-center gap-4 group-hover:text-black transition-colors duration-300">
                                Let's Go

                                {/* Arrow */}
                                <svg
                                    className="w-6 h-6 transform group-hover:translate-x-2 transition-transform duration-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="square"
                                        strokeLinejoin="miter"
                                        strokeWidth={2.5}
                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                    />
                                </svg>
                            </span>

                            {/* Floating particles on hover */}
                            {isHovering && (
                                <>
                                    {[...Array(12)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="absolute w-1 h-1 bg-black/20 rounded-full animate-float-particle"
                                            style={{
                                                left: `${50 + Math.cos(i * 30 * Math.PI / 180) * 60}%`,
                                                top: `${50 + Math.sin(i * 30 * Math.PI / 180) * 60}%`,
                                                animationDelay: `${i * 0.1}s`,
                                            }}
                                        />
                                    ))}
                                </>
                            )}
                        </div>
                    </Link>

                    {/* Pulsing ring around button */}
                    <div
                        className={`absolute inset-0 -m-8 border border-black/10 rounded-sm pointer-events-none transition-all duration-1000 delay-700 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"
                            }`}
                    >
                        <div className="absolute inset-0 border border-black/5 animate-ping-slow" />
                    </div>
                </div>

                {/* Minimal status text at bottom */}
                <div
                    className={`absolute bottom-12 transition-all duration-1000 delay-900 ${isVisible ? "opacity-100" : "opacity-0"
                        }`}
                >
                    <p className="text-[10px] font-mono tracking-[0.5em] text-black/20 uppercase">
                        System Ready
                    </p>
                </div>
            </div>

            {/* Floating geometric shapes in background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className={`absolute border border-black/[0.02] transition-all duration-1000`}
                        style={{
                            width: `${100 + i * 60}px`,
                            height: `${100 + i * 60}px`,
                            left: `${50}%`,
                            top: `${50}%`,
                            transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
                            animation: `rotate-slow ${20 + i * 3}s linear infinite ${i % 2 === 0 ? 'reverse' : ''}`,
                            animationDelay: `${i * 0.5}s`,
                            opacity: isVisible ? 1 : 0,
                            transitionDelay: `${i * 100}ms`,
                        }}
                    />
                ))}
            </div>

            {/* Subtle noise texture */}
            <div className="absolute inset-0 opacity-[0.015] mix-blend-multiply pointer-events-none bg-noise" />
        </div>
    );
}