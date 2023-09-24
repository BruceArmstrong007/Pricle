import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { APIEndpoint } from '../../utils/api.endpoints';
import { environment } from 'src/environments/environment';
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
    const requestOptions = {
      withCredentials: true,
      origin: environment.apiURL,
    };
    let url = environment.apiURL + endpoint.url;
    if (params?.urlParams) {
      url += '/' + params?.urlParams;
    }
    if (params?.queryParams) {
      url += '?' + params?.queryParams;
    }
    switch (endpoint.method) {
      case 'POST':
        return this.http.post(url, body, requestOptions);
      case 'GET':
        return this.http.get(url, requestOptions);
      case 'DELETE':
        return this.http.delete(url, requestOptions);
      case 'PUT':
        return this.http.put(url, body, requestOptions);
      default:
        return this.http.get(url, requestOptions);
    }
  }

  uploadProfile(endpoint: APIEndpoint, body: UploadProfile) {
    const requestOptions = {
      withCredentials: true,
      origin: environment.fileURL,
    };
    const url = environment.apiURL + endpoint.url;
    const formData = new FormData();
    formData.append('profile', body.profile);
    formData.append('prevFilename', body.prevFilename);
    return this.http.put(url, formData, requestOptions);
  }
}
