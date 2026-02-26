import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Heart, Factory, Network, BarChart3 } from 'lucide-react';
import './SplashScreen.css';

const SplashScreen: React.FC = () => {
    const elements = [
        {
            icon: (
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                    <Factory size={48} className="text-cyan-400" />
                </motion.div>
            ),
            label: 'Ambiente Laboral'
        },
        {
            icon: (
                <motion.div
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <Heart size={48} className="text-red-500" />
                </motion.div>
            ),
            label: 'Prevenção e Saúde'
        },
        {
            icon: (
                <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <Network size={48} className="text-cyan-400" />
                </motion.div>
            ),
            label: 'Rede de Fatores'
        },
        {
            icon: (
                <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                >
                    <BarChart3 size={48} className="text-cyan-400" />
                </motion.div>
            ),
            label: 'Análise de Riscos'
        },
    ];

    return (
        <div className="splash-container">
            <div className="splash-overlay" />

            <div className="carousel-track">
                <motion.div
                    className="flex min-w-max gap-16 px-16"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                >
                    {[...elements, ...elements, ...elements, ...elements].map((el, index) => (
                        <div key={`item-${index}`} className="hologram-element min-w-[250px] flex flex-col items-center justify-center">
                            <div className="icon-wrapper mb-8 flex items-center justify-center w-24 h-24 border border-cyan-500/20 rounded-full bg-cyan-500/5">
                                {el.icon}
                            </div>
                            <span className="text-sm font-bold uppercase tracking-widest text-cyan-400">{el.label}</span>
                        </div>
                    ))}
                </motion.div>
            </div>

            <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="loading-text mt-12 text-cyan-400 font-mono tracking-[0.3em]"
            >
                SISTEMA ARP :: INICIALIZANDO...
            </motion.div>
        </div>
    );
};

export default SplashScreen;
