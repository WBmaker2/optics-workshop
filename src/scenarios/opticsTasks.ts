import {LensInput} from '../domain/opticsTypes';
export type Task={id:number;title:string;prompt:string;input?:LensInput;hint:string};
export const tasks:Task[]=[
 {id:1,title:'초점을 맞춰라',prompt:'스크린에 선명한 상이 맺힐 위치를 먼저 예측해 보세요.',hint:'평행 광선은 렌즈 뒤 초점을 향하고, 중심 광선은 곧게 갑니다.'},
 {id:2,title:'스크린에 잡히지 않는 상',prompt:'렌즈 앞에서 물체가 초점 안쪽에 있을 때 상의 성질을 예측하세요.',hint:'광선이 실제로 만나는지, 뒤로 연장해야 만나는지 살펴보세요.'},
 {id:3,title:'작은 카메라 설계',prompt:'센서면 120 mm에 맺히도록 초점 거리와 물체 거리를 설계하세요.',hint:'1/f = 1/dₒ + 1/120 mm을 만족하는지 계산해 보세요.'}
];
export const taskDefaults=(id:number):LensInput=>id===1?{lensType:'converging',focalLengthM:.1,objectDistanceM:.3,objectHeightM:.02,screenDistanceM:.15,objectAtInfinity:false}:id===2?{lensType:'converging',focalLengthM:.1,objectDistanceM:.06,objectHeightM:.02,screenDistanceM:.15,objectAtInfinity:false}:{lensType:'converging',focalLengthM:.08,objectDistanceM:.48,objectHeightM:.01,screenDistanceM:.12,objectAtInfinity:false};
