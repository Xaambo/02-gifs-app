import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interface';

const GIPHY_API_KEY = 'jQ23GwxKihuh7lSxkr08bRkop8TvLTHO';
const GIPHY_URL = 'https://api.giphy.com/v1/gifs';

@Injectable({ providedIn: 'root' })
export class GifsService {
  public gifsList: Gif[] = [];

  private _tagsHistory: string[] = [];

  constructor(private http: HttpClient) {
    this.loadLocalStorage();
  }

  get tagsHistory() {
    return [...this._tagsHistory];
  }

  set tagsHistory(tags: string[]) {
    this._tagsHistory = [...tags];
  }

  public searchTag(tag: string): void {
    if (tag.length === 0) return;

    this.organizeHistory(tag);

    const params = new HttpParams().set('api_key', GIPHY_API_KEY).set('q', tag);

    this.http
      .get<SearchResponse>(`${GIPHY_URL}/search`, { params })
      .subscribe((resp) => {
        this.gifsList = resp.data;
      });
  }

  private organizeHistory(tag: string) {
    tag = tag.toLowerCase();

    if (this.tagsHistory.includes(tag)) {
      this.tagsHistory = this.tagsHistory.filter((oldTag) => oldTag != tag);
    }

    this._tagsHistory.unshift(tag);
    this.tagsHistory = this.tagsHistory.slice(0, 10);
    this.saveLocalStorage();
  }

  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage(): void {
    if (!localStorage.getItem('history')) return;
    this._tagsHistory = JSON.parse(localStorage.getItem('history')!);

    if (this._tagsHistory.length === 0) return;
    this.searchTag(this._tagsHistory[0]);
  }
}
