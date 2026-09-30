"use client";

import React, { useEffect, useRef } from "react";

const FRAG_SHADER = `precision highp float;
uniform float uTime;uniform vec2 uRes;uniform vec2 uMouse;
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
vec3 field(vec2 uv){
 float t=uTime*0.3;vec2 m=(uMouse-0.5);
 float yr=sin(uv.y*2.3-t*0.6)+0.6*sin(uv.y*1.1+t*0.35+1.7);
 float phase=t*0.7+m.x*2.0;
 float w=sin(uv.x*8.5+yr*1.4+phase)*0.6+sin(uv.x*4.5-yr*0.8+phase*0.55)*0.45+sin(uv.x*15.0+yr*0.5-phase*0.3)*0.2;
 float f=w*0.5+0.5;
 f=pow(clamp(f,0.,1.),2.0);
 vec2 asp=vec2(uRes.x/uRes.y,1.);
 float d=distance(uv*asp,uMouse*asp);
 f+=smoothstep(0.5,0.0,d)*0.5;
 vec3 c0=vec3(0.0314,0.1765,0.0235),c1=vec3(0.07,0.5,0.11),c2=vec3(0.45,1.0,0.34);
 vec3 col=mix(c0,c1,smoothstep(0.15,0.6,f));
 col=mix(col,c2,smoothstep(0.72,1.02,f));
 vec3 A=vec3(0.0353,0.2667,0.0353);
 vec3 B=vec3(0.2824,0.6863,0.3059);
 vec3 C=vec3(0.0902,0.4039,0.1725);
 col=mix(col,A,0.20*smoothstep(0.55,0.05,f));
 col=mix(col,C,0.05*smoothstep(0.25,0.75,f));
 col=mix(col,B,0.07*smoothstep(0.65,1.0,f));
 col=mix(col,vec3(0.0),smoothstep(0.10,0.0,f)*0.2);
 return col;
}
void main(){
 vec2 uv=gl_FragCoord.xy/uRes.xy;
 float rods=30.0;
 float x=uv.x*rods;float id=floor(x);float lens=fract(x)-0.5;
 float center=(id+0.5)/rods;
 float mag=1.7;float bend=lens-(lens*lens*lens)*0.6;
 float sx=center+bend*(mag/rods);
 float disp=lens*(2.0/rods);
 vec3 col=vec3(field(vec2(sx+disp,uv.y)).r,field(vec2(sx,uv.y)).g,field(vec2(sx-disp,uv.y)).b);
 col+=pow(max(0.,1.0-abs(lens)*2.35),10.0)*0.18;
 col*=1.0-smoothstep(0.37,0.5,abs(lens))*0.28;
 col+=(hash(gl_FragCoord.xy*1.3)-0.5)*0.02;
 gl_FragColor=vec4(col,1.0);
}`;

const VERT_SHADER = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";

export default function HeroShader() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = (canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) {
      canvas.style.background = "#082D06";
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

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const targetMouse = [0.72, 0.5];
    const currentMouse = [0.72, 0.5];

    const render = (time: number) => {
      gl.uniform1f(uTime, time);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uMouse, currentMouse[0], currentMouse[1]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    let prevW = 0;
    let prevH = 0;

    const handleResize = () => {
      const dpr = Math.min(1, window.devicePixelRatio || 1);
      const w = Math.max(2, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(2, Math.round(canvas.clientHeight * dpr));

      if (w === prevW && Math.abs(h - prevH) < 120) return;
      prevW = w;
      prevH = h;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      if (prefersReduced) render(0);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(canvas);
    handleResize();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouse[0] = (e.clientX - rect.left) / rect.width;
      targetMouse[1] = 1 - (e.clientY - rect.top) / rect.height;
    };

    let rafId = 0;
    let isRunning = false;
    let lastTime = 0;
    const startTime = performance.now();

    const loop = (now: number) => {
      if (!isRunning) return;
      rafId = requestAnimationFrame(loop);

      if (now - lastTime < 32.8) return; // ~30fps throttle for efficiency
      lastTime = now;

      currentMouse[0] += (targetMouse[0] - currentMouse[0]) * 0.06;
      currentMouse[1] += (targetMouse[1] - currentMouse[1]) * 0.06;

      render((now - startTime) / 1000);
    };

    const stop = () => {
      isRunning = false;
      cancelAnimationFrame(rafId);
    };

    if (!prefersReduced) {
      window.addEventListener("pointermove", handleMouseMove);
    } else {
      render(0);
    }

    let isVisible = true;
    const checkState = () => {
      if (isVisible && !document.hidden) {
        if (!isRunning && !prefersReduced) {
          isRunning = true;
          lastTime = 0;
          rafId = requestAnimationFrame(loop);
        }
      } else {
        stop();
      }
    };

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        checkState();
      },
      { threshold: 0 }
    );
    intersectionObserver.observe(canvas);
    document.addEventListener("visibilitychange", checkState);

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", checkState);
      window.removeEventListener("pointermove", handleMouseMove);
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="Hero-module___w2HtG__shader"
      data-hero-shader="true"
      aria-hidden="true"
    />
  );
}
