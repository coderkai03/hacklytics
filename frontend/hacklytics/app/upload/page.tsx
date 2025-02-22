'use client';

import React, { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (isValidFileType(droppedFile)) {
      setFile(droppedFile);
    } else {
      alert("Please upload only MP4 or MOV files");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && isValidFileType(selectedFile)) {
      setFile(selectedFile);
    } else {
      alert("Please upload only MP4 or MOV files");
    }
  };

  const isValidFileType = (file: File) => {
    const validTypes = ['video/mp4', 'video/quicktime'];
    return file && validTypes.includes(file.type);
  };

  const handleUpload = async () => {
    if (!file) return;

    // Here you would implement your actual file upload logic
    // For example, using FormData to send to your backend
    const formData = new FormData();
    formData.append('video', file);

    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        alert('Upload successful!');
        // You could redirect to the analytics page here
        // window.location.href = '/analytics';
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Upload Your Video</h2>
        
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <div className="mb-4">
            <p className="text-lg mb-2">Drag and drop your video here</p>
            <p className="text-sm text-muted-foreground">
              Supports MP4 and MOV formats
            </p>
          </div>
          
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".mp4,.mov"
            onChange={handleFileSelect}
          />
          <label htmlFor="file-upload">
            <Button variant="outline" className="mr-2">
              Select File
            </Button>
          </label>
        </div>

        {file && (
          <div className="mt-6">
            <div className="flex items-center justify-between bg-muted p-4 rounded-lg">
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              <Button onClick={handleUpload}>
                Upload Video
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default UploadPage;
