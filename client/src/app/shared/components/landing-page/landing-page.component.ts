import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { Routes, RoutesInterface } from '../../utils/client.routes';
import { selectUrl } from '../../router-store/router-selector';
import { Store } from '@ngrx/store';
import { NgIf } from '@angular/common';
import { ThemeService } from '../../services/theme/theme.service';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [ButtonModule, RouterLink, NgIf, LoaderComponent],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements AfterViewInit {
  readonly isLoading = signal(0);
  readonly store = inject(Store);
  readonly theme = inject(ThemeService);
  routePath = this.store.selectSignal(selectUrl);
  @ViewChild('cmp') container!: ElementRef<HTMLCanvasElement>;
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.Renderer;
  controls!: OrbitControls;
  earthMesh!: THREE.Group;
  starsT1!: THREE.Points;
  starsT2!: THREE.Points;
  Routes: RoutesInterface = Routes;
  // mouse
  mouseX = 0;
  mouseY = 0;

  ngAfterViewInit() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(
      this.container.nativeElement.offsetWidth,
      this.container.nativeElement.offsetHeight
    );
    this.container.nativeElement.appendChild(this.renderer.domElement);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = false;
    this.controls.enablePan = false;
    this.controls.enableRotate = false;
    this.controls.enableZoom = false;
    this.camera.position.set(0, 0, 12);
    this.controls.target = new THREE.Vector3(-6, 0, 0);

    const light = new THREE.AmbientLight(0x404040);
    this.scene.add(light);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemiLight.position.set(0, 300, 0);
    this.scene.add(hemiLight);

    this.animateFrames();

    this.container.nativeElement.addEventListener(
      'mousedown',
      this.mouseDown.bind(this)
    );
    this.container.nativeElement.addEventListener(
      'mousemove',
      this.mouseMove.bind(this)
    );
    this.container.nativeElement.addEventListener(
      'mouseup',
      this.mouseUp.bind(this)
    );

    this.container.nativeElement.addEventListener(
      'touchstart',
      (event: Event) => {
        this.mouseDown(event);
      }
    );
    this.container.nativeElement.addEventListener(
      'touchmove',
      (event: Event) => {
        this.mouseMove(event);
      }
    );
    this.container.nativeElement.addEventListener(
      'touchend',
      (event: Event) => {
        this.mouseUp(event);
      }
    );
    this.stars();
    this.loadGLTF();
  }

  loadGLTF() {
    const loader = new GLTFLoader();
    loader.load(
      'assets/earth/earth.glb',
      (gltf) => {
        this.earthMesh = gltf.scene;
        this.scene.add(this.earthMesh);
      },
      (xhr) => {
        const percentage = (xhr.loaded / xhr.total) * 100;
        this.isLoading.set(percentage);
      },
      (error) => {
        console.log('An error happened');
      }
    );
  }

  mouseMove(e: any) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
  }
  mouseUp(e: Event) {}
  mouseDown(e: Event) {}

  getCenterPoint(mesh: THREE.Mesh) {
    const middle = new THREE.Vector3();
    const geometry = mesh instanceof THREE.Mesh ? mesh.geometry : mesh;
    geometry.computeBoundingBox();
    geometry.boundingBox?.getSize(middle);
    middle.x = middle.x / 2;
    middle.y = middle.y / 2;
    middle.z = middle.z / 2;
    mesh.localToWorld(middle);
    return middle;
  }

  animateFrames() {
    if (this.earthMesh) {
      this.earthMesh.rotateX(-0.005);
      this.earthMesh.rotateY(-0.005);
    }
    if (this.starsT1 && this.starsT2) {
      this.starsT1.position.x = this.mouseX * 0.0001;
      this.starsT1.position.y = this.mouseY * -0.0001;
      this.starsT2.position.x = this.mouseX * 0.0001;
      this.starsT2.position.y = this.mouseY * -0.0001;
    }
    window.requestAnimationFrame(() => this.animateFrames());
    this.renderer.render(this.scene, this.camera);
    this.controls.update();
  }

  @HostListener('window:resize', ['$event']) onResize() {
    this.camera.aspect =
      this.container.nativeElement.offsetWidth /
      this.container.nativeElement.offsetHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(
      this.container.nativeElement.offsetWidth,
      this.container.nativeElement.offsetHeight
    );
    this.renderer.render(this.scene, this.camera);
  }

  stars() {
    const getRandomParticelPos = (particleCount: number) => {
      const arr = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        arr[i] = (Math.random() - 0.5) * 10;
      }
      return arr;
    };
    const geometrys = [new THREE.BufferGeometry(), new THREE.BufferGeometry()];
    geometrys[0].setAttribute(
      'position',
      new THREE.BufferAttribute(getRandomParticelPos(350), 3)
    );
    geometrys[1].setAttribute(
      'position',
      new THREE.BufferAttribute(getRandomParticelPos(1500), 3)
    );
    const loader = new THREE.TextureLoader();
    const materials = [
      new THREE.PointsMaterial({
        size: 0.05,
        map: loader.load('assets/stars/star.png'),
        transparent: true,
      }),
      new THREE.PointsMaterial({
        size: 0.075,
        map: loader.load('assets/stars/star1.png'),
        transparent: true,
      }),
    ];
    this.starsT1 = new THREE.Points(geometrys[0], materials[0]);
    this.starsT2 = new THREE.Points(geometrys[1], materials[1]);
    this.scene.add(this.starsT1);
    this.scene.add(this.starsT2);
  }
}
