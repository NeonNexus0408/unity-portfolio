"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Stars, Float, Environment, Sphere, Box, Cylinder } from "@react-three/drei"
import * as THREE from "three"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Gamepad2, Code, Zap, Rocket, Shield, Target, Mail, Github, MessageCircle, Download } from "lucide-react"

export default function UnityPortfolio() {
  const [activeSection, setActiveSection] = useState("hero")

  return (
    <div className="w-full h-screen bg-black overflow-y-auto relative">
      {/* 3D Background Canvas */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }} gl={{ antialias: true, alpha: true }}>
          <Environment preset="night" />
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#4a90ff" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff4a4a" />

          <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade speed={1} />
          <SpaceBackground />
          <SpaceObjects />
        </Canvas>
      </div>

      {/* Static UI Content */}
      <div className="relative z-10 w-full h-full">
        <NavigationHUD activeSection={activeSection} setActiveSection={setActiveSection} />
        <GameUI />

        <div className={`container mx-auto px-4 py-16 flex flex-col items-center ${activeSection === "projects" ? "min-h-full justify-start" : "h-full justify-center"}`}>
          {activeSection === "hero" && <HeroSection setActiveSection={setActiveSection} />}
          {activeSection === "about" && <AboutSection />}
          {activeSection === "skills" && <SkillsSection />}
          {activeSection === "projects" && <div className="mt-[30px]"><ProjectsSection /></div>}
          {activeSection === "contact" && <ContactSection />}
        </div>
      </div>
    </div>
  )
}

function SpaceBackground() {
  const particlesRef = useRef<THREE.Points>(null)

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.05
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02
    }
  })

  const particleCount = 1000
  const positions = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 200
    positions[i * 3 + 1] = (Math.random() - 0.5) * 200
    positions[i * 3 + 2] = (Math.random() - 0.5) * 200
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.5} color="#4a90ff" transparent opacity={0.6} />
    </points>
  )
}

function SpaceObjects() {
  return (
    <>
      {/* Multiple spaceships */}
      <Spaceship position={[-5, 3, -10]} scale={0.8} rotation={[0.2, 0.5, 0]} />
      <Spaceship position={[8, -4, -15]} scale={1.2} rotation={[-0.3, -0.2, 0.1]} />
      <Spaceship position={[0, 7, -20]} scale={1.5} rotation={[0.1, 0.8, -0.2]} />

      {/* Space stations */}
      <SpaceStation position={[-10, -8, -25]} scale={2} />
      <SpaceStation position={[15, 10, -30]} scale={3} rotation={[0.5, 0.3, 0.2]} />

      {/* Planets */}
      <Planet position={[-20, 5, -50]} scale={5} color="#ff4a4a" />
      <Planet position={[25, -15, -70]} scale={8} color="#4aff4a" />

      {/* Asteroids field */}
      <AsteroidsField />
    </>
  )
}

function Spaceship({
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0],
}: {
  position?: [number, number, number]
  scale?: number
  rotation?: [number, number, number]
}) {
  const shipRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (shipRef.current) {
      shipRef.current.rotation.z += Math.sin(state.clock.elapsedTime * 0.5) * 0.005
      shipRef.current.rotation.x += Math.sin(state.clock.elapsedTime * 0.3) * 0.003
      shipRef.current.position.x += Math.sin(state.clock.elapsedTime * 0.2) * 0.01
      shipRef.current.position.y += Math.cos(state.clock.elapsedTime * 0.3) * 0.01
    }
  })

  return (
    <group ref={shipRef} position={position} scale={scale} rotation={rotation}>
      <Float speed={3} rotationIntensity={0.2} floatIntensity={0.8}>
        {/* Main body */}
        <Cylinder args={[0.3, 0.1, 2]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#666666" metalness={0.8} roughness={0.2} />
        </Cylinder>

        {/* Wings */}
        <Box args={[2, 0.1, 0.5]} position={[0, 0, 0.5]}>
          <meshStandardMaterial color="#444444" metalness={0.7} roughness={0.3} />
        </Box>

        {/* Engine glow */}
        <Sphere args={[0.2]} position={[0, 0, -1.2]}>
          <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={2} />
        </Sphere>
      </Float>
    </group>
  )
}

function SpaceStation({
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0],
}: {
  position?: [number, number, number]
  scale?: number
  rotation?: [number, number, number]
}) {
  const stationRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (stationRef.current) {
      stationRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <group ref={stationRef} position={position} scale={scale} rotation={rotation}>
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
        {/* Central hub */}
        <Sphere args={[1, 16, 16]}>
          <meshStandardMaterial color="#888888" metalness={0.7} roughness={0.3} />
        </Sphere>

        {/* Rings */}
        <group rotation={[Math.PI / 2, 0, 0]}>
          <Cylinder args={[2, 2, 0.1, 32, 1, true]}>
            <meshStandardMaterial color="#666666" metalness={0.8} roughness={0.2} side={THREE.DoubleSide} />
          </Cylinder>
        </group>

        {/* Spokes */}
        {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, i) => (
          <Box key={i} args={[0.2, 0.2, 2]} position={[Math.cos(angle) * 1.5, Math.sin(angle) * 1.5, 0]}>
            <meshStandardMaterial color="#555555" metalness={0.7} roughness={0.3} />
          </Box>
        ))}

        {/* Lights */}
        <pointLight position={[0, 0, 0]} intensity={0.5} color="#4a90ff" distance={3} />
      </Float>
    </group>
  )
}

function Planet({
  position = [0, 0, 0],
  scale = 1,
  color = "#4a90ff",
}: {
  position?: [number, number, number]
  scale?: number
  color?: string
}) {
  const planetRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (planetRef.current) {
      planetRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <Sphere ref={planetRef} args={[1, 32, 32]} position={position} scale={scale}>
      <meshStandardMaterial color={color} roughness={0.7} />
    </Sphere>
  )
}

function AsteroidsField() {
  const groupRef = useRef<THREE.Group>(null)
  const asteroidCount = 50

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.02
      groupRef.current.rotation.x = state.clock.elapsedTime * 0.01
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, -40]}>
      {Array.from({ length: asteroidCount }).map((_, i) => {
        const position: [number, number, number] = [
          (Math.random() - 0.5) * 60,
          (Math.random() - 0.5) * 60,
          (Math.random() - 0.5) * 60,
        ]
        const scale = Math.random() * 0.5 + 0.2
        const rotation: [number, number, number] = [
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI,
        ]

        return (
          <Box key={i} args={[1, 1, 1]} position={position} scale={scale} rotation={rotation}>
            <meshStandardMaterial color="#777777" roughness={0.9} />
          </Box>
        )
      })}
    </group>
  )
}

// Static UI Components

function HeroSection({ setActiveSection }: { setActiveSection: (section: string) => void }) {
  return (
    <div className="text-center max-w-4xl mx-auto">
      <div className="mb-6 animate-pulse">
        <div className="inline-block px-6 py-3 border-2 border-blue-500 rounded-full text-blue-400 text-sm font-mono">
          SYSTEM ONLINE
        </div>
      </div>
      <h1 className="text-6xl md:text-7xl font-bold mb-6 text-white">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400">
          UNITY DEVELOPER
        </span>
      </h1>
      <p className="text-xl md:text-2xl text-gray-300 mb-10">10+ Years of Combat Experience in Digital Battlefields</p>
      <Button
        onClick={() => setActiveSection("about")}
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-full font-bold text-lg shadow-lg shadow-blue-500/50 border border-blue-400"
      >
        <Rocket className="mr-2 h-5 w-5" />
        Launch Portfolio
      </Button>
    </div>
  )
}

function AboutSection() {
  return (
    <Card className="w-full max-w-4xl bg-black/80 border-blue-500 backdrop-blur-sm">
      <CardContent className="p-8">
        <div className="flex items-center mb-6">
          <Shield className="h-10 w-10 text-blue-400 mr-4" />
          <h2 className="text-3xl font-bold text-white">About Me</h2>
        </div>
        <p className="text-xl text-gray-300 mb-8">
          Elite Unity Developer with over 10 years of combat experience in the digital battlefield. Specialized in
          creating immersive gaming experiences, AR/VR applications, and interactive simulations.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-900/30 p-6 rounded-lg border border-blue-800">
            <div className="flex items-center text-green-400 mb-2">
              <Target className="h-6 w-6 mr-2" />
              <span className="text-lg font-bold">Mission Success</span>
            </div>
            <p className="text-3xl font-mono text-green-300">99.9%</p>
          </div>
          <div className="bg-blue-900/30 p-6 rounded-lg border border-blue-800">
            <div className="flex items-center text-blue-400 mb-2">
              <Zap className="h-6 w-6 mr-2" />
              <span className="text-lg font-bold">Games Deployed</span>
            </div>
            <p className="text-3xl font-mono text-blue-300">50+</p>
          </div>
          <div className="bg-blue-900/30 p-6 rounded-lg border border-blue-800">
            <div className="flex items-center text-purple-400 mb-2">
              <Code className="h-6 w-6 mr-2" />
              <span className="text-lg font-bold">Lines of Code</span>
            </div>
            <p className="text-3xl font-mono text-purple-300">1M+</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SkillsSection() {
  const skills = [
    { name: "Unity 3D", level: 95, color: "#ff4444" },
    { name: "C# Programming", level: 90, color: "#44ff44" },
    { name: "Game Design", level: 85, color: "#4444ff" },
    { name: "AR/VR Development", level: 95, color: "#ffff44" },
    { name: "Mobile Development", level: 88, color: "#ff44ff" },
    { name: "Multiplayer Systems", level: 82, color: "#44ffff" },
  ]

  return (
    <Card className="w-full max-w-4xl bg-black/80 border-green-500 backdrop-blur-sm">
      <CardContent className="p-8">
        <div className="flex items-center mb-6">
          <Gamepad2 className="h-10 w-10 text-green-400 mr-4" />
          <h2 className="text-3xl font-bold text-white">Combat Skills</h2>
        </div>
        <div className="space-y-6">
          {skills.map((skill, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-white">
                <span className="text-lg">{skill.name}</span>
                <span className="font-mono">{skill.level}%</span>
              </div>
              <Progress
                value={skill.level}
                className="h-3 bg-gray-700"
                style={
                  {
                    "--progress-background": skill.color,
                    boxShadow: `0 0 10px ${skill.color}`,
                  } as React.CSSProperties
                }
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ProjectsSection() {
  const projects = [
    {
      title: "SkyForge",
      description: "Epic space exploration and crafting game with procedural worlds",
      tech: ["Unity", "C#", "Procedural Generation", "Space Physics"],
      color: "#ff4444",
      image: "/images/skyforge.jpg",
    },
    {
      title: "NeuroSim",
      description: "Advanced neural network simulation and brain training application",
      tech: ["Unity", "C#", "AI/ML", "Data Visualization"],
      color: "#44ff44",
      image: "/images/NeuroSim.jfif",
    },
    {
      title: "AR Story",
      description: "Interactive augmented reality storytelling platform",
      tech: ["Unity", "C#", "ARCore/ARKit", "Interactive Narrative"],
      color: "#4444ff",
      image: "/images/ARStory.png",
    },
  ]

  return (
    <Card className="w-full max-w-4xl bg-black/80 border-purple-500 backdrop-blur-sm">
      <CardContent className="p-8">
        <div className="flex items-center mb-6">
          <Target className="h-10 w-10 text-purple-400 mr-4" />
          <h2 className="text-3xl font-bold text-white">Battle Projects</h2>
        </div>
        <div className="grid grid-cols-1 gap-8 ">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-black/50 rounded-lg border border-purple-700 hover:border-purple-400 transition-all hover:-translate-y-1 overflow-hidden"
              style={{ boxShadow: `0 4px 20px ${project.color}30`}}
            >
              <div className="relative">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/80 z-10"></div>
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={`Screenshot of ${project.title}`}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 z-20 bg-black/70 px-3 py-1 rounded-full border border-purple-500">
                  <span className="text-purple-300 text-xs font-mono">UNITY ENGINE</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                <p className="text-gray-300 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, techIndex) => (
                    <Badge key={techIndex} variant="outline" className="border-purple-400 text-purple-300">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ContactSection() {
  return (
    <Card className="w-full max-w-4xl bg-black/80 border-yellow-500 backdrop-blur-sm">
      <CardContent className="p-8">
        <div className="flex items-center mb-6">
          <Mail className="h-10 w-10 text-yellow-400 mr-4" />
          <h2 className="text-3xl font-bold text-white">Contact Command</h2>
        </div>
        <p className="text-xl text-gray-300 mb-8">
          Ready to join forces? Let's create the next legendary gaming experience together.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
              onClick={() => window.open('https://github.com/smartdev2048', '_blank')}
            >
              <Github className="mr-2 h-5 w-5" />
              GitHub Arsenal
            </Button>
            <Button 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 text-lg"
              onClick={() => {
                // Try to open Discord app first, fallback to web
                window.open('discord://users/techmaster1992', '_blank') || 
                window.open('https://discord.com/users/techmaster1992', '_blank');
              }}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Discord Command
            </Button>
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/resume.pdf';
                link.download = 'resume.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              <Download className="mr-2 h-5 w-5" />
              Download Resume
            </Button>
          </div>
          <div className="bg-blue-900/30 p-6 rounded-lg border border-blue-800">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-mono">COMMS ONLINE</span>
              </div>
              <p className="text-gray-300">
                Direct communication channels available. Send encrypted message for immediate response.
              </p>
              <div className="font-mono text-blue-300">
                <div>EMAIL: commander@unity-dev.com</div>
                <div>LOCATION: Digital Sector 7G</div>
                <div>STATUS: Ready for deployment</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function NavigationHUD({
  activeSection,
  setActiveSection,
}: {
  activeSection: string
  setActiveSection: (section: string) => void
}) {
  const sections = [
    { id: "hero", name: "Home", icon: Rocket },
    { id: "about", name: "About", icon: Shield },
    { id: "skills", name: "Skills", icon: Gamepad2 },
    { id: "projects", name: "Projects", icon: Target },
    { id: "contact", name: "Contact", icon: Mail },
  ]

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-10">
      <div className="flex space-x-2 bg-black/70 backdrop-blur-sm rounded-full p-2 border border-blue-500/30">
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <Button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              variant={activeSection === section.id ? "default" : "ghost"}
              size="sm"
              className={`rounded-full ${
                activeSection === section.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/50"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon className="h-4 w-4 mr-1" />
              {section.name}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

function GameUI() {
  const [health, setHealth] = useState(100)
  const [energy, setEnergy] = useState(85)

  useEffect(() => {
    const interval = setInterval(() => {
      setHealth((prev) => Math.max(95, prev + (Math.random() - 0.5) * 2))
      setEnergy((prev) => Math.max(80, prev + (Math.random() - 0.5) * 3))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed bottom-4 left-4 z-10">
      <div className="bg-black/70 backdrop-blur-sm rounded-lg p-4 border border-green-500/30">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-mono">SYSTEM ONLINE</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-red-400 text-xs">HP:</span>
            <div className="w-20 h-2 bg-gray-700 rounded">
              <div className="h-full bg-red-500 rounded transition-all duration-300" style={{ width: `${health}%` }} />
            </div>
            <span className="text-red-400 text-xs">{Math.round(health)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-blue-400 text-xs">EN:</span>
            <div className="w-20 h-2 bg-gray-700 rounded">
              <div className="h-full bg-blue-500 rounded transition-all duration-300" style={{ width: `${energy}%` }} />
            </div>
            <span className="text-blue-400 text-xs">{Math.round(energy)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
