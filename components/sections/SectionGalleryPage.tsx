'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { SectionEntry, SectionMeta } from '@/lib/sections';

export interface SlideData {
  id: string | number;
  category: string;
  title: string;
  description: string;
  year: string;
  stack: string;
  reference: string;
  image: string;
  link?: string;
}

interface InfiniteGalleryProps {
  section: SectionMeta;
  entries: SectionEntry[];
  snapDelay?: number;
}

const CONFIG = {
  spacingX: 45,
  pWidth: 14,
  pHeight: 18,
  camZ: 30,
  wallAngleY: -0.25,
  lerpSpeed: 0.06
};

const FALLBACK_IMAGE = 'https://assets.codepen.io/573855/demo-monsters-03.webp';

function mapEntriesToSlides(entries: SectionEntry[]): SlideData[] {
  return entries.map((entry, index) => ({
    id: entry.slug,
    category: `${String(index + 1).padStart(2, '0')} / ${entry.type.toUpperCase()}`,
    title: entry.title,
    description: entry.summary,
    year: entry.date,
    stack: entry.stack?.join(' / ') || entry.tags.join(' / ') || entry.type,
    reference: entry.kicker || entry.section,
    image: entry.image || FALLBACK_IMAGE,
    link: entry.href
  }));
}

export function SectionGalleryPage({
  section,
  entries,
  snapDelay = 200
}: InfiniteGalleryProps) {
  const slides = mapEntriesToSlides(entries);
  const mountRef = useRef<HTMLDivElement>(null);
  const currentScrollRef = useRef(0);
  const targetScrollRef = useRef(0);
  const snapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const isDark = section.theme === 'dark';

  useEffect(() => {
    const htmlOverflow = document.documentElement.style.overflow;
    const bodyOverflow = document.body.style.overflow;
    const bodyTouchAction = document.body.style.touchAction;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    return () => {
      document.documentElement.style.overflow = htmlOverflow;
      document.body.style.overflow = bodyOverflow;
      document.body.style.touchAction = bodyTouchAction;
    };
  }, []);

  useEffect(() => {
    if (!mountRef.current || slides.length === 0) {
      return;
    }

    const slideCount = slides.length;
    const totalGalleryWidth = slideCount * CONFIG.spacingX;
    const bgColor = section.theme === 'dark' ? 0x1c1814 : 0xf3ede4;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(bgColor);
    scene.fog = new THREE.Fog(bgColor, 10, 110);

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, CONFIG.camZ);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, section.theme === 'dark' ? 0.3 : 0.6);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, section.theme === 'dark' ? 0.8 : 0.5);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    const galleryGroup = new THREE.Group();
    scene.add(galleryGroup);

    const textureLoader = new THREE.TextureLoader();
    const planeGeo = new THREE.PlaneGeometry(CONFIG.pWidth, CONFIG.pHeight);
    const paintingGroups: any[] = [];
    const textures: any[] = [];
    const materials: any[] = [];
    const geometries: any[] = [planeGeo];

    slides.forEach((slide, index) => {
      const group = new THREE.Group();
      group.position.set(index * CONFIG.spacingX, 0, 0);

      const texture = textureLoader.load(slide.image);
      textures.push(texture);

      const imageMaterial = new THREE.MeshBasicMaterial({ map: texture });
      materials.push(imageMaterial);
      const imageMesh = new THREE.Mesh(planeGeo, imageMaterial);

      const edgesGeometry = new THREE.EdgesGeometry(planeGeo);
      geometries.push(edgesGeometry);
      const outlineMaterial = new THREE.LineBasicMaterial({
        color: section.theme === 'dark' ? 0x444444 : 0x222222
      });
      materials.push(outlineMaterial);
      const outline = new THREE.LineSegments(edgesGeometry, outlineMaterial);

      const shadowGeometry = new THREE.PlaneGeometry(CONFIG.pWidth, CONFIG.pHeight);
      geometries.push(shadowGeometry);
      const shadowMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: section.theme === 'dark' ? 0.4 : 0.15
      });
      materials.push(shadowMaterial);
      const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
      shadow.position.set(0.8, -0.8, -0.5);

      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-CONFIG.spacingX / 2, 14, -1),
        new THREE.Vector3(CONFIG.spacingX / 2, 14, -1),
        new THREE.Vector3(-CONFIG.spacingX / 2, -14, -1),
        new THREE.Vector3(CONFIG.spacingX / 2, -14, -1)
      ]);
      geometries.push(lineGeometry);
      const lineMaterial = new THREE.LineBasicMaterial({
        color: section.theme === 'dark' ? 0x6f6255 : 0xb8ab98,
        transparent: true,
        opacity: section.theme === 'dark' ? 0.9 : 0.95
      });
      materials.push(lineMaterial);
      const lines = new THREE.LineSegments(lineGeometry, lineMaterial);

      group.add(shadow);
      group.add(imageMesh);
      group.add(outline);
      group.add(lines);

      galleryGroup.add(group);
      paintingGroups.push(group);
    });

    galleryGroup.rotation.y = CONFIG.wallAngleY;
    galleryGroup.position.x = 8;

    const snapToNearest = () => {
      const index = Math.round(targetScrollRef.current / CONFIG.spacingX);
      targetScrollRef.current = index * CONFIG.spacingX;
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      targetScrollRef.current += event.deltaY * 0.1;
      if (snapTimerRef.current) {
        clearTimeout(snapTimerRef.current);
      }
      snapTimerRef.current = setTimeout(snapToNearest, snapDelay);
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartRef.current = event.touches[0].clientX;
      if (snapTimerRef.current) {
        clearTimeout(snapTimerRef.current);
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      event.preventDefault();
      const diff = touchStartRef.current - event.touches[0].clientX;
      targetScrollRef.current += diff * 0.6;
      touchStartRef.current = event.touches[0].clientX;
      if (snapTimerRef.current) {
        clearTimeout(snapTimerRef.current);
      }
    };

    const handleTouchEnd = () => snapToNearest();

    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    let animationFrameId = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      currentScrollRef.current +=
        (targetScrollRef.current - currentScrollRef.current) * CONFIG.lerpSpeed;

      const xMove = currentScrollRef.current * Math.cos(CONFIG.wallAngleY);
      const zMove = currentScrollRef.current * Math.sin(CONFIG.wallAngleY);
      camera.position.x = xMove;
      camera.position.z = CONFIG.camZ - zMove;

      paintingGroups.forEach((group, index) => {
        const originalX = index * CONFIG.spacingX;
        const distFromCam = currentScrollRef.current - originalX;
        const shift = Math.round(distFromCam / totalGalleryWidth) * totalGalleryWidth;
        group.position.x = originalX + shift;
      });

      camera.rotation.x = mouseRef.current.y * 0.05;
      camera.rotation.y = -mouseRef.current.x * 0.05;

      const rawIndex = Math.round(currentScrollRef.current / CONFIG.spacingX);
      const safeIndex = ((rawIndex % slideCount) + slideCount) % slideCount;
      if (safeIndex !== activeIndexRef.current) {
        activeIndexRef.current = safeIndex;
        setActiveIndex(safeIndex);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      cancelAnimationFrame(animationFrameId);
      if (snapTimerRef.current) {
        clearTimeout(snapTimerRef.current);
      }

      textures.forEach((texture) => texture.dispose());
      materials.forEach((material) => material.dispose());
      geometries.forEach((geometry) => geometry.dispose());
      renderer.dispose();

      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [section.theme, slides, snapDelay]);

  return (
    <div
      className={`relative h-screen w-full overflow-hidden font-sans transition-colors duration-500 ${
        isDark ? 'bg-[#1c1814] text-gray-100' : 'bg-[#f3ede4] text-gray-900'
      }`}
    >
      <div className="absolute left-6 top-6 z-30 md:left-10 md:top-10">
        <Link
          href="/"
          className={`inline-flex items-center gap-3 border-b px-1 py-2 text-[0.7rem] uppercase tracking-[0.18em] transition ${
            isDark
              ? 'border-[#6f6255]/70 bg-transparent text-[#d8cfc3] hover:border-[#b59d7d] hover:text-[#f3ede4]'
              : 'border-[#b8ab98]/90 bg-transparent text-[#5c4c3d] hover:border-[#8f7b63] hover:text-[#2d241b]'
          }`}
        >
          <span className="text-base leading-none" aria-hidden="true">
            &larr;
          </span>
          <span>{section.title}</span>
        </Link>
      </div>

      <div ref={mountRef} className="absolute inset-0 z-10" />

      <div className="pointer-events-none absolute inset-0 z-20">
        {slides.length > 0 ? (
          slides.map((slide, index) => {
            const isActive = index === activeIndex;
            const isInternal = !!slide.link && slide.link.startsWith('/');
            const actionClass = `mt-8 inline-block border px-6 py-2.5 text-xs uppercase tracking-[2px] transition-all duration-300 ${
              isDark
                ? 'border-gray-100 bg-gray-100 text-gray-900 hover:bg-transparent hover:text-gray-100'
                : 'border-gray-900 bg-gray-900 text-white hover:bg-transparent hover:text-gray-900'
            }`;

            return (
              <div
                key={slide.id}
                className={`absolute left-[8%] top-1/4 w-[80%] max-w-[450px] transition-all duration-800 ease-out md:left-[10%] md:w-[35%] ${
                  isActive
                    ? 'pointer-events-auto translate-y-0 opacity-100'
                    : 'pointer-events-none translate-y-5 opacity-0'
                }`}
              >
                <span
                  className={`mb-6 inline-block border-b pb-1 text-[0.65rem] uppercase tracking-[3px] md:text-xs ${
                    isDark ? 'border-gray-700 text-gray-400' : 'border-gray-300 text-gray-500'
                  }`}
                >
                  {slide.category}
                </span>

                <h1
                  className={`mb-6 whitespace-pre-line font-serif text-5xl font-normal italic leading-none md:text-6xl ${
                    isDark ? 'text-gray-50' : 'text-gray-900'
                  }`}
                >
                  {slide.title}
                </h1>

                <div
                  className={`mb-8 text-justify text-sm font-light leading-relaxed md:text-base ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  {slide.description}
                </div>

                <div
                  className={`grid grid-cols-[70px_1fr] gap-y-3 border-t pt-6 md:grid-cols-[80px_1fr] ${
                    isDark ? 'border-gray-800' : 'border-gray-200'
                  }`}
                >
                  <span className="self-center text-[0.6rem] uppercase tracking-[1.5px] text-gray-500 md:text-[0.65rem]">
                    日期
                  </span>
                  <span className={`font-serif text-base italic md:text-lg ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                    {slide.year}
                  </span>

                  <span className="self-center text-[0.6rem] uppercase tracking-[1.5px] text-gray-500 md:text-[0.65rem]">
                    标签
                  </span>
                  <span className={`font-serif text-base italic md:text-lg ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                    {slide.stack}
                  </span>

                  <span className="self-center text-[0.6rem] uppercase tracking-[1.5px] text-gray-500 md:text-[0.65rem]">
                    参考
                  </span>
                  <span className={`font-serif text-base italic md:text-lg ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                    {slide.reference}
                  </span>
                </div>

                {slide.link && isInternal ? (
                  <Link href={slide.link} className={actionClass}>
                    详细阅读
                  </Link>
                ) : null}

                {slide.link && !isInternal ? (
                  <a href={slide.link} target="_blank" rel="noopener noreferrer" className={actionClass}>
                    详细阅读
                  </a>
                ) : null}
              </div>
            );
          })
        ) : (
          <div className="absolute left-[8%] top-1/4 w-[80%] max-w-[480px] md:left-[10%] md:w-[35%]">
            <div
              className={`mb-6 inline-block border-b pb-1 text-[0.65rem] uppercase tracking-[3px] md:text-xs ${
                isDark ? 'border-gray-700 text-gray-400' : 'border-gray-300 text-gray-500'
              }`}
            >
              {section.eyebrow}
            </div>
            <h1
              className={`mb-6 whitespace-pre-line font-serif text-5xl font-normal italic leading-none md:text-6xl ${
                isDark ? 'text-gray-50' : 'text-gray-900'
              }`}
            >
              {section.title}
            </h1>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-base leading-8`}>
              {section.description}
            </p>
          </div>
        )}
      </div>

      <div
        className={`pointer-events-none absolute bottom-10 left-8 z-20 text-[0.65rem] uppercase tracking-[2px] md:left-12 md:text-xs ${
          isDark ? 'text-gray-500' : 'text-gray-400'
        }`}
      >
        {section.hint}
      </div>
    </div>
  );
}
