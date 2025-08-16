import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Eye, 
  Target, 
  TrendingUp, 
  Clock,
  Zap
} from "lucide-react";

interface DetectionLog {
  timestamp: Date;
  age: number;
  gender: 'male' | 'female';
  adShown: string;
}

interface DashboardStatsProps {
  detectionLogs: DetectionLog[];
  isSystemActive: boolean;
  systemUptime: number;
}

export const DashboardStats = ({ detectionLogs, isSystemActive, systemUptime }: DashboardStatsProps) => {
  const totalDetections = detectionLogs.length;
  const recentDetections = detectionLogs.filter(log => 
    Date.now() - log.timestamp.getTime() < 60000 // Last minute
  ).length;
  
  const genderStats = detectionLogs.reduce((acc, log) => {
    acc[log.gender] = (acc[log.gender] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const ageGroups = detectionLogs.reduce((acc, log) => {
    if (log.age < 25) acc.young++;
    else if (log.age < 45) acc.adult++;
    else acc.senior++;
    return acc;
  }, { young: 0, adult: 0, senior: 0 });

  const avgAge = detectionLogs.length > 0 
    ? detectionLogs.reduce((sum, log) => sum + log.age, 0) / detectionLogs.length 
    : 0;

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* System Status */}
      <Card className="bg-gradient-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">System Status</CardTitle>
          <Zap className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${isSystemActive ? 'bg-success' : 'bg-muted-foreground'}`} />
            <span className="text-xl font-bold">
              {isSystemActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Uptime: {formatUptime(systemUptime)}
          </p>
        </CardContent>
      </Card>

      {/* Total Detections */}
      <Card className="bg-gradient-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Detections</CardTitle>
          <Users className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalDetections}</div>
          <p className="text-xs text-muted-foreground">
            +{recentDetections} in last minute
          </p>
        </CardContent>
      </Card>

      {/* Targeting Accuracy */}
      <Card className="bg-gradient-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Targeting Accuracy</CardTitle>
          <Target className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">87.4%</div>
          <p className="text-xs text-muted-foreground">
            Based on engagement metrics
          </p>
        </CardContent>
      </Card>

      {/* Gender Distribution */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Gender Distribution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Male</span>
              <span>{genderStats.male || 0}</span>
            </div>
            <Progress 
              value={totalDetections > 0 ? ((genderStats.male || 0) / totalDetections) * 100 : 0} 
              className="h-2"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Female</span>
              <span>{genderStats.female || 0}</span>
            </div>
            <Progress 
              value={totalDetections > 0 ? ((genderStats.female || 0) / totalDetections) * 100 : 0} 
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Age Groups */}
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Age Demographics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center">
            <Badge variant="secondary">18-24</Badge>
            <span className="text-sm">{ageGroups.young}</span>
          </div>
          <div className="flex justify-between items-center">
            <Badge variant="secondary">25-44</Badge>
            <span className="text-sm">{ageGroups.adult}</span>
          </div>
          <div className="flex justify-between items-center">
            <Badge variant="secondary">45+</Badge>
            <span className="text-sm">{ageGroups.senior}</span>
          </div>
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Average age: {avgAge.toFixed(1)} years
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card className="bg-gradient-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Performance</CardTitle>
          <TrendingUp className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>FPS</span>
            <span className="font-medium">24.7</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Latency</span>
            <span className="font-medium">0.8s</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Accuracy</span>
            <span className="font-medium">89.2%</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};