import { motion, useInView, useSpring } from 'framer-motion';
import React, { useEffect, useRef } from 'react';

const stats = [
  { label: 'Active Users', value: 120_000 },
  { label: 'Integrations', value: 85 },
  { label: 'Uptime', value: 99.99, suffix: '%' },
  { label: 'AI Models', value: 12 },
];

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = React.useState(0);
  const spring = useSpring(0, { duration: 1.8 });

  useEffect(() => {
    if (inView) {
      spring.set(value);
    }
  }, [inView, value, spring]);

  useEffect(() => {
    return spring.on('change', (latest) => {
      setDisplay(Number(latest));
    });
  }, [spring]);

  return (
    <span ref={ref}>{Math.round(display)}{suffix}</span>
  );
}

export default function CoolAnimatedSection() {
  return (
    <section className="relative z-[1] py-28 bg-gradient-to-br from-slate-900/95 via-blue-950/90 to-purple-900/85">
      <div className="relative z-[2] flex flex-col items-center justify-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-extrabold text-center text-white mb-6 drop-shadow-lg"
        >
          Numbers That Speak For Themselves
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center text-blue-200 text-lg md:text-xl mb-12"
        >
          Our platform is trusted by thousands, integrated everywhere, and always online. See the impact in real time.
        </motion.p>
        {/* Animated Stats */}
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.15, duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-800/80 via-blue-700/80 to-blue-900/80 rounded-2xl shadow-xl px-10 py-8 flex flex-col items-center min-w-[160px] border border-blue-400/20 backdrop-blur-lg"
            >
              <span className="text-4xl md:text-5xl font-extrabold text-cyan-300 mb-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </span>
              <span className="text-blue-100 text-lg font-semibold text-center">{stat.label}</span>
            </motion.div>
          ))}
        </div>
        {/* Glowing CTA Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.7 }}
          viewport={{ once: true }}
          className="px-10 py-4 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-white font-bold text-lg shadow-2xl hover:scale-105 hover:from-blue-500 hover:to-cyan-400 transition-all border-2 border-blue-300/30 backdrop-blur-md relative overflow-hidden"
        >
          <span className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-tr from-cyan-300 to-blue-500 rounded-full blur-md opacity-60 animate-ping" />
          Get Started Now
        </motion.button>
      </div>
      {/* SVG Background Decoration */}
      <figure className="absolute top-0 left-0 pointer-events-none w-full h-full overflow-hidden z-[1]" aria-hidden="true">
        <svg className="absolute top-0 left-2/4 -translate-x-2/4 w-[134%] min-w-[1280px] max-w-[1920px] h-auto" viewBox="0 0 1920 450" fill="none">
          <rect opacity="0.5" x="1952.45" y="45.1172" width="175.38" height="1451.58" transform="rotate(99.6416 1952.45 45.1172)" fill="url(#bg-decoration-v1-fx-6-linear-1)" />
          <circle opacity="0.5" r="38" transform="matrix(-1 0 0 1 1583 171)" fill="url(#bg-decoration-v1-fx-6-radial-1)" />
          <path opacity="0.5" d="M1338 187L1679.53 -0.113281L1416.47 -78.0066L1338 187Z" fill="url(#bg-decoration-v1-fx-6-linear-2)" />
          <path opacity="0.5" d="M1683.59 291L1612.88 413.475L1709.47 387.593L1683.59 291Z" fill="url(#bg-decoration-v1-fx-6-linear-3)" />
          <defs>
            <linearGradient id="bg-decoration-v1-fx-6-linear-1" x1="2040.14" y1="45.1172" x2="2040.14" y2="1496.7" gradientUnits="userSpaceOnUse">
              <stop stopColor="#9ca3af" stopOpacity="0" />
              <stop offset="1" stopColor="#9ca3af" />
            </linearGradient>
            <radialGradient id="bg-decoration-v1-fx-6-radial-1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="scale(38)">
              <stop stopColor="#4338ca" stopOpacity="0" />
              <stop offset="1" stopColor="#4338ca" />
            </radialGradient>
            <linearGradient id="bg-decoration-v1-fx-6-linear-2" x1="1640.29" y1="132.39" x2="1377.23" y2="54.4967" gradientUnits="userSpaceOnUse">
              <stop stopColor="#9ca3af" />
              <stop offset="1" stopColor="#9ca3af" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="bg-decoration-v1-fx-6-linear-3" x1="1599.94" y1="365.178" x2="1696.53" y2="339.296" gradientUnits="userSpaceOnUse">
              <stop stopColor="#9ca3af" />
              <stop offset="1" stopColor="#9ca3af" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </figure>
    </section>
  );
} 