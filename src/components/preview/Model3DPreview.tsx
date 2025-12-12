import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Center, useGLTF } from "@react-three/drei";
import { Loader2, AlertTriangle, Box } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Model3DPreviewProps {
  fileUrl: string;
  fileType: string;
  onLoad: () => void;
}

// GLB/GLTF Model Component
const GLTFModel = ({ url, onLoad }: { url: string; onLoad: () => void }) => {
  const { scene } = useGLTF(url);
  
  useEffect(() => {
    onLoad();
  }, [onLoad]);

  return <primitive object={scene} />;
};

// Simple Box placeholder for unsupported formats
const PlaceholderModel = () => (
  <mesh>
    <boxGeometry args={[2, 2, 2]} />
    <meshStandardMaterial color="#6366f1" />
  </mesh>
);

const Model3DPreview = ({ fileUrl, fileType, onLoad }: Model3DPreviewProps) => {
  const [error, setError] = useState<string | null>(null);
  const [showCanvas, setShowCanvas] = useState(false);
  
  const supportedFormats = ["glb", "gltf"];
  const isSupported = supportedFormats.includes(fileType.toLowerCase());

  useEffect(() => {
    if (!isSupported) {
      setError(`Formato .${fileType.toUpperCase()} não suportado para pré-visualização 3D. Apenas GLB e GLTF são suportados no browser.`);
      onLoad();
      return;
    }
    
    // Small delay to ensure the dialog is fully rendered
    const timer = setTimeout(() => {
      setShowCanvas(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [fileType, isSupported, onLoad]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="h-24 w-24 rounded-full bg-amber-500/10 flex items-center justify-center">
          <Box className="h-12 w-12 text-amber-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Pré-visualização 3D</h3>
          <p className="text-sm text-muted-foreground max-w-md">{error}</p>
        </div>
        <Button asChild variant="outline">
          <a href={fileUrl} download>
            Descarregar Ficheiro
          </a>
        </Button>
      </div>
    );
  }

  if (!showCanvas) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full h-[70vh] rounded-lg overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          <Center>
            {isSupported ? (
              <GLTFModel url={fileUrl} onLoad={onLoad} />
            ) : (
              <PlaceholderModel />
            )}
          </Center>
          
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            autoRotate={true}
            autoRotateSpeed={2}
          />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
      
      {/* Controls hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur px-4 py-2 rounded-full text-xs text-muted-foreground">
        🖱️ Arrastar para rodar • Scroll para zoom • Shift+Arrastar para mover
      </div>
    </div>
  );
};

export default Model3DPreview;
