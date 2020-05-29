/// <reference path="../lib/modules.d.ts" />
import * as pacote from 'pacote'
import * as nodu from 'nodu'
import npmInstall from 'nodu/lib/commands/install'

nodu.resolveAll()

export const manifest = pacote.manifest;
export const extract = pacote.extract;
export const npm = nodu.npm;
export const install = npmInstall;