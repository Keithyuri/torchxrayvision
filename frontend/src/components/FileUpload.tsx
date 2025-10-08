import { useCallback, useState } from "react";
import { Upload, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
}

const FileUpload = ({ onFileSelect, isLoading }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "application/dicom"];
    const validExtensions = [".jpg", ".jpeg", ".png", ".dcm"];
    
    const isValidType = validTypes.includes(file.type);
    const hasValidExtension = validExtensions.some(ext => 
      file.name.toLowerCase().endsWith(ext)
    );

    if (!isValidType && !hasValidExtension) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a .jpg, .jpeg, .png, or .dcm file",
      });
      return false;
    }

    return true;
  };

  const handleFile = (file: File) => {
    if (validateFile(file)) {
      onFileSelect(file);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [onFileSelect]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <Card
      className={`border-2 border-dashed transition-all ${
        dragActive
          ? "border-primary bg-accent/50"
          : "border-border bg-card hover:border-primary/50"
      } ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className="p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-accent">
            <FileImage className="w-8 h-8 text-primary" />
          </div>
        </div>
        
        <h3 className="text-lg font-semibold mb-2 text-foreground">
          Upload Chest X-Ray
        </h3>
        
        <p className="text-sm text-muted-foreground mb-6">
          Drag and drop your X-ray image here, or click to browse
        </p>
        
        <label htmlFor="file-upload">
          <Button
            type="button"
            disabled={isLoading}
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            {isLoading ? "Processing..." : "Select File"}
          </Button>
          <input
            id="file-upload"
            type="file"
            accept=".jpg,.jpeg,.png,.dcm"
            onChange={handleChange}
            className="hidden"
          />
        </label>
        
        <p className="text-xs text-muted-foreground mt-4">
          Supported formats: JPG, JPEG, PNG, DICOM
        </p>
      </div>
    </Card>
  );
};

export default FileUpload;
