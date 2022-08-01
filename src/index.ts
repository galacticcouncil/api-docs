import {Router} from '@vaadin/router';

/* Screens */
import './screen/home';
import './screen/not-found';

import {initApi, testApi} from './events';
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
testApi('wss://rpc.polkadot.io');
