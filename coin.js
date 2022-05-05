function coinFlip() {
    return (Math.floor(Math.random() * 2) == 0) ? 'heads' : 'tails'
  }
  
  /** Multiple coin flips
   * 
   * Write a function that accepts one parameter (number of flips) and returns an array of 
   * resulting "heads" or "tails".
   * 
   * @param {number} flips 
   * @returns {string[]} results
   * 
   * example: coinFlips(10)
   * returns:
   *  [
        'heads', 'heads',
        'heads', 'tails',
        'heads', 'tails',
        'tails', 'heads',
        'tails', 'heads'
      ]
   */
  
  function coinFlips(flips) {
    const results = []
    for (let i = 0; i < flips; i++) {
      results.push(coinFlip())
    }
    return results
  }
  
  /** Count multiple flips
   * 
   * Write a function that accepts an array consisting of "heads" or "tails" 
   * (e.g. the results of your `coinFlips()` function) and counts each, returning 
   * an object containing the number of each.
   * 
   * example: conutFlips(['heads', 'heads','heads', 'tails','heads', 'tails','tails', 'heads','tails', 'heads'])
   * { tails: 5, heads: 5 }
   * 
   * @param {string[]} array 
   * @returns {{ heads: number, tails: number }}
   */
  
  function countFlips(array) {
    var heads = 0
    var tails = 0
    if (array.length > 1) {
      for (let i = 0; i < array.length; i++) {
        if (array[i] == 'heads') {
          heads++
        } else if (array[i] == 'tails') {
          tails++
        } else {
        }
      }
      return { heads: heads, tails: tails }
    } else {
      if (array[0] == 'heads') {
        return { heads: 1}
      } else {
        return { tails: 1}
      }
    }
  }
  
  /** Flip a coin!
   * 
   * Write a function that accepts one input parameter: a string either "heads" or "tails", flips a coin, and then records "win" or "lose". 
   * 
   * @param {string} call 
   * @returns {object} with keys that are the input param (heads or tails), a flip (heads or tails), and the result (win or lose). See below example.
   * 
   * example: flipACoin('tails')
   * returns: { call: 'tails', flip: 'heads', result: 'lose' }
   */
  
  function flipACoin(call) {
    var actual = coinFlip()
    var result = ''
    call == actual ? result = 'win' : result = 'lose' 
    return {call: call, flip: actual, result: result}
  }
  
  /** Export 
   * 
   * Export all of your named functions
  */
  module.exports = { coinFlip, coinFlips, countFlips, flipACoin }
