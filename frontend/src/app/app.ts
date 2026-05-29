import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';
import { TextareaModule } from 'primeng/textarea';
import { TagModule } from 'primeng/tag';
import { ApiService, Base64Upload, CatalogItem, CreateMaterialPayload, StudyMaterial } from './core/api.service';

type Notice = {
  tone: 'success' | 'error' | 'info';
  text: string;
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    FormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    SelectModule,
    TabsModule,
    TextareaModule,
    TagModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly api = inject(ApiService);

  readonly isLogged = signal(Boolean(localStorage.getItem('gbriel_token')));
  readonly notice = signal<Notice | null>(null);
  readonly loading = signal(false);
  readonly subjects = signal<CatalogItem[]>([]);
  readonly types = signal<CatalogItem[]>([]);
  readonly materials = signal<StudyMaterial[]>([]);
  readonly questionResults = signal<StudyMaterial[]>([]);
  readonly selectedFileName = signal('');
  readonly audioName = signal('');
  readonly recording = signal(false);
  readonly recordSeconds = signal(0);
  readonly userEmail = signal(localStorage.getItem('gbriel_user') ?? '');

  authMode: 'login' | 'register' = 'login';
  auth = { name: '', email: '', password: '' };
  dump = {
    subject: '',
    materialType: '',
    contextText: '',
    noteText: '',
  };
  newSubject = '';
  newType = '';
  listFilters = { q: '', subject: '', materialType: '' };
  question = '';
  private fileUpload: Base64Upload | undefined;
  private audioUpload: Base64Upload | undefined;
  private mediaRecorder?: MediaRecorder;
  private recordTimer?: number;
  private audioChunks: BlobPart[] = [];

  readonly subjectOptions = computed(() => this.subjects().map((item) => item.name));
  readonly typeOptions = computed(() => this.types().map((item) => item.name));

  canSaveDump(): boolean {
    return Boolean(
      this.dump.subject &&
        this.dump.materialType &&
        this.dump.contextText.trim().length >= 8 &&
        (this.dump.noteText.trim() || this.fileUpload),
    );
  }

  constructor() {
    if (this.isLogged()) {
      this.bootstrapData();
    }
  }

  submitAuth(): void {
    this.loading.set(true);
    this.notice.set(null);
    const request =
      this.authMode === 'login'
        ? this.api.login(this.auth.email, this.auth.password)
        : this.api.register(this.auth.name, this.auth.email, this.auth.password);

    request.subscribe({
      next: (result) => {
        this.isLogged.set(true);
        this.userEmail.set(result.user.email);
        this.notice.set({ tone: 'success', text: 'Sessao iniciada.' });
        this.bootstrapData();
      },
      error: (error) => this.showError(error, 'Nao foi possivel entrar.'),
      complete: () => this.loading.set(false),
    });
  }

  logout(): void {
    localStorage.removeItem('gbriel_token');
    localStorage.removeItem('gbriel_user');
    this.isLogged.set(false);
    this.userEmail.set('');
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      this.fileUpload = undefined;
      this.selectedFileName.set('');
      return;
    }

    this.selectedFileName.set(file.name);
    this.toBase64(file).then((base64) => {
      this.fileUpload = {
        fileName: file.name,
        mimeType: file.type,
        base64,
      };
    });
  }

  saveDump(): void {
    if (!this.canSaveDump()) {
      this.notice.set({ tone: 'error', text: 'Preencha as tags, o contexto e envie arquivo ou frase solta.' });
      return;
    }

    const payload: CreateMaterialPayload = {
      subject: this.dump.subject,
      materialType: this.dump.materialType,
      contextText: this.dump.contextText,
      noteText: this.dump.noteText || undefined,
      file: this.fileUpload,
      audio: this.audioUpload,
    };

    this.loading.set(true);
    this.api.createMaterial(payload).subscribe({
      next: () => {
        this.notice.set({ tone: 'success', text: 'Dump salvo e pronto para busca.' });
        this.dump = { subject: '', materialType: '', contextText: '', noteText: '' };
        this.fileUpload = undefined;
        this.audioUpload = undefined;
        this.selectedFileName.set('');
        this.audioName.set('');
        this.refreshMaterials();
      },
      error: (error) => this.showError(error, 'Nao foi possivel salvar o dump.'),
      complete: () => this.loading.set(false),
    });
  }

  addSubject(): void {
    const name = this.newSubject.trim();
    if (!name) return;

    this.api.createSubject(name).subscribe({
      next: () => {
        this.newSubject = '';
        this.loadSubjects();
      },
      error: (error) => this.showError(error, 'Nao foi possivel criar a materia.'),
    });
  }

  addType(): void {
    const name = this.newType.trim();
    if (!name) return;

    this.api.createType(name).subscribe({
      next: () => {
        this.newType = '';
        this.loadTypes();
      },
      error: (error) => this.showError(error, 'Nao foi possivel criar o tipo.'),
    });
  }

  refreshMaterials(): void {
    this.api.searchMaterials(this.listFilters).subscribe({
      next: (items) => this.materials.set(items),
      error: (error) => this.showError(error, 'Nao foi possivel listar os materiais.'),
    });
  }

  ask(): void {
    const q = this.question.trim();
    if (!q) return;

    this.loading.set(true);
    this.api.searchMaterials({ q }).subscribe({
      next: (items) => {
        this.questionResults.set(items);
        this.notice.set({
          tone: items.length ? 'info' : 'error',
          text: items.length ? 'Conexoes encontradas no seu acervo.' : 'Nada encontrado com esse termo ainda.',
        });
      },
      error: (error) => this.showError(error, 'Nao foi possivel buscar respostas.'),
      complete: () => this.loading.set(false),
    });
  }

  deleteMaterial(material: StudyMaterial): void {
    const confirmed = window.confirm(`Excluir "${material.subject}" dos seus materiais?`);

    if (!confirmed) return;

    this.loading.set(true);
    this.api.deleteMaterial(material.id).subscribe({
      next: () => {
        this.materials.update((items) => items.filter((item) => item.id !== material.id));
        this.questionResults.update((items) => items.filter((item) => item.id !== material.id));
        this.notice.set({ tone: 'success', text: 'Material excluido.' });
      },
      error: (error) => this.showError(error, 'Nao foi possivel excluir o material.'),
      complete: () => this.loading.set(false),
    });
  }

  async toggleRecording(): Promise<void> {
    if (this.recording()) {
      this.mediaRecorder?.stop();
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.audioChunks = [];
    this.mediaRecorder = new MediaRecorder(stream);
    this.mediaRecorder.ondataavailable = (event) => this.audioChunks.push(event.data);
    this.mediaRecorder.onstop = () => {
      stream.getTracks().forEach((track) => track.stop());
      const blob = new Blob(this.audioChunks, { type: this.mediaRecorder?.mimeType || 'audio/webm' });
      const fileName = `contexto-${Date.now()}.webm`;
      this.blobToBase64(blob).then((base64) => {
        this.audioUpload = {
          fileName,
          mimeType: blob.type,
          base64,
        };
        this.audioName.set(fileName);
      });
      this.recording.set(false);
      window.clearInterval(this.recordTimer);
    };

    this.recordSeconds.set(0);
    this.recording.set(true);
    this.mediaRecorder.start();
    this.recordTimer = window.setInterval(() => {
      const next = this.recordSeconds() + 1;
      this.recordSeconds.set(next);
      if (next >= 15) {
        this.mediaRecorder?.stop();
      }
    }, 1000);
  }

  fileHref(material: StudyMaterial): string {
    return material.file_url ? `${this.api.uploadsUrl}${material.file_url}` : '';
  }

  audioHref(material: StudyMaterial): string {
    return material.audio_url ? `${this.api.uploadsUrl}${material.audio_url}` : '';
  }

  private bootstrapData(): void {
    this.loadSubjects();
    this.loadTypes();
    this.refreshMaterials();
  }

  private loadSubjects(): void {
    this.api.listSubjects().subscribe({
      next: (items) => this.subjects.set(items),
      error: (error) => this.showError(error, 'Nao foi possivel carregar materias.'),
    });
  }

  private loadTypes(): void {
    this.api.listTypes().subscribe({
      next: (items) => this.types.set(items),
      error: (error) => this.showError(error, 'Nao foi possivel carregar tipos.'),
    });
  }

  private toBase64(file: File): Promise<string> {
    return this.blobToBase64(file);
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  }

  private showError(error: unknown, fallback: string): void {
    const message =
      typeof error === 'object' &&
      error !== null &&
      'error' in error &&
      typeof (error as { error?: { message?: string } }).error?.message === 'string'
        ? (error as { error: { message: string } }).error.message
        : fallback;

    this.notice.set({ tone: 'error', text: message });
    this.loading.set(false);
  }
}
