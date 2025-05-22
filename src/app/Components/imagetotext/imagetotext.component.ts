import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-imagetotext',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './imagetotext.component.html',
  styleUrl: './imagetotext.component.scss',
})
export class ImagetotextComponent {
  private token = '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'; // Replace with your token

  imageFile: File | null = null;
  imageUrl: string = '';
  selectedFileName: string = '';
  imagePreviewUrl: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  generatedText: string = '';

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
      this.selectedFileName = file.name;
      this.createImagePreview(file);
      this.imageUrl = ''; // Clear URL when file is selected
    }
  }

  createImagePreview(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  triggerFileInput(): void {
    document.getElementById('image-upload')?.click();
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.generatedText);
    alert('Text copied to clipboard!');
  }

  async analyzeImage(): Promise<void> {
    if (!this.imageFile && !this.imageUrl) {
      this.errorMessage = 'Please upload an image or provide a URL';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.generatedText = '';

    try {
      let imageData: Blob;

      if (this.imageFile) {
        // Use uploaded file
        imageData = this.imageFile;
      } else {
        // Fetch image from URL
        try {
          const corsProxyUrl = 'https://corsproxy.io/?';
          const response = await fetch(
            corsProxyUrl + encodeURIComponent(this.imageUrl)
          );
          if (!response.ok) {
            throw new Error(
              `Failed to fetch image: ${response.status} ${response.statusText}`
            );
          }
          imageData = await response.blob();

          // Create preview for URL image
          if (!this.imagePreviewUrl) {
            this.imagePreviewUrl = this.imageUrl;
          }
        } catch (error: any) {
          this.errorMessage = `Error loading image from URL: ${error.message}`;
          this.isLoading = false;
          return;
        }
      }

      // Convert image to base64
      const base64data = await this.blobToBase64(imageData);

      // Call HuggingFace API
      const result = await this.query(base64data);

      if (result && Array.isArray(result) && result.length > 0) {
        this.generatedText = result[0].generated_text;
      } else {
        console.log('API Response:', result);
        throw new Error('Invalid response from API');
      }
    } catch (error: any) {
      console.error('Error analyzing image:', error);
      this.errorMessage = `Failed to analyze image: ${error.message}`;
    } finally {
      this.isLoading = false;
    }
  }

  blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        // Remove the data:image/jpeg;base64, prefix
        const base64Content = base64data.split(',')[1];
        resolve(base64Content);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async query(imageBase64: string) {
    try {
      const response = await fetch(
        'https://api-inference.huggingface.co/models/nlpconnect/vit-gpt2-image-captioning',
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({ inputs: imageBase64 }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Network or API error:', error);
      throw error;
    }
  }
}
