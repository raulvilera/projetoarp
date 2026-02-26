import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Heart, Activity, Factory, Network, BarChart3 } from 'lucide-react';
import './SplashScreen.css';

const SplashScreen: React.FC = () => {
    const [rotation, setRotation] = useState(0);

    // Auto-rotação lenta para o carrossel
    useEffect(() => {
        const interval = setInterval(() => {
            setRotation(prev => prev + 120);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const elements = [
        {
            icon: (
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="relative"
                >
                    <Factory />
                </motion.div>
            ),
            label: 'Ambiente Laboral'
        },
        {
            icon: (
                <div className="relative">
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <Shield className="text-cyan-500/30 scale-150" />
                    </motion.div>
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                    >
                        <Heart className="text-red-500 relative z-10" />
                    </motion.div>
                </div>
            ),
            label: 'Prevenção e Saúde'
        },
        {
            icon: (
                <motion.div
                    animate={{
                        rotateZ: [0, 10, -10, 0],
                        scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <Network />
                </motion.div>
            ),
            label: 'Rede de Fatores'
        },
        {
            icon: (
                <div className="relative flex items-center justify-center">
                    <motion.div
                        animate={{ height: ["20%", "80%", "40%", "100%", "20%"] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute bottom-0 w-full bg-cyan-500/10"
                    />
                    <BarChart3 className="relative z-10" />
                </div>
            ),
            label: 'Análise de Riscos'
        },
    ];

    return (
        <div className="splash-container">
            <div className="splash-overlay" />
            <div className="scanline" />

            <div className="carousel-track">
                <motion.div
                    className="flex gap-8"
                    animate={{
                        x: [-1000, 0],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    {[...elements, ...elements].map((el, index) => (
                        <div key={index} className="hologram-element min-w-[200px]">
                            <div className="flex flex-col items-center">
                                <div className="icon-wrapper text-cyan-400 mb-4">{el.icon}</div>
                                <span>{el.label}</span>
                            </div>
                        </div>
                    ))}
                </motion.div>
                <div className="hologram-glow" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 1 }}
                className="loading-text"
            >
                <span className="flex items-center gap-2">
                    INICIALIZANDO PLATAFORMA ARP
                    <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                    >
                        _
                    </motion.span>
                </span>
            </motion.div>

            <div className="absolute bottom-8 text-[0.6rem] text-cyan-900/40 uppercase tracking-[0.5em] font-light">
                Securing Human Capital & Risk Assessment
            </div>
        </div>
    );
};

export default SplashScreen;
