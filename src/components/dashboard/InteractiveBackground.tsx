import { useRef, useMemo, useEffect, useState, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useLocation } from 'react-router-dom'
import * as THREE from 'three'
import { motion } from 'framer-motion'

// Utility to create a soft, blurry circle texture programmatically
const createCircleTexture = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 16
  canvas.height = 16
  const ctx = canvas.getContext('2d')
  if (ctx) {
    const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 16, 16)
  }
  return new THREE.CanvasTexture(canvas)
}

function ParticleConstellation() {
  const { viewport } = useThree()
  const count = 90 // slightly increased to support dense particle fields nicely
  
  // Track mouse coordinates normalized for 3D viewport
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })
  
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1
      const y = -(event.clientY / window.innerHeight) * 2 + 1
      mouseRef.current.targetX = x * (viewport.width / 2)
      mouseRef.current.targetY = y * (viewport.height / 2)
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [viewport])

  // Get active route path
  let pathname = '/'
  try {
    const location = useLocation()
    pathname = location.pathname
  } catch (e) {
    // fallback outside router context
  }

  // Define modes based on route
  const getMode = (path: string) => {
    if (path === '/' || path === '') return 'constellation' // Dashboard
    if (path.startsWith('/planner')) return 'gradient' // Planner
    if (path.startsWith('/resources')) return 'floating-nodes' // Knowledge Hub
    if (path.startsWith('/analytics')) return 'particle-field' // Analytics
    if (path.startsWith('/preferences') || path.startsWith('/settings')) return 'calm-blur' // Settings
    if (path.startsWith('/profile')) return 'organic-mesh' // Profile
    if (path.startsWith('/study')) return 'nebula-breath' // Study Workspace
    return 'constellation'
  };

  const mode = getMode(pathname)

  // Initialize particle vectors
  const particles = useMemo(() => {
    const data = []
    for (let i = 0; i < count; i++) {
      data.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * viewport.width * 1.35,
          (Math.random() - 0.5) * viewport.height * 1.35,
          (Math.random() - 0.5) * 5
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.005,
          (Math.random() - 0.5) * 0.005,
          (Math.random() - 0.5) * 0.002
        ),
        originalSpeed: Math.random() * 0.4 + 0.6,
        noiseSeed: Math.random() * 100
      })
    }
    return data
  }, [viewport])

  const pointsRef = useRef<THREE.Points>(null)
  const lineGeometryRef = useRef<THREE.BufferGeometry>(null)
  const pointsMaterialRef = useRef<THREE.PointsMaterial>(null)
  const lineMaterialRef = useRef<THREE.LineBasicMaterial>(null)
  
  const texture = useMemo(() => createCircleTexture(), [])

  // Line segment buffers
  const maxLines = count * 3
  const linePositions = useMemo(() => new Float32Array(maxLines * 2 * 3), [maxLines])
  const lineColors = useMemo(() => new Float32Array(maxLines * 2 * 4), [maxLines])

  // Reacting to Light/Dark Mode
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'))
  
  useEffect(() => {
    const handleThemeChange = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    window.addEventListener('theme-change', handleThemeChange)
    return () => window.removeEventListener('theme-change', handleThemeChange)
  }, [])

  // Lerp parameters for mode transitions
  const lerpParams = useRef({
    maxDist: 2.2,
    alpha: 0.35,
    lineAlpha: 0.12,
    particleSize: 12
  })

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    const mouse = mouseRef.current
    mouse.x += (mouse.targetX - mouse.x) * 0.06
    mouse.y += (mouse.targetY - mouse.y) * 0.06

    // Target parameters depending on mode
    let targetMaxDist = 2.2
    let targetAlpha = isDark ? 0.35 : 0.22
    let targetLineAlpha = isDark ? 0.12 : 0.07
    let targetParticleSize = isDark ? 14 : 10

    switch (mode) {
      case 'gradient': // Planner: smooth gradient, minimal lines/points
        targetMaxDist = 0.0
        targetAlpha = 0.02
        targetLineAlpha = 0.0
        targetParticleSize = 4
        break
      case 'floating-nodes': // Knowledge Hub: sparse rising nodes
        targetMaxDist = 1.9
        targetAlpha = isDark ? 0.28 : 0.18
        targetLineAlpha = isDark ? 0.08 : 0.04
        targetParticleSize = isDark ? 16 : 12
        break
      case 'particle-field': // Analytics: dense wave particles
        targetMaxDist = 0.0
        targetAlpha = isDark ? 0.45 : 0.28
        targetLineAlpha = 0.0
        targetParticleSize = isDark ? 8 : 6
        break
      case 'calm-blur': // Settings: ultra subtle, slow
        targetMaxDist = 0.0
        targetAlpha = 0.06
        targetLineAlpha = 0.0
        targetParticleSize = 6
        break
      case 'organic-mesh': // Profile: grid/mesh structures
        targetMaxDist = 3.2
        targetAlpha = isDark ? 0.4 : 0.25
        targetLineAlpha = isDark ? 0.18 : 0.12
        targetParticleSize = isDark ? 12 : 9
        break
      case 'nebula-breath': // Study Workspace: breathing spots
        targetMaxDist = 0.0
        targetAlpha = (isDark ? 0.3 : 0.18) * (0.6 + Math.sin(time * 0.8) * 0.4) // breathing pulse
        targetLineAlpha = 0.0
        targetParticleSize = (isDark ? 15 : 11) * (0.85 + Math.sin(time * 0.8) * 0.15)
        break
      case 'constellation': // Dashboard: default network
      default:
        targetMaxDist = 2.2
        targetAlpha = isDark ? 0.35 : 0.22
        targetLineAlpha = isDark ? 0.12 : 0.07
        targetParticleSize = isDark ? 14 : 10
        break
    }

    // Lerp values
    const lerpSpeed = 0.04
    const params = lerpParams.current
    params.maxDist += (targetMaxDist - params.maxDist) * lerpSpeed
    params.alpha += (targetAlpha - params.alpha) * lerpSpeed
    params.lineAlpha += (targetLineAlpha - params.lineAlpha) * lerpSpeed
    params.particleSize += (targetParticleSize - params.particleSize) * lerpSpeed

    // Update Materials
    if (pointsMaterialRef.current) {
      pointsMaterialRef.current.opacity = params.alpha
      pointsMaterialRef.current.size = params.particleSize
    }

    const positionsAttr = pointsRef.current?.geometry.attributes.position as THREE.BufferAttribute
    if (!positionsAttr) return

    particles.forEach((p, i) => {
      // 1. Movement logic based on mode
      if (mode === 'floating-nodes') {
        // Rise upwards like bubbles
        p.position.y += 0.003 * p.originalSpeed
        p.position.x += Math.sin(time * 0.5 + p.noiseSeed) * 0.001
        
        // Wrap-around bounds
        const boundY = viewport.height * 0.75
        if (p.position.y > boundY) {
          p.position.y = -boundY
          p.position.x = (Math.random() - 0.5) * viewport.width * 1.35
        }
      } else if (mode === 'particle-field') {
        // Flow in a beautiful sine wave matrix
        p.position.x += p.velocity.x * 0.2
        p.position.y = Math.sin(p.position.x * 0.6 + time * 0.6 + p.noiseSeed) * 1.6
        p.position.z = Math.cos(p.position.x * 0.3 + time * 0.4) * 1.2
        
        // Wrap horizontally
        const boundX = viewport.width * 0.75
        if (p.position.x > boundX) p.position.x = -boundX
        if (p.position.x < -boundX) p.position.x = boundX
      } else if (mode === 'nebula-breath') {
        // Calm drifting in place
        p.position.x += p.velocity.x * 0.15
        p.position.y += p.velocity.y * 0.15
        
        // Soft bounce boundaries
        const boundX = viewport.width * 0.75
        const boundY = viewport.height * 0.75
        if (Math.abs(p.position.x) > boundX) p.velocity.x *= -1
        if (Math.abs(p.position.y) > boundY) p.velocity.y *= -1
      } else {
        // Standard constellation drift
        p.position.x += p.velocity.x * p.originalSpeed
        p.position.y += p.velocity.y * p.originalSpeed
        p.position.z += p.velocity.z * p.originalSpeed

        // Bound wrap-around
        const boundX = viewport.width * 0.8
        const boundY = viewport.height * 0.8
        if (p.position.x > boundX) p.position.x = -boundX
        if (p.position.x < -boundX) p.position.x = boundX
        if (p.position.y > boundY) p.position.y = -boundY
        if (p.position.y < -boundY) p.position.y = boundY
      }

      // 2. Mouse attraction vs repulsion
      const dx = mouse.x - p.position.x
      const dy = mouse.y - p.position.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      
      if (dist < 4.0) {
        if (mode === 'organic-mesh') {
          // Attract (organic mesh warping)
          const force = (4.0 - dist) * 0.0006
          p.position.x += (dx / dist) * force
          p.position.y += (dy / dist) * force
        } else if (mode !== 'particle-field') {
          // Repel (constellation particles push away)
          const force = (4.0 - dist) * 0.0008
          p.position.x -= (dx / dist) * force
          p.position.y -= (dy / dist) * force
        }
      }

      positionsAttr.setXYZ(i, p.position.x, p.position.y, p.position.z)
    })
    positionsAttr.needsUpdate = true

    // Proximity connections line drawing
    let lineIdx = 0
    
    if (params.maxDist > 0.05) {
      const lineConnectionColor = isDark 
        ? new THREE.Color('#6366f1') // Violet
        : new THREE.Color('#3b82f6') // Blue

      for (let i = 0; i < count; i++) {
        const p1 = particles[i]
        for (let j = i + 1; j < count; j++) {
          if (lineIdx >= maxLines) break
          
          const p2 = particles[j]
          const dx = p1.position.x - p2.position.x
          const dy = p1.position.y - p2.position.y
          const dz = p1.position.z - p2.position.z
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz)

          if (d < params.maxDist) {
            const idx = lineIdx * 6
            linePositions[idx] = p1.position.x
            linePositions[idx + 1] = p1.position.y
            linePositions[idx + 2] = p1.position.z
            
            linePositions[idx + 3] = p2.position.x
            linePositions[idx + 4] = p2.position.y
            linePositions[idx + 5] = p2.position.z

            // Opacity drops linearly with distance
            const alpha = (1.0 - d / params.maxDist) * params.lineAlpha
            const colIdx = lineIdx * 8
            
            // Source point color + alpha
            lineColors[colIdx] = lineConnectionColor.r
            lineColors[colIdx + 1] = lineConnectionColor.g
            lineColors[colIdx + 2] = lineConnectionColor.b
            lineColors[colIdx + 3] = alpha
            
            // Destination point color + alpha
            lineColors[colIdx + 4] = lineConnectionColor.r
            lineColors[colIdx + 5] = lineConnectionColor.g
            lineColors[colIdx + 6] = lineConnectionColor.b
            lineColors[colIdx + 7] = alpha

            lineIdx++
          }
        }
      }
    }

    // Clear remaining indices
    for (let i = lineIdx; i < maxLines; i++) {
      const idx = i * 6
      const colIdx = i * 8
      linePositions[idx] = 0
      linePositions[idx + 1] = 0
      linePositions[idx + 2] = 0
      linePositions[idx + 3] = 0
      linePositions[idx + 4] = 0
      linePositions[idx + 5] = 0
      lineColors[colIdx + 3] = 0
      lineColors[colIdx + 7] = 0
    }

    if (lineGeometryRef.current) {
      const posAttr = lineGeometryRef.current.getAttribute('position') as THREE.BufferAttribute
      const colAttr = lineGeometryRef.current.getAttribute('color') as THREE.BufferAttribute
      if (posAttr) posAttr.needsUpdate = true
      if (colAttr) colAttr.needsUpdate = true
    }
  })

  // Set initial point coordinates
  const initialPositions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    particles.forEach((p, i) => {
      arr[i * 3] = p.position.x
      arr[i * 3 + 1] = p.position.y
      arr[i * 3 + 2] = p.position.z
    })
    return arr
  }, [particles])

  // Custom colors for points
  const pointColors = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const color = isDark
        ? (Math.random() > 0.5 ? new THREE.Color('#818cf8') : new THREE.Color('#60a5fa'))
        : (Math.random() > 0.5 ? new THREE.Color('#4f46e5') : new THREE.Color('#2563eb'))
      arr[i * 3] = color.r
      arr[i * 3 + 1] = color.g
      arr[i * 3 + 2] = color.b
    }
    return arr
  }, [isDark])

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[initialPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[pointColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={pointsMaterialRef}
          sizeAttenuation={true}
          transparent={true}
          alphaMap={texture}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={isDark ? 0.35 : 0.22}
          vertexColors={true}
        />
      </points>

      <lineSegments>
        <bufferGeometry ref={lineGeometryRef}>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[lineColors, 4]} />
        </bufferGeometry>
        <lineBasicMaterial
          ref={lineMaterialRef}
          transparent={true}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          vertexColors={true}
          linewidth={1}
        />
      </lineSegments>
    </group>
  )
}

function BlobBackground() {
  let pathname = '/'
  try {
    const location = useLocation()
    pathname = location.pathname
  } catch (e) {}

  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'))
  
  useEffect(() => {
    const handleThemeChange = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    window.addEventListener('theme-change', handleThemeChange)
    return () => window.removeEventListener('theme-change', handleThemeChange)
  }, [])

  // In settings or preferences page, damp the blobs opacity even further for minimal distractions
  const isSettings = pathname.startsWith('/preferences') || pathname.startsWith('/settings')
  const isStudy = pathname.startsWith('/study')

  // Get workspace-specific colors to support page identities within the Moon Blue style family
  const getWorkspaceColors = (path: string, dark: boolean) => {
    // Default / Dashboard: Moon Blue (#6FA8FF) to Lavender (#9B8CFF)
    let c1 = dark ? 'rgba(111, 168, 255, 0.12)' : 'rgba(111, 168, 255, 0.08)'
    let c2 = dark ? 'rgba(155, 140, 255, 0.10)' : 'rgba(155, 140, 255, 0.06)'
    let c3 = dark ? 'rgba(111, 168, 255, 0.08)' : 'rgba(111, 168, 255, 0.04)'

    if (path.startsWith('/courses')) {
      // Emerald -> Cyan
      c1 = dark ? 'rgba(52, 211, 153, 0.12)' : 'rgba(52, 211, 153, 0.08)'
      c2 = dark ? 'rgba(6, 182, 212, 0.10)' : 'rgba(6, 182, 212, 0.06)'
      c3 = dark ? 'rgba(52, 211, 153, 0.08)' : 'rgba(52, 211, 153, 0.04)'
    } else if (path.startsWith('/planner')) {
      // Moon Blue -> Aqua
      c1 = dark ? 'rgba(111, 168, 255, 0.12)' : 'rgba(111, 168, 255, 0.08)'
      c2 = dark ? 'rgba(34, 211, 238, 0.10)' : 'rgba(34, 211, 238, 0.06)'
      c3 = dark ? 'rgba(111, 168, 255, 0.08)' : 'rgba(111, 168, 255, 0.04)'
    } else if (path.startsWith('/timeline')) {
      // Indigo -> Moon Blue
      c1 = dark ? 'rgba(99, 102, 241, 0.12)' : 'rgba(99, 102, 241, 0.08)'
      c2 = dark ? 'rgba(111, 168, 255, 0.10)' : 'rgba(111, 168, 255, 0.06)'
      c3 = dark ? 'rgba(99, 102, 241, 0.08)' : 'rgba(99, 102, 241, 0.04)'
    } else if (path.startsWith('/resources') || path.startsWith('/import')) {
      // Cyan -> Ice Blue
      c1 = dark ? 'rgba(6, 182, 212, 0.12)' : 'rgba(6, 182, 212, 0.08)'
      c2 = dark ? 'rgba(190, 231, 255, 0.10)' : 'rgba(190, 231, 255, 0.06)'
      c3 = dark ? 'rgba(6, 182, 212, 0.08)' : 'rgba(6, 182, 212, 0.04)'
    } else if (path.startsWith('/study')) {
      // Soft Lavender -> Blue
      c1 = dark ? 'rgba(155, 140, 255, 0.12)' : 'rgba(155, 140, 255, 0.08)'
      c2 = dark ? 'rgba(59, 130, 246, 0.10)' : 'rgba(59, 130, 246, 0.06)'
      c3 = dark ? 'rgba(155, 140, 255, 0.08)' : 'rgba(155, 140, 255, 0.04)'
    } else if (path.startsWith('/analytics')) {
      // Electric Blue -> Violet
      c1 = dark ? 'rgba(37, 99, 235, 0.12)' : 'rgba(37, 99, 235, 0.08)'
      c2 = dark ? 'rgba(139, 92, 246, 0.10)' : 'rgba(139, 92, 246, 0.06)'
      c3 = dark ? 'rgba(37, 99, 235, 0.08)' : 'rgba(37, 99, 235, 0.04)'
    } else if (path.startsWith('/profile')) {
      // Moon Blue -> Rose Tint
      c1 = dark ? 'rgba(111, 168, 255, 0.12)' : 'rgba(111, 168, 255, 0.08)'
      c2 = dark ? 'rgba(251, 113, 133, 0.10)' : 'rgba(251, 113, 133, 0.06)'
      c3 = dark ? 'rgba(111, 168, 255, 0.08)' : 'rgba(111, 168, 255, 0.04)'
    } else if (path.startsWith('/preferences') || path.startsWith('/settings')) {
      // Slate -> Moon Blue
      c1 = dark ? 'rgba(100, 116, 139, 0.10)' : 'rgba(100, 116, 139, 0.06)'
      c2 = dark ? 'rgba(111, 168, 255, 0.08)' : 'rgba(111, 168, 255, 0.04)'
      c3 = dark ? 'rgba(100, 116, 139, 0.06)' : 'rgba(100, 116, 139, 0.03)'
    }
    return { c1, c2, c3 }
  }

  const colors = getWorkspaceColors(pathname, isDark)

  return (
    <div 
      className={`absolute inset-0 overflow-hidden z-0 pointer-events-none transition-opacity duration-1000 ${
        isSettings ? 'opacity-25' : isStudy ? 'opacity-30' : 'opacity-50 dark:opacity-40'
      }`}
    >
      {/* Blob 1: Multi-layer Primary Workspace Accent */}
      <motion.div
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -40, 30, 0],
          scale: [1, 1.1, 0.92, 1],
        }}
        transition={{
          duration: 95,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ backgroundColor: colors.c1 }}
        className="absolute -top-[10%] -left-[10%] w-[55vw] h-[55vw] max-w-[650px] rounded-full blur-[110px] md:blur-[150px]"
      />
      {/* Blob 2: Workspace Secondary Accent */}
      <motion.div
        animate={{
          x: [0, -60, 40, 0],
          y: [0, 50, -40, 0],
          scale: [1, 0.9, 1.12, 1],
        }}
        transition={{
          duration: 110,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ backgroundColor: colors.c2 }}
        className="absolute -bottom-[15%] -right-[15%] w-[60vw] h-[60vw] max-w-[750px] rounded-full blur-[110px] md:blur-[150px]"
      />
      {/* Blob 3: Workspace Tertiary Accent */}
      <motion.div
        animate={{
          x: [0, 35, -50, 0],
          y: [0, 30, 50, 0],
          scale: [1, 1.15, 0.85, 1],
        }}
        transition={{
          duration: 90,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ backgroundColor: colors.c3 }}
        className="absolute top-[25%] left-[35%] w-[38vw] h-[38vw] max-w-[500px] rounded-full blur-[100px] md:blur-[130px]"
      />
    </div>
  )
}

export default function InteractiveBackground() {
  const [hasWebGL, setHasWebGL] = useState(true)
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'))

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const support = !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')))
      setHasWebGL(support)
    } catch (e) {
      setHasWebGL(false)
    }
  }, [])

  useEffect(() => {
    const handleThemeChange = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    window.addEventListener('theme-change', handleThemeChange)
    return () => window.removeEventListener('theme-change', handleThemeChange)
  }, [])

  const backgroundStyle = isDark
    ? {
        background: `radial-gradient(circle at 10% 20%, rgba(111, 168, 255, 0.15), transparent 45%),
                     radial-gradient(circle at 90% 80%, rgba(155, 140, 255, 0.10), transparent 40%),
                     linear-gradient(180deg, #0B1220 0%, #111827 50%, #151D2F 100%)`
      }
    : {
        background: `radial-gradient(circle at 10% 20%, rgba(111, 168, 255, 0.08), transparent 50%),
                     radial-gradient(circle at 90% 80%, rgba(155, 140, 255, 0.05), transparent 40%),
                     linear-gradient(180deg, #F8F9FB 0%, #EDF1F5 50%, #E6EEF4 100%)`
      }

  return (
    <div 
      style={backgroundStyle}
      className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none select-none transition-all duration-1000"
    >
      {/* Layer 1: Morphing CSS Gradients */}
      <BlobBackground />

      {/* Layer 2: Interactive 3D Canvas */}
      {hasWebGL && (
        <div className="absolute inset-0 w-full h-full opacity-70 dark:opacity-85">
          <Canvas
            camera={{ position: [0, 0, 8], fov: 60 }}
            dpr={[1, 1.5]}
            gl={{ alpha: true, antialias: false, depth: false, powerPreference: "high-performance" }}
          >
            <Suspense fallback={null}>
              <ParticleConstellation />
            </Suspense>
          </Canvas>
        </div>
      )}
    </div>
  )
}
