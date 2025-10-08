# 🩻 Chest X-Ray Labelling and Delabelling App  
### Powered by TorchXRayVision  

---

## 📖 Overview

This project provides an **interactive tool for medical students and researchers** to upload, label, and delabel **chest X-ray (CXR) images** using **TorchXRayVision**.  
It helps users visualize AI-generated segmentations and pathology labels while assessing image quality using a custom **PACEMAN** grading system.

---

## 🎯 Objective

To create a user-friendly web application that:
- Allows users to **upload their own chest X-ray images**.
- Automatically performs **AI segmentation and pathology labelling**.
- Enables **manual relabelling or correction** (delabelling).
- Generates a **PACEMAN score** to evaluate the technical quality of the X-ray.

---

## 🧠 Key Features

| Feature | Description |
|----------|-------------|
| 🖼️ **Upload X-ray** | Upload any chest X-ray (JPG, PNG, or DICOM). |
| 🤖 **AI Labeling** | Automatically detect and label thoracic pathologies using TorchXRayVision pretrained models. |
| ✏️ **Delabelling Tool** | Users can manually edit, add, or remove incorrect AI-generated labels. |
| 🩻 **Segmentation Visualization** | Visual overlays to show which regions correspond to different pathologies. |
| 📊 **PACEMAN Grading** | Automatic scoring system that evaluates image quality based on exposure, positioning, and clarity. |
| 💾 **Save & Export** | Save corrected labels for retraining or export results as JSON/CSV. |

---

## 🧩 System Workflow

1. **User Uploads Image**  
   → The app accepts a chest X-ray file (PNG, JPG, or DICOM).  

2. **TorchXRayVision Model Processes Image**  
   → Produces segmentation and probability scores for multiple thoracic pathologies.  

3. **Display & Manual Review**  
   → The AI’s output is displayed with overlays and editable labels.  

4. **PACEMAN Grading**  
   → A grading tool evaluates how well the image was taken (Positioning, Artifacts, Clarity, Exposure, Motion, Anatomy, Noise).  

5. **Output Results**  
   → Users can view, correct, and export results for educational or research purposes.  

---

## ⚙️ Tech Stack

| Layer | Technology |
|--------|-------------|
| **Backend** | [FastAPI](https://fastapi.tiangolo.com/) |
| **AI Model** | [TorchXRayVision](https://github.com/mlmed/torchxrayvision) |
| **Training Framework** | [MONAI Label](https://monai.io/) (for retraining with corrected labels) |
| **Frontend (Optional)** | Streamlit / Lovable AI Interface |
| **Environment** | Python 3.10 (Anaconda / Conda virtual environment) |

---

## 🚀 How to Run (Local Setup)

### 1️⃣ Create Environment

```bash
conda create -n xrayapp python=3.10 -y
conda activate xrayapp
