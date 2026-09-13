export type LensType='converging'|'diverging';
export type LensInput={lensType:LensType;focalLengthM:number;objectDistanceM:number;objectHeightM:number;screenDistanceM:number;objectAtInfinity:boolean};
export type InputError={field:keyof LensInput|string;message:string};
export type LensResult={kind:'invalid';errors:InputError[]}|{kind:'focal-boundary';reason:'object-at-focal-plane'}|{kind:'near-focal';imageDistanceM:number;imageType:'real'|'virtual'}|{kind:'finite-image';imageDistanceM:number;magnification:number;imageHeightM:number;imageType:'real'|'virtual';orientation:'upright'|'inverted';screenMatch:'on-screen'|'off-screen'|'not-projectable'}|{kind:'infinite-object';imageDistanceM:number;imageType:'real'|'virtual'};
export const SCREEN_TOLERANCE_M=.005; export const EPSILON_MODEL=1e-8;
