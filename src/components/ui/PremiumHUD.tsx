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
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>

                    <linearGradient id="hud-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00A3FF" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#00E0FF" />
                        <stop offset="100%" stopColor="#00A3FF" stopOpacity="0.8" />
                    </linearGradient>

                    <mask id="icon-mask">
                        <circle cx="200" cy="200" r="180" fill="white" />
                    </mask>
                </defs>

                {/* Outer Tech Rings */}
                <motion.circle
                    cx="200"
                    cy="200"
                    r="190"
                    stroke="rgba(0, 163, 255, 0.1)"
                    strokeWidth="1"
                    strokeDasharray="10 20"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                />

                <motion.circle
                    cx="200"
                    cy="200"
                    r="170"
                    stroke="url(#hud-gradient)"
                    strokeWidth="2"
                    strokeDasharray="200 100"
                    opacity="0.3"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                />

                {/* Main Double Frame Circles */}
                <circle cx="200" cy="200" r="150" stroke="rgba(0, 163, 255, 0.4)" strokeWidth="6" />
                <circle cx="200" cy="200" r="142" stroke="rgba(0, 163, 255, 0.6)" strokeWidth="1" />

                {/* Rotating segments on the main circle */}
                <motion.path
                    d="M200 50 A150 150 0 0 1 350 200"
                    stroke="#00E0FF"
                    strokeWidth="8"
                    strokeLinecap="round"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    style={{ originX: "200px", originY: "200px" }}
                />

                <motion.path
                    d="M200 350 A150 150 0 0 1 50 200"
                    stroke="#00E0FF"
                    strokeWidth="8"
                    strokeLinecap="round"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    style={{ originX: "200px", originY: "200px" }}
                />

                {/* Internal HUD Elements - Composition */}
                <g mask="url(#icon-mask)">
                    {/* 1. Factory Pilar (Left) */}
                    <g transform="translate(100, 200)">
                        {/* Factory Body */}
                        <path d="M-40 20 L-40 -10 L-20 -10 L-20 0 L0 0 L0 20 Z" fill="rgba(0, 163, 255, 0.2)" stroke="#00E0FF" strokeWidth="2" />
                        <path d="M-20 -10 L-20 -20 L-10 -20 L-10 -10 Z" fill="rgba(0, 163, 255, 0.4)" stroke="#00E0FF" strokeWidth="1" />

                        {/* Animating Gear */}
                        <motion.g
                            animate={animateInternal ? { rotate: 360 } : {}}
                            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                        >
                            <circle cx="15" cy="15" r="12" stroke="#00E0FF" strokeWidth="2" strokeDasharray="4 2" />
                            <circle cx="15" cy="15" r="5" stroke="#00E0FF" strokeWidth="1" />
                        </motion.g>
                    </g>

                    {/* 2. Central Human Pilar (Center) */}
                    <g transform="translate(200, 200)">
                        {/* Shield with Check */}
                        <motion.path
                            d="M-40 0 L-20 20 L0 0 L-20 -20 Z"
                            stroke="#00E0FF"
                            strokeWidth="2"
                            animate={animateInternal ? { opacity: [0.5, 1, 0.5] } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        <path d="M-25 0 L-22 3 L-18 -3" stroke="#00E3FF" strokeWidth="2" strokeLinecap="round" />

                        {/* Human Icon */}
                        <circle cx="5" cy="-25" r="10" stroke="#00E0FF" strokeWidth="2" fill="rgba(0, 163, 255, 0.1)" />
                        <path d="M-10 15 L-10 0 C-10 -10 20 -10 20 0 L20 15" stroke="#00E0FF" strokeWidth="2" fill="none" />

                        {/* Pulsing Heart */}
                        <motion.path
                            d="M30 -5 C35 -15 50 -10 40 5 C35 0 30 10 30 15 C30 10 25 0 20 5 C10 -10 25 -15 30 -5"
                            fill="#F43F5E"
                            stroke="#F43F5E"
                            strokeWidth="1"
                            animate={animateInternal ? { scale: [1, 1.3, 1] } : {}}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                    </g>

                    {/* 3. Network Pilar (Right) */}
                    <g transform="translate(300, 200)">
                        {/* Molecule/Network */}
                        <circle cx="0" cy="0" r="15" stroke="#00E0FF" strokeWidth="2" />
                        <motion.g animate={animateInternal ? { rotate: -360 } : {}} transition={{ duration: 15, repeat: Infinity, ease: "linear" }}>
                            <line x1="15" y1="0" x2="35" y2="-20" stroke="#00E0FF" strokeWidth="1" opacity="0.6" />
                            <circle cx="35" cy="-20" r="5" stroke="#00E0FF" strokeWidth="2" />

                            <line x1="15" y1="0" x2="35" y2="20" stroke="#00E0FF" strokeWidth="1" opacity="0.6" />
                            <circle cx="35" cy="20" r="5" stroke="#00E0FF" strokeWidth="2" />

                            <line x1="-15" y1="0" x2="-35" y2="0" stroke="#00E0FF" strokeWidth="1" opacity="0.6" />
                            <circle cx="-35" cy="0" r="5" stroke="#00E0FF" strokeWidth="2" />
                        </motion.g>

                        {/* Connection Lines from Center */}
                    </g>

                    <line x1="130" y1="200" x2="160" y2="200" stroke="#00E0FF" strokeWidth="1" strokeDasharray="2 2" />
                    <line x1="240" y1="200" x2="270" y2="200" stroke="#00E0FF" strokeWidth="1" strokeDasharray="2 2" />
                </g>

                {/* Data points flaring */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                    <motion.circle
                        key={i}
                        r="3"
                        fill="#00E0FF"
                        animate={{
                            cx: 200 + Math.cos(angle * Math.PI / 180) * 150,
                            cy: 200 + Math.sin(angle * Math.PI / 180) * 150,
                            opacity: [0, 1, 0],
                            scale: [0.5, 1.5, 0.5]
                        }}
                        transition={{
                            duration: 2 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2
                        }}
                    />
                ))}

                {/* Scanning Scanline Overlay */}
                <motion.rect
                    x="50"
                    width="300"
                    height="4"
                    fill="rgba(0, 163, 255, 0.3)"
                    animate={{ y: [100, 300, 100] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
            </svg>

            {/* HUD Background Grid / Glows */}
            <div className="absolute inset-0 pointer-events-none opacity-20 border border-blue-500/20 rounded-full bg-[radial-gradient(circle,rgba(0,163,255,0.1)_0%,transparent_70%)]" />
        </div>
    );
};

export default PremiumHUD;
