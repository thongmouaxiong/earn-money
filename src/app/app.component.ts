import { Component } from '@angular/core';
import { Network } from '@awesome-cordova-plugins/network/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private network: Network) {
    // watch network for a disconnection
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      alert('network was disconnected :-(');
    });

    // stop disconnect watch
    disconnectSubscription.unsubscribe();

    // watch network for a connection
    let connectSubscription = this.network.onConnect().subscribe(() => {
      alert('network connected!');
      // We just got a connection but we need to wait briefly
      // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
      setTimeout(() => {
        if (this.network.type === 'wifi') {
          alert('we got a wifi connection, woohoo!');
        }
      }, 3000);
    });

    // stop connect watch
    connectSubscription.unsubscribe();
  }
}
