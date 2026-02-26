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
        { icon: <Factory />, label: 'Ambiente Laboral' },
        { icon: <div className="relative"><Shield className="absolute -left-2 top-0 opacity-50" /><Heart className="text-red-400" /></div>, label: 'Prevenção e Saúde' },
        { icon: <Network />, label: 'Rede de Fatores' },
        { icon: <BarChart3 />, label: 'Análise de Riscos' },
    ];

    return (
        <div className="splash-container">
            <div className="splash-overlay" />
            <div className="scanline" />

            <div className="carousel-track">
                <motion.div
                    className="flex gap-8"
                    animate={{
                        x: [0, -1000],
                    }}
                    transition={{
                        duration: 20,
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
