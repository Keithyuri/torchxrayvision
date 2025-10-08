import { useState } from "react";
import { Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FileUpload from "@/components/FileUpload";
import ImageViewer from "@/components/ImageViewer";
import PredictionsList, { Prediction } from "@/components/PredictionsList";
import PacemanEvaluation, { PacemanResult } from "@/components/PacemanEvaluation";
import ActionButtons from "@/components/ActionButtons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [pacemanResults, setPacemanResults] = useState<PacemanResult[]>([]);
  const [isLoadingPredictions, setIsLoadingPredictions] = useState(false);
  const [isLoadingPaceman, setIsLoadingPaceman] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    setCurrentFile(file);
    
    // Display the image
    const url = URL.createObjectURL(file);
    setImageUrl(url);

    // Call both prediction API and PACEMAN evaluation in parallel
    const formData = new FormData();
    formData.append("image", file);

    // Start predictions
    setIsLoadingPredictions(true);
    const predictionsPromise = fetch("YOUR_BACKEND_URL/predict", {
      method: "POST",
      body: formData,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Prediction request failed");
        const data = await response.json();
        
        const transformedPredictions: Prediction[] = Object.entries(data.predictions || {}).map(
          ([pathology, confidence]) => ({
            pathology,
            confidence: confidence as number,
            enabled: true,
          })
        );

        setPredictions(transformedPredictions);
        return transformedPredictions.length;
      })
      .catch((error) => {
        console.error("Prediction error:", error);
        toast({
          variant: "destructive",
          title: "Prediction failed",
          description: "Could not connect to the prediction API.",
        });
        return 0;
      })
      .finally(() => setIsLoadingPredictions(false));

    // Start PACEMAN evaluation
    setIsLoadingPaceman(true);
    const pacemanFormData = new FormData();
    pacemanFormData.append("image", file);
    
    const pacemanPromise = fetch("YOUR_BACKEND_URL/paceman", {
      method: "POST",
      body: pacemanFormData,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("PACEMAN evaluation failed");
        const data = await response.json();
        
        // Expected format: { paceman: [{ category, findings, status }, ...] }
        const results: PacemanResult[] = data.paceman || [];
        setPacemanResults(results);
        return results.length;
      })
      .catch((error) => {
        console.error("PACEMAN error:", error);
        toast({
          variant: "destructive",
          title: "PACEMAN evaluation failed",
          description: "Could not connect to the PACEMAN API.",
        });
        return 0;
      })
      .finally(() => setIsLoadingPaceman(false));

    // Wait for both to complete and show combined success message
    Promise.all([predictionsPromise, pacemanPromise]).then(([predCount, pacemanCount]) => {
      if (predCount > 0 || pacemanCount > 0) {
        toast({
          title: "Analysis complete",
          description: `Generated ${predCount} predictions and ${pacemanCount} PACEMAN findings`,
        });
      }
    });
  };

  const handleTogglePrediction = (index: number) => {
    setPredictions((prev) =>
      prev.map((p, i) => (i === index ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const handleSaveCorrections = async () => {
    if (!currentFile) {
      toast({
        variant: "destructive",
        title: "No image loaded",
        description: "Please upload an image first",
      });
      return;
    }

    setIsSaving(true);
    try {
      const correctedLabels = predictions
        .filter((p) => p.enabled)
        .reduce((acc, p) => {
          acc[p.pathology] = p.confidence;
          return acc;
        }, {} as Record<string, number>);

      const formData = new FormData();
      formData.append("image", currentFile);
      formData.append("labels", JSON.stringify(correctedLabels));

      // Replace with your actual backend URL
      const response = await fetch("YOUR_BACKEND_URL/save_labels", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Save request failed");
      }

      toast({
        title: "Corrections saved",
        description: "Your label corrections have been saved successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Save failed",
        description: "Could not save corrections. Please try again.",
      });
      console.error("Save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTrainModel = async () => {
    setIsTraining(true);
    try {
      // Replace with your actual backend URL
      const response = await fetch("YOUR_BACKEND_URL/train", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Training request failed");
      }

      toast({
        title: "Training initiated",
        description: "Model retraining has been started in the background",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Training failed",
        description: "Could not start model training. Please try again.",
      });
      console.error("Training error:", error);
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary">
              <Activity className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Chest X-Ray AI Labeling
              </h1>
              <p className="text-sm text-muted-foreground">
                Upload, analyze, and correct AI predictions for medical education
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Upload & Controls */}
          <div className="lg:col-span-3 space-y-6">
            <FileUpload
              onFileSelect={handleFileSelect}
              isLoading={isLoadingPredictions}
            />
            
            <ActionButtons
              onSaveCorrections={handleSaveCorrections}
              onTrainModel={handleTrainModel}
              isSaving={isSaving}
              isTraining={isTraining}
              disabled={predictions.length === 0}
            />
          </div>

          {/* Center Panel - Image Viewer */}
          <div className="lg:col-span-6">
            <ImageViewer
              imageUrl={imageUrl}
              isLoading={isLoadingPredictions}
            />
          </div>

          {/* Right Panel - Predictions & PACEMAN */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="predictions" className="h-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
                <TabsTrigger value="paceman">PACEMAN</TabsTrigger>
              </TabsList>
              
              <TabsContent value="predictions" className="mt-0">
                <PredictionsList
                  predictions={predictions}
                  onToggle={handleTogglePrediction}
                  isLoading={isLoadingPredictions}
                />
              </TabsContent>
              
              <TabsContent value="paceman" className="mt-0">
                <PacemanEvaluation
                  results={pacemanResults}
                  isLoading={isLoadingPaceman}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
