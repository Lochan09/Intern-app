import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

interface Message {
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  sentimentData?: any;
}

@Component({
  selector: 'app-aisupport',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './aisupport.component.html',
  styleUrl: './aisupport.component.scss',
})
export class AisupportComponent implements OnInit, AfterViewChecked {
  private token = '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';

  messages: Message[] = [];
  userInput: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  @ViewChild('chatContainer') chatContainer!: ElementRef;

  ngOnInit() {
    this.messages.push({
      content:
        'Hello! I can analyze the sentiment of any text. Try typing a message to analyze.',
      role: 'assistant',
      timestamp: new Date(),
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop =
        this.chatContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  async sendMessage() {
    if (!this.userInput.trim() || this.isLoading) return;

    const userMessage: Message = {
      content: this.userInput.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    this.messages.push(userMessage);
    const currentInput = this.userInput;
    this.userInput = '';
    this.isLoading = true;
    this.errorMessage = '';

    try {
      const result = await this.query({ inputs: currentInput });

      let responseContent = '';

      if (Array.isArray(result) && result.length > 0) {
        const sentimentResults = result[0];

        let highestScore = 0;
        let dominantSentiment = '';

        for (const sentiment in sentimentResults) {
          if (sentimentResults[sentiment] > highestScore) {
            highestScore = sentimentResults[sentiment];
            dominantSentiment = sentiment;
          }
        }

        responseContent = `Sentiment Analysis Results:\n\n`;
        responseContent += `The dominant sentiment is: ${this.formatSentimentLabel(
          dominantSentiment
        )} (${(highestScore * 100).toFixed(1)}%)\n\n`;
        responseContent += `Detailed breakdown:\n`;

        for (const sentiment in sentimentResults) {
          const percentage = (sentimentResults[sentiment] * 100).toFixed(1);
          responseContent += `• ${this.formatSentimentLabel(
            sentiment
          )}: ${percentage}%\n`;
        }

        responseContent += `\nThis analysis indicates how positive, negative, or neutral the text appears to be.`;
      } else {
        responseContent =
          "I couldn't analyze the sentiment. Please try again with a different text.";
      }

      this.messages.push({
        content: responseContent,
        role: 'assistant',
        timestamp: new Date(),
        sentimentData: result[0],
      });
    } catch (error: any) {
      console.error('Error analyzing sentiment:', error);
      this.errorMessage = `Failed to analyze sentiment: ${error.message}`;

      this.messages.push({
        content:
          'Sorry, I encountered an error while analyzing the sentiment. Please try again later.',
        role: 'assistant',
        timestamp: new Date(),
      });
    } finally {
      this.isLoading = false;
    }
  }

  getSentiments(sentimentData: any): string[] {
    return Object.keys(sentimentData);
  }

  getSentimentPercentage(sentimentData: any, sentiment: string): number {
    const total = Object.values(sentimentData).reduce(
      (sum: number, value: unknown) =>
        sum + (typeof value === 'number' ? value : 0),
      0
    );
    return total > 0 ? (sentimentData[sentiment] / total) * 100 : 0;
  }

  formatSentimentLabel(label: string): string {
    if (label === 'LABEL_0') return 'Negative';
    if (label === 'LABEL_1') return 'Neutral';
    if (label === 'LABEL_2') return 'Positive';
    return label.replace('LABEL_', '').replace(/_/g, ' ');
  }

  askQuestion(question: string) {
    this.userInput = question;
    this.sendMessage();
  }

  async query(data: any) {
    const response = await fetch(
      'https://router.huggingface.co/hf-inference/models/tabularisai/multilingual-sentiment-analysis',
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  }
}
