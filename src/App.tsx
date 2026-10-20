import { useRef, useState, type ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three'
import './App.css'

// Los 3 lugares donde pueden estar las figuras: izquierda, centro y derecha
const lugares: [number, number, number][] = [
  [-4.9, 0, 0],
  [10, 0, 10],
  [2.5, 5, 0],
]

// Dibuja una estrella de 5 puntas
function crearEstrella() {
  const forma = new THREE.Shape()
  for (let i = 0; i < 10; i++) {
    const radio = i % 2 === 0 ? 1 : 0.45
    const angulo = (i / 10) * Math.PI * 2 + Math.PI / 2
    const x = Math.cos(angulo) * radio
    const y = Math.sin(angulo) * radio
    if (i === 0) forma.moveTo(x, y)
    else forma.lineTo(x, y)
  }
  return forma
}

const estrella = crearEstrella()

type FiguraProps = {
  posicion: [number, number, number]
  color: string
  onClick: () => void
  children: ReactNode
}

// Una figura que gira sola
function Figura({ posicion, color, onClick, children }: FiguraProps) {//
  const ref = useRef<THREE.Mesh>(null!)

  useFrame((_, delta) => {
    ref.current.rotation.y += delta
  })

  return (
    <mesh ref={ref} position={posicion} onClick={onClick}>
      {children}
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

function App() {
  const [turno, setTurno] = useState(0)

  // Cada clic mueve las figuras un lugar
  const cambiarDeLado = () => setTurno((t) => (t + 1) % 3)//

  return (
    <>
      <h1 className="nombre">Juan Gabriel Ibanez</h1>

      <Canvas camera={{ position: [0, 0, 6] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} />
        <OrbitControls enableZoom={false} enablePan={false} />
        <Environment files="/360.jpg" background />

       <Figura posicion={lugares[turno]} color="red" onClick={cambiarDeLado}>
          <sphereGeometry args={[0.9, 32, 32]} />
        </Figura>

        <Figura posicion={lugares[(turno + 1) % 3]} color="gold" onClick={cambiarDeLado}>
          <extrudeGeometry args={[estrella, { depth: 0.3 }]} />
        </Figura>

        <Figura posicion={lugares[(turno + 2) % 3]} color="dodgerblue" onClick={cambiarDeLado}>
          <boxGeometry args={[1.4, 1.4, 1.4]} />
        </Figura>
      </Canvas>
    </>
  )
}

export default App
