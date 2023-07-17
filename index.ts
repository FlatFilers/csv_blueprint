import { recordHook, FlatfileRecord } from '@flatfile/plugin-record-hook'
import { FlatfileEvent, Client } from '@flatfile/listener'
import api from '@flatfile/api'
import axios from 'axios'

export default function flatfileEventListener(listener: Client) {
  listener.on('**', ({ topic }: FlatfileEvent) => {
    console.log(`Received event: ${topic}`)
  })
}
