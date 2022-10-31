import AuthLogo from './extensions/asko_logo.png';
import MenuLogo from './extensions/asko-favicon.png';
import favicon from './extensions/asko-favicon.png';

export default {
  config: {
    // Replace the Strapi logo in auth (login) views
    auth: {
      logo: AuthLogo,
    },
    // Replace the favicon
    head: {
      favicon: favicon,
    },
    // Add a new locale, other than 'en'
    locales: ['tr', 'fr'],
    // Replace the Strapi logo in the main navigation
    menu: {
      logo: MenuLogo,
    },
    // Disable video tutorials
    tutorials: false,
    // Disable notifications about new Strapi releases
    notifications: { release: true },
  },

  bootstrap() { },
};