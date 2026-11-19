import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { SolidType, SolidGeometryOutput } from './geometryMath';

interface SolidScene3DProps {
  solidType: SolidType;
  baseDimension: number; // a hoặc r
  height: number;        // h
  unfoldProgress: number; // 0 (khối 3D) -> 1 (trải phẳng)
  outputs: SolidGeometryOutput;
  showLabels: boolean;
  showAltitude: boolean;
  showWireframe: boolean;
  showGrid: boolean;
  opacity: number;
}

export const SolidScene3D: React.FC<SolidScene3DProps> = ({
  solidType,
  baseDimension,
  height,
  unfoldProgress,
  outputs,
  showLabels,
  showAltitude,
  showWireframe,
  showGrid,
  opacity,
}) => {
  return (
    <div className="relative w-full h-full bg-slate-950 select-none overflow-hidden">
      <Canvas
        camera={{ position: [9, 11, 13], fov: 45 }}
        gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
      >
        <color attach="background" args={['#020617']} />

        {/* Ambient & Directional Lights */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[12, 18, 12]} intensity={1.3} castShadow />
        <directionalLight position={[-12, 10, -10]} intensity={0.6} />
        <pointLight position={[0, 15, 0]} intensity={0.5} />

        {/* Ground grid */}
        {showGrid && (
          <gridHelper
            args={[30, 30, '#0284c7', '#1e293b']}
            position={[0, -0.01, 0]}
          />
        )}

        {/* Main 3D Solid / Net Mesh */}
        <SolidMeshContainer
          solidType={solidType}
          baseDimension={baseDimension}
          height={height}
          unfoldProgress={unfoldProgress}
          outputs={outputs}
          showLabels={showLabels}
          showAltitude={showAltitude}
          showWireframe={showWireframe}
          opacity={opacity}
        />

        {/* Orbit Controls */}
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.08}
          minDistance={4}
          maxDistance={35}
          maxPolarAngle={Math.PI / 2 + 0.15} // don't go too far below ground
        />
      </Canvas>

      {/* Floating 3D view guide */}
      <div className="absolute top-3 left-3 z-10 pointer-events-none bg-slate-900/80 backdrop-blur-md border border-slate-700/70 px-3 py-1.5 rounded-xl text-[11px] text-slate-300 shadow-lg">
        <span className="text-cyan-400 font-bold">Xoay 3D:</span> Chuột trái • <span className="text-cyan-400 font-bold">Thu phóng:</span> Cuộn chuột • <span className="text-cyan-400 font-bold">Di chuyển:</span> Chuột phải
      </div>
    </div>
  );
};

// =========================================================================
// RENDER CONTAINER FOR SPECIFIC SOLID
// =========================================================================
interface MeshContainerProps {
  solidType: SolidType;
  baseDimension: number;
  height: number;
  unfoldProgress: number;
  outputs: SolidGeometryOutput;
  showLabels: boolean;
  showAltitude: boolean;
  showWireframe: boolean;
  opacity: number;
}

const SolidMeshContainer: React.FC<MeshContainerProps> = ({
  solidType,
  baseDimension,
  height,
  unfoldProgress,
  outputs,
  showLabels,
  showAltitude,
  showWireframe,
  opacity,
}) => {
  switch (solidType) {
    case 'square-pyramid':
      return (
        <SquarePyramidMesh
          a={baseDimension}
          h={height}
          t={unfoldProgress}
          outputs={outputs}
          showLabels={showLabels}
          showAltitude={showAltitude}
          showWireframe={showWireframe}
          opacity={opacity}
        />
      );

    case 'triangular-pyramid':
      return (
        <TriangularPyramidMesh
          a={baseDimension}
          h={height}
          t={unfoldProgress}
          outputs={outputs}
          showLabels={showLabels}
          showAltitude={showAltitude}
          showWireframe={showWireframe}
          opacity={opacity}
        />
      );

    case 'triangular-prism':
      return (
        <TriangularPrismMesh
          a={baseDimension}
          h={height}
          t={unfoldProgress}
          outputs={outputs}
          showLabels={showLabels}
          showAltitude={showAltitude}
          showWireframe={showWireframe}
          opacity={opacity}
        />
      );

    case 'cylinder':
      return (
        <CylinderMesh
          r={baseDimension}
          h={height}
          t={unfoldProgress}
          outputs={outputs}
          showLabels={showLabels}
          showAltitude={showAltitude}
          showWireframe={showWireframe}
          opacity={opacity}
        />
      );

    case 'cone':
      return (
        <ConeMesh
          r={baseDimension}
          h={height}
          t={unfoldProgress}
          outputs={outputs}
          showLabels={showLabels}
          showAltitude={showAltitude}
          showWireframe={showWireframe}
          opacity={opacity}
        />
      );

    default:
      return null;
  }
};

// =========================================================================
// 1. HÌNH CHÓP TỨ GIÁC ĐỀU (SQUARE PYRAMID & NET)
// =========================================================================
interface SquarePyramidProps {
  a: number;
  h: number;
  t: number; // 0..1
  outputs: SolidGeometryOutput;
  showLabels: boolean;
  showAltitude: boolean;
  showWireframe: boolean;
  opacity: number;
}

const SquarePyramidMesh: React.FC<SquarePyramidProps> = ({
  a,
  h,
  t,
  outputs,
  showLabels,
  showAltitude,
  showWireframe,
  opacity,
}) => {
  const d = outputs.slantHeightOrGenerator; // Trung đoạn
  const currentHeight = (1 - t) * h;

  // Closed tilt angle: sin(theta) = h/d, cos(theta) = (a/2)/d
  const closedAngle = Math.atan2(h, a / 2);
  const currentTilt = (1 - t) * closedAngle;

  // Triangular face geometry centered at base edge
  const triGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      -a / 2, 0, 0,   // bottom left
       a / 2, 0, 0,   // bottom right
       0, d, 0,       // apex pointing up locally
    ]);
    geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geom.computeVertexNormals();
    return geom;
  }, [a, d]);

  return (
    <group>
      {/* Base Square ABCD on ground (y = 0) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[a, a]} />
        <meshStandardMaterial
          color="#0284c7"
          roughness={0.3}
          metalness={0.2}
          side={THREE.DoubleSide}
          transparent
          opacity={opacity}
          wireframe={showWireframe}
        />
      </mesh>

      {/* Base Edges Border */}
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(a, a)]} />
        <lineBasicMaterial color="#38bdf8" linewidth={2} />
      </lineSegments>

      {/* 4 Folding Side Faces */}
      {/* Face 1: AB (z = a/2) */}
      <group position={[0, 0, a / 2]} rotation={[currentTilt, 0, 0]}>
        <mesh geometry={triGeometry} rotation={[-Math.PI / 2, 0, 0]}>
          <meshStandardMaterial
            color="#38bdf8"
            side={THREE.DoubleSide}
            transparent
            opacity={opacity * 0.9}
            wireframe={showWireframe}
          />
        </mesh>
      </group>

      {/* Face 2: BC (x = a/2) */}
      <group position={[a / 2, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <group rotation={[currentTilt, 0, 0]}>
          <mesh geometry={triGeometry} rotation={[-Math.PI / 2, 0, 0]}>
            <meshStandardMaterial
              color="#0ea5e9"
              side={THREE.DoubleSide}
              transparent
              opacity={opacity * 0.9}
              wireframe={showWireframe}
            />
          </mesh>
        </group>
      </group>

      {/* Face 3: CD (z = -a/2) */}
      <group position={[0, 0, -a / 2]} rotation={[0, Math.PI, 0]}>
        <group rotation={[currentTilt, 0, 0]}>
          <mesh geometry={triGeometry} rotation={[-Math.PI / 2, 0, 0]}>
            <meshStandardMaterial
              color="#0284c7"
              side={THREE.DoubleSide}
              transparent
              opacity={opacity * 0.9}
              wireframe={showWireframe}
            />
          </mesh>
        </group>
      </group>

      {/* Face 4: DA (x = -a/2) */}
      <group position={[-a / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <group rotation={[currentTilt, 0, 0]}>
          <mesh geometry={triGeometry} rotation={[-Math.PI / 2, 0, 0]}>
            <meshStandardMaterial
              color="#38bdf8"
              side={THREE.DoubleSide}
              transparent
              opacity={opacity * 0.9}
              wireframe={showWireframe}
            />
          </mesh>
        </group>
      </group>

      {/* Altitude SO (Chiều cao h) */}
      {showAltitude && t < 0.95 && (
        <group>
          {/* Vertical line SO */}
          <line>
            <bufferGeometry
              attach="geometry"
              {...(() => {
                const geom = new THREE.BufferGeometry();
                geom.setAttribute(
                  'position',
                  new THREE.Float32BufferAttribute([0, 0, 0, 0, currentHeight, 0], 3)
                );
                return geom;
              })()}
            />
            <lineDashedMaterial color="#f59e0b" dashSize={0.2} gapSize={0.1} />
          </line>

          {/* Slant height line SM on Face 1 */}
          <line>
            <bufferGeometry
              attach="geometry"
              {...(() => {
                const geom = new THREE.BufferGeometry();
                const apexY = d * Math.sin(currentTilt);
                const apexZ = a / 2 + d * Math.cos(currentTilt);
                geom.setAttribute(
                  'position',
                  new THREE.Float32BufferAttribute([0, 0, a / 2, 0, apexY, apexZ], 3)
                );
                return geom;
              })()}
            />
            <lineBasicMaterial color="#ec4899" linewidth={2} />
          </line>
        </group>
      )}

      {/* Labels */}
      {showLabels && (
        <>
          <Html position={[-a / 2 - 0.2, 0, a / 2 + 0.2]} center>
            <span className="label-badge">A</span>
          </Html>
          <Html position={[a / 2 + 0.2, 0, a / 2 + 0.2]} center>
            <span className="label-badge">B</span>
          </Html>
          <Html position={[a / 2 + 0.2, 0, -a / 2 - 0.2]} center>
            <span className="label-badge">C</span>
          </Html>
          <Html position={[-a / 2 - 0.2, 0, -a / 2 - 0.2]} center>
            <span className="label-badge">D</span>
          </Html>
          <Html position={[0, -0.2, 0]} center>
            <span className="label-badge bg-amber-950 text-amber-300 border-amber-600">O</span>
          </Html>
          {t < 0.1 && (
            <Html position={[0, h + 0.3, 0]} center>
              <span className="label-badge bg-rose-950 text-rose-300 border-rose-500">S (Đỉnh)</span>
            </Html>
          )}
          {showAltitude && (
            <Html position={[0.2, currentHeight / 2, 0]} center>
              <span className="text-[10px] font-mono text-amber-400 font-bold bg-slate-900/80 px-1 rounded">
                h = {h.toFixed(1)}
              </span>
            </Html>
          )}
        </>
      )}
    </group>
  );
};

// =========================================================================
// 2. HÌNH CHÓP TAM GIÁC ĐỀU (TRIANGULAR PYRAMID & NET)
// =========================================================================
interface TriangularPyramidProps {
  a: number;
  h: number;
  t: number;
  outputs: SolidGeometryOutput;
  showLabels: boolean;
  showAltitude: boolean;
  showWireframe: boolean;
  opacity: number;
}

const TriangularPyramidMesh: React.FC<TriangularPyramidProps> = ({
  a,
  h,
  t,
  outputs,
  showLabels,
  showAltitude,
  showWireframe,
  opacity,
}) => {
  const d = outputs.slantHeightOrGenerator;
  const inradius = outputs.inradius;
  const circumradius = outputs.circumradius;
  const currentHeight = (1 - t) * h;

  const closedAngle = Math.atan2(h, inradius);
  const currentTilt = (1 - t) * closedAngle;

  // Base triangle geometry
  const baseGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const pA = [0, circumradius, 0];
    const pB = [-a / 2, -inradius, 0];
    const pC = [a / 2, -inradius, 0];
    const vertices = new Float32Array([...pA, ...pB, ...pC]);
    geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geom.computeVertexNormals();
    return geom;
  }, [a, inradius, circumradius]);

  // Triangular side face
  const sideTriGeom = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      -a / 2, 0, 0,
       a / 2, 0, 0,
       0, d, 0,
    ]);
    geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geom.computeVertexNormals();
    return geom;
  }, [a, d]);

  return (
    <group>
      {/* Base Equilateral Triangle */}
      <mesh geometry={baseGeometry} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial
          color="#6366f1"
          side={THREE.DoubleSide}
          transparent
          opacity={opacity}
          wireframe={showWireframe}
        />
      </mesh>

      {/* 3 Folding Side Faces */}
      {/* Side 1: BC (bottom edge at z = inradius) */}
      <group position={[0, 0, inradius]} rotation={[currentTilt, 0, 0]}>
        <mesh geometry={sideTriGeom} rotation={[-Math.PI / 2, 0, 0]}>
          <meshStandardMaterial
            color="#818cf8"
            side={THREE.DoubleSide}
            transparent
            opacity={opacity * 0.9}
            wireframe={showWireframe}
          />
        </mesh>
      </group>

      {/* Side 2: CA */}
      <group rotation={[0, (2 * Math.PI) / 3, 0]}>
        <group position={[0, 0, inradius]} rotation={[currentTilt, 0, 0]}>
          <mesh geometry={sideTriGeom} rotation={[-Math.PI / 2, 0, 0]}>
            <meshStandardMaterial
              color="#a5b4fc"
              side={THREE.DoubleSide}
              transparent
              opacity={opacity * 0.9}
              wireframe={showWireframe}
            />
          </mesh>
        </group>
      </group>

      {/* Side 3: AB */}
      <group rotation={[0, -(2 * Math.PI) / 3, 0]}>
        <group position={[0, 0, inradius]} rotation={[currentTilt, 0, 0]}>
          <mesh geometry={sideTriGeom} rotation={[-Math.PI / 2, 0, 0]}>
            <meshStandardMaterial
              color="#818cf8"
              side={THREE.DoubleSide}
              transparent
              opacity={opacity * 0.9}
              wireframe={showWireframe}
            />
          </mesh>
        </group>
      </group>

      {/* Altitude Line */}
      {showAltitude && t < 0.95 && (
        <line>
          <bufferGeometry
            attach="geometry"
            {...(() => {
              const geom = new THREE.BufferGeometry();
              geom.setAttribute(
                'position',
                new THREE.Float32BufferAttribute([0, 0, 0, 0, currentHeight, 0], 3)
              );
              return geom;
            })()}
          />
          <lineDashedMaterial color="#f59e0b" dashSize={0.2} gapSize={0.1} />
        </line>
      )}

      {/* Labels */}
      {showLabels && (
        <>
          <Html position={[0, 0, -circumradius - 0.2]} center>
            <span className="label-badge">A</span>
          </Html>
          <Html position={[-a / 2 - 0.2, 0, inradius + 0.2]} center>
            <span className="label-badge">B</span>
          </Html>
          <Html position={[a / 2 + 0.2, 0, inradius + 0.2]} center>
            <span className="label-badge">C</span>
          </Html>
          {t < 0.1 && (
            <Html position={[0, h + 0.3, 0]} center>
              <span className="label-badge bg-rose-950 text-rose-300 border-rose-500">S</span>
            </Html>
          )}
          <Html position={[0, -0.2, 0]} center>
            <span className="label-badge bg-amber-950 text-amber-300 border-amber-600">O</span>
          </Html>
        </>
      )}
    </group>
  );
};

// =========================================================================
// 3. HÌNH LĂNG TRỤ ĐỨNG TAM GIÁC (TRIANGULAR PRISM & NET)
// =========================================================================
interface TriangularPrismProps {
  a: number;
  h: number;
  t: number;
  outputs: SolidGeometryOutput;
  showLabels: boolean;
  showAltitude: boolean;
  showWireframe: boolean;
  opacity: number;
}

const TriangularPrismMesh: React.FC<TriangularPrismProps> = ({
  a,
  h,
  t,
  outputs,
  showLabels,
  showAltitude,
  showWireframe,
  opacity,
}) => {
  const inradius = outputs.inradius;
  const circumradius = outputs.circumradius;
  const foldAngle = (1 - t) * (Math.PI / 2); // 90° down to 0°

  // Base triangle geometry
  const triGeom = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const pA = [0, -circumradius, 0];
    const pB = [-a / 2, inradius, 0];
    const pC = [a / 2, inradius, 0];
    const vertices = new Float32Array([...pA, ...pB, ...pC]);
    geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geom.computeVertexNormals();
    return geom;
  }, [a, inradius, circumradius]);

  return (
    <group>
      {/* Bottom Base Triangle (Ground) */}
      <mesh geometry={triGeom} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial
          color="#10b981"
          side={THREE.DoubleSide}
          transparent
          opacity={opacity}
          wireframe={showWireframe}
        />
      </mesh>

      {/* 3 Folding Rectangles */}
      {/* Rect 1 along BC */}
      <group position={[0, 0, inradius]} rotation={[foldAngle, 0, 0]}>
        <mesh position={[0, 0, h / 2]}>
          <planeGeometry args={[a, h]} />
          <meshStandardMaterial
            color="#34d399"
            side={THREE.DoubleSide}
            transparent
            opacity={opacity * 0.9}
            wireframe={showWireframe}
          />
        </mesh>

        {/* Top Lid Triangle attached to the top of Rect 1 */}
        <group position={[0, 0, h]} rotation={[-(1 - t) * (Math.PI / 2), 0, 0]}>
          <mesh geometry={triGeom} rotation={[-Math.PI / 2, 0, Math.PI]}>
            <meshStandardMaterial
              color="#059669"
              side={THREE.DoubleSide}
              transparent
              opacity={opacity}
              wireframe={showWireframe}
            />
          </mesh>
        </group>
      </group>

      {/* Rect 2 along CA */}
      <group rotation={[0, (2 * Math.PI) / 3, 0]}>
        <group position={[0, 0, inradius]} rotation={[foldAngle, 0, 0]}>
          <mesh position={[0, 0, h / 2]}>
            <planeGeometry args={[a, h]} />
            <meshStandardMaterial
              color="#6ee7b7"
              side={THREE.DoubleSide}
              transparent
              opacity={opacity * 0.9}
              wireframe={showWireframe}
            />
          </mesh>
        </group>
      </group>

      {/* Rect 3 along AB */}
      <group rotation={[0, -(2 * Math.PI) / 3, 0]}>
        <group position={[0, 0, inradius]} rotation={[foldAngle, 0, 0]}>
          <mesh position={[0, 0, h / 2]}>
            <planeGeometry args={[a, h]} />
            <meshStandardMaterial
              color="#34d399"
              side={THREE.DoubleSide}
              transparent
              opacity={opacity * 0.9}
              wireframe={showWireframe}
            />
          </mesh>
        </group>
      </group>

      {/* Altitude indicator along vertical edge */}
      {showAltitude && t < 0.1 && (
        <line>
          <bufferGeometry
            attach="geometry"
            {...(() => {
              const geom = new THREE.BufferGeometry();
              geom.setAttribute(
                'position',
                new THREE.Float32BufferAttribute([-a / 2, 0, inradius, -a / 2, h, inradius], 3)
              );
              return geom;
            })()}
          />
          <lineBasicMaterial color="#f59e0b" linewidth={3} />
        </line>
      )}

      {/* Labels */}
      {showLabels && (
        <>
          <Html position={[0, 0, -circumradius - 0.2]} center>
            <span className="label-badge">A</span>
          </Html>
          <Html position={[-a / 2 - 0.2, 0, inradius + 0.2]} center>
            <span className="label-badge">B</span>
          </Html>
          <Html position={[a / 2 + 0.2, 0, inradius + 0.2]} center>
            <span className="label-badge">C</span>
          </Html>
          {t < 0.1 && (
            <>
              <Html position={[0, h + 0.2, -circumradius - 0.2]} center>
                <span className="label-badge bg-emerald-950 text-emerald-300 border-emerald-500">A'</span>
              </Html>
              <Html position={[-a / 2 - 0.2, h + 0.2, inradius + 0.2]} center>
                <span className="label-badge bg-emerald-950 text-emerald-300 border-emerald-500">B'</span>
              </Html>
              <Html position={[a / 2 + 0.2, h + 0.2, inradius + 0.2]} center>
                <span className="label-badge bg-emerald-950 text-emerald-300 border-emerald-500">C'</span>
              </Html>
            </>
          )}
        </>
      )}
    </group>
  );
};

// =========================================================================
// 4. HÌNH TRỤ (CYLINDER & NET)
// =========================================================================
interface CylinderProps {
  r: number;
  h: number;
  t: number;
  outputs: SolidGeometryOutput;
  showLabels: boolean;
  showAltitude: boolean;
  showWireframe: boolean;
  opacity: number;
}

const CylinderMesh: React.FC<CylinderProps> = ({
  r,
  h,
  t,
  showLabels,
  showAltitude,
  showWireframe,
  opacity,
}) => {
  const circ = 2 * Math.PI * r;
  // If t == 0, render 3D cylinder. If t > 0, unwrap to flat rectangle of width 2pi*r and height h.
  const isFlat = t > 0.05;

  return (
    <group>
      {!isFlat ? (
        // Standard 3D Cylinder
        <group position={[0, h / 2, 0]}>
          <mesh>
            <cylinderGeometry args={[r, r, h, 36]} />
            <meshStandardMaterial
              color="#06b6d4"
              roughness={0.2}
              metalness={0.1}
              transparent
              opacity={opacity}
              wireframe={showWireframe}
            />
          </mesh>
        </group>
      ) : (
        // Unfolded Net: Flat Rectangle + 2 Circle Lids
        <group>
          {/* Unwrapped Lateral Rectangle (Width 2pi*r, Height h) */}
          <mesh position={[0, (h / 2) * (1 - t), 0]} rotation={[-Math.PI / 2 * t, 0, 0]}>
            <planeGeometry args={[circ * t + (1 - t) * 2 * r, h]} />
            <meshStandardMaterial
              color="#06b6d4"
              side={THREE.DoubleSide}
              transparent
              opacity={opacity}
              wireframe={showWireframe}
            />
          </mesh>

          {/* Bottom Circle Lid */}
          <mesh position={[0, 0, r + 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[r, 36]} />
            <meshStandardMaterial
              color="#0891b2"
              side={THREE.DoubleSide}
              transparent
              opacity={opacity}
              wireframe={showWireframe}
            />
          </mesh>

          {/* Top Circle Lid */}
          <mesh position={[0, (1 - t) * h, -(r + 0.1)]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[r, 36]} />
            <meshStandardMaterial
              color="#0891b2"
              side={THREE.DoubleSide}
              transparent
              opacity={opacity}
              wireframe={showWireframe}
            />
          </mesh>
        </group>
      )}

      {/* Central Axis & Height */}
      {showAltitude && t < 0.1 && (
        <line>
          <bufferGeometry
            attach="geometry"
            {...(() => {
              const geom = new THREE.BufferGeometry();
              geom.setAttribute(
                'position',
                new THREE.Float32BufferAttribute([0, 0, 0, 0, h, 0], 3)
              );
              return geom;
            })()}
          />
          <lineDashedMaterial color="#f59e0b" dashSize={0.2} gapSize={0.1} />
        </line>
      )}

      {/* Labels */}
      {showLabels && (
        <>
          <Html position={[0, -0.2, 0]} center>
            <span className="label-badge">O₁ (Đáy dưới)</span>
          </Html>
          {t < 0.1 && (
            <Html position={[0, h + 0.2, 0]} center>
              <span className="label-badge">O₂ (Đáy trên)</span>
            </Html>
          )}
          <Html position={[r / 2, 0, 0]} center>
            <span className="text-[10px] font-mono font-bold text-cyan-300 bg-slate-900/80 px-1 rounded">
              r = {r.toFixed(1)}
            </span>
          </Html>
        </>
      )}
    </group>
  );
};

// =========================================================================
// 5. HÌNH NÓN (CONE & NET)
// =========================================================================
interface ConeProps {
  r: number;
  h: number;
  t: number;
  outputs: SolidGeometryOutput;
  showLabels: boolean;
  showAltitude: boolean;
  showWireframe: boolean;
  opacity: number;
}

const ConeMesh: React.FC<ConeProps> = ({
  r,
  h,
  t,
  outputs,
  showLabels,
  showAltitude,
  showWireframe,
  opacity,
}) => {
  const l = outputs.slantHeightOrGenerator; // Đường sinh
  const isFlat = t > 0.05;
  const sectorAngleRad = ((2 * Math.PI * r) / l) * t;

  return (
    <group>
      {!isFlat ? (
        // Standard 3D Cone
        <group position={[0, h / 2, 0]}>
          <mesh>
            <coneGeometry args={[r, h, 36]} />
            <meshStandardMaterial
              color="#f59e0b"
              roughness={0.25}
              transparent
              opacity={opacity}
              wireframe={showWireframe}
            />
          </mesh>

          {/* Base Cap */}
          <mesh position={[0, -h / 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[r, 36]} />
            <meshStandardMaterial
              color="#d97706"
              side={THREE.DoubleSide}
              transparent
              opacity={opacity}
              wireframe={showWireframe}
            />
          </mesh>
        </group>
      ) : (
        // Unfolded Net: Sector + Circular Base
        <group>
          {/* Circular Sector (Quạt tròn trải phẳng bán kính l) */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0, l, 36, 1, 0, sectorAngleRad || 0.1]} />
            <meshStandardMaterial
              color="#f59e0b"
              side={THREE.DoubleSide}
              transparent
              opacity={opacity}
              wireframe={showWireframe}
            />
          </mesh>

          {/* Circular Base on Ground Plane */}
          <mesh position={[0, 0, l + r + 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[r, 36]} />
            <meshStandardMaterial
              color="#d97706"
              side={THREE.DoubleSide}
              transparent
              opacity={opacity}
              wireframe={showWireframe}
            />
          </mesh>
        </group>
      )}

      {/* Altitude line and generator line */}
      {showAltitude && t < 0.1 && (
        <group>
          {/* Height SO */}
          <line>
            <bufferGeometry
              attach="geometry"
              {...(() => {
                const geom = new THREE.BufferGeometry();
                geom.setAttribute(
                  'position',
                  new THREE.Float32BufferAttribute([0, 0, 0, 0, h, 0], 3)
                );
                return geom;
              })()}
            />
            <lineDashedMaterial color="#ec4899" dashSize={0.2} gapSize={0.1} />
          </line>

          {/* Generator SA */}
          <line>
            <bufferGeometry
              attach="geometry"
              {...(() => {
                const geom = new THREE.BufferGeometry();
                geom.setAttribute(
                  'position',
                  new THREE.Float32BufferAttribute([r, 0, 0, 0, h, 0], 3)
                );
                return geom;
              })()}
            />
            <lineBasicMaterial color="#38bdf8" linewidth={2} />
          </line>
        </group>
      )}

      {/* Labels */}
      {showLabels && (
        <>
          <Html position={[0, -0.2, 0]} center>
            <span className="label-badge">O (Tâm đáy)</span>
          </Html>
          {t < 0.1 && (
            <Html position={[0, h + 0.3, 0]} center>
              <span className="label-badge bg-rose-950 text-rose-300 border-rose-500">S (Đỉnh)</span>
            </Html>
          )}
          <Html position={[r + 0.2, 0, 0]} center>
            <span className="label-badge">A</span>
          </Html>
          {showAltitude && (
            <Html position={[r / 2 + 0.2, h / 2, 0]} center>
              <span className="text-[10px] font-mono font-bold text-cyan-300 bg-slate-900/80 px-1 rounded">
                l = {l.toFixed(1)}
              </span>
            </Html>
          )}
        </>
      )}
    </group>
  );
};
