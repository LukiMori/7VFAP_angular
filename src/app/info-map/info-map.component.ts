import { Component, Input, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-info-map',
  standalone: true,
  templateUrl: './info-map.component.html',
  styleUrls: []
})
export class InfoMapComponent implements OnInit, AfterViewInit {
  @Input() latitude!: number;
  @Input() longitude!: number;

  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLDivElement>;
  private map!: L.Map;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map(this.mapContainer.nativeElement).setView([this.latitude, this.longitude], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    L.marker([this.latitude, this.longitude])
      .addTo(this.map)
      .bindPopup('Zvolená adresa')
      .openPopup();
  }
}
