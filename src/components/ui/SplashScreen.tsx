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
                    className="relative flex items-center justify-center"
                >
                    <Factory className="w-12 h-12" />
                </motion.div>
            ),
            label: 'Ambiente Laboral'
        },
        {
            icon: (
                <div className="relative flex items-center justify-center w-12 h-12">
                    <motion.div
                        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <Shield className="text-cyan-500 w-full h-full" />
                    </motion.div>
                    <motion.div
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Heart className="text-red-500 w-8 h-8 relative z-10" />
                    </motion.div>
                </div>
            ),
            label: 'Prevenção e Saúde'
        },
        {
            icon: (
                <motion.div
                    animate={{
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="flex items-center justify-center"
                >
                    <Network className="w-12 h-12" />
                </motion.div>
            ),
            label: 'Rede de Fatores'
        },
        {
            icon: (
                <div className="relative flex items-center justify-center w-12 h-12 overflow-hidden">
                    <motion.div
                        animate={{ y: ["100%", "0%", "100%"] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-cyan-500/20"
                    />
                    <BarChart3 className="w-10 h-10 relative z-10" />
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
                    className="flex min-w-max gap-12 px-12"
                    animate={{
                        x: ["0%", "-50%"],
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                >
                    {/* Triplicamos para garantir cobertura total em telas largas */}
                    {[...elements, ...elements, ...elements, ...elements].map((el, index) => (
                        <div key={`splash-item-${index}`} className="hologram-element min-w-[220px]">
                            <div className="flex flex-col items-center">
                                <div className="icon-wrapper text-cyan-400 mb-6">{el.icon}</div>
                                <span className="text-xs font-medium uppercase tracking-widest">{el.label}</span>
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
