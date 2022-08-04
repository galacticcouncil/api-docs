import {Router} from '@vaadin/router';

/* Screens */
import './screen/dashboard';
import './screen/not-found';

import {testApi} from './events';
import './app';

const routes = [
  {
    path: '/',
    component: 'app-root',
    children: [
      {
        path: '',
        component: 'app-dashboard',
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
//testApi('wss://rpc.polkadot.io');

//testApi('wss://rpc-01.basilisk.hydradx.io');
testApi('wss://rpc-01.hydradx.io');


