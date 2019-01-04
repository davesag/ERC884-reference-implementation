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
      await token.addVerified(punter, web3.utils.toHex('some hash'))
      await token.addVerified(
        anotherPunter,
        web3.utils.toHex('some other hash')
      )
      await token.mint(punter, 10)
    })

    context('transfer', () => {
      context('from a verified punter to an unverified punter', () => {
        it('is not allowed', () =>
          assertThrows(token.transfer(unverifiedPunter, 1, { from: punter })))
      })

      context('from a verified punter to another verified punter', () => {
        let holderCount

        before(async () => {
          tx = await token.transfer(anotherPunter, 5, { from: punter })
          holderCount = await token.holderCount()
        })

        it('emits the Transfer event', () => {
          assert.ok(getLog(tx, 'Transfer'))
        })

        it('holderCount() is now 2', () => {
          assert.equal(holderCount.toNumber(), 2)
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
        let holderCount

        before(async () => {
          tx = await token.transferFrom(punter, anotherPunter, 5, {
            from: someThirdParty
          })
          holderCount = await token.holderCount()
        })

        it('emits the Transfer event', () => {
          assert.ok(getLog(tx, 'Transfer'))
        })

        it('punter now has no tokens so holderCount() is now 1', () => {
          assert.equal(holderCount.toNumber(), 1)
        })

        it('punter is no longer a shareholder', async () => {
          const isShareholder = await token.isHolder(punter)
          assert.isFalse(isShareholder)
        })
      })
    })
  }
)
