'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export type SubjectVisualType =
  | 'mathematics'
  | 'science'
  | 'social-science'
  | 'english'
  | 'hindi'
  | 'sanskrit'
  | 'computer'
  | string;

interface Subject3DVisualProps {
  subjectType: SubjectVisualType;
  className?: string;
  isHovered?: boolean;
  isExpanded?: boolean;
}

export function Subject3DVisual({
  subjectType,
  className = '',
  isHovered = false,
  isExpanded = false,
}: Subject3DVisualProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const isHoveredRef = useRef(isHovered);
  const isExpandedRef = useRef(isExpanded);

  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    isExpandedRef.current = isExpanded;
  }, [isExpanded]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 340;

    // 1. Scene Setup
    const scene = new THREE.Scene();

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(0, 0.2, 5.0);

    // 3. Renderer with alpha transparency & high performance
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Lighting - Soft daylight educational illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.2);
    mainLight.position.set(5, 7, 5);
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0x60a5fa, 1.2);
    fillLight.position.set(-5, -2, 3);
    scene.add(fillLight);

    const warmAccentLight = new THREE.PointLight(0x4caf50, 1.6, 12);
    warmAccentLight.position.set(0, 2, 3);
    scene.add(warmAccentLight);

    // 5. Subject Specific 3D Object Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const normalizedSubject = subjectType.toLowerCase();

    // Build specific 3D educational visual
    if (normalizedSubject.includes('math')) {
      buildMathematicsVisual(rootGroup);
    } else if (normalizedSubject.includes('sci')) {
      buildScienceVisual(rootGroup);
    } else if (normalizedSubject.includes('soc') || normalizedSubject.includes('sst')) {
      buildSocialScienceVisual(rootGroup);
    } else if (normalizedSubject.includes('eng')) {
      buildEnglishVisual(rootGroup);
    } else if (normalizedSubject.includes('hin')) {
      buildHindiVisual(rootGroup);
    } else if (normalizedSubject.includes('san')) {
      buildSanskritVisual(rootGroup);
    } else {
      buildScienceVisual(rootGroup);
    }

    // 6. Pointer & Parallax Interaction
    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      pointerRef.current.targetX = Math.max(-1, Math.min(1, x)) * 0.16;
      pointerRef.current.targetY = Math.max(-1, Math.min(1, y)) * 0.12;
    };

    const handlePointerLeave = () => {
      pointerRef.current.targetX = 0;
      pointerRef.current.targetY = 0;
    };

    window.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerleave', handlePointerLeave);

    // 7. Animation Loop with smooth lerping
    let animationFrameId: number;
    const clock = new THREE.Clock();
    let currentScale = 1;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth pointer interpolation (gentle damping)
      pointerRef.current.x += (pointerRef.current.targetX - pointerRef.current.x) * 0.06;
      pointerRef.current.y += (pointerRef.current.targetY - pointerRef.current.y) * 0.06;

      // Hover scale transition (200-400ms feel)
      const targetScale = isExpandedRef.current ? 1.25 : isHoveredRef.current ? 1.08 : 1.0;
      currentScale += (targetScale - currentScale) * 0.08;
      rootGroup.scale.set(currentScale, currentScale, currentScale);

      // Continuous gentle rotation and tilt
      rootGroup.rotation.y = elapsed * 0.35 + pointerRef.current.x * 2.0;
      rootGroup.rotation.x = Math.sin(elapsed * 0.4) * 0.06 - pointerRef.current.y * 1.5;

      // Gentle floating bob
      rootGroup.position.y = Math.sin(elapsed * 1.4) * 0.06;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 400;
      const h = container.clientHeight || 340;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 9. Cleanup
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      // Dispose materials & geometries
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry?.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else {
            mesh.material?.dispose();
          }
        }
      });
    };
  }, [subjectType]);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full flex items-center justify-center select-none ${className}`}
      aria-label={`${subjectType} interactive 3D visual`}
    />
  );
}

/**
 * MATHEMATICS VISUAL:
 * Wireframe Icosahedron & Dodecahedron, coordinate torus rings, Cartesian grid axes.
 */
function buildMathematicsVisual(group: THREE.Group) {
  // 1. Central Icosahedron (Leaf Green Wireframe + Translucent Core)
  const icoGeo = new THREE.IcosahedronGeometry(1.25, 0);
  const icoMat = new THREE.MeshStandardMaterial({
    color: 0x2e7d32,
    roughness: 0.25,
    metalness: 0.3,
    transparent: true,
    opacity: 0.85,
  });
  const icoMesh = new THREE.Mesh(icoGeo, icoMat);
  group.add(icoMesh);

  // Wireframe Cage
  const wireGeo = new THREE.WireframeGeometry(icoGeo);
  const wireMat = new THREE.LineBasicMaterial({ color: 0x81c784, linewidth: 2 });
  const wireMesh = new THREE.LineSegments(wireGeo, wireMat);
  group.add(wireMesh);

  // 2. Outer Dodecahedron Cage
  const dodecaGeo = new THREE.DodecahedronGeometry(1.65, 0);
  const dodecaWire = new THREE.WireframeGeometry(dodecaGeo);
  const dodecaMat = new THREE.LineBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.5 });
  const dodecaLines = new THREE.LineSegments(dodecaWire, dodecaMat);
  group.add(dodecaLines);

  // 3. Orbital Coordinate Torus Ring (Soft Blue)
  const torusGeo = new THREE.TorusGeometry(1.9, 0.03, 16, 100);
  const torusMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.2 });
  const torusMesh = new THREE.Mesh(torusGeo, torusMat);
  torusMesh.rotation.x = Math.PI / 3;
  group.add(torusMesh);

  // 4. Floating geometric nodes
  const sphereGeo = new THREE.SphereGeometry(0.08, 16, 16);
  const nodeMat = new THREE.MeshStandardMaterial({ color: 0x4caf50, emissive: 0x2e7d32, emissiveIntensity: 0.5 });
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const node = new THREE.Mesh(sphereGeo, nodeMat);
    node.position.set(Math.cos(angle) * 1.9, Math.sin(angle) * 0.95, Math.sin(angle) * 1.6);
    group.add(node);
  }
}

/**
 * SCIENCE VISUAL:
 * Glowing central nucleus / planet with atmospheric rings, molecular lattice, orbiting electrons.
 */
function buildScienceVisual(group: THREE.Group) {
  // 1. Central Core / Sphere (Rich Blue with soft emissive glow)
  const coreGeo = new THREE.SphereGeometry(1.15, 32, 32);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0x1e88e5,
    emissive: 0x0d47a1,
    emissiveIntensity: 0.35,
    roughness: 0.3,
    metalness: 0.2,
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  group.add(coreMesh);

  // Atmosphere Glow Shell
  const atmoGeo = new THREE.SphereGeometry(1.22, 32, 32);
  const atmoMat = new THREE.MeshBasicMaterial({
    color: 0x93c5fd,
    transparent: true,
    opacity: 0.22,
    wireframe: true,
  });
  const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
  group.add(atmoMesh);

  // 2. Orbital Electron Rings (Tilted at 3 intersecting scientific angles)
  const ringGeo = new THREE.TorusGeometry(1.75, 0.025, 16, 100);
  const ringMatGreen = new THREE.MeshStandardMaterial({ color: 0x4caf50, emissive: 0x2e7d32, emissiveIntensity: 0.4 });
  const ringMatBlue = new THREE.MeshStandardMaterial({ color: 0x60a5fa, emissive: 0x1e88e5, emissiveIntensity: 0.4 });

  const ring1 = new THREE.Mesh(ringGeo, ringMatGreen);
  ring1.rotation.set(Math.PI / 4, Math.PI / 6, 0);
  group.add(ring1);

  const ring2 = new THREE.Mesh(ringGeo, ringMatBlue);
  ring2.rotation.set(-Math.PI / 4, -Math.PI / 6, 0);
  group.add(ring2);

  const ring3 = new THREE.Mesh(ringGeo, ringMatGreen);
  ring3.rotation.set(0, Math.PI / 2.5, Math.PI / 4);
  group.add(ring3);

  // 3. Orbiting Electrons
  const electronGeo = new THREE.SphereGeometry(0.09, 16, 16);
  const electronMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x60a5fa,
    emissiveIntensity: 0.8,
  });

  const e1 = new THREE.Mesh(electronGeo, electronMat);
  e1.position.set(1.75, 0, 0);
  ring1.add(e1);

  const e2 = new THREE.Mesh(electronGeo, electronMat);
  e2.position.set(-1.75, 0, 0);
  ring2.add(e2);

  const e3 = new THREE.Mesh(electronGeo, electronMat);
  e3.position.set(0, 1.75, 0);
  ring3.add(e3);
}

/**
 * SOCIAL SCIENCE VISUAL:
 * 3D Interactive Globe with illuminated continents, latitude/longitude mesh, civilization glow points.
 */
function buildSocialScienceVisual(group: THREE.Group) {
  // 1. Earth Globe Sphere (Deep ocean blue)
  const globeGeo = new THREE.SphereGeometry(1.28, 40, 40);
  const globeMat = new THREE.MeshStandardMaterial({
    color: 0x1565c0,
    roughness: 0.4,
    metalness: 0.1,
  });
  const globeMesh = new THREE.Mesh(globeGeo, globeMat);
  group.add(globeMesh);

  // 2. Latitude / Longitude Coordinate Wireframe Grid
  const gridGeo = new THREE.SphereGeometry(1.31, 24, 18);
  const gridMat = new THREE.MeshBasicMaterial({
    color: 0xfde68a,
    wireframe: true,
    transparent: true,
    opacity: 0.28,
  });
  const gridMesh = new THREE.Mesh(gridGeo, gridMat);
  group.add(gridMesh);

  // 3. Stylized Continents (Warm Earth / Leaf Green landmasses)
  const continentGeo = new THREE.SphereGeometry(1.29, 20, 20, 0.4, 2.2, 0.5, 1.8);
  const landMat = new THREE.MeshStandardMaterial({
    color: 0x2e7d32,
    roughness: 0.5,
    metalness: 0.05,
  });
  const landMesh1 = new THREE.Mesh(continentGeo, landMat);
  group.add(landMesh1);

  // Secondary landmass
  const landMesh2 = new THREE.Mesh(
    new THREE.SphereGeometry(1.29, 20, 20, 3.2, 1.8, 1.0, 1.6),
    new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.5 })
  );
  group.add(landMesh2);

  // 4. Civilization Glow Nodes
  const nodeGeo = new THREE.SphereGeometry(0.06, 12, 12);
  const nodeMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.9,
  });
  const positions = [
    [0.9, 0.7, 0.5],
    [-0.8, 0.6, 0.7],
    [0.4, -0.7, 0.9],
    [-0.5, -0.6, -0.8],
  ];
  positions.forEach(([x, y, z]) => {
    const node = new THREE.Mesh(nodeGeo, nodeMat);
    node.position.set(x, y, z);
    group.add(node);
  });

  // 5. Equatorial Horizon Ring
  const equatorGeo = new THREE.TorusGeometry(1.68, 0.025, 16, 80);
  const equatorMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3 });
  const equator = new THREE.Mesh(equatorGeo, equatorMat);
  equator.rotation.x = Math.PI / 2;
  group.add(equator);
}

/**
 * ENGLISH VISUAL:
 * 3D Open Hardcover Book with illuminated pages, floating alphabet letters, quill arc.
 */
function buildEnglishVisual(group: THREE.Group) {
  const bookGroup = new THREE.Group();
  bookGroup.rotation.set(0.3, -0.2, 0.1);
  group.add(bookGroup);

  // 1. Book Cover Spine (Deep Royal Indigo)
  const coverGeo = new THREE.BoxGeometry(2.3, 1.55, 0.06);
  const coverMat = new THREE.MeshStandardMaterial({ color: 0x4c1d95, roughness: 0.35 });
  const coverMesh = new THREE.Mesh(coverGeo, coverMat);
  bookGroup.add(coverMesh);

  // 2. Open Pages (Crisp White Left & Right Wings)
  const pageGeo = new THREE.BoxGeometry(1.05, 1.45, 0.05);
  const pageMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25 });

  const leftPage = new THREE.Mesh(pageGeo, pageMat);
  leftPage.position.set(-0.55, 0, 0.06);
  leftPage.rotation.y = 0.2;
  bookGroup.add(leftPage);

  const rightPage = new THREE.Mesh(pageGeo, pageMat);
  rightPage.position.set(0.55, 0, 0.06);
  rightPage.rotation.y = -0.2;
  bookGroup.add(rightPage);

  // 3. Leaf Green Ribbon Bookmark
  const ribbonGeo = new THREE.BoxGeometry(0.12, 1.2, 0.02);
  const ribbonMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.3 });
  const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
  ribbon.position.set(0, -0.4, 0.08);
  ribbon.rotation.z = -0.12;
  bookGroup.add(ribbon);

  // 4. Floating Typography Nodes (Letters A, B, C aura)
  const letterNodeGeo = new THREE.SphereGeometry(0.08, 16, 16);
  const letterMat = new THREE.MeshStandardMaterial({
    color: 0x8b5cf6,
    emissive: 0x6d28d9,
    emissiveIntensity: 0.6,
  });

  const nodeA = new THREE.Mesh(letterNodeGeo, letterMat);
  nodeA.position.set(-0.7, 0.9, 0.3);
  bookGroup.add(nodeA);

  const nodeB = new THREE.Mesh(letterNodeGeo, letterMat);
  nodeB.position.set(0.2, 1.1, 0.4);
  bookGroup.add(nodeB);

  const nodeC = new THREE.Mesh(letterNodeGeo, letterMat);
  nodeC.position.set(0.8, 0.8, 0.2);
  bookGroup.add(nodeC);

  // Quill Pen Arc Line
  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-0.8, 0.4, 0.2),
    new THREE.Vector3(0, 1.2, 0.5),
    new THREE.Vector3(0.9, 0.5, 0.2)
  );
  const points = curve.getPoints(30);
  const quillLineGeo = new THREE.BufferGeometry().setFromPoints(points);
  const quillLineMat = new THREE.LineBasicMaterial({ color: 0xa78bfa, linewidth: 2 });
  const quillLine = new THREE.Line(quillLineGeo, quillLineMat);
  bookGroup.add(quillLine);
}

/**
 * HINDI VISUAL:
 * 3D Illuminated Manuscript Scroll with Devanagari Akshar nodes and peacock feather accent.
 */
function buildHindiVisual(group: THREE.Group) {
  const scrollGroup = new THREE.Group();
  scrollGroup.rotation.set(0.2, -0.15, 0);
  group.add(scrollGroup);

  // 1. Parchment Scroll Paper (Warm Cream / Saffron)
  const paperGeo = new THREE.BoxGeometry(2.0, 1.4, 0.04);
  const paperMat = new THREE.MeshStandardMaterial({ color: 0xfffbeb, roughness: 0.4 });
  const paperMesh = new THREE.Mesh(paperGeo, paperMat);
  scrollGroup.add(paperMesh);

  // 2. Wooden Rollers on Top & Bottom
  const rollerGeo = new THREE.CylinderGeometry(0.09, 0.09, 2.3, 20);
  const rollerMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.3 });

  const topRoller = new THREE.Mesh(rollerGeo, rollerMat);
  topRoller.rotation.z = Math.PI / 2;
  topRoller.position.set(0, 0.72, 0.03);
  scrollGroup.add(topRoller);

  const bottomRoller = new THREE.Mesh(rollerGeo, rollerMat);
  bottomRoller.rotation.z = Math.PI / 2;
  bottomRoller.position.set(0, -0.72, 0.03);
  scrollGroup.add(bottomRoller);

  // 3. Glowing Devanagari Sacred Nodes ('अ', 'क', 'ज्ञ')
  const aksharNodeGeo = new THREE.SphereGeometry(0.1, 16, 16);
  const aksharMat = new THREE.MeshStandardMaterial({
    color: 0xdc2626,
    emissive: 0xb91c1c,
    emissiveIntensity: 0.7,
  });

  const akshar1 = new THREE.Mesh(aksharNodeGeo, aksharMat);
  akshar1.position.set(-0.5, 0.1, 0.1);
  scrollGroup.add(akshar1);

  const akshar2 = new THREE.Mesh(aksharNodeGeo, aksharMat);
  akshar2.position.set(0.4, -0.1, 0.1);
  scrollGroup.add(akshar2);

  // 4. Stylized Peacock Feather Motif (Emerald & Sapphire Torus Loop)
  const featherGeo = new THREE.TorusGeometry(0.5, 0.03, 16, 40);
  const featherMat = new THREE.MeshStandardMaterial({ color: 0x047857, emissive: 0x0284c7, emissiveIntensity: 0.4 });
  const feather = new THREE.Mesh(featherGeo, featherMat);
  feather.position.set(0.7, 0.7, 0.15);
  feather.rotation.z = 0.5;
  scrollGroup.add(feather);
}

/**
 * SANSKRIT VISUAL:
 * Classical Palm-Leaf Manuscript (Taalapatra), sacred lotus ring, and stone seal emblem.
 */
function buildSanskritVisual(group: THREE.Group) {
  const sanskritGroup = new THREE.Group();
  sanskritGroup.rotation.set(0.25, 0.2, -0.05);
  group.add(sanskritGroup);

  // 1. Layered Taalapatra (Palm-Leaf Manuscripts)
  const leafGeo = new THREE.BoxGeometry(2.4, 0.55, 0.03);
  const leafMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.45 });

  for (let i = 0; i < 3; i++) {
    const leaf = new THREE.Mesh(leafGeo, leafMat);
    leaf.position.set(0, (i - 1) * 0.42, (i - 1) * 0.05);
    leaf.rotation.z = (i - 1) * 0.04;
    sanskritGroup.add(leaf);

    // Manuscript binding cord holes
    const holeGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.05, 12);
    const holeMat = new THREE.MeshBasicMaterial({ color: 0x92400e });
    const h1 = new THREE.Mesh(holeGeo, holeMat);
    h1.position.set(-0.75, (i - 1) * 0.42, (i - 1) * 0.05 + 0.02);
    sanskritGroup.add(h1);
    const h2 = new THREE.Mesh(holeGeo, holeMat);
    h2.position.set(0.75, (i - 1) * 0.42, (i - 1) * 0.05 + 0.02);
    sanskritGroup.add(h2);
  }

  // 2. Classical Red Binding Cord
  const cordGeo = new THREE.BoxGeometry(0.04, 1.4, 0.04);
  const cordMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3 });
  const cord1 = new THREE.Mesh(cordGeo, cordMat);
  cord1.position.set(-0.75, 0, 0.06);
  sanskritGroup.add(cord1);
  const cord2 = new THREE.Mesh(cordGeo, cordMat);
  cord2.position.set(0.75, 0, 0.06);
  sanskritGroup.add(cord2);

  // 3. Sacred Lotus / Mandala Orbit Ring (Gold & Terracotta)
  const mandalaGeo = new THREE.TorusGeometry(1.6, 0.03, 16, 60);
  const mandalaMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.25 });
  const mandala = new THREE.Mesh(mandalaGeo, mandalaMat);
  mandala.rotation.x = Math.PI / 2.8;
  sanskritGroup.add(mandala);

  // 4. Classical Stone Seal Emblem in center
  const sealGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.08, 32);
  const sealMat = new THREE.MeshStandardMaterial({
    color: 0x92400e,
    emissive: 0xd97706,
    emissiveIntensity: 0.3,
    roughness: 0.35,
  });
  const seal = new THREE.Mesh(sealGeo, sealMat);
  seal.rotation.x = Math.PI / 2;
  seal.position.set(0, 0, 0.22);
  sanskritGroup.add(seal);
}
