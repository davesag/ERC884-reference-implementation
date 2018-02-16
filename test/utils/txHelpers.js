/**
 *  extract the log for a specific event from the supplied transaction
 *  @param tx — The transaction to look into
 *  @param event — The name of the event to look for
 *  @throws if no event matches
 *  @return the log for the matching event.
 */
const getLog = (tx, event) => {
  const theLog = tx.logs.find(log => log.event === event)
  if (!theLog)
    throw new Error(
      `No logs with event ${event}. Logs ${JSON.stringify(tx.logs)}`
    )
  return theLog
}

/**
 *  Get the address of a specific variable given an event and a transaction.
 *  @param tx — The transaction to look into
 *  @param event — The name of the event to look for
 *  @param variable — The name of the variable to look at
 *  @throws if no event matches
 *  @return the address for the matching variable.
 */
const getAddress = (tx, event, variable) => {
  const log = getLog(tx, event)
  const address = log.args[variable]
  if (!address)
    throw new Error(
      `No variable ${variable} in log args given event ${event}. Log.args ${
        log.args
      }`
    )
  return address
}

/**
 *  Get the contract instance given a transaction, event, and variable.
 *  @param tx — The transaction to look into
 *  @param event — The name of the event to look for
 *  @param variable — The name of the variable to look at
 *  @param Contract — The contract to find the instance of.
 *  @throws if no event matches
 *  @return the address for the matching variable.
 */
const getContract = (tx, event, variable, Contract) =>
  Contract.at(getAddress(tx, event, variable))

module.exports = {
  getLog,
  getAddress,
  getContract
}
