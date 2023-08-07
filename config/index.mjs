import {
  resolve
} from 'node:path'
import args from './args.mjs'

export const PATH = resolve(
  args.has('path')
    ? args.get('path')
    : '.'
)
