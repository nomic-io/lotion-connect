'use strict'

let connect = require('..')
let lotion = require('lotion')
let test = require('ava')

test.beforeEach(async (t) => {
  let state = { foo: Math.random() }
  let app = lotion({
    initialState: state
  })
  let info = await app.start()

  t.context.state = state
  t.context.app = app
  t.context.info = info
})

test.afterEach((t) => {
  // TODO: call a close method
  t.context.client.lightClient.rpc.close()

  t.context.app.tendermintProcess.close()
  t.context.app.discoveryServer.close()
})

test('connect via GCI', async (t) => {
  let client = await connect(t.context.info.GCI)
  t.context.client = client
  t.pass('connected')

  let state = await client.state
  t.deepEqual(state, t.context.state)
})

test('connect via address with GCI', async (t) => {
  let client = await connect(t.context.info.GCI, {
    nodes: [ `ws://localhost:${t.context.info.ports.rpc}` ]
  })
  t.context.client = client
  t.pass('connected')

  let state = await client.state
  t.deepEqual(state, t.context.state)
})

test('connect via address with genesis', async (t) => {
  let genesis = require(t.context.info.genesisPath)

  let client = await connect(null, {
    nodes: [ `ws://localhost:${t.context.info.ports.rpc}` ],
    genesis
  })
  t.context.client = client
  t.pass('connected')

  let state = await client.state
  t.deepEqual(state, t.context.state)
})
