// These are the pages you can go to.
// They are all wrapped in the App component, which should contain the navbar etc
// See http://blog.mxstbr.com/2016/01/react-apps-with-pages for more information
// about the code splitting business
import { getAsyncInjectors } from './utils/asyncInjectors';

const errorLoading = (err) => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default);
};

export default function createRoutes(store) {
  // create reusable async injectors using getAsyncInjectors factory
  const { injectReducer, injectSagas } = getAsyncInjectors(store);

  return [
    {
      path: '/',
      name: 'home',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/ListPage/reducer'),
          System.import('containers/ListPage/sagas'),
          System.import('containers/HomePage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('list', reducer.default);
          injectSagas(sagas.default);

          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/list',
      name: 'list',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/ListPage/reducer'),
          System.import('containers/ListPage/sagas'),
          System.import('containers/ListPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('list', reducer.default);
          injectSagas(sagas.default);

          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/saved',
      name: 'saved',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/ListPage/reducer'),
          System.import('containers/ListPage/sagas'),
          System.import('containers/SavedPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('list', reducer.default);
          injectSagas(sagas.default);

          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/filter(/:home)',
      name: 'filter',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/ListPage/reducer'),
          System.import('containers/ListPage/sagas'),
          System.import('containers/FilterPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('list', reducer.default);
          injectSagas(sagas.default);

          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/features',
      name: 'features',
      getComponent(nextState, cb) {
        System.import('containers/FeaturePage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    }, {
      path: '/advert/:id(/:matching)',
      name: 'advert',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/JobAdvert/reducer'),
          System.import('containers/JobAdvert/sagas'),
          System.import('containers/JobAdvert'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('advert', reducer.default);
          injectSagas(sagas.default);

          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/occupation(/:group)(/:id)',
      name: 'occupation',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/AddOccupation/reducer'),
          System.import('containers/AddOccupation/sagas'),
          System.import('containers/AddOccupation'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('occupation', reducer.default);
          injectSagas(sagas.default);

          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/location(/:filter)',
      name: 'location',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/AddLocation/reducer'),
          System.import('containers/AddLocation/sagas'),
          System.import('containers/AddLocation'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('location', reducer.default);
          injectSagas(sagas.default);

          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/onboarding',
      name: 'onboarding',
      getComponent(nextState, cb) {
        System.import('containers/OnboardingPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    }, {
      path: '*',
      name: 'notfound',
      getComponent(nextState, cb) {
        System.import('containers/NotFoundPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    },
  ];
}
