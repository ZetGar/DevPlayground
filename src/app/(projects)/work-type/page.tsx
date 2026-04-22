import { Suspense } from "react";
import WorkTypeContent from "./WorkTypeContent"; // 로직을 분리한 컴포넌트

export default function WorkTypePage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <WorkTypeContent />
    </Suspense>
  );
}