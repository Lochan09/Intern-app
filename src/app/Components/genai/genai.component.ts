import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-genai',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './genai.component.html',
  styleUrl: './genai.component.scss',
})
export class GenaiComponent implements OnInit {
  private token = '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';
  private inputText: HTMLInputElement | null = null;
  private image: HTMLImageElement | null = null;
  private button: HTMLButtonElement | null = null;
  public prompt: string = '';
  public isLoading: boolean = false;
  public errorMessage: string = '';

  ngOnInit() {
    this.inputText = document.getElementById('input') as HTMLInputElement;
    this.image = document.getElementById('image') as HTMLImageElement;
    this.button = document.getElementById('btn') as HTMLButtonElement;

    if (this.button) {
      this.button.addEventListener('click', async () => {
        this.isLoading = true;
        this.errorMessage = '';

        try {
          const response = await this.query();
          if (this.image) {
            const objectURL = URL.createObjectURL(response);
            this.image.src = objectURL;
          }
        } catch (error: any) {
          console.error('Error generating image:', error);
          this.errorMessage = `Failed to generate image: ${error.message}`;
          alert(
            'Failed to generate image. Please check API key and model access.'
          );
        } finally {
          this.isLoading = false;
        }
      });
    }
  }

  async query(): Promise<Blob> {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ inputs: this.inputText?.value || '' }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`${response.status} ${response.statusText}`);
    }

    return await response.blob();
  }
}
