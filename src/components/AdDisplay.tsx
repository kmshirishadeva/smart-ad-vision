import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Clock, Target } from "lucide-react";

interface Ad {
  id: string;
  title: string;
  description: string;
  targetAge: string;
  targetGender: string;
  category: string;
  imageUrl: string;
  duration: number;
}

interface AdDisplayProps {
  targetAge?: number;
  targetGender?: 'male' | 'female';
  onAdView?: (adId: string) => void;
}

const ads: Ad[] = [
  {
    id: "1",
    title: "Premium Skincare Collection",
    description: "Discover our anti-aging skincare line for radiant, youthful skin",
    targetAge: "25-45",
    targetGender: "female",
    category: "Beauty",
    imageUrl: "/api/placeholder/400/300",
    duration: 15
  },
  {
    id: "2", 
    title: "Gaming Laptop Pro",
    description: "Ultimate performance for gaming and content creation",
    targetAge: "18-35",
    targetGender: "male",
    category: "Technology",
    imageUrl: "/api/placeholder/400/300",
    duration: 10
  },
  {
    id: "3",
    title: "Retirement Planning Guide",
    description: "Secure your financial future with our expert retirement solutions",
    targetAge: "50-70",
    targetGender: "both",
    category: "Finance",
    imageUrl: "/api/placeholder/400/300",
    duration: 20
  },
  {
    id: "4",
    title: "Fitness Tracker Pro",
    description: "Monitor your health and achieve your fitness goals",
    targetAge: "20-40",
    targetGender: "both",
    category: "Health",
    imageUrl: "/api/placeholder/400/300",
    duration: 12
  }
];

export const AdDisplay = ({ targetAge, targetGender, onAdView }: AdDisplayProps) => {
  const [currentAd, setCurrentAd] = useState<Ad>(ads[0]);
  const [timeRemaining, setTimeRemaining] = useState(15);
  const [isPlaying, setIsPlaying] = useState(false);

  // Select appropriate ad based on demographics
  useEffect(() => {
    if (!targetAge || !targetGender) return;

    const suitableAds = ads.filter(ad => {
      const [minAge, maxAge] = ad.targetAge.split('-').map(Number);
      const ageMatch = targetAge >= minAge && targetAge <= maxAge;
      const genderMatch = ad.targetGender === 'both' || ad.targetGender === targetGender;
      return ageMatch && genderMatch;
    });

    if (suitableAds.length > 0) {
      const selectedAd = suitableAds[Math.floor(Math.random() * suitableAds.length)];
      setCurrentAd(selectedAd);
      setTimeRemaining(selectedAd.duration);
      setIsPlaying(true);
      onAdView?.(selectedAd.id);
    }
  }, [targetAge, targetGender, onAdView]);

  // Countdown timer
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsPlaying(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <Card className="bg-gradient-card border-border overflow-hidden">
      <div className="relative aspect-video bg-muted overflow-hidden">
        {/* Ad Content */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20">
          <div className="flex items-center justify-center h-full p-6">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">{currentAd.title}</h2>
              <p className="text-muted-foreground max-w-md">{currentAd.description}</p>
              
              {/* Targeting info */}
              <div className="flex gap-2 justify-center">
                <Badge variant="secondary" className="bg-primary/20 text-primary">
                  {currentAd.category}
                </Badge>
                <Badge variant="outline">
                  {currentAd.targetAge}
                </Badge>
                <Badge variant="outline">
                  {currentAd.targetGender === 'both' ? 'All' : currentAd.targetGender}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        {isPlaying && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-muted">
            <div 
              className="h-full bg-primary transition-all duration-1000 ease-linear"
              style={{ 
                width: `${((currentAd.duration - timeRemaining) / currentAd.duration) * 100}%` 
              }}
            />
          </div>
        )}

        {/* Status indicators */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-success animate-pulse' : 'bg-muted-foreground'}`} />
          <span className="text-sm font-medium text-foreground">
            {isPlaying ? 'Playing' : 'Standby'}
          </span>
        </div>

        <div className="absolute top-4 right-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">
            {timeRemaining}s
          </span>
        </div>
      </div>

      {/* Ad metrics */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              Targeted to: {targetAge ? `${targetAge}y ${targetGender}` : 'General audience'}
            </span>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setIsPlaying(!isPlaying);
              if (!isPlaying) {
                setTimeRemaining(currentAd.duration);
              }
            }}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
        </div>
      </div>
    </Card>
  );
};