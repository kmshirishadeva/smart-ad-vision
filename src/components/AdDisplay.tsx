import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Clock, Target } from "lucide-react";
import skincareAd from "@/assets/ads/skincare-ad.jpg";
import gamingLaptopAd from "@/assets/ads/gaming-laptop-ad.jpg";
import retirementAd from "@/assets/ads/retirement-ad.jpg";
import fitnessTrackerAd from "@/assets/ads/fitness-tracker-ad.jpg";

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
    imageUrl: skincareAd,
    duration: 15
  },
  {
    id: "2", 
    title: "Gaming Laptop Pro",
    description: "Ultimate performance for gaming and content creation",
    targetAge: "18-35",
    targetGender: "male",
    category: "Technology",
    imageUrl: gamingLaptopAd,
    duration: 10
  },
  {
    id: "3",
    title: "Retirement Planning Guide",
    description: "Secure your financial future with our expert retirement solutions",
    targetAge: "50-70",
    targetGender: "both",
    category: "Finance",
    imageUrl: retirementAd,
    duration: 20
  },
  {
    id: "4",
    title: "Fitness Tracker Pro",
    description: "Monitor your health and achieve your fitness goals",
    targetAge: "20-40",
    targetGender: "both",
    category: "Health",
    imageUrl: fitnessTrackerAd,
    duration: 12
  }
];

export const AdDisplay = ({ targetAge, targetGender, onAdView }: AdDisplayProps) => {
  const [currentAd, setCurrentAd] = useState<Ad>(ads[0]);
  const [timeRemaining, setTimeRemaining] = useState(15);
  const [isPlaying, setIsPlaying] = useState(false);
  const [suitableAds, setSuitableAds] = useState<Ad[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  // Select appropriate ads based on demographics
  useEffect(() => {
    if (!targetAge || !targetGender) {
      setSuitableAds([]);
      setIsPlaying(false);
      return;
    }

    const filteredAds = ads.filter(ad => {
      const [minAge, maxAge] = ad.targetAge.split('-').map(Number);
      const ageMatch = targetAge >= minAge && targetAge <= maxAge;
      const genderMatch = ad.targetGender === 'both' || ad.targetGender === targetGender;
      return ageMatch && genderMatch;
    });

    if (filteredAds.length > 0) {
      setSuitableAds(filteredAds);
      setCurrentAdIndex(0);
      setCurrentAd(filteredAds[0]);
      setTimeRemaining(filteredAds[0].duration);
      setIsPlaying(true);
      onAdView?.(filteredAds[0].id);
    } else {
      // Show random ad if no match
      const randomAd = ads[Math.floor(Math.random() * ads.length)];
      setSuitableAds([randomAd]);
      setCurrentAdIndex(0);
      setCurrentAd(randomAd);
      setTimeRemaining(randomAd.duration);
      setIsPlaying(true);
      onAdView?.(randomAd.id);
    }
  }, [targetAge, targetGender, onAdView]);

  // Countdown timer and ad rotation
  useEffect(() => {
    if (!isPlaying || suitableAds.length === 0) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Move to next ad in rotation
          const nextIndex = (currentAdIndex + 1) % suitableAds.length;
          const nextAd = suitableAds[nextIndex];
          setCurrentAdIndex(nextIndex);
          setCurrentAd(nextAd);
          onAdView?.(nextAd.id);
          return nextAd.duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, suitableAds, currentAdIndex, onAdView]);

  return (
    <Card className="bg-gradient-card border-border overflow-hidden">
      <div className="relative aspect-video bg-muted overflow-hidden">
        {/* Ad Image */}
        <img 
          src={currentAd.imageUrl} 
          alt={currentAd.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Overlay with ad info */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">{currentAd.title}</h2>
            <p className="text-white/90 mb-4 max-w-md">{currentAd.description}</p>
            
            {/* Targeting info */}
            <div className="flex gap-2">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {currentAd.category}
              </Badge>
              <Badge variant="outline" className="border-white/30 text-white">
                {currentAd.targetAge}
              </Badge>
              <Badge variant="outline" className="border-white/30 text-white">
                {currentAd.targetGender === 'both' ? 'All' : currentAd.targetGender}
              </Badge>
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
          <div className="flex gap-2">
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
            {suitableAds.length > 1 && (
              <Badge variant="secondary" className="text-xs">
                {currentAdIndex + 1}/{suitableAds.length}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};