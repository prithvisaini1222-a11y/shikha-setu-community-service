'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Educational3DVisualProps {
  className?: string;
  activeRole?: string;
  interactive?: boolean;
}

export function Educational3DVisual({
  className = '',
  activeRole = 'learner',
  interactive = true,
}: Educational3DVisualProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 380;
    const height = container.clientHeight || 320;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0.4, 5.2);

    // 3. Renderer with antialiasing and alpha transparency
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Lighting - natural soft educational light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xEEF7F0, 2.0);
    keyLight.position.set(4, 6, 4);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x6E9AD6, 1.1);
    fillLight.position.set(-4, -2, 2);
    scene.add(fillLight);

    const softGreenLight = new THREE.PointLight(0x4F9D69, 1.6, 10);
    softGreenLight.position.set(0, 2, 2);
    scene.add(softGreenLight);

    // 5. Educational 3D Object Group
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // --- Object A: Digital Tablet ---
    // Tablet Body (Sleek slate with soft rounded edges)
    const tabletGeometry = new THREE.BoxGeometry(2.1, 1.4, 0.08);
    const tabletMaterial = new THREE.MeshStandardMaterial({
      color: 0x2A3D31,
      roughness: 0.35,
      metalness: 0.1,
    });
    const tablet = new THREE.Mesh(tabletGeometry, tabletMaterial);
    tablet.position.set(-0.2, -0.15, -0.3);
    tablet.rotation.set(-0.25, 0.35, -0.08);
    mainGroup.add(tablet);

    // Tablet Screen (Soft glowing educational display)
    const screenGeometry = new THREE.PlaneGeometry(1.95, 1.25);
    const screenMaterial = new THREE.MeshStandardMaterial({
      color: 0xEEF7F0,
      emissive: 0x6E9AD6,
      emissiveIntensity: 0.25,
      roughness: 0.2,
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(0, 0, 0.045);
    tablet.add(screen);

    // --- Object B: Floating Open Book (Symbol of Knowledge) ---
    const bookGroup = new THREE.Group();
    bookGroup.position.set(0.2, 0.35, 0.3);
    bookGroup.rotation.set(0.18, -0.35, 0.12);
    mainGroup.add(bookGroup);

    // Left Page & Right Page
    const pageGeometry = new THREE.BoxGeometry(0.9, 1.15, 0.04);
    const pageMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      roughness: 0.3,
      metalness: 0.05,
    });

    const leftPage = new THREE.Mesh(pageGeometry, pageMaterial);
    leftPage.position.set(-0.44, 0, 0.06);
    leftPage.rotation.y = 0.22;
    bookGroup.add(leftPage);

    const rightPage = new THREE.Mesh(pageGeometry, pageMaterial);
    rightPage.position.set(0.44, 0, 0.06);
    rightPage.rotation.y = -0.22;
    bookGroup.add(rightPage);

    // Book Cover (Natural Leaf Green Spine & Cover)
    const coverGeometry = new THREE.BoxGeometry(1.9, 1.2, 0.03);
    const coverMaterial = new THREE.MeshStandardMaterial({
      color: 0x4F9D69,
      roughness: 0.4,
      metalness: 0.1,
    });
    const cover = new THREE.Mesh(coverGeometry, coverMaterial);
    cover.position.set(0, -0.01, 0.01);
    bookGroup.add(cover);

    // Decorative Bookmark Ribbon (Soft Blue)
    const ribbonGeometry = new THREE.BoxGeometry(0.1, 0.8, 0.01);
    const ribbonMaterial = new THREE.MeshStandardMaterial({
      color: 0x6E9AD6,
      roughness: 0.2,
    });
    const ribbon = new THREE.Mesh(ribbonGeometry, ribbonMaterial);
    ribbon.position.set(0.05, -0.4, 0.07);
    ribbon.rotation.z = -0.15;
    bookGroup.add(ribbon);

    // --- Object C: Stylized Organic Leaves (Growth & Community) ---
    const leafGroup = new THREE.Group();
    mainGroup.add(leafGroup);

    const createLeaf = (x: number, y: number, z: number, scale: number, rotZ: number, rotY: number) => {
      const leafShape = new THREE.Shape();
      leafShape.moveTo(0, 0);
      leafShape.bezierCurveTo(0.18, 0.25, 0.22, 0.65, 0, 0.9);
      leafShape.bezierCurveTo(-0.22, 0.65, -0.18, 0.25, 0, 0);

      const extrudeSettings = { depth: 0.02, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.02, bevelThickness: 0.01 };
      const leafGeo = new THREE.ExtrudeGeometry(leafShape, extrudeSettings);
      const leafMat = new THREE.MeshStandardMaterial({
        color: 0x78B98A,
        roughness: 0.35,
        metalness: 0.05,
      });
      const leafMesh = new THREE.Mesh(leafGeo, leafMat);
      leafMesh.scale.set(scale, scale, scale);
      leafMesh.position.set(x, y, z);
      leafMesh.rotation.set(0.2, rotY, rotZ);
      return leafMesh;
    };

    const leaf1 = createLeaf(1.1, 0.6, 0.2, 0.55, -0.4, 0.3);
    const leaf2 = createLeaf(-1.1, 0.5, 0.1, 0.45, 0.6, -0.2);
    const leaf3 = createLeaf(0.8, -0.7, 0.4, 0.38, -0.8, 0.5);
    leafGroup.add(leaf1, leaf2, leaf3);

    // --- Object D: Subtle Floating Connection Nodes ---
    const nodesGroup = new THREE.Group();
    mainGroup.add(nodesGroup);

    const nodeGeometry = new THREE.SphereGeometry(0.06, 16, 16);
    const nodeMaterialGreen = new THREE.MeshStandardMaterial({
      color: 0x4F9D69,
      emissive: 0x4F9D69,
      emissiveIntensity: 0.4,
    });
    const nodeMaterialBlue = new THREE.MeshStandardMaterial({
      color: 0x6E9AD6,
      emissive: 0x6E9AD6,
      emissiveIntensity: 0.4,
    });

    const node1 = new THREE.Mesh(nodeGeometry, nodeMaterialGreen);
    node1.position.set(1.4, -0.2, 0.3);
    const node2 = new THREE.Mesh(nodeGeometry, nodeMaterialBlue);
    node2.position.set(-1.3, -0.5, 0.2);
    const node3 = new THREE.Mesh(nodeGeometry, nodeMaterialGreen);
    node3.position.set(0, 1.2, -0.2);
    nodesGroup.add(node1, node2, node3);

    // 6. Mouse / Pointer Interaction
    const handlePointerMove = (e: PointerEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      // Subtle 1-2 degrees range limit
      pointerRef.current.targetX = Math.max(-1, Math.min(1, x)) * 0.12;
      pointerRef.current.targetY = Math.max(-1, Math.min(1, y)) * 0.08;
    };

    const handlePointerLeave = () => {
      pointerRef.current.targetX = 0;
      pointerRef.current.targetY = 0;
    };

    window.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerleave', handlePointerLeave);

    // 7. Animation Loop with smooth lerp
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth pointer interpolation
      pointerRef.current.x += (pointerRef.current.targetX - pointerRef.current.x) * 0.05;
      pointerRef.current.y += (pointerRef.current.targetY - pointerRef.current.y) * 0.05;

      // Gentle floating animation
      mainGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.08;

      // Subtle base rotation + mouse tilt
      mainGroup.rotation.y = Math.sin(elapsedTime * 0.35) * 0.08 + pointerRef.current.x;
      mainGroup.rotation.x = Math.cos(elapsedTime * 0.45) * 0.04 - pointerRef.current.y;

      // Secondary objects gently hover
      bookGroup.position.y = 0.35 + Math.sin(elapsedTime * 1.6 + 1) * 0.03;
      tablet.position.y = -0.15 + Math.cos(elapsedTime * 1.4) * 0.02;

      // Leaves gently flutter
      leaf1.rotation.z = -0.4 + Math.sin(elapsedTime * 2.0) * 0.08;
      leaf2.rotation.z = 0.6 + Math.cos(elapsedTime * 1.8) * 0.07;
      leaf3.rotation.z = -0.8 + Math.sin(elapsedTime * 1.9 + 2) * 0.06;

      // Floating nodes orbit subtly
      node1.position.y = -0.2 + Math.sin(elapsedTime * 1.5) * 0.08;
      node2.position.y = -0.5 + Math.cos(elapsedTime * 1.3) * 0.07;
      node3.position.y = 1.2 + Math.sin(elapsedTime * 1.7) * 0.06;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 380;
      const h = container.clientHeight || 320;
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
    };
  }, [interactive]);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full min-h-[260px] flex items-center justify-center select-none pointer-events-auto ${className}`}
      aria-label="3D Education Object: Floating Book, Tablet and Leaves"
    />
  );
}
