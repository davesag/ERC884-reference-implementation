const ERC884ReferenceImpl = artifacts.require(
  './token/ERC884/ERC884ReferenceImpl.sol'
)

const assertThrows = require('./utils/assertThrows')
const { getLog } = require('./utils/txHelpers')

contract(
  'ERC884ReferenceImpl (tranfers)',
  ([owner, punter, anotherPunter, unverifiedPunter, someThirdParty]) => {
    let token
    let tx

    before(async () => {
      token = await ERC884ReferenceImpl.new()
      await token.addVerified(punter, 'some hash')
      await token.addVerified(anotherPunter, 'some other hash')
      await token.mint(punter, 10)
    })

    context('transfer', () => {
      context('from a verified punter to an unverified punter', () => {
        it('is not allowed', () =>
          assertThrows(token.transfer(unverifiedPunter, 1, { from: punter })))
      })

      context('from a verified punter to another verified punter', () => {
        before(async () => {
          tx = await token.transfer(anotherPunter, 1, { from: punter })
        })

        it('emits the Transfer event', () => {
          assert.ok(getLog(tx, 'Transfer'))
        })
      })
    })

    context('transferFrom', () => {
      before(async () => {
        await token.approve(someThirdParty, 5, { from: punter })
      })

      context('from a verified punter to an unverified punter', () => {
        it('is not allowed', () =>
          assertThrows(
            token.transferFrom(punter, unverifiedPunter, 1, {
              from: someThirdParty
            })
          ))
      })

      context('from a verified punter to another verified punter', () => {
        before(async () => {
          tx = await token.transferFrom(punter, anotherPunter, 1, {
            from: someThirdParty
          })
        })

        it('emits the Transfer event', () => {
          assert.ok(getLog(tx, 'Transfer'))
        })
      })
    })
  }
)
