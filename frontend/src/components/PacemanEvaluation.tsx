import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  User, 
  Wind, 
  Heart, 
  Stethoscope, 
  Bone, 
  Package, 
  Radio 
} from "lucide-react";

export interface PacemanResult {
  category: string;
  findings: string[];
  status: "normal" | "abnormal" | "attention";
}

interface PacemanEvaluationProps {
  results: PacemanResult[];
  isLoading?: boolean;
}

const categoryIcons = {
  "Patient & Projection": User,
  "Airway": Wind,
  "Cardiac": Heart,
  "Everything Else": Stethoscope,
  "Muscles & Soft Tissues": Bone,
  "Abdomen": Package,
  "Neck": Radio,
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "normal":
      return "bg-success text-success-foreground";
    case "attention":
      return "bg-warning text-warning-foreground";
    case "abnormal":
      return "bg-destructive text-destructive-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "normal":
      return "Normal";
    case "attention":
      return "Needs Attention";
    case "abnormal":
      return "Abnormal";
    default:
      return "Unknown";
  }
};

const PacemanEvaluation = ({ results, isLoading }: PacemanEvaluationProps) => {
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>PACEMAN Evaluation</CardTitle>
          <CardDescription>Systematic chest X-ray review</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-16 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (results.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>PACEMAN Evaluation</CardTitle>
          <CardDescription>
            Systematic review of chest X-ray components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 rounded-full bg-muted mb-4">
              <Stethoscope className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Upload an X-ray to receive PACEMAN evaluation
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>PACEMAN Evaluation</CardTitle>
        <CardDescription>
          Systematic chest X-ray review: Patient, Airway, Cardiac, Everything else, Muscles, Abdomen, Neck
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
        {results.map((result, index) => {
          const Icon = categoryIcons[result.category as keyof typeof categoryIcons] || Stethoscope;
          
          return (
            <div
              key={index}
              className="p-4 rounded-lg border border-border bg-card hover:bg-accent/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground">
                    {result.category}
                  </h4>
                </div>
                <Badge className={getStatusColor(result.status)}>
                  {getStatusText(result.status)}
                </Badge>
              </div>
              
              <div className="space-y-2 ml-10">
                {result.findings.map((finding, fIndex) => (
                  <div
                    key={fIndex}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="text-primary mt-1">•</span>
                    <span>{finding}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default PacemanEvaluation;