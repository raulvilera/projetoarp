import React from 'react';
import { motion } from 'framer-motion';

interface PremiumHUDProps {
    size?: number;
    className?: string;
    animateInternal?: boolean;
}

const PremiumHUD: React.FC<PremiumHUDProps> = ({ size = 300, className = "", animateInternal = true }) => {
    return (
        <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
            <svg
                viewBox="0 0 400 400"
                className="w-full h-full drop-shadow-[0_0_15px_rgba(0,163,255,0.5)]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <filter id="glow-light" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>

                    <linearGradient id="hud-gradient-light" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00D1FF" stopOpacity="0.6" />
                        <stop offset="50%" stopColor="#00E0FF" />
                        <stop offset="100%" stopColor="#00D1FF" stopOpacity="0.6" />
                    </linearGradient>

                    <mask id="icon-mask">
                        <circle cx="200" cy="200" r="180" fill="white" />
                    </mask>
                </defs>

                {/* Outer Tech Rings - Clean Style */}
                <motion.circle
                    cx="200"
                    cy="200"
                    r="190"
                    stroke="rgba(0, 209, 255, 0.15)"
                    strokeWidth="1"
                    strokeDasharray="5 15"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
                />

                <motion.circle
                    cx="200"
                    cy="200"
                    r="180"
                    stroke="rgba(0, 224, 255, 0.2)"
                    strokeWidth="1"
                    strokeDasharray="100 200"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                />

                {/* Main Double Frame Circles - More transparent/clean */}
                <circle cx="200" cy="200" r="150" stroke="rgba(0, 209, 255, 0.3)" strokeWidth="2" />
                <circle cx="200" cy="200" r="145" stroke="rgba(0, 209, 255, 0.1)" strokeWidth="1" />

                {/* Rotating thin segments */}
                <motion.path
                    d="M200 55 A145 145 0 0 1 345 200"
                    stroke="rgba(0, 224, 255, 0.5)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    style={{ originX: "200px", originY: "200px" }}
                />

                {/* Internal HUD Elements - Blueprint Style */}
                <g mask="url(#icon-mask)">
                    {/* 1. Factory Pilar (Left) */}
                    <g transform="translate(110, 200)">
                        <path d="M-30 15 L-30 -10 L-15 -10 L-15 0 L0 0 L0 15 Z" fill="rgba(0, 209, 255, 0.05)" stroke="#00D1FF" strokeWidth="1.5" />
                        <motion.g
                            animate={animateInternal ? { rotate: 360 } : {}}
                            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                            style={{ originX: "12px", originY: "12px" }}
                        >
                            <circle cx="12" cy="12" r="10" stroke="#00D1FF" strokeWidth="1.5" strokeDasharray="3 2" />
                            <circle cx="12" cy="12" r="4" stroke="#00D1FF" strokeWidth="1" />
                        </motion.g>
                    </g>

                    {/* 2. Central Human Pilar (Center) */}
                    <g transform="translate(200, 200)">
                        <motion.path
                            d="M-30 0 L-15 15 L0 0 L-15 -15 Z"
                            stroke="#00D1FF"
                            strokeWidth="1.5"
                            animate={animateInternal ? { opacity: [0.4, 0.8, 0.4] } : {}}
                            transition={{ duration: 3, repeat: Infinity }}
                        />
                        <path d="M-19 0 L-17 2 L-13 -2" stroke="#00D1FF" strokeWidth="1.5" strokeLinecap="round" />

                        <circle cx="5" cy="-20" r="8" stroke="#00D1FF" strokeWidth="1.5" />
                        <path d="M-8 10 L-8 0 C-8 -8 18 -8 18 0 L18 10" stroke="#00D1FF" strokeWidth="1.5" fill="none" />

                        <motion.path
                            d="M25 -3 C29 -10 40 -7 33 3 C29 0 25 7 25 10 C25 7 21 0 17 3 C10 -7 21 -10 25 -3"
                            fill="#F43F5E"
                            stroke="#F43F5E"
                            strokeWidth="1"
                            opacity="0.8"
                            animate={animateInternal ? { scale: [1, 1.2, 1] } : {}}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                    </g>

                    {/* 3. Network Pilar (Right) */}
                    <g transform="translate(300, 200)">
                        <circle cx="0" cy="0" r="12" stroke="#00D1FF" strokeWidth="1.5" />
                        <motion.g animate={animateInternal ? { rotate: -360 } : {}} transition={{ duration: 25, repeat: Infinity, ease: "linear" }}>
                            <line x1="12" y1="0" x2="28" y2="-15" stroke="#00D1FF" strokeWidth="1" opacity="0.4" />
                            <circle cx="28" cy="-15" r="4" stroke="#00D1FF" strokeWidth="1.5" />

                            <line x1="12" y1="0" x2="28" y2="15" stroke="#00D1FF" strokeWidth="1" opacity="0.4" />
                            <circle cx="28" cy="15" r="4" stroke="#00D1FF" strokeWidth="1.5" />
                        </motion.g>
                    </g>

                    <line x1="140" y1="200" x2="170" y2="200" stroke="#00D1FF" strokeWidth="1" strokeDasharray="2 3" opacity="0.3" />
                    <line x1="230" y1="200" x2="260" y2="200" stroke="#00D1FF" strokeWidth="1" strokeDasharray="2 3" opacity="0.3" />
                </g>

                {/* Scanning Scanline Overlay - Subtle */}
                <motion.rect
                    x="100"
                    width="200"
                    height="2"
                    fill="rgba(0, 209, 255, 0.2)"
                    animate={{ y: [120, 280, 120] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                />
            </svg>

            {/* HUD Ambient Glow - Subtle Light */}
            <div className="absolute inset-0 pointer-events-none opacity-10 border border-blue-400/10 rounded-full bg-[radial-gradient(circle,rgba(0,209,255,0.05)_0%,transparent_80%)]" />
        </div>
    );
};

export default PremiumHUD;
