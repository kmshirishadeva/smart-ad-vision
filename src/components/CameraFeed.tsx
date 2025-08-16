import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, StopCircle, Users } from "lucide-react";

interface DetectedPerson {
  id: string;
  age: number;
  gender: 'male' | 'female';
  confidence: number;
  x: number;
  y: number;
}

interface CameraFeedProps {
  onPersonDetected: (person: DetectedPerson) => void;
  isActive: boolean;
  onToggle: () => void;
}

export const CameraFeed = ({ onPersonDetected, isActive, onToggle }: CameraFeedProps) => {
  const [detectedPersons, setDetectedPersons] = useState<DetectedPerson[]>([]);
  const [frameRate, setFrameRate] = useState(24);

  // Simulate face detection
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      // Simulate random detection
      if (Math.random() > 0.7) {
        const person: DetectedPerson = {
          id: Math.random().toString(36).substr(2, 9),
          age: Math.floor(Math.random() * 60) + 15,
          gender: Math.random() > 0.5 ? 'male' : 'female',
          confidence: 0.8 + Math.random() * 0.15,
          x: Math.random() * 60 + 20,
          y: Math.random() * 60 + 20,
        };
        
        setDetectedPersons(prev => [person]);
        onPersonDetected(person);
        
        // Clear detection after 3 seconds
        setTimeout(() => {
          setDetectedPersons([]);
        }, 3000);
      }
      
      setFrameRate(20 + Math.random() * 10);
    }, 2000);

    return () => clearInterval(interval);
  }, [isActive, onPersonDetected]);

  return (
    <Card className="relative bg-gradient-card border-border overflow-hidden">
      <div className="aspect-video bg-muted relative overflow-hidden">
        {/* Simulated camera feed background */}
        <div className="absolute inset-0 bg-gradient-to-br from-muted to-card" />
        
        {/* Scanning line animation when active */}
        {isActive && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="w-full h-0.5 bg-primary/60 animate-scan-line" />
          </div>
        )}
        
        {/* Detection overlays */}
        {detectedPersons.map((person) => (
          <div
            key={person.id}
            className="absolute border-2 border-primary animate-pulse-glow rounded-lg"
            style={{
              left: `${person.x}%`,
              top: `${person.y}%`,
              width: '120px',
              height: '140px',
            }}
          >
            <div className="absolute -top-8 left-0 flex gap-1">
              <Badge variant="secondary" className="text-xs bg-primary text-primary-foreground">
                {person.gender}
              </Badge>
              <Badge variant="secondary" className="text-xs bg-primary text-primary-foreground">
                {person.age}y
              </Badge>
            </div>
            <div className="absolute -bottom-6 left-0">
              <Badge variant="outline" className="text-xs">
                {(person.confidence * 100).toFixed(1)}%
              </Badge>
            </div>
          </div>
        ))}
        
        {/* Status overlay */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-success animate-pulse' : 'bg-muted-foreground'}`} />
          <span className="text-sm font-medium text-foreground">
            {isActive ? `Live • ${frameRate.toFixed(0)} FPS` : 'Standby'}
          </span>
        </div>
        
        {/* Detection count */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">
            {detectedPersons.length} detected
          </span>
        </div>
        
        {/* Center message when inactive */}
        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Camera feed inactive</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Controls */}
      <div className="p-4 border-t border-border">
        <Button
          onClick={onToggle}
          variant={isActive ? "destructive" : "default"}
          className="w-full"
        >
          {isActive ? (
            <>
              <StopCircle className="w-4 h-4 mr-2" />
              Stop Detection
            </>
          ) : (
            <>
              <Camera className="w-4 h-4 mr-2" />
              Start Detection
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};