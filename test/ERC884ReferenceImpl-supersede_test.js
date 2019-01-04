const ERC884ReferenceImpl = artifacts.require(
  './token/ERC884/ERC884ReferenceImpl.sol'
)

const assertThrows = require('./utils/assertThrows')
const { getLog, ZERO_ADDRESS } = require('./utils/txHelpers')

contract(
  'ERC884ReferenceImpl (cancelAndReissue)',
  ([
    owner,
    punterWithTokens,
    punterWithoutTokens,
    anotherPunterWithoutTokens,
    anotherPunterWithTokens,
    unverifiedPunter
  ]) => {
    let token
    let tx

    before(async () => {
      token = await ERC884ReferenceImpl.new()
      await token.addVerified(punterWithTokens, web3.utils.toHex('some hash'))
      await token.addVerified(
        punterWithoutTokens,
        web3.utils.toHex('some other hash')
      )
      await token.addVerified(
        anotherPunterWithTokens,
        web3.utils.toHex('some third hash')
      )
      await token.addVerified(
        anotherPunterWithoutTokens,
        web3.utils.toHex('some fourth hash')
      )
      await token.mint(punterWithTokens, 10)
      await token.mint(anotherPunterWithTokens, 5)
    })

    context('before doing anything', () => {
      context('getCurrentFor', () => {
        it('getCurrentFor(punterWithTokens) is punterWithTokens', async () => {
          assert.equal(
            await token.getCurrentFor(punterWithTokens),
            punterWithTokens
          )
        })

        it('getCurrentFor(ZERO_ADDRESS) is ZERO_ADDRESS', async () => {
          assert.equal(await token.getCurrentFor(ZERO_ADDRESS), ZERO_ADDRESS)
        })
      })

      context('it throws trying to cancelAndReissue', () => {
        it('punterWithTokens for anotherPunterWithTokens', () =>
          assertThrows(
            token.cancelAndReissue(punterWithTokens, anotherPunterWithTokens)
          ))

        it('punterWithTokens for anotherPunterWithTokens', () =>
          assertThrows(
            token.cancelAndReissue(punterWithTokens, unverifiedPunter)
          ))

        it('punterWithoutTokens for anotherPunterWithoutTokens', () =>
          assertThrows(
            token.cancelAndReissue(
              punterWithoutTokens,
              anotherPunterWithoutTokens
            )
          ))
      })
    })

    context(
      'cancel punterWithTokens and re-issued to punterWithoutTokens',
      () => {
        let balance

        before(async () => {
          balance = await token.balanceOf(punterWithTokens)
          tx = await token.cancelAndReissue(
            punterWithTokens,
            punterWithoutTokens
          )
        })

        it('emitted VerifiedAddressSuperseded event', () => {
          assert.ok(getLog(tx, 'VerifiedAddressSuperseded'))
        })

        it('getCurrentFor(punterWithTokens) is punterWithoutTokens', async () => {
          assert.equal(
            await token.getCurrentFor(punterWithTokens),
            punterWithoutTokens
          )
        })

        it('isSuperseded(punterWithTokens) is true', async () => {
          assert.isTrue(await token.isSuperseded(punterWithTokens))
        })

        it('isVerified(punterWithTokens) is false', async () => {
          assert.isFalse(await token.isVerified(punterWithTokens))
        })

        it("can't verify punterWithTokens", () =>
          assertThrows(
            token.addVerified(
              punterWithTokens,
              web3.utils.toHex('some new hash')
            )
          ))

        it("can't unverify punterWithoutTokens", () =>
          assertThrows(token.removeVerified(punterWithoutTokens)))

        it('balanceOf(punterWithTokens) is 0', async () => {
          const b = await token.balanceOf(punterWithTokens)
          assert.equal(b.toNumber(), 0)
        })

        it("punterWithoutTokens's balance is what punterWithTokens had", async () => {
          const b = await token.balanceOf(punterWithoutTokens)
          assert.equal(b.toNumber(), balance.toNumber())
        })
      }
    )
  }
)
