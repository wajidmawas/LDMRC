import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GoogleMapsLoaderService {
  private static isLoaded = false;
  private static loadPromise: Promise<void>;

  static loadApi(key: string): Promise<void> {
    if (!GoogleMapsLoaderService.isLoaded) {
      GoogleMapsLoaderService.loadPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&v=weekly`;
        script.async = true;
        script.onload = () => {
          GoogleMapsLoaderService.isLoaded = true;
          resolve();
        };
        script.onerror = () => reject(new Error('Failed to load Google Maps API'));
        document.body.appendChild(script);
      });
    }
    return GoogleMapsLoaderService.loadPromise;
  }
}
