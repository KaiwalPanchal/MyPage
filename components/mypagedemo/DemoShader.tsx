"use client";

import React, { useEffect, useRef } from "react";

interface DemoShaderProps {
  theme?: "cyan" | "green"; // "cyan" key is preserved for theme prop, but renders Frosted Silver with subtle ice-blue hint!
  className?: string;
}

const VERT_SHADER = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";

// High-fidelity fluted glass chromatic dispersion shader tuned to Frosted Silver + Ice-Blue Hint
const FRAG_SHADER = `precision highp float;
uniform float uTime;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform float uTheme; // 0.0 = Frosted Metallic Silver with subtle ice hint, 1.0 = Electric Emerald Green

float hash(vec2 p){
  p=fract(p*vec2(123.34,456.21));
  p+=dot(p,p+45.32);
  return fract(p.x*p.y);
}

vec3 field(vec2 uv, float theme){
  float t=uTime*0.3;
  vec2 m=(uMouse-0.5);
  float yr=sin(uv.y*2.3-t*0.6)+0.6*sin(uv.y*1.1+t*0.35+1.7);
  float phase=t*0.7+m.x*2.0;
  float w=sin(uv.x*8.5+yr*1.4+phase)*0.6+sin(uv.x*4.5-yr*0.8+phase*0.55)*0.45+sin(uv.x*15.0+yr*0.5-phase*0.3)*0.2;
  float f=w*0.5+0.5;
  f=pow(clamp(f,0.,1.),2.0);
  vec2 asp=vec2(uRes.x/uRes.y,1.);
  float d=distance(uv*asp,uMouse*asp);
  f+=smoothstep(0.5,0.0,d)*0.5;

  // Theme 1.0 = Electric Green (original kstoimenov)
  vec3 g0=vec3(0.0314,0.1765,0.0235), g1=vec3(0.07,0.5,0.11), g2=vec3(0.45,1.0,0.34);
  vec3 gA=vec3(0.0353,0.2667,0.0353);
  vec3 gB=vec3(0.2824,0.6863,0.3059);
  vec3 gC=vec3(0.0902,0.4039,0.1725);

  vec3 colG=mix(g0,g1,smoothstep(0.15,0.6,f));
  colG=mix(colG,g2,smoothstep(0.72,1.02,f));
  colG=mix(colG,gA,0.20*smoothstep(0.55,0.05,f));
  colG=mix(colG,gC,0.05*smoothstep(0.25,0.75,f));
  colG=mix(colG,gB,0.07*smoothstep(0.65,1.0,f));
  colG=mix(colG,vec3(0.0),smoothstep(0.10,0.0,f)*0.2);

  // Theme 0.0 = Frosted Metallic Silver with faint ice-blue hint (calibrated for high text contrast)
  vec3 s0=vec3(0.015, 0.022, 0.035); // Deep slate obsidian
  vec3 s1=vec3(0.20, 0.25, 0.32);    // Frosted brushed steel silver with cool ice-blue hint
  vec3 s2=vec3(0.65, 0.72, 0.80);    // Luminous platinum silver highlight (calibrated contrast floor)
  vec3 sA=vec3(0.05, 0.07, 0.10);    // Deep titanium shadow
  vec3 sB=vec3(0.48, 0.55, 0.64);    // Brushed silver caustic wave highlight
  vec3 sC=vec3(0.14, 0.18, 0.23);    // Mid chrome

  vec3 colS=mix(s0,s1,smoothstep(0.15,0.6,f));
  colS=mix(colS,s2,smoothstep(0.72,1.02,f));
  colS=mix(colS,sA,0.20*smoothstep(0.55,0.05,f));
  colS=mix(colS,sC,0.05*smoothstep(0.25,0.75,f));
  colS=mix(colS,sB,0.07*smoothstep(0.65,1.0,f));
  colS=mix(colS,vec3(0.002, 0.005, 0.01),smoothstep(0.10,0.0,f)*0.2);

  return mix(colS, colG, theme);
}

void main(){
  vec2 uv=gl_FragCoord.xy/uRes.xy;
  float rods=30.0;
  float x=uv.x*rods;
  float id=floor(x);
  float lens=fract(x)-0.5;
  float center=(id+0.5)/rods;
  float mag=1.7;
  float bend=lens-(lens*lens*lens)*0.6;
  float sx=center+bend*(mag/rods);
  float disp=lens*(2.0/rods);

  vec3 col=vec3(
    field(vec2(sx+disp,uv.y), uTheme).r,
    field(vec2(sx,uv.y), uTheme).g,
    field(vec2(sx-disp,uv.y), uTheme).b
  );

  col+=pow(max(0.,1.0-abs(lens)*2.35),10.0)*0.18;
  col*=1.0-smoothstep(0.37,0.5,abs(lens))*0.28;
  col+=(hash(gl_FragCoord.xy*1.3)-0.5)*0.02;

  gl_FragColor=vec4(col,1.0);
}`;

export default function DemoShader({
  theme = "cyan",
  className = "DemoHero-shader",
}: DemoShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = (canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) {
      canvas.style.background = theme === "cyan" ? "#0a0f16" : "#082D06";
      return;
    }

    const compileShader = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const vert = compileShader(gl.VERTEX_SHADER, VERT_SHADER);
    const frag = compileShader(gl.FRAGMENT_SHADER, FRAG_SHADER);
    if (!vert || !frag) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );

    const posAttr = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "uTime");
    const uRes = gl.getUniformLocation(program, "uRes");
    const uMouse = gl.getUniformLocation(program, "uMouse");
    const uTheme = gl.getUniformLocation(program, "uTheme");

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const targetMouse = [0.72, 0.5];
    const curMouse = [0.72, 0.5];
    let animationFrameId = 0;
    let isVisible = true;
    const startT = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const w = Math.max(2, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(2, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        targetMouse[0] = (e.clientX - rect.left) / rect.width;
        targetMouse[1] = 1.0 - (e.clientY - rect.top) / rect.height;
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const render = (now: number) => {
      if (isVisible) {
        curMouse[0] += (targetMouse[0] - curMouse[0]) * 0.05;
        curMouse[1] += (targetMouse[1] - curMouse[1]) * 0.05;

        const elapsed = (now - startT) * 0.001;
        gl.uniform1f(uTime, prefersReduced ? 0.4 : elapsed);
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform2f(uMouse, curMouse[0], curMouse[1]);
        gl.uniform1f(uTheme, theme === "green" ? 1.0 : 0.0);

        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    intersectionObserver.observe(canvas);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("pointermove", onPointerMove);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      gl.deleteProgram(program);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      data-shader-canvas="true"
      aria-hidden="true"
    />
  );
}
