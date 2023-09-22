import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { APIEndpoint } from '../../utils/api.endpoints';
import { environment } from 'src/environments/environment.development';
import { UploadProfile } from 'src/app/stores/user/user.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);

  request(
    endpoint: APIEndpoint,
    body?: unknown,
    params?: { urlParams?: string; queryParams?: string }
  ) {
    let url = environment.apiURL + endpoint.url;
    if (params?.urlParams) {
      url += '/' + params?.urlParams;
    }
    if (params?.queryParams) {
      url += '?' + params?.queryParams;
    }
    switch (endpoint.method) {
      case 'POST':
        return this.http.post(url, body);
      case 'GET':
        return this.http.get(url);
      case 'DELETE':
        return this.http.delete(url);
      case 'PUT':
        return this.http.put(url, body);
      default:
        return this.http.get(url);
    }
  }

  uploadProfile(endpoint: APIEndpoint, body: UploadProfile) {
    const url = environment.apiURL + endpoint.url;
    const formData = new FormData();
    formData.append('profile', body.profile);
    formData.append('prevFilename', body.prevFilename);
    return this.http.put(url, formData);
  }
}
