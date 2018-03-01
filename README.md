# ERC884-reference-implementation

An Interface and Reference Implementation of the draft ERC-884 Delaware General Corporate Law compliant (DGCL) Token.

* `develop` — [![CircleCI](https://circleci.com/gh/davesag/ERC884-reference-implementation/tree/develop.svg?style=svg)](https://circleci.com/gh/davesag/ERC884-reference-implementation/tree/develop) [![codecov](https://codecov.io/gh/davesag/ERC884-reference-implementation/branch/develop/graph/badge.svg)](https://codecov.io/gh/davesag/ERC884-reference-implementation)
* `master` — [![CircleCI](https://circleci.com/gh/davesag/ERC884-reference-implementation/tree/master.svg?style=svg)](https://circleci.com/gh/davesag/ERC884-reference-implementation/tree/master) [![codecov](https://codecov.io/gh/davesag/ERC884-reference-implementation/branch/master/graph/badge.svg)](https://codecov.io/gh/davesag/ERC884-reference-implementation)

See [ethereum/EIPs/pull/884](https://github.com/ethereum/EIPs/pull/884) for the `DRAFT` proposal.

## Status

ERC-884 is a `DRAFT` proposal to standardise an ERC20 compatible Token that is compliant with Delaware General Corporate Law.

It has not been accepted yet and the details are subject to change.

## Development

The smart contracts are being implemented in Solidity `0.4.19`.

### Development Prerequisites

* [NodeJS](htps://nodejs.org), version 9.6.1 or better (I use [`nvm`](https://github.com/creationix/nvm) to manage Node versions — `brew install nvm`.)
* [truffle](http://truffleframework.com/), which is a comprehensive framework for Ethereum development. `npm install -g truffle` — this should install Truffle v4.0.6 or better.  Check that with `truffle version`.

### Initialisation

    npm install

### Testing

#### Standalone

    npm test

or with code coverage

    npm run test:cov

#### From within Truffle

Run the `truffle` development environment

    truffle develop

then from the prompt you can run

    compile
    migrate
    test

as well as other Truffle commands. See [truffleframework.com](http://truffleframework.com) for more.

### Linting

You can use the following linting options

* `npm run lint:sol` — to lint the Solidity files, and
* `npm run lint:js` — to lint the Javascript.

## Contributing

Please see the [contributing notes](CONTRIBUTING.md).
