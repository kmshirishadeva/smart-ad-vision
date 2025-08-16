import { useState, useEffect } from "react";
import { CameraFeed } from "@/components/CameraFeed";
import { AdDisplay } from "@/components/AdDisplay";
import { DashboardStats } from "@/components/DashboardStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Zap, Target } from "lucide-react";
import heroImage from "@/assets/smartad-hero.jpg";

interface DetectedPerson {
  id: string;
  age: number;
  gender: 'male' | 'female';
  confidence: number;
  x: number;
  y: number;
}

interface DetectionLog {
  timestamp: Date;
  age: number;
  gender: 'male' | 'female';
  adShown: string;
}

const Index = () => {
  const [isSystemActive, setIsSystemActive] = useState(false);
  const [currentTarget, setCurrentTarget] = useState<{age: number, gender: 'male' | 'female'} | null>(null);
  const [detectionLogs, setDetectionLogs] = useState<DetectionLog[]>([]);
  const [systemUptime, setSystemUptime] = useState(0);

  // System uptime counter
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemUptime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePersonDetected = (person: DetectedPerson) => {
    setCurrentTarget({ age: person.age, gender: person.gender });
    
    // Add to detection logs
    setDetectionLogs(prev => [...prev, {
      timestamp: new Date(),
      age: person.age,
      gender: person.gender,
      adShown: `Ad targeted to ${person.age}y ${person.gender}`
    }].slice(-100)); // Keep last 100 logs
  };

  const handleAdView = (adId: string) => {
    console.log(`Ad viewed: ${adId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* Hero Section */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={heroImage} 
          alt="SmartAd AI Vision System"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Brain className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">SmartAd Vision</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl">
              AI-powered personalized advertising using real-time face recognition and demographic analysis
            </p>
            <div className="flex gap-4 justify-center">
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                <Zap className="w-3 h-3 mr-1" />
                Real-time Processing
              </Badge>
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                <Target className="w-3 h-3 mr-1" />
                Smart Targeting
              </Badge>
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                <Brain className="w-3 h-3 mr-1" />
                AI-Powered
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* System Overview */}
        <DashboardStats 
          detectionLogs={detectionLogs}
          isSystemActive={isSystemActive}
          systemUptime={systemUptime}
        />

        {/* Main Interface Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Camera Feed Section */}
          <div className="space-y-4">
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  Face Detection & Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CameraFeed 
                  onPersonDetected={handlePersonDetected}
                  isActive={isSystemActive}
                  onToggle={() => setIsSystemActive(!isSystemActive)}
                />
              </CardContent>
            </Card>

            {/* Current Detection Info */}
            {currentTarget && (
              <Card className="bg-gradient-card border-border animate-fade-in-up">
                <CardHeader>
                  <CardTitle className="text-sm">Current Target Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Detected Age:</span>
                      <Badge variant="secondary">{currentTarget.age} years</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Detected Gender:</span>
                      <Badge variant="secondary">{currentTarget.gender}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ad Targeting:</span>
                      <Badge className="bg-primary text-primary-foreground">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Ad Display Section */}
          <div className="space-y-4">
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Personalized Ad Display
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AdDisplay 
                  targetAge={currentTarget?.age}
                  targetGender={currentTarget?.gender}
                  onAdView={handleAdView}
                />
              </CardContent>
            </Card>

            {/* System Features */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="text-sm">System Capabilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span className="text-sm">Real-time face detection with OpenCV</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span className="text-sm">Age & gender prediction (85% accuracy)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span className="text-sm">Rule-based ad targeting engine</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span className="text-sm">≥15 FPS processing with &lt;1s latency</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span className="text-sm">Analytics & performance monitoring</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity Log */}
        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle>Recent Detection Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {detectionLogs.slice(-10).reverse().map((log, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">
                      {log.timestamp.toLocaleTimeString()}
                    </Badge>
                    <span className="text-sm">
                      Detected: {log.age}y {log.gender}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {log.adShown}
                  </span>
                </div>
              ))}
              {detectionLogs.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No detections yet. Start the camera to begin analysis.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;