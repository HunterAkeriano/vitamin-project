import { resolve } from 'path';

const pages = [
  {
    name: 'index',
    path: resolve(__dirname, 'index.html'),
  },
  {
    name: 'quiz',
    path: resolve(__dirname, 'quiz.html'),
  },
  {
    name: 'personal-pack',
    path: resolve(__dirname, 'personal-pack.html'),
  },
  {
    name: 'shop',
    path: resolve(__dirname, 'shop.html'),
  },
  {
    name: 'one-product',
    path: resolve(__dirname, 'one-product.html'),
  },
  {
    name: 'registration',
    path: resolve(__dirname, 'registration.html'),
  },
  {
    name: 'login',
    path: resolve(__dirname, 'login.html'),
  },
  {
    name: 'recover-password',
    path: resolve(__dirname, 'recover.html'),
  },
  {
    name: 'reset-password',
    path: resolve(__dirname, 'reset-password.html'),
  },
  {
    name: 'profile',
    path: resolve(__dirname, 'profile.html'),
  },
  {
    name: 'create-order',
    path: resolve(__dirname, 'create-order.html'),
  },
  {
    name: 'successful-order',
    path: resolve(__dirname, 'successful-order.html'),
  },
  {
    name: '404',
    path: resolve(__dirname, '404.html'),
  },
];

export default pages;
