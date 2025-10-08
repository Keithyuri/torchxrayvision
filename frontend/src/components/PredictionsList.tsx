import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export interface Prediction {
  pathology: string;
  confidence: number;
  enabled: boolean;
}

interface PredictionsListProps {
  predictions: Prediction[];
  onToggle: (index: number) => void;
  isLoading?: boolean;
}

const PredictionsList = ({ predictions, onToggle, isLoading }: PredictionsListProps) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "bg-success text-success-foreground";
    if (confidence >= 0.5) return "bg-warning text-warning-foreground";
    return "bg-muted text-muted-foreground";
  };

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>AI Predictions</CardTitle>
          <CardDescription>Loading predictions...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (predictions.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>AI Predictions</CardTitle>
          <CardDescription>Detected pathologies will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 rounded-full bg-muted mb-4">
              <AlertCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Upload an X-ray to get AI predictions
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>AI Predictions</CardTitle>
        <CardDescription>
          Toggle predictions on/off to correct the AI's analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
        {predictions.map((prediction, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
          >
            <div className="flex-1 mr-4">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-medium text-foreground">
                  {prediction.pathology}
                </h4>
                <Badge
                  className={getConfidenceColor(prediction.confidence)}
                  variant="secondary"
                >
                  {(prediction.confidence * 100).toFixed(1)}%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Confidence: {prediction.confidence >= 0.8
                  ? "High"
                  : prediction.confidence >= 0.5
                  ? "Medium"
                  : "Low"}
              </p>
            </div>
            <Switch
              checked={prediction.enabled}
              onCheckedChange={() => onToggle(index)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PredictionsList;
