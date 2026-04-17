# Pawsome Elements

## Environment

- Node.js (v20.11.1)

## Commands

##### `npm install` - Install dependencies

##### `npm run start` - Run development server

##### `npm run preview` - Run development server with prod build

##### `npm run build` - Production build

##### `npm run test` Run tests

##### `npm run lint` Lints and fixes files

##### `npm run size` Production build and size analyze

##### `npm run format` Format all files using prettier

### Inversion Of Control

We use `inversify` package as main IOC container to implement Dependency
Injection in the project. Also, to add an ability for lazy injection in case of
instantiating the program unit by framework (in example, Vue instantiates
components by itself and we cannot add injection in constructor), we use
`inversify-inject-decorators` package. Check out [inversify][inversify] and
[inversify-inject-decorators][inversify-inject-decorators] to learn more about
dependency injection in javascript and how it works.

[vue-prop-decorator-link]: https://github.com/kaorun343/vue-property-decorator
[inversify]: https://github.com/inversify/InversifyJS
[inversify-inject-decorators]: https://github.com/inversify/inversify-inject-decorators
[clean-architecture-link]: https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html
