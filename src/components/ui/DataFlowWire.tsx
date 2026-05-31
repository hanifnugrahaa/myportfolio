import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

const DataFlowWire: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const centerLineRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  // 5 Nodes representing Fullstack/IoT Architecture
  const n1LineRef = useRef<HTMLDivElement>(null);
  const n1TextRef = useRef<HTMLDivElement>(null);

  const n2LineRef = useRef<HTMLDivElement>(null);
  const n2TextRef = useRef<HTMLDivElement>(null);

  const n3LineRef = useRef<HTMLDivElement>(null);
  const n3TextRef = useRef<HTMLDivElement>(null);

  const n4LineRef = useRef<HTMLDivElement>(null);
  const n4TextRef = useRef<HTMLDivElement>(null);

  const n5LineRef = useRef<HTMLDivElement>(null);
  const n5TextRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Initial setups for lines (scaling from correct origin)
    gsap.set(centerLineRef.current, { scaleY: 0, transformOrigin: 'top center' });
    
    // Left side nodes (1, 3, 5)
    gsap.set([n1LineRef.current, n3LineRef.current, n5LineRef.current], { scaleX: 0, transformOrigin: 'right center' });
    gsap.set([n1TextRef.current, n3TextRef.current, n5TextRef.current], { opacity: 0, x: 20 });
    
    // Right side nodes (2, 4)
    gsap.set([n2LineRef.current, n4LineRef.current], { scaleX: 0, transformOrigin: 'left center' });
    gsap.set([n2TextRef.current, n4TextRef.current], { opacity: 0, x: -20 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 75%',
        end: 'bottom 25%',
        scrub: 0.5,
      }
    });

    // 10 duration base for easy percentage calculation (10 = 100%)
    tl.to(centerLineRef.current, { scaleY: 1, ease: 'none', duration: 10 }, 0);
    tl.to(dotRef.current, { top: '100%', ease: 'none', duration: 10 }, 0);

    const animateNode = (lineRef: React.RefObject<HTMLDivElement | null>, textRef: React.RefObject<HTMLDivElement | null>, time: number) => {
      tl.to(lineRef.current, { scaleX: 1, ease: 'power2.out', duration: 0.6 }, time);
      tl.to(textRef.current, { opacity: 1, x: 0, ease: 'back.out(1.5)', duration: 1 }, time + 0.2);
    };

    // Node 1 at 25% (2.5)
    animateNode(n1LineRef, n1TextRef, 2.5);
    // Node 2 at 45% (4.5)
    animateNode(n2LineRef, n2TextRef, 4.5);
    // Node 3 at 65% (6.5)
    animateNode(n3LineRef, n3TextRef, 6.5);
    // Node 4 at 80% (8.0)
    animateNode(n4LineRef, n4TextRef, 8.0);
    // Node 5 at 95% (9.5)
    animateNode(n5LineRef, n5TextRef, 9.5);

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full h-[600px] md:h-[800px] flex justify-center items-center my-16 overflow-visible z-0">
      
      {/* Background Main Trace */}
      <div className="absolute top-0 w-[2px] h-full bg-[var(--border-color)] opacity-20" />

      {/* Main Active Trace */}
      <div 
        ref={centerLineRef}
        className="absolute top-0 w-[2px] h-full bg-gradient-to-b from-[var(--text-primary)] via-[var(--accent-color)] to-[var(--text-secondary)]"
        style={{ boxShadow: '0 0 12px var(--text-primary)' }}
      />

      {/* ============================== */}
      {/* NODE 1: SENSORS (25%, LEFT) */}
      {/* ============================== */}
      <div className="absolute top-[25%] right-1/2 w-12 md:w-40 h-[2px] bg-[var(--border-color)] opacity-20" />
      <div ref={n1LineRef} className="absolute top-[25%] right-1/2 w-12 md:w-40 h-[2px] bg-[var(--text-primary)]" style={{ boxShadow: '0 0 10px var(--text-primary)' }} />
      <div ref={n1TextRef} className="absolute right-[calc(50%+3rem)] md:right-[calc(50%+10rem)] top-[25%] -translate-y-1/2 pr-4 text-[10px] md:text-xs font-mono text-[var(--text-primary)] text-right w-max">
        <span className="font-bold opacity-80">[SENSOR_ARRAY]</span> <br/>
        <span className="opacity-60">COLLECTING_TELEMETRY...</span>
      </div>

      {/* ============================== */}
      {/* NODE 2: EDGE GATEWAY (45%, RIGHT) */}
      {/* ============================== */}
      <div className="absolute top-[45%] left-1/2 w-12 md:w-40 h-[2px] bg-[var(--border-color)] opacity-20" />
      <div ref={n2LineRef} className="absolute top-[45%] left-1/2 w-12 md:w-40 h-[2px] bg-[var(--text-secondary)]" style={{ boxShadow: '0 0 10px var(--text-secondary)' }} />
      <div ref={n2TextRef} className="absolute left-[calc(50%+3rem)] md:left-[calc(50%+10rem)] top-[45%] -translate-y-1/2 pl-4 text-[10px] md:text-xs font-mono text-[var(--text-secondary)] text-left w-max">
        <span className="font-bold opacity-80">[EDGE_COMPUTE]</span> <br/>
        <span className="opacity-60">FILTERING_DATA_STREAM...</span>
      </div>

      {/* ============================== */}
      {/* NODE 3: MQTT CLOUD (65%, LEFT) */}
      {/* ============================== */}
      <div className="absolute top-[65%] right-1/2 w-12 md:w-40 h-[2px] bg-[var(--border-color)] opacity-20" />
      <div ref={n3LineRef} className="absolute top-[65%] right-1/2 w-12 md:w-40 h-[2px] bg-[var(--text-primary)]" style={{ boxShadow: '0 0 10px var(--text-primary)' }} />
      <div ref={n3TextRef} className="absolute right-[calc(50%+3rem)] md:right-[calc(50%+10rem)] top-[65%] -translate-y-1/2 pr-4 text-[10px] md:text-xs font-mono text-[var(--text-primary)] text-right w-max">
        <span className="font-bold opacity-80">[MQTT_BROKER]</span> <br/>
        <span className="opacity-60">ROUTING_PACKETS...</span>
      </div>

      {/* ============================== */}
      {/* NODE 4: BACKEND API (80%, RIGHT) */}
      {/* ============================== */}
      <div className="absolute top-[80%] left-1/2 w-12 md:w-40 h-[2px] bg-[var(--border-color)] opacity-20" />
      <div ref={n4LineRef} className="absolute top-[80%] left-1/2 w-12 md:w-40 h-[2px] bg-[var(--text-secondary)]" style={{ boxShadow: '0 0 10px var(--text-secondary)' }} />
      <div ref={n4TextRef} className="absolute left-[calc(50%+3rem)] md:left-[calc(50%+10rem)] top-[80%] -translate-y-1/2 pl-4 text-[10px] md:text-xs font-mono text-[var(--text-secondary)] text-left w-max">
        <span className="font-bold opacity-80">[CORE_BACKEND]</span> <br/>
        <span className="opacity-60">EXECUTING_BUSINESS_LOGIC...</span>
      </div>

      {/* ============================== */}
      {/* NODE 5: CLIENT UI (95%, LEFT) */}
      {/* ============================== */}
      <div className="absolute top-[95%] right-1/2 w-12 md:w-40 h-[2px] bg-[var(--border-color)] opacity-20" />
      <div ref={n5LineRef} className="absolute top-[95%] right-1/2 w-12 md:w-40 h-[2px] bg-[var(--text-primary)]" style={{ boxShadow: '0 0 10px var(--text-primary)' }} />
      <div ref={n5TextRef} className="absolute right-[calc(50%+3rem)] md:right-[calc(50%+10rem)] top-[95%] -translate-y-1/2 pr-4 text-[10px] md:text-xs font-mono text-[var(--text-primary)] text-right w-max">
        <span className="font-bold opacity-80">[CLIENT_DASHBOARD]</span> <br/>
        <span className="opacity-60">RENDERING_INTERFACE...</span>
      </div>

      {/* Data Packet Dot */}
      <div 
        ref={dotRef}
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white z-10 flex items-center justify-center"
        style={{ boxShadow: '0 0 20px 5px var(--text-primary)' }}
      >
        <div className="w-full h-full rounded-full bg-white animate-ping opacity-75" />
        <div className="absolute w-2 h-2 rounded-full bg-[var(--accent-color)]" />
      </div>

    </div>
  );
};

export default DataFlowWire;
