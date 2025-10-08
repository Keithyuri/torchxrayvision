import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ImageViewerProps {
  imageUrl: string | null;
  isLoading?: boolean;
}

const ImageViewer = ({ imageUrl, isLoading }: ImageViewerProps) => {
  if (isLoading) {
    return (
      <Card className="h-full flex items-center justify-center p-8">
        <Skeleton className="w-full h-[600px]" />
      </Card>
    );
  }

  if (!imageUrl) {
    return (
      <Card className="h-full flex items-center justify-center p-8 border-2 border-dashed">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <svg
              className="w-12 h-12 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-lg font-medium text-muted-foreground">
            No image loaded
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Upload an X-ray image to begin analysis
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full overflow-hidden">
      <div className="relative h-full flex items-center justify-center p-4 bg-muted/30">
        <img
          src={imageUrl}
          alt="Chest X-Ray"
          className="max-w-full max-h-[700px] object-contain rounded-lg shadow-lg"
        />
      </div>
    </Card>
  );
};

export default ImageViewer;
