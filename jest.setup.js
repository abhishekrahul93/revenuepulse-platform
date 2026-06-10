import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'
Object.assign(global, { TextDecoder, TextEncoder })
import { Request, Response, fetch, Headers } from 'cross-fetch'
global.Request = Request
global.Response = Response
global.fetch = fetch
global.Headers = Headers
