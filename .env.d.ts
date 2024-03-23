// .env.d.ts
declare namespace NodeJS {
    interface ProcessEnv {
        NEXT_PUBLIC_DEFAULT_BED: string;
        BILIBILI_SESSDATA:string;
        BILIBILI_CSRF:string;
        SM_TOKEN:string;
        IMGBB_API:string;
    }
}