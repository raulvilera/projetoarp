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
        { icon: <Shield />, label: 'Prevenção e Saúde' },
        { icon: <Network />, label: 'Fatores Psicossociais' },
    ];

    return (
        <div className="splash-container">
            <div className="splash-overlay" />
            <div className="scanline" />

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="carousel-container"
            >
                {elements.map((el, index) => {
                    const angle = (index * 120 + rotation) % 360;
                    return (
                        <motion.div
                            key={index}
                            className="hologram-element"
                            animate={{
                                rotateY: angle,
                                z: Math.cos((angle * Math.PI) / 180) * 400,
                                x: Math.sin((angle * Math.PI) / 180) * 500,
                                opacity: Math.cos((angle * Math.PI) / 180) > 0 ? 1 : 0.2,
                                scale: Math.cos((angle * Math.PI) / 180) > 0 ? 1 : 0.7,
                            }}
                            transition={{
                                duration: 2.5,
                                ease: "easeInOut"
                            }}
                        >
                            <div className="flex flex-col items-center">
                                <i className="text-cyan-400">{el.icon}</i>
                                <span>{el.label}</span>
                            </div>
                        </motion.div>
                    );
                })}
                <div className="hologram-glow" />
            </motion.div>

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
