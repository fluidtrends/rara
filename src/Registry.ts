/// <reference path="../lib/modules.d.ts" />
import * as pacote from 'pacote'
import cli from '@npmcli/run-script'

export const manifest = pacote.manifest;
export const extract = pacote.extract;
export const runScript = cli;