const jsonrpc = '2.0'
const id = 0
const base = { jsonrpc, id }

/**
 *  Utility to send a method and params to the blockchain via web3
 *  @param method — the method name
 *  @param params — an array of parameters (defaults to [])
 */
const send = (method, params = []) =>
  web3.currentProvider.send({ ...base, method, params })

/**
 *  Tell the blockchain to jum ahead in time by a nomnated number of seconds.
 *  @param seconds — The number of seconds to jump ahead
 */
const timeTravel = async seconds => {
  await send('evm_increaseTime', [seconds])
  await send('evm_mine')
}

module.exports = timeTravel
