export interface IDataFile {
    load(args?: any, options?: any): Promise<any>;
    save(dest?: string, args?: any): Promise<any>;
}
