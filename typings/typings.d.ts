
declare module 'rd-component';
declare module "*.png" {
    const content: any;
    export default content;
}
declare module "*.webp" {
    const content: any;
    export default content;
}
// https://stackoverflow.com/questions/40382842/cant-import-css-scss-modules-typescript-says-cannot-find-module
declare module "*.css";