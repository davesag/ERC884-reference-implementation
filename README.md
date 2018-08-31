# ERC884-reference-implementation

[![Greenkeeper badge](https://badges.greenkeeper.io/davesag/ERC884-reference-implementation.svg)](https://greenkeeper.io/)

An Interface and Reference Implementation of the `ERC-884` Delaware General Corporate Law compliant (DGCL) token.

* `develop` — [![CircleCI](https://circleci.com/gh/davesag/ERC884-reference-implementation/tree/develop.svg?style=svg)](https://circleci.com/gh/davesag/ERC884-reference-implementation/tree/develop) [![codecov](https://codecov.io/gh/davesag/ERC884-reference-implementation/branch/develop/graph/badge.svg)](https://codecov.io/gh/davesag/ERC884-reference-implementation)
* `master` — [![CircleCI](https://circleci.com/gh/davesag/ERC884-reference-implementation/tree/master.svg?style=svg)](https://circleci.com/gh/davesag/ERC884-reference-implementation/tree/master) [![codecov](https://codecov.io/gh/davesag/ERC884-reference-implementation/branch/master/graph/badge.svg)](https://codecov.io/gh/davesag/ERC884-reference-implementation)

## Status

An `ERC-884` token is an `ERC-20` compatible token that is compliant with Delaware General Corporate Law.

* See [EIPS/eip-884](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-884.md) for the official spec.
* * See [Tokenising Shares: Introducing ERC-884](https://medium.com/coinmonks/tokenising-shares-introducing-erc-884-cc491258e413) for a more wordy overview.

## Development

The smart contracts are implemented using Solidity `0.4.24`.

### Development Prerequisites

* [NodeJS](htps://nodejs.org), version 10+ or better (I use [`nvm`](https://github.com/creationix/nvm) to manage Node versions — `brew install nvm`.)
* [truffle](http://truffleframework.com/), which is a comprehensive framework for Ethereum development. `npm install -g truffle` — this should install Truffle v4.1.14 or better.  Check that with `truffle version`.

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
