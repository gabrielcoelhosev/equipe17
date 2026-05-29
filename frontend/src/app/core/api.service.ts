import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';

export type CatalogItem = {
  id: number;
  name: string;
  created_at: string;
};

export type StudyMaterial = {
  id: number;
  subject: string;
  material_type: string;
  context_text: string;
  note_text?: string | null;
  file_url?: string | null;
  file_name?: string | null;
  file_mime?: string | null;
  audio_url?: string | null;
  audio_name?: string | null;
  audio_mime?: string | null;
  created_at: string;
};

export type Base64Upload = {
  fileName?: string;
  mimeType?: string;
  base64?: string;
};

export type CreateMaterialPayload = {
  subject: string;
  materialType: string;
  contextText: string;
  noteText?: string;
  file?: Base64Upload;
  audio?: Base64Upload;
};

export type LoginResult = {
  token: string;
  user: {
    id: number;
    email: string;
  };
};

const API_URL = window.location.port === '4200' ? 'http://localhost:3333' : '';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  readonly uploadsUrl = API_URL;

  login(email: string, password: string): Observable<LoginResult> {
    return this.http.post<LoginResult>(`${API_URL}/auth/login`, { email, password }).pipe(
      tap((result) => {
        localStorage.setItem('gbriel_token', result.token);
        localStorage.setItem('gbriel_user', result.user.email);
      }),
    );
  }

  register(name: string, email: string, password: string): Observable<LoginResult> {
    return this.http.post<unknown>(`${API_URL}/auth/register`, { name, email, password }).pipe(
      tap(() => undefined),
      switchMap(() => this.login(email, password)),
    );
  }

  listSubjects(): Observable<CatalogItem[]> {
    return this.http.get<CatalogItem[]>(`${API_URL}/catalog/subjects`);
  }

  createSubject(name: string): Observable<CatalogItem> {
    return this.http.post<CatalogItem>(`${API_URL}/catalog/subjects`, { name });
  }

  listTypes(): Observable<CatalogItem[]> {
    return this.http.get<CatalogItem[]>(`${API_URL}/catalog/types`);
  }

  createType(name: string): Observable<CatalogItem> {
    return this.http.post<CatalogItem>(`${API_URL}/catalog/types`, { name });
  }

  createMaterial(payload: CreateMaterialPayload): Observable<StudyMaterial> {
    return this.http.post<StudyMaterial>(`${API_URL}/materials`, payload);
  }

  searchMaterials(filters: { q?: string; subject?: string; materialType?: string }): Observable<StudyMaterial[]> {
    let params = new HttpParams();

    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        params = params.set(key, value);
      }
    }

    return this.http.get<StudyMaterial[]>(`${API_URL}/materials`, { params });
  }

  deleteMaterial(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${API_URL}/materials/${id}`);
  }
}
