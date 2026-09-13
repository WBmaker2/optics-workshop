import {LensInput,LensResult,SCREEN_TOLERANCE_M,EPSILON_MODEL} from '../domain/opticsTypes';
export function calculateLens(input:LensInput):LensResult{
 const errors=[]; if(!Number.isFinite(input.focalLengthM)||input.focalLengthM===0) errors.push({field:'focalLengthM',message:'초점 거리 f는 0이 아닌 수여야 합니다.'});
 if(!input.objectAtInfinity&&input.lensType==='converging'&&input.focalLengthM<0) errors.push({field:'lensType',message:'볼록·수렴 렌즈의 f는 양수로 입력하세요. 부호를 자동 보정하지 않습니다.'});
 if(!input.objectAtInfinity&&input.lensType==='diverging'&&input.focalLengthM>0) errors.push({field:'lensType',message:'오목·발산 렌즈의 f는 음수로 입력하세요. 부호를 자동 보정하지 않습니다.'});
 if(!input.objectAtInfinity&&(!Number.isFinite(input.objectDistanceM)||input.objectDistanceM<=0)) errors.push({field:'objectDistanceM',message:'물체 거리 dₒ는 0보다 커야 합니다.'});
 if(!input.objectAtInfinity&&(!Number.isFinite(input.objectHeightM)||input.objectHeightM<=0)) errors.push({field:'objectHeightM',message:'물체 높이 hₒ는 0보다 커야 합니다.'});
 if(!Number.isFinite(input.screenDistanceM)) errors.push({field:'screenDistanceM',message:'스크린 위치를 숫자로 입력하세요.'}); if(errors.length)return {kind:'invalid',errors};
 if(input.objectAtInfinity)return {kind:'infinite-object',imageDistanceM:input.focalLengthM,imageType:input.focalLengthM>0?'real':'virtual'};
 const denom=1/input.focalLengthM-1/input.objectDistanceM;
 if(Math.abs(denom)<EPSILON_MODEL){ if(input.objectDistanceM===input.focalLengthM)return {kind:'focal-boundary',reason:'object-at-focal-plane'}; return {kind:'near-focal',imageDistanceM:1/denom,imageType:denom>0?'real':'virtual'}; }
 const di=1/denom, mag=-di/input.objectDistanceM; const imageType=di>0?'real':'virtual';
 return {kind:'finite-image',imageDistanceM:di,magnification:mag,imageHeightM:mag*input.objectHeightM,imageType,orientation:mag<0?'inverted':'upright',screenMatch:imageType==='virtual'?'not-projectable':Math.abs(di-input.screenDistanceM)<=SCREEN_TOLERANCE_M?'on-screen':'off-screen'};
}
