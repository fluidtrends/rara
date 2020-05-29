/// <reference path="modules.d.ts" />
import * as pacote from 'pacote';
import * as nodu from 'nodu';
export declare const manifest: typeof pacote.manifest;
export declare const extract: typeof pacote.extract;
export declare const npm: typeof nodu.npm;
export declare const install: (input?: any) => Promise<{
    id: any;
    to: any;
    version: string;
    name: string;
    deps: Record<string, string> | undefined;
} | undefined>;
