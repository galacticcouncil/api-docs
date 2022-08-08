import {Router} from '@vaadin/router';
import {createApi} from './polka/api';

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
export const router = new Router(outlet);
router.setRoutes(routes);

/* Init */
createApi('wss://rpc-01.basilisk.hydradx.io', () => {});
