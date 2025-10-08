import { Button } from "@/components/ui/button";
import { Save, Zap, Loader2 } from "lucide-react";

interface ActionButtonsProps {
  onSaveCorrections: () => void;
  onTrainModel: () => void;
  isSaving?: boolean;
  isTraining?: boolean;
  disabled?: boolean;
}

const ActionButtons = ({
  onSaveCorrections,
  onTrainModel,
  isSaving,
  isTraining,
  disabled,
}: ActionButtonsProps) => {
  return (
    <div className="flex gap-3">
      <Button
        onClick={onSaveCorrections}
        disabled={disabled || isSaving}
        className="flex-1"
      >
        {isSaving ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            Save Corrections
          </>
        )}
      </Button>

      <Button
        onClick={onTrainModel}
        disabled={disabled || isTraining}
        variant="secondary"
        className="flex-1"
      >
        {isTraining ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Training...
          </>
        ) : (
          <>
            <Zap className="w-4 h-4 mr-2" />
            Train Model
          </>
        )}
      </Button>
    </div>
  );
};

export default ActionButtons;
