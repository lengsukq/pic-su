// .env.d.ts
declare namespace NodeJS {
    interface ProcessEnv {
        BILIBILI_SESSDATA:string;
        BILIBILI_CSRF:string;
        SM_TOKEN:string;
        IMGBB_API:string;
    }
}