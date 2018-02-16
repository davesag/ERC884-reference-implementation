const ERC884ReferenceImpl = artifacts.require(
  './token/ERC884/ERC884ReferenceImpl.sol'
)

const assertThrows = require('./utils/assertThrows')
const { getLog } = require('./utils/txHelpers')

contract('ERC884ReferenceImpl', ([owner, punter, anotherPunter]) => {
  let token
  let tx

  before(async () => {
    token = await ERC884ReferenceImpl.new()
  })

  it('decimals is 0', async () => {
    const decimals = await token.decimals()
    assert.equal(decimals.toNumber(), 0, 'expected 0')
  })

  it('has owner', async () => {
    assert.equal(await token.owner(), owner, `expected ${owner}`)
  })

  context('before any addresses are verified', () => {
    it('totalSupply() is 0', async () => {
      assert.equal(await token.totalSupply(), 0, 'Expected 0')
    })

    it("won't mint token for unverified address", async () =>
      assertThrows(token.mint(punter, 1)))

    it('ownerAt(0) throws an error', async () => assertThrows(token.ownerAt(0)))

    it('isVerified(punter) is false', async () => {
      assert.isFalse(await token.isVerified(punter))
    })

    it('isVerified(0x0) is false', async () => {
      assert.isFalse(await token.isVerified(0x0))
    })
  })

  context('verify a punter', () => {
    const hash = 'someHash'

    it('zero address throws', async () =>
      assertThrows(token.addVerified(0x0, hash)))

    it('zero hash throws', async () =>
      assertThrows(token.addVerified(punter, '')))

    context('given a punter and hash', () => {
      before(async () => {
        tx = await token.addVerified(punter, hash)
      })

      it('emitted the VerifiedAddressAdded event', () => {
        assert.ok(getLog(tx, 'VerifiedAddressAdded'))
      })

      it('isVerified(punter) is true', async () => {
        assert.isTrue(await token.isVerified(punter))
      })

      it("won't verify the same address again", async () =>
        assertThrows(token.addVerified(punter, hash)))

      context('mint a token for punter', () => {
        before(async () => {
          await token.mint(punter, 1)
        })

        it('totalSupply is now 1', async () => {
          assert.equal(await token.totalSupply(), 1)
        })

        it('ownerAt(0) returns punter', async () => {
          assert.equal(await token.ownerAt(0), punter)
        })

        it("can't remove a verified address that owns a token", async () =>
          assertThrows(token.removeVerified(punter)))

        context('hasHash', () => {
          it('given correct hash for punter returns true', async () => {
            assert.isTrue(await token.hasHash(punter, hash))
          })

          it('given incorrect hash for punter returns false', async () => {
            assert.isFalse(await token.hasHash(punter, 'nonsense'))
          })

          it('given a hash but 0x0 address returns false', async () => {
            assert.isFalse(await token.hasHash(0x0, hash))
          })

          it('given a zero hash returns false', async () => {
            assert.isFalse(await token.hasHash(punter, ''))
          })

          context('updateVerified', () => {
            const newHash = 'some fancy new hash'

            before(async () => {
              tx = await token.updateVerified(punter, newHash)
            })

            it('emitted VerifiedAddressUpdated', () => {
              assert.ok(getLog(tx, 'VerifiedAddressUpdated'))
            })

            it('hasHash now returns true when given the new hash', async () => {
              assert.isTrue(await token.hasHash(punter, newHash))
            })

            it('given zero address throws', async () =>
              assertThrows(token.updateVerified(0x0, 'something something')))

            it('given zero hash throws', async () =>
              assertThrows(token.updateVerified(punter, '')))

            context('given identical hash', () => {
              before(async () => {
                tx = await token.updateVerified(punter, newHash)
              })

              it("doesn't emit VerifiedAddressUpdated", () =>
                assert.throws(() => getLog(tx, 'VerifiedAddressUpdated')))
            })
          })
        })
      })
    })
  })

  context('verify another punter', () => {
    const hash = 'some other hash'
    before(async () => {
      await token.addVerified(anotherPunter, hash)
    })

    context('now un-verify it', () => {
      before(async () => {
        tx = await token.removeVerified(anotherPunter)
      })

      it('emitted VerifiedAddressRemoved', () => {
        assert.ok(getLog(tx, 'VerifiedAddressRemoved'))
      })

      it('isVerified(anotherPunter) is false', async () => {
        assert.isFalse(await token.isVerified(anotherPunter))
      })

      context("un-verifying a punter that's not verified", async () => {
        before(async () => {
          tx = await token.removeVerified(anotherPunter)
        })

        it("doesn't emit VerifiedAddressRemoved", () =>
          assert.throws(() => getLog(tx, 'VerifiedAddressRemoved')))
      })
    })
  })
})
