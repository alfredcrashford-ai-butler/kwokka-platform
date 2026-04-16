# Kwokka Frontend

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

## Architecture

We use [clean architecutre][clean-architecture-link] approach to build frontend
application. We separate the layers in the following way:

- Domain
  - Entities
  - Use cases
  - Repository interfaces
- Interface adapters
  - Repositories
  - Adapters (serializer / deserializer)
  - Application services (error-tracker, notification, etc.)
- Application
  - Ui-kit
  - Vue components
  - Views
  - Routing

However the separation of the layers does not necessarily have a direct mapping
on directory structure. Therefore, because we want to keep our directory
structure simple, readable and framework agnostic, we separate the presentation
layer logic in `app` directory and the rest of the logic (not related to
framework) in `core` directory.

### Limitations

- You can not use `Repository` classes in Presentation layer
- You should always deserialize data from backend, and never use raw data in app
- You should never have anything related to Vue in `core` directory
- You should never have imports from `app` in `core` directory

## Code styling

In this section you can find hints on how to style the code in the repo and
general approaches on code organization.

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
