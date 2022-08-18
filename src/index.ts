import {Router} from '@vaadin/router';
import {createApi} from './polka/api';

import {locationCursor} from './db';

/* Screens */
import './screen/home';
import './screen/pallet/summary';
import './screen/not-found';

import './app';

const routes = [
  {
    path: '/',
    component: 'app-root',
    children: [
      {
        path: '',
        component: 'app-home',
      },
      {
        path: 'pallets/:pallet',
        children: [
          {
            path: '',
            component: 'app-pallet',
          },
          {
            path: '/:itemType/:item',
            component: 'app-pallet',
          },
        ],
      },
    ],
  },
  {
    path: '(.*)',
    component: 'not-found',
  },
];

const outlet = document.getElementById('app');
const router = new Router(outlet);
router.setRoutes(routes);

window.addEventListener('vaadin-router-location-changed', (e) => {
  locationCursor.reset(e.detail.location);
});

/* Init */
createApi('wss://rpc.basilisk.cloud', () => {});
