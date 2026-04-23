// // src/lib/job-log/guestStorage.ts

// const GUEST_JOBS_KEY = 'job_log_guest_jobs';

// export const guestStorage = {
//   // 데이터 가져오기
//   getJobs: (): any[] => {
//     if (typeof window === 'undefined') return [];
//     const saved = localStorage.getItem(GUEST_JOBS_KEY);
//     return saved ? JSON.parse(saved) : [];
//   },

//   // 데이터 저장하기 (최대 1개만 유지하거나 추가)
//   saveJob: (job: any) => {
//     const jobWithId = { 
//       ...job, 
//       id: `guest-${Date.now()}`,
//       created_at: new Date().toISOString() 
//     };
//     localStorage.setItem(GUEST_JOBS_KEY, JSON.stringify([jobWithId]));
//     return jobWithId;
//   },

//   // 데이터 삭제
//   clearJobs: () => {
//     localStorage.removeItem(GUEST_JOBS_KEY);
//   }
// };

// src/lib/job-log/guestStorage.ts

const GUEST_KEY = 'job_log_guest_data';

export const guestStorage = {
  // 1. 데이터 저장 (기존 배열 앞에 추가)
  saveJob: (formData: any) => {
    const existingData = guestStorage.getJobs();
    const newJob = {
      ...formData,
      id: `guest-${Date.now()}`, // 고유 ID 생성
      created_at: new Date().toISOString()
    };
    
    const updated = [newJob, ...existingData];
    localStorage.setItem(GUEST_KEY, JSON.stringify(updated));
  },

  // 2. 데이터 불러오기
  getJobs: (): any[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(GUEST_KEY);
    return data ? JSON.parse(data) : [];
  },

  // 3. 특정 항목 삭제 (ID 기준)
  deleteJob: (id: string) => {
    const existingData = guestStorage.getJobs();
    // 해당 ID를 제외한 나머지만 필터링
    const updated = existingData.filter(job => job.id !== id);
    localStorage.setItem(GUEST_KEY, JSON.stringify(updated));
  },

  // 4. 모든 게스트 데이터 초기화
  clearJobs: () => {
    localStorage.removeItem(GUEST_KEY);
  }
};