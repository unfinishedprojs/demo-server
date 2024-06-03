export interface CtxErr {
    error: string,
    code: errCode
}

export enum errCode {
    NOPASSWORD = 'NOPASSWORD',
    NOACCOUNT = 'NOACCOUNT',
    NORESULT = 'NORESULT',
    ALREADYEXIST = 'ALREADYEXIST',
    MISSINGVALUES = 'MISSINGVALUES',
    INVALIDVALUES = 'INVALIDVALUES',
    INVALIDTOKEN = 'INVALIDTOKEN',
    ALREADYVOTED = 'ALREADYVOTED'
}

export interface DbErr {
    error?: any,
    model: string,
    target: string[],
    code: intCode,
}

export enum intCode {
    P2002 = "P2002"
}