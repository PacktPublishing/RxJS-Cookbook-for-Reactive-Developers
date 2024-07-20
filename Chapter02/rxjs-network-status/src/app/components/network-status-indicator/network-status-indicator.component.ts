import { MatIconModule } from '@angular/material/icon';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ENetworkSpeed, NetworkStatusService } from '../../services/network-status.service';

@Component({
  selector: 'app-network-status-indicator',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './network-status-indicator.component.html',
  styleUrl: './network-status-indicator.component.scss'
})
export class NetworkStatusIndicatorComponent {

  isOnline = true;
  isSlowNetwork = false;

  constructor(private networkStatusService: NetworkStatusService) { }

  ngOnInit(): void {
    this.networkStatusService.onlineChanges$.subscribe(isOnline => this.isOnline = isOnline);

    this.networkStatusService.slowNetworkChanges$.subscribe(speed => {
      this.isSlowNetwork = speed === ENetworkSpeed.SLOW;
    });
  }
}
