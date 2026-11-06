'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { ProjectData } from '@/engine/types';
import { RotateCcw, Eye, Layers, Lightbulb, Compass } from 'lucide-react';

interface FloorPlan3DCanvasProps {
  project: ProjectData;
  height?: number;
}

export default function FloorPlan3DCanvas({
  project,
  height = 520
}: FloorPlan3DCanvasProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [showConduits, setShowConduits] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showLights, setShowLights] = useState(true);
  const [cameraView, setCameraView] = useState<'isometric' | 'top' | 'perspective'>('isometric');

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const conduitGroupRef = useRef<THREE.Group | null>(null);
  const lightsGroupRef = useRef<THREE.Group | null>(null);
  const floorMeshRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 920;
    const canvasHeight = height;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#FBF8F4'); // Warm ivory theme background

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / canvasHeight, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.set(0, 32, 42);
    camera.lookAt(0, 0, 0);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    rendererRef.current = renderer;
    renderer.setSize(width, canvasHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // 4. Lighting Environment
    const ambientLight = new THREE.AmbientLight(0xfff8f2, 0.65);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.55);
    dirLight.position.set(20, 40, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 100;
    dirLight.shadow.camera.left = -25;
    dirLight.shadow.camera.right = 25;
    dirLight.shadow.camera.top = 25;
    dirLight.shadow.camera.bottom = -25;
    scene.add(dirLight);

    // 5. Floor & Heatmap Texture
    const floorW = 48;
    const floorH = 28;

    // Generate procedural isolux heatmap canvas texture
    const heatCanvas = document.createElement('canvas');
    heatCanvas.width = 512;
    heatCanvas.height = 300;
    const hctx = heatCanvas.getContext('2d');
    if (hctx) {
      hctx.fillStyle = '#FFFFFF';
      hctx.fillRect(0, 0, 512, 300);

      // Radial lux pools
      const lightHotspots = [
        { x: 180, y: 80, r: 75, lux: 500 },
        { x: 260, y: 80, r: 85, lux: 540 },
        { x: 340, y: 80, r: 80, lux: 520 },
        { x: 140, y: 150, r: 70, lux: 460 },
        { x: 200, y: 150, r: 80, lux: 680 },
        { x: 260, y: 150, r: 85, lux: 720 },
        { x: 320, y: 150, r: 85, lux: 710 },
        { x: 380, y: 150, r: 80, lux: 660 },
        { x: 420, y: 80, r: 80, lux: 530 },
        { x: 200, y: 220, r: 75, lux: 510 },
        { x: 260, y: 220, r: 85, lux: 540 },
        { x: 320, y: 220, r: 85, lux: 540 },
        { x: 380, y: 220, r: 75, lux: 490 }
      ];

      lightHotspots.forEach(pt => {
        const grad = hctx.createRadialGradient(pt.x, pt.y, 5, pt.x, pt.y, pt.r);
        if (pt.lux >= 650) {
          grad.addColorStop(0, 'rgba(241, 214, 106, 0.7)');
          grad.addColorStop(0.4, 'rgba(16, 185, 129, 0.45)');
          grad.addColorStop(0.8, 'rgba(53, 185, 164, 0.2)');
          grad.addColorStop(1, 'rgba(53, 185, 164, 0)');
        } else {
          grad.addColorStop(0, 'rgba(16, 185, 129, 0.55)');
          grad.addColorStop(0.5, 'rgba(53, 185, 164, 0.3)');
          grad.addColorStop(1, 'rgba(53, 185, 164, 0)');
        }
        hctx.fillStyle = grad;
        hctx.beginPath();
        hctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        hctx.fill();
      });
    }

    const floorTexture = new THREE.CanvasTexture(heatCanvas);
    const floorMaterial = new THREE.MeshStandardMaterial({
      map: floorTexture,
      roughness: 0.8,
      metalness: 0.05
    });

    const floorGeo = new THREE.PlaneGeometry(floorW, floorH);
    const floorMesh = new THREE.Mesh(floorGeo, floorMaterial);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);
    floorMeshRef.current = floorMesh;

    // Grid Floor Boundary
    const gridHelper = new THREE.GridHelper(52, 26, 0xE7DED4, 0xF5EFE8);
    gridHelper.position.y = -0.01;
    scene.add(gridHelper);

    // 6. Extruded Architectural Walls
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x202321, roughness: 0.9 });
    const wallTransMat = new THREE.MeshStandardMaterial({ color: 0x8A8982, transparent: true, opacity: 0.45, roughness: 0.5 });
    const wallGroup = new THREE.Group();

    const wallHeight = 2.4;
    const wallThick = 0.4;

    const createWall = (x: number, z: number, w: number, d: number, mat = wallMat) => {
      const geo = new THREE.BoxGeometry(w, wallHeight, d);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, wallHeight / 2, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      wallGroup.add(mesh);
    };

    // Outer Perimeter Walls
    createWall(0, -floorH / 2 + wallThick / 2, floorW, wallThick); // North
    createWall(0, floorH / 2 - wallThick / 2, floorW, wallThick);  // South
    createWall(-floorW / 2 + wallThick / 2, 0, wallThick, floorH); // West
    createWall(floorW / 2 - wallThick / 2, 0, wallThick, floorH);  // East

    // Interior Room Partitions
    createWall(13, -7, 14, 0.25);  // Top Right Boardroom
    createWall(6, -7, 0.25, 14);   // Boardroom Left
    createWall(10, 4, 18, 0.25);   // Executive Suite 1
    createWall(10, 10, 18, 0.25);  // Executive Suite 2
    createWall(1, 7, 0.25, 14);    // Suite Corridor
    createWall(-14, -8, 0.25, 12, wallTransMat); // Staircase Core
    scene.add(wallGroup);

    // 7. Workstation Furniture & Boardroom Table
    const furnitureGroup = new THREE.Group();
    const deskMat = new THREE.MeshStandardMaterial({ color: 0xFFFCF8, roughness: 0.7 });
    const screenMat = new THREE.MeshStandardMaterial({ color: 0x087F73, roughness: 0.3 });
    const chairMat = new THREE.MeshStandardMaterial({ color: 0x62645F, roughness: 0.8 });

    // Conference Boardroom Table (Top-Right)
    const confTableGeo = new THREE.BoxGeometry(7.5, 0.75, 2.8);
    const confTableMesh = new THREE.Mesh(confTableGeo, deskMat);
    confTableMesh.position.set(13.5, 0.75 / 2, -7.5);
    confTableMesh.castShadow = true;
    confTableMesh.receiveShadow = true;
    furnitureGroup.add(confTableMesh);

    // 10 Conference Chairs
    for (let c = 0; c < 5; c++) {
      const chairGeo = new THREE.BoxGeometry(0.65, 0.85, 0.65);
      // Top row chairs
      const chairTop = new THREE.Mesh(chairGeo, chairMat);
      chairTop.position.set(10.5 + c * 1.5, 0.85 / 2, -9.5);
      furnitureGroup.add(chairTop);
      // Bottom row chairs
      const chairBot = new THREE.Mesh(chairGeo, chairMat);
      chairBot.position.set(10.5 + c * 1.5, 0.85 / 2, -5.5);
      furnitureGroup.add(chairBot);
    }

    // 8 Workstation Pods (4 Desks each)
    const podPositions = [
      { x: -9, z: -7 }, { x: -3, z: -7 },
      { x: -15, z: 2 }, { x: -9, z: 2 }, { x: -3, z: 2 }, { x: 3, z: 2 },
      { x: -15, z: 8 }, { x: -9, z: 8 }, { x: -3, z: 8 }, { x: 3, z: 8 }
    ];

    podPositions.forEach(pos => {
      // Desk Base (2x2 cluster)
      const deskGeo = new THREE.BoxGeometry(2.4, 0.7, 2.0);
      const deskMesh = new THREE.Mesh(deskGeo, deskMat);
      deskMesh.position.set(pos.x, 0.7 / 2, pos.z);
      deskMesh.castShadow = true;
      deskMesh.receiveShadow = true;
      furnitureGroup.add(deskMesh);

      // Partition Divider
      const partGeo = new THREE.BoxGeometry(2.4, 0.45, 0.08);
      const partMesh = new THREE.Mesh(partGeo, screenMat);
      partMesh.position.set(pos.x, 0.7 + 0.45 / 2, pos.z);
      furnitureGroup.add(partMesh);

      // 2 Dual Monitors
      const monGeo = new THREE.BoxGeometry(0.8, 0.45, 0.05);
      const mon1 = new THREE.Mesh(monGeo, screenMat);
      mon1.position.set(pos.x - 0.55, 0.7 + 0.45 / 2, pos.z - 0.35);
      const mon2 = new THREE.Mesh(monGeo, screenMat);
      mon2.position.set(pos.x + 0.55, 0.7 + 0.45 / 2, pos.z + 0.35);
      furnitureGroup.add(mon1);
      furnitureGroup.add(mon2);
    });

    scene.add(furnitureGroup);

    // 8. 3D Luminaires & True Photometric Light Cones
    const lightsGroup = new THREE.Group();
    lightsGroupRef.current = lightsGroup;

    const fixtureGeo = new THREE.BoxGeometry(1.2, 0.12, 1.2);
    const fixtureMat = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      emissive: 0xFFFEE8,
      emissiveIntensity: 1.2,
      roughness: 0.2
    });

    const fixtureElevation = 3.6;

    const fixturePositions = [
      // Top pods & conference
      { x: -9, z: -7 }, { x: -3, z: -7 }, { x: 10.5, z: -7.5 }, { x: 16.5, z: -7.5 },
      // Main center aisle
      { x: -18, z: -2.5 }, { x: -12, z: -2.5 }, { x: -6, z: -2.5 }, { x: 0, z: -2.5 }, { x: 6, z: -2.5 },
      // Workstation clusters
      { x: -15, z: 2 }, { x: -9, z: 2 }, { x: -3, z: 2 }, { x: 3, z: 2 },
      { x: -15, z: 8 }, { x: -9, z: 8 }, { x: -3, z: 8 }, { x: 3, z: 8 },
      // Cabins
      { x: 10, z: 1 }, { x: 17, z: 1 }, { x: 10, z: 7 }, { x: 17, z: 7 }
    ];

    fixturePositions.forEach(fp => {
      // Luminaire Physical Troffer
      const fMesh = new THREE.Mesh(fixtureGeo, fixtureMat);
      fMesh.position.set(fp.x, fixtureElevation, fp.z);
      lightsGroup.add(fMesh);

      // Suspension rod
      const rodGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.8);
      const rodMat = new THREE.MeshBasicMaterial({ color: 0x8A8982 });
      const rod = new THREE.Mesh(rodGeo, rodMat);
      rod.position.set(fp.x, fixtureElevation + 0.4, fp.z);
      lightsGroup.add(rod);

      // True 3D PointLight casting illuminance
      const ptLight = new THREE.PointLight(0xFFF9E6, 0.85, 14, 1.4);
      ptLight.position.set(fp.x, fixtureElevation - 0.15, fp.z);
      lightsGroup.add(ptLight);
    });

    scene.add(lightsGroup);

    // 9. 3D Ceiling Conduit Routing Network
    const conduitGroup = new THREE.Group();
    conduitGroupRef.current = conduitGroup;

    const conduitMat25 = new THREE.MeshStandardMaterial({ color: 0x087F73, roughness: 0.4, metalness: 0.6 }); // Deep teal GI
    const conduitMat20 = new THREE.MeshStandardMaterial({ color: 0x0B9B8A, roughness: 0.5, metalness: 0.4 }); // Mid teal PVC
    const jboxMat = new THREE.MeshStandardMaterial({ color: 0x202321, roughness: 0.3 });

    const createPipe = (p1: [number, number, number], p2: [number, number, number], isGI = false) => {
      const v1 = new THREE.Vector3(...p1);
      const v2 = new THREE.Vector3(...p2);
      const dist = v1.distanceTo(v2);
      const pipeGeo = new THREE.CylinderGeometry(isGI ? 0.07 : 0.045, isGI ? 0.07 : 0.045, dist, 8);
      const pipeMesh = new THREE.Mesh(pipeGeo, isGI ? conduitMat25 : conduitMat20);

      // Center and align cylinder along vector
      pipeMesh.position.copy(v1).add(v2).multiplyScalar(0.5);
      pipeMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), v2.clone().sub(v1).normalize());
      conduitGroup.add(pipeMesh);

      // Junction box at target node
      const jboxGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.14, 8);
      const jboxMesh = new THREE.Mesh(jboxGeo, jboxMat);
      jboxMesh.position.copy(v2);
      conduitGroup.add(jboxMesh);
    };

    // Primary 25mm GI Spine Run
    const conduitH = fixtureElevation + 0.4;
    createPipe([-18, conduitH, -2.5], [6, conduitH, -2.5], true);
    createPipe([6, conduitH, -2.5], [17, conduitH, -2.5], true);

    // Secondary 20mm Branches
    fixturePositions.forEach(fp => {
      createPipe([fp.x, conduitH, -2.5], [fp.x, conduitH, fp.z], false);
      // Vertical Drop down to fixture
      createPipe([fp.x, conduitH, fp.z], [fp.x, fixtureElevation, fp.z], false);
    });

    scene.add(conduitGroup);

    // 10. Interactive Mouse Orbit & Pan
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let spherical = { radius: 52, theta: Math.PI / 4, phi: Math.PI / 3.2 };

    const updateCamera = () => {
      camera.position.x = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
      camera.position.y = spherical.radius * Math.cos(spherical.phi);
      camera.position.z = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
      camera.lookAt(0, 0, 0);
    };
    updateCamera();

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      spherical.theta -= deltaX * 0.008;
      spherical.phi = Math.max(0.15, Math.min(Math.PI / 2 - 0.05, spherical.phi - deltaY * 0.008));
      updateCamera();
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      spherical.radius = Math.max(16, Math.min(95, spherical.radius + e.deltaY * 0.04));
      updateCamera();
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('wheel', onWheel, { passive: false });

    // 11. Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // 12. Cleanup
    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('wheel', onWheel);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [project, height]);

  // Handle Layer Toggles
  useEffect(() => {
    if (conduitGroupRef.current) conduitGroupRef.current.visible = showConduits;
  }, [showConduits]);

  useEffect(() => {
    if (lightsGroupRef.current) lightsGroupRef.current.visible = showLights;
  }, [showLights]);

  useEffect(() => {
    if (floorMeshRef.current) floorMeshRef.current.visible = showHeatmap;
  }, [showHeatmap]);

  const setViewPreset = (view: 'isometric' | 'top' | 'perspective') => {
    setCameraView(view);
    const camera = cameraRef.current;
    if (!camera) return;

    if (view === 'top') {
      camera.position.set(0, 48, 0.01);
      camera.lookAt(0, 0, 0);
    } else if (view === 'perspective') {
      camera.position.set(0, 6, 26);
      camera.lookAt(0, 2, 0);
    } else {
      camera.position.set(28, 32, 38);
      camera.lookAt(0, 0, 0);
    }
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-[#E7DED4] bg-[#FBF8F4]">
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="w-full cursor-grab active:cursor-grabbing" style={{ height: `${height}px` }} />

      {/* Floating 3D Controls Strip (Top Left) */}
      <div className="absolute top-3.5 left-3.5 flex items-center space-x-1.5 bg-[#FFFCF8]/90 backdrop-blur-xs p-1.5 rounded-lg border border-[#E7DED4] shadow-xs text-[11.5px] select-none">
        <button
          onClick={() => setViewPreset('isometric')}
          className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
            cameraView === 'isometric' ? 'bg-[#087F73] text-white font-medium' : 'text-[#62645F] hover:text-[#202321]'
          }`}
        >
          Isometric
        </button>
        <button
          onClick={() => setViewPreset('top')}
          className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
            cameraView === 'top' ? 'bg-[#087F73] text-white font-medium' : 'text-[#62645F] hover:text-[#202321]'
          }`}
        >
          Top Down
        </button>
        <button
          onClick={() => setViewPreset('perspective')}
          className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
            cameraView === 'perspective' ? 'bg-[#087F73] text-white font-medium' : 'text-[#62645F] hover:text-[#202321]'
          }`}
        >
          Eye Level
        </button>
      </div>

      {/* Floating Layer Toggles (Top Right) */}
      <div className="absolute top-3.5 right-3.5 flex items-center space-x-1.5 bg-[#FFFCF8]/90 backdrop-blur-xs p-1.5 rounded-lg border border-[#E7DED4] shadow-xs text-[11.5px] select-none">
        <button
          onClick={() => setShowHeatmap(!showHeatmap)}
          title="Toggle Lux Heatmap"
          className={`flex items-center space-x-1 px-2.5 py-1 rounded cursor-pointer transition-colors ${
            showHeatmap ? 'bg-[#E5F4EF] text-[#087F73] font-medium border border-[#087F73]/30' : 'text-[#8A8982]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Heatmap</span>
        </button>

        <button
          onClick={() => setShowConduits(!showConduits)}
          title="Toggle Conduit Routing"
          className={`flex items-center space-x-1 px-2.5 py-1 rounded cursor-pointer transition-colors ${
            showConduits ? 'bg-[#E5F4EF] text-[#087F73] font-medium border border-[#087F73]/30' : 'text-[#8A8982]'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Conduits</span>
        </button>

        <button
          onClick={() => setShowLights(!showLights)}
          title="Toggle Luminaire Photometrics"
          className={`flex items-center space-x-1 px-2.5 py-1 rounded cursor-pointer transition-colors ${
            showLights ? 'bg-[#E5F4EF] text-[#087F73] font-medium border border-[#087F73]/30' : 'text-[#8A8982]'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Lights</span>
        </button>
      </div>

      {/* Bottom Hint */}
      <div className="absolute bottom-3 left-4 text-[11px] text-[#8A8982] select-none pointer-events-none flex items-center space-x-2">
        <RotateCcw className="w-3 h-3 text-[#087F73]" />
        <span>Click & drag to rotate · Scroll wheel to zoom · Three.js WebGL Engine</span>
      </div>
    </div>
  );
}
